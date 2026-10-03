/**
 * OBJECT AI — Scroll reveal, subtle page-content enter, scroll parallax.
 * Multi-page app: normal link navigation (no full-page fade / no artificial delays).
 */

(function () {
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initReveal() {
    const els = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale');
    if (!els.length) return;

    if (reduced()) {
      els.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    els.forEach((el) => io.observe(el));
  }

  function initTimeline() {
    const line = document.querySelector('.process-line-fill');
    const section = document.querySelector('.section-how');
    if (!line || !section || reduced()) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) line.classList.add('is-lit');
        });
      },
      { threshold: 0.35 }
    );
    io.observe(section);
  }

  /** Animate only main content — navbar/footer/background stay visible. */
  function initPageContentEnter() {
    if (reduced()) return;

    const root =
      document.getElementById('main-content') ||
      document.querySelector('main') ||
      document.querySelector('.auth-split');
    if (!root) return;

    root.classList.add('page-content-enter');
    requestAnimationFrame(() => {
      root.classList.add('page-content-enter-active');
    });
  }

  function initScrollParallax() {
    if (reduced()) return;
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const glow = hero.querySelector('.hero-bg');
    const floats = hero.querySelector('.hero-floats');
    function onScroll() {
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, 1 - rect.top / window.innerHeight));
      const y = progress * 18;
      if (glow) glow.style.transform = `translateY(${y * 0.35}px)`;
      if (floats) floats.style.transform = `translateY(${y * 0.55}px)`;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initTimeline();
    initPageContentEnter();
    initScrollParallax();
  });
})();
