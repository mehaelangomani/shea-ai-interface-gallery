(function () {
  'use strict'

  const TYPEWRITER_LINE_1 = 'explore the'
  const TYPEWRITER_LINE_2 = 'world of AI!'
  const TYPEWRITER_SPEED = 38
  const TYPEWRITER_START_DELAY = 600
  const DESKTOP_MIN_WIDTH = 1024

  function initNavigation() {
    const menuToggle = document.getElementById('menu-toggle')
    const mobileMenu = document.getElementById('mobile-menu')
    const contactOverlay = document.getElementById('contact-overlay')
    const contactToggleDesktop = document.getElementById('contact-toggle-desktop')
    const contactToggleMobile = document.getElementById('contact-toggle-mobile')
    const contactPanel = contactOverlay?.querySelector('.overlay__contact-panel')

    let isMobileMenuOpen = false
    let isContactOpen = false

    function setMobileMenuOpen(open) {
      isMobileMenuOpen = open
      mobileMenu?.classList.toggle('is-open', open)
      mobileMenu?.setAttribute('aria-hidden', String(!open))
      menuToggle?.classList.toggle('is-open', open)
      menuToggle?.setAttribute('aria-expanded', String(open))
      menuToggle?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    }

    function setContactOpen(open) {
      isContactOpen = open
      contactOverlay?.classList.toggle('is-open', open)
      contactOverlay?.setAttribute('aria-hidden', String(!open))
    }

    function openContact() {
      setMobileMenuOpen(false)
      setContactOpen(true)
    }

    function closeContact() {
      setContactOpen(false)
    }

    menuToggle?.addEventListener('click', () => {
      setMobileMenuOpen(!isMobileMenuOpen)
    })

    contactToggleDesktop?.addEventListener('click', () => {
      if (isContactOpen) closeContact()
      else openContact()
    })

    contactToggleMobile?.addEventListener('click', openContact)

    contactOverlay?.addEventListener('click', (event) => {
      if (event.target === contactOverlay) closeContact()
    })

    contactPanel?.addEventListener('click', (event) => {
      event.stopPropagation()
    })
  }

  function initBackgroundVideo() {
    const video = document.getElementById('bg-video')
    if (!(video instanceof HTMLVideoElement)) return

    const videoWrap = video.parentElement
    let canvas = document.getElementById('bg-video-canvas')
    if (!(canvas instanceof HTMLCanvasElement)) {
      canvas = document.createElement('canvas')
      canvas.id = 'bg-video-canvas'
      canvas.className = 'bg-video'
      canvas.setAttribute('aria-hidden', 'true')
      videoWrap?.appendChild(canvas)
    }
    canvas.style.position = 'absolute'
    canvas.style.inset = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.pointerEvents = 'none'
    canvas.style.opacity = '0'
    canvas.style.visibility = 'hidden'
    canvas.style.zIndex = '1'

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let targetTime = 0
    let prevX = null
    let scrubbingEnabled = false
    let rafId = 0

    const frameCache = []
    let frameTimes = []
    let frameCacheReady = false
    let frameExtracting = false
    let currentDecodeIndex = -1
    let decodeQueue = []
    let hasReleasedCanvasToUser = false
    const FRAME_STEP = 1 / 30
    const CAPTURE_MAX_WIDTH = 1280
    const WARMUP_SECONDS = 0.875

    let captureCanvas = null
    let captureCtx = null
    let captureWidth = 0
    let captureHeight = 0

    let canvasHasValidFrame = false
    let lastCanvasPixelWidth = 0
    let lastCanvasPixelHeight = 0
    let lastDrawnFrameIndex = -1
    let lastRenderedFrame = null
    let renderPending = false
    let scrolling = false
    let scrollStopTimerId = 0
    const SCROLL_IDLE_MS = 125

    function clampTime(time) {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return 0
      return Math.max(0, Math.min(video.duration, time))
    }

    function isDesktopScrub() {
      return window.innerWidth >= DESKTOP_MIN_WIDTH
    }

    function objectPositionY() {
      return isDesktopScrub() ? 'bottom' : 'center'
    }

    function showVisibleVideoFallback() {
      if (!isDesktopScrub()) return
      video.autoplay = false
      video.pause()
      video.style.removeProperty('opacity')
      video.style.removeProperty('visibility')
      video.style.removeProperty('display')
      canvas.style.opacity = '0'
      canvas.style.visibility = 'hidden'
      videoWrap?.classList.remove('is-canvas-active')
    }

    function showDecoderVideoForMobile() {
      video.style.opacity = ''
      video.style.visibility = ''
      canvas.style.display = 'none'
    }

    function warmupFrameBudget() {
      if (!frameTimes.length) return 0
      return Math.min(
        frameTimes.length,
        Math.max(2, Math.ceil(WARMUP_SECONDS / FRAME_STEP)),
      )
    }

    function warmupReadyForTime(time) {
      if (!frameTimes.length) return false
      const center = idealFrameIndex(time)
      if (center < 0 || !frameCache[center]) return false

      const half = Math.max(1, Math.floor(warmupFrameBudget() / 2))
      let decodedInWindow = 0
      let slots = 0
      const start = Math.max(0, center - half)
      const end = Math.min(frameTimes.length - 1, center + half)
      for (let i = start; i <= end; i++) {
        slots++
        if (frameCache[i]) decodedInWindow++
      }
      const required = Math.min(slots, warmupFrameBudget())
      return decodedInWindow >= required
    }

    function canShowCanvasLayer() {
      if (!canvasHasValidFrame) return false
      if (hasReleasedCanvasToUser) return true
      return warmupReadyForTime(targetTime)
    }

    function hasCachedFrames() {
      for (let i = 0; i < frameTimes.length; i++) {
        if (frameCache[i]) return true
      }
      return false
    }

    function rebuildDecodeQueue() {
      const undecoded = []
      for (let i = 0; i < frameTimes.length; i++) {
        if (!frameCache[i] && i !== currentDecodeIndex) undecoded.push(i)
      }
      if (!undecoded.length) {
        decodeQueue = []
        return
      }

      const focus = idealFrameIndex(targetTime)
      const focusTime = focus >= 0 ? frameTimes[focus] : targetTime
      undecoded.sort((a, b) => {
        const distA = Math.abs(frameTimes[a] - focusTime)
        const distB = Math.abs(frameTimes[b] - focusTime)
        if (distA !== distB) return distA - distB
        return a - b
      })
      decodeQueue = undecoded
    }

    function activateCanvasLayer() {
      if (!isDesktopScrub() || !canShowCanvasLayer()) return
      if (canvas.width < 1 || canvas.height < 1) return
      canvas.style.display = 'block'
      canvas.style.opacity = '1'
      canvas.style.visibility = 'visible'
      video.style.opacity = '0'
      video.style.visibility = 'hidden'
      videoWrap?.classList.add('is-canvas-active')
      hasReleasedCanvasToUser = true
    }

    function drawCoverImage(image, imageWidth, imageHeight) {
      if (!image || !imageWidth || !imageHeight) return false

      const cw = canvas.clientWidth
      const ch = canvas.clientHeight
      if (!cw || !ch) return false

      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw
        canvas.height = ch
        lastCanvasPixelWidth = cw
        lastCanvasPixelHeight = ch
      }

      const scale = Math.max(cw / imageWidth, ch / imageHeight)
      const dw = imageWidth * scale
      const dh = imageHeight * scale
      const dx = cw - dw
      const dy = objectPositionY() === 'bottom' ? ch - dh : (ch - dh) / 2

      try {
        ctx.drawImage(image, dx, dy, dw, dh)
      } catch {
        return false
      }

      canvasHasValidFrame = true
      lastRenderedFrame = image
      return true
    }

    function idealFrameIndex(time) {
      if (!frameTimes.length) return -1

      let ideal = 0
      let bestDist = Math.abs(frameTimes[0] - time)
      for (let i = 1; i < frameTimes.length; i++) {
        const dist = Math.abs(frameTimes[i] - time)
        if (dist < bestDist) {
          ideal = i
          bestDist = dist
        }
      }
      return ideal
    }

    function frameIndexForTarget(time) {
      const ideal = idealFrameIndex(time)
      if (ideal < 0 || !hasCachedFrames()) return -1

      if (frameCache[ideal]) return ideal

      let best = -1
      let bestDist = Infinity
      for (let i = 0; i < frameTimes.length; i++) {
        const frame = frameCache[i]
        if (!frame) continue
        const dist = Math.abs(frameTimes[i] - time)
        if (dist < bestDist) {
          best = i
          bestDist = dist
        }
      }
      return best
    }

    function drawCachedFrameIfPossible() {
      if (scrolling) return false

      if (!hasCachedFrames()) {
        showVisibleVideoFallback()
        return false
      }

      const cw = canvas.clientWidth
      const ch = canvas.clientHeight
      if (!cw || !ch) {
        showVisibleVideoFallback()
        return false
      }

      const sizeChanged = canvas.width !== cw || canvas.height !== ch

      let index = frameIndexForTarget(targetTime)
      let frame = index >= 0 ? frameCache[index] : null

      if (!frame && lastRenderedFrame) {
        frame = lastRenderedFrame
        index = lastDrawnFrameIndex
      }

      if (!frame) {
        showVisibleVideoFallback()
        return false
      }

      if (index === lastDrawnFrameIndex && canvasHasValidFrame && !sizeChanged) {
        if (canShowCanvasLayer()) activateCanvasLayer()
        else showVisibleVideoFallback()
        return true
      }

      const drew = drawCoverImage(frame, captureWidth, captureHeight)
      if (drew) {
        if (index >= 0) lastDrawnFrameIndex = index
        if (canShowCanvasLayer()) activateCanvasLayer()
        else showVisibleVideoFallback()
        return true
      }

      showVisibleVideoFallback()
      return false
    }

    function markRenderNeeded() {
      renderPending = true
    }

    function setupCaptureSurface() {
      const vw = video.videoWidth
      const vh = video.videoHeight
      if (!vw || !vh) return

      captureWidth = Math.min(vw, CAPTURE_MAX_WIDTH)
      captureHeight = Math.round((vh / vw) * captureWidth)

      captureCanvas = document.createElement('canvas')
      captureCanvas.width = captureWidth
      captureCanvas.height = captureHeight
      captureCtx = captureCanvas.getContext('2d', { alpha: false })
    }

    function buildFrameTimeList() {
      frameTimes = []
      if (!Number.isFinite(video.duration) || video.duration <= 0) return
      for (let t = 0; t <= video.duration; t += FRAME_STEP) {
        frameTimes.push(Math.min(t, video.duration))
      }
      if (frameTimes[frameTimes.length - 1] < video.duration) {
        frameTimes.push(video.duration)
      }
    }

    function captureFrameSurface() {
      if (!captureCtx || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return null
      captureCtx.drawImage(video, 0, 0, captureWidth, captureHeight)
      const stored = document.createElement('canvas')
      stored.width = captureWidth
      stored.height = captureHeight
      const storedCtx = stored.getContext('2d', { alpha: false })
      if (!storedCtx) return null
      storedCtx.drawImage(captureCanvas, 0, 0)
      return stored
    }

    function extractNextFrame() {
      if (!frameExtracting) return
      if (scrolling) return

      if (!decodeQueue.length) {
        frameExtracting = false
        frameCacheReady = hasCachedFrames()
        drawCachedFrameIfPossible()
        return
      }

      currentDecodeIndex = decodeQueue.shift()
      video.currentTime = frameTimes[currentDecodeIndex]
    }

    function onVideoSeekedForExtract() {
      if (!frameExtracting || currentDecodeIndex < 0) return

      if (scrolling) {
        currentDecodeIndex = -1
        rebuildDecodeQueue()
        return
      }

      const surface = captureFrameSurface()
      if (!surface) {
        currentDecodeIndex = -1
        rebuildDecodeQueue()
        extractNextFrame()
        return
      }

      frameCache[currentDecodeIndex] = surface
      currentDecodeIndex = -1

      if (scrubbingEnabled) {
        markRenderNeeded()
        drawCachedFrameIfPossible()
      }

      rebuildDecodeQueue()
      extractNextFrame()
    }

    function startFrameCacheBuild() {
      if (frameExtracting || frameCacheReady) return
      setupCaptureSurface()
      buildFrameTimeList()
      if (!frameTimes.length || !captureCtx) return

      frameExtracting = true
      frameCacheReady = false
      hasReleasedCanvasToUser = false
      currentDecodeIndex = -1
      frameCache.length = frameTimes.length
      video.autoplay = false
      video.pause()
      showVisibleVideoFallback()
      targetTime = 0
      rebuildDecodeQueue()
      extractNextFrame()
    }

    function onTargetTimeChanged() {
      if (!frameExtracting || scrolling) return
      rebuildDecodeQueue()
      if (currentDecodeIndex < 0) extractNextFrame()
    }

    function resumeAfterScrollIdle() {
      if (!isDesktopScrub()) return
      if (frameExtracting && currentDecodeIndex < 0) {
        extractNextFrame()
      }
      if (renderPending) {
        renderPending = false
        drawCachedFrameIfPossible()
      }
    }

    function handleScroll() {
      if (!isDesktopScrub()) return
      scrolling = true
      window.clearTimeout(scrollStopTimerId)
      scrollStopTimerId = window.setTimeout(() => {
        scrolling = false
        resumeAfterScrollIdle()
      }, SCROLL_IDLE_MS)
    }

    function handlePointerMove(event) {
      if (!scrubbingEnabled) return
      if (!Number.isFinite(video.duration) || video.duration <= 0) return

      const currentX = event.clientX
      if (prevX === null) {
        prevX = currentX
        return
      }

      const delta = currentX - prevX
      prevX = currentX

      const adjustment = (delta / window.innerWidth) * 0.8 * video.duration
      targetTime = clampTime(targetTime + adjustment)
      onTargetTimeChanged()
      markRenderNeeded()
    }

    function animationTick() {
      rafId = window.requestAnimationFrame(animationTick)
      if (!scrubbingEnabled || !renderPending || scrolling) return
      renderPending = false
      drawCachedFrameIfPossible()
    }

    function onLoadedData() {
      if (!isDesktopScrub() || canvasHasValidFrame) return
      showVisibleVideoFallback()
      video.autoplay = false
      video.pause()
      targetTime = 0
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        video.currentTime = 0
      }
    }

    function onLoadedMetadata() {
      targetTime = clampTime(video.currentTime)
      if (isDesktopScrub()) {
        targetTime = 0
        showVisibleVideoFallback()
        startFrameCacheBuild()
      }
    }

    function setupPlayback() {
      if (!isDesktopScrub()) {
        scrubbingEnabled = false
        frameExtracting = false
        canvas.style.display = 'none'
        showDecoderVideoForMobile()
        videoWrap?.classList.remove('is-canvas-active')
        video.autoplay = true
        video.play().catch(() => {})
      } else {
        scrubbingEnabled = true
        showVisibleVideoFallback()
        prevX = null
        targetTime = clampTime(video.currentTime)
        if (frameCacheReady && canvasHasValidFrame) {
          activateCanvasLayer()
        } else {
          showVisibleVideoFallback()
        }
        if (!frameCacheReady && !frameExtracting && video.readyState >= 1) {
          startFrameCacheBuild()
        }
        drawCachedFrameIfPossible()
      }
    }

    video.addEventListener('play', () => {
      if (isDesktopScrub()) {
        video.pause()
      }
    })

    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('loadeddata', onLoadedData)
    video.addEventListener('seeked', onVideoSeekedForExtract)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', () => {
      lastDrawnFrameIndex = -1
      setupPlayback()
      drawCachedFrameIfPossible()
    })

    setupPlayback()
    rafId = window.requestAnimationFrame(animationTick)
  }

  function initTypewriter() {
    const line1El = document.getElementById('typewriter-line-1')
    const line2El = document.getElementById('typewriter-line-2')
    const line2Wrap = document.getElementById('typewriter-line-2-wrap')
    const cursorEl = document.getElementById('typewriter-cursor')
    if (!line1El || !line2El || !line2Wrap || !cursorEl) return

    const totalLength = TYPEWRITER_LINE_1.length + TYPEWRITER_LINE_2.length
    let index = 0

    window.setTimeout(() => {
      const intervalId = window.setInterval(() => {
        index += 1

        if (index <= TYPEWRITER_LINE_1.length) {
          line1El.textContent = TYPEWRITER_LINE_1.slice(0, index)
        } else {
          line1El.textContent = TYPEWRITER_LINE_1
          if (line2Wrap.hidden) {
            line2Wrap.hidden = false
            line2Wrap.appendChild(cursorEl)
          }
          const line2Index = index - TYPEWRITER_LINE_1.length
          line2El.textContent = TYPEWRITER_LINE_2.slice(0, line2Index)
        }

        if (index >= totalLength) {
          window.clearInterval(intervalId)
          cursorEl.classList.add('is-hidden')
        }
      }, TYPEWRITER_SPEED)
    }, TYPEWRITER_START_DELAY)
  }

  function sitePath(relativePath) {
    if (!relativePath) return relativePath
    const trimmed = String(relativePath).replace(/^\/+/, '')
    return new URL(trimmed, document.baseURI).href
  }

  function initTemplateGallery() {
    const grid = document.getElementById('template-gallery-grid')
    const lightbox = document.getElementById('template-lightbox')
    const lightboxVideo = document.getElementById('template-lightbox-video')
    const lightboxImage = document.getElementById('template-lightbox-image')
    const lightboxName = document.getElementById('template-lightbox-name')
    const lightboxDescription = document.getElementById('template-lightbox-description')
    const lightboxCta = document.getElementById('template-lightbox-cta')

    if (
      !grid ||
      !lightbox ||
      !lightboxVideo ||
      !lightboxImage ||
      !lightboxName ||
      !lightboxDescription ||
      !lightboxCta
    ) {
      return
    }

    let activeItem = null

    function assetExists(url) {
      return fetch(url, { method: 'HEAD' })
        .then((response) => response.ok)
        .catch(() => false)
    }

    function setLightboxMedia(item) {
      lightboxVideo.pause()
      lightboxVideo.removeAttribute('src')
      lightboxVideo.load()
      lightboxVideo.hidden = true
      lightboxImage.hidden = true
      lightboxImage.removeAttribute('src')

      if (item.previewVideo) {
        lightboxVideo.src = sitePath(item.previewVideo)
        lightboxVideo.hidden = false
        lightboxVideo.play().catch(() => {})
        return
      }

      if (item.previewImage) {
        lightboxImage.src = item.previewImage
        lightboxImage.alt = item.name
        lightboxImage.hidden = false
      }
    }

    function openLightbox(item) {
      activeItem = item
      lightboxName.textContent = item.name
      lightboxDescription.textContent = item.description || ''
      lightboxCta.href = sitePath(item.page)
      setLightboxMedia(item)
      lightbox.hidden = false
      lightbox.setAttribute('aria-hidden', 'false')
      document.body.style.overflow = 'hidden'
    }

    function closeLightbox() {
      activeItem = null
      lightbox.hidden = true
      lightbox.setAttribute('aria-hidden', 'true')
      document.body.style.overflow = ''
      lightboxVideo.pause()
    }

    function observePreviewVideos() {
      const videos = grid.querySelectorAll('.template-card__preview video')
      if (!videos.length) return

      videos.forEach((video) => {
        if (!(video instanceof HTMLVideoElement)) return
        video.playbackRate = Number(video.dataset.playbackRate) || 1

        video.addEventListener('error', () => {
          video.style.visibility = 'hidden'
        })
      })

      if (!('IntersectionObserver' in window)) {
        videos.forEach((video) => {
          if (video instanceof HTMLVideoElement) {
            video.play().catch(() => {})
          }
        })
        return
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = entry.target
            if (!(video instanceof HTMLVideoElement)) return

            if (entry.isIntersecting) {
              video.playbackRate = Number(video.dataset.playbackRate) || 1
              const tryPlay = () => {
                video.playbackRate = Number(video.dataset.playbackRate) || 1
                video.play().catch(() => {})
              }
              if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
                tryPlay()
              } else {
                video.addEventListener('loadeddata', tryPlay, { once: true })
              }
            } else {
              video.pause()
            }
          })
        },
        { root: null, rootMargin: '80px 0px', threshold: 0.12 },
      )

      videos.forEach((video) => observer.observe(video))
    }

    function createCard(item) {
      const card = document.createElement('button')
      card.type = 'button'
      card.className = 'template-card'

      const preview = document.createElement('div')
      preview.className = 'template-card__preview'

      if (item.previewVideo) {
        const video = document.createElement('video')
        video.muted = true
        video.defaultMuted = true
        video.playsInline = true
        video.loop = true
        video.autoplay = true
        video.preload = 'metadata'
        const previewRate = item.name.toLowerCase().includes('prompt generator')
  ? 0.5
  : 1;

video.playbackRate = previewRate;
video.dataset.playbackRate = String(previewRate);
        video.setAttribute('playsinline', '')
        video.setAttribute('webkit-playsinline', '')
        video.src = sitePath(item.previewVideo)
        preview.appendChild(video)
      } else if (item.previewImage) {
        const img = document.createElement('img')
        img.loading = 'lazy'
        img.src = item.previewImage
        img.alt = item.name
        preview.appendChild(img)
      }

      const body = document.createElement('div')
      body.className = 'template-card__body'
      const title = document.createElement('h3')
      title.className = 'template-card__name'
      title.textContent = item.name
      body.appendChild(title)

      card.appendChild(preview)
      card.appendChild(body)
      card.addEventListener('click', () => openLightbox(item))
      return card
    }

    function validateItem(item) {
      if (!item || !item.name || !item.page) return Promise.resolve(null)
      return Promise.resolve(item)
    }

    lightbox.querySelectorAll('[data-lightbox-close]').forEach((el) => {
      el.addEventListener('click', closeLightbox)
    })

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !lightbox.hidden) closeLightbox()
    })

    fetch(sitePath('assets/gallery.json'))
      .then((response) => (response.ok ? response.json() : []))
      .catch(() => [])
      .then((items) => {
        if (!Array.isArray(items)) return
        return Promise.all(items.map((item) => validateItem(item)))
      })
      .then((validated) => {
        if (!validated) return
        const ready = validated.filter(Boolean)
        ready.forEach((item) => {
          grid.appendChild(createCard(item))
        })
        observePreviewVideos()
      })
  }

  function init() {
    initNavigation()
    initBackgroundVideo()
    initTypewriter()
    initTemplateGallery()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
