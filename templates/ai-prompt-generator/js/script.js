/**

 * PROMPTLY — Landing Page Scripts

 */



(function () {

  'use strict';



  const PLACEHOLDERS = {

    chat: 'Explain quantum computing to a beginner...',

    image: 'Create a cinematic image of a futuristic city at dusk...',

    coding: 'Build a Python function that validates email addresses...',

    marketing: 'Create an Instagram campaign for a sustainable skincare brand...',

    research: 'Analyze the impact of remote work on urban economies...',

  };



  const PARALLAX_LERP = 0.08;

  const MAX_CARD_OFFSET = 18;

  const MAX_VIDEO_OFFSET_X = 18;

  const MAX_VIDEO_OFFSET_Y = 12;



  let parallaxEnabled = true;

  let targetNormX = 0;

  let targetNormY = 0;

  let currentNormX = 0;

  let currentNormY = 0;



  let heroRect = { left: 0, top: 0, width: 1, height: 1 };

  let parallaxCards = [];

  let heroVideo = null;

  let parallaxLoopStarted = false;



  document.addEventListener('DOMContentLoaded', () => {

    initReducedMotion();

    initVideoFallback();

    initHeroPointerParallax();

    initFloatingCardEntrance();

    initGeneratorPreview();

    initScrollAnimations();

    initSmoothScroll();

    initHeroEntrance();

    initVisibilityPause();

  });



  function initReducedMotion() {

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const apply = (reduced) => {
      parallaxEnabled = !reduced;
      document.documentElement.classList.toggle('reduce-motion', reduced);
      if (reduced) {
        targetNormX = 0;
        targetNormY = 0;
        currentNormX = 0;
        currentNormY = 0;
        document.querySelectorAll('.parallax-card').forEach((card) => {
          card.style.transform = '';
        });
        const video = document.querySelector('.hero__video');
        if (video) video.style.transform = '';
      }
    };

    apply(mq.matches);

    mq.addEventListener('change', (e) => apply(e.matches));

  }



  function initVideoFallback() {

    const video = document.querySelector('.hero__video');

    const fallback = document.querySelector('.hero__fallback');

    if (!video || !fallback) return;



    fallback.classList.add('is-visible');



    const showFallback = () => {

      video.classList.add('is-hidden');

      fallback.classList.add('is-visible');

    };



    const hideFallback = () => {

      fallback.classList.remove('is-visible');

      video.classList.remove('is-hidden');

    };



    video.addEventListener('error', showFallback);



    video.addEventListener('canplay', () => {

      hideFallback();

      video.play().catch(showFallback);

    }, { once: true });



    const timeout = setTimeout(() => {

      if (video.readyState < 2 || video.classList.contains('is-hidden')) {

        showFallback();

      }

    }, 3000);



    video.addEventListener('canplay', () => clearTimeout(timeout), { once: true });

  }



  /**

   * Single pointer parallax system: hero-relative coords, one rAF loop.

   * Document-level pointer tracking so the navbar does not trigger hero mouseleave snaps.

   */

  function initHeroPointerParallax() {

    const hero = document.querySelector('.hero');

    heroVideo = document.querySelector('.hero__video');

    parallaxCards = Array.from(document.querySelectorAll('.parallax-card[data-depth]'));

    if (!hero) return;



    function cacheHeroRect() {

      const rect = hero.getBoundingClientRect();

      heroRect = {

        left: rect.left,

        top: rect.top,

        width: Math.max(rect.width, 1),

        height: Math.max(rect.height, 1),

      };

    }



    cacheHeroRect();

    window.addEventListener('resize', cacheHeroRect, { passive: true });

    window.addEventListener('scroll', cacheHeroRect, { passive: true });



    function setTargetsFromPointer(clientX, clientY) {

      const x = clientX - heroRect.left;

      const y = clientY - heroRect.top;

      targetNormX = (x / heroRect.width) * 2 - 1;

      targetNormY = (y / heroRect.height) * 2 - 1;

    }



    function isPointerOnPage(clientX, clientY) {

      return (

        clientX >= 0 &&

        clientY >= 0 &&

        clientX <= window.innerWidth &&

        clientY <= window.innerHeight

      );

    }



    document.addEventListener(

      'pointermove',

      (e) => {

        if (!parallaxEnabled) return;

        if (!isPointerOnPage(e.clientX, e.clientY)) {

          targetNormX = 0;

          targetNormY = 0;

          return;

        }

        setTargetsFromPointer(e.clientX, e.clientY);

      },

      { passive: true }

    );



    document.addEventListener('pointerleave', () => {

      targetNormX = 0;

      targetNormY = 0;

    });



    if (!parallaxLoopStarted) {

      parallaxLoopStarted = true;

      function tick() {

        currentNormX += (targetNormX - currentNormX) * PARALLAX_LERP;

        currentNormY += (targetNormY - currentNormY) * PARALLAX_LERP;



        if (parallaxEnabled) {

          if (heroVideo && !heroVideo.classList.contains('is-hidden')) {

            heroVideo.style.transform = `translate3d(${-currentNormX * MAX_VIDEO_OFFSET_X}px, ${-currentNormY * MAX_VIDEO_OFFSET_Y}px, 0)`;

          }



          parallaxCards.forEach((card) => {

            const depth = parseFloat(card.dataset.depth) || 0.4;

            const tx = currentNormX * depth * MAX_CARD_OFFSET;

            const ty = currentNormY * depth * MAX_CARD_OFFSET;

            card.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;

          });

        }



        requestAnimationFrame(tick);

      }

      requestAnimationFrame(tick);

    }

  }



  function initFloatingCardEntrance() {

    const wraps = document.querySelectorAll('.parallax-card');

    if (!wraps.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;



    requestAnimationFrame(() => {

      wraps.forEach((wrap, i) => {

        wrap.style.opacity = '0';

        setTimeout(() => {

          wrap.style.opacity = '1';

          wrap.style.transition = 'opacity 0.6s ease';

        }, 600 + i * 120);

      });

    });

  }



  function initGeneratorPreview() {

    const input = document.getElementById('preview-input');

    const chips = document.querySelectorAll('.category-chip');

    const toneSelect = document.getElementById('tone-select');

    const detailSelect = document.getElementById('detail-select');

    const formatSelect = document.getElementById('format-select');

    const meta = document.getElementById('preview-meta');

    const cta = document.getElementById('hero-generate-cta');



    let selectedCategory = 'chat';



    chips.forEach((chip) => {

      chip.addEventListener('click', () => {

        chips.forEach((c) => {

          c.classList.remove('is-selected');

          c.setAttribute('aria-pressed', 'false');

        });

        chip.classList.add('is-selected');

        chip.setAttribute('aria-pressed', 'true');

        selectedCategory = chip.dataset.category || 'chat';

        if (input) {

          input.placeholder = PLACEHOLDERS[selectedCategory] || PLACEHOLDERS.chat;

        }

        updateMeta();

      });

    });



    function updateMeta() {

      if (!meta) return;

      const tone = toneSelect?.value || 'Friendly';

      const detail = detailSelect?.value || 'Detailed';

      const format = formatSelect?.value || 'Paragraph';

      meta.textContent = `Preview: ${tone} tone · ${detail} detail · ${format} format`;

    }



    [toneSelect, detailSelect, formatSelect].forEach((el) => {

      el?.addEventListener('change', updateMeta);

    });



    updateMeta();



    cta?.addEventListener('click', () => {

      window.location.href = 'generator.html';

    });

  }



  function initScrollAnimations() {

    const featureCards = document.querySelectorAll('.feature-card');

    const stepsSection = document.querySelector('.steps');



    const observer = new IntersectionObserver(

      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) return;

          entry.target.classList.add('is-visible');

          observer.unobserve(entry.target);

        });

      },

      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }

    );



    featureCards.forEach((card) => observer.observe(card));

    if (stepsSection) observer.observe(stepsSection);

  }



  function initSmoothScroll() {

    const indicator = document.getElementById('scroll-indicator');

    const features = document.getElementById('features');



    indicator?.addEventListener('click', () => {

      features?.scrollIntoView({ behavior: parallaxEnabled ? 'smooth' : 'auto' });

    });

  }



  function initHeroEntrance() {

    const eyebrow = document.querySelector('.hero__eyebrow');

    const title = document.querySelector('.hero__title');

    const desc = document.querySelector('.hero__desc');

    const panel = document.querySelector('.generator-panel');



    requestAnimationFrame(() => {

      eyebrow?.classList.add('is-visible');

      title?.classList.add('is-visible');

      desc?.classList.add('is-visible');

      panel?.classList.add('is-visible');

    });

  }



  function initVisibilityPause() {

    const video = document.querySelector('.hero__video');

    document.addEventListener('visibilitychange', () => {

      if (document.hidden) {

        video?.pause();

      } else if (video && !video.classList.contains('is-hidden')) {

        video.play().catch(() => {});

      }

    });

  }

})();


