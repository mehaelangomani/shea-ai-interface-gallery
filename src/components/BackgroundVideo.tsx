import { useEffect, useRef } from 'react'

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4'

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const prevXRef = useRef<number | null>(null)
  const targetTimeRef = useRef(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onSeeked = () => {
      if (Number.isFinite(video.duration)) {
        targetTimeRef.current = video.currentTime
      }
    }

    video.addEventListener('seeked', onSeeked)

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return
      if (!Number.isFinite(video.duration) || video.duration <= 0) return

      const currentX = e.clientX
      if (prevXRef.current === null) {
        prevXRef.current = currentX
        return
      }

      const delta = currentX - prevXRef.current
      prevXRef.current = currentX

      const adjustment = (delta / window.innerWidth) * 0.8 * video.duration
      let targetTime = targetTimeRef.current + adjustment
      targetTime = Math.max(0, Math.min(video.duration, targetTime))
      targetTimeRef.current = targetTime
      video.currentTime = targetTime
    }

    const onLoadedMetadata = () => {
      targetTimeRef.current = video.currentTime
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const setupPlayback = () => {
      if (window.innerWidth < 1024) {
        video.autoplay = true
        void video.play()
      } else {
        video.autoplay = false
        video.pause()
        prevXRef.current = null
        if (Number.isFinite(video.duration)) {
          targetTimeRef.current = video.currentTime
        }
      }
    }

    setupPlayback()
    window.addEventListener('resize', setupPlayback)
    return () => window.removeEventListener('resize', setupPlayback)
  }, [])

  return (
    <div className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-neutral-50 lg:bg-transparent">
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        src={VIDEO_SRC}
        className="w-full h-full object-cover object-right lg:object-right-bottom"
      />
    </div>
  )
}
