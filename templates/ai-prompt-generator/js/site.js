/**
 * PROMPTLY — Shared site scripts (all pages)
 */
(function () {
  'use strict';

  const THEME_KEY = 'promptly-theme-v2';

  const NAV_ROUTES = {
    'index.html': 'home',
    '': 'home',
    'templates.html': 'templates',
    'how-it-works.html': 'how-it-works',
    'pricing.html': 'pricing',
    'blog.html': 'blog',
  };

  document.addEventListener('DOMContentLoaded', () => {
    syncThemeToggleAria();
    initThemeToggle();
    initMobileMenu();
    initActiveNav();
    initNavLoaded();
    initPageTransition();
    initTemplatesPage();
    initHowItWorksPage();
    initPricingPage();
    initBlogPage();
    initAuthPage();
    initContactForm();
    initToastContainer();
  });

  function getPageKey() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    return NAV_ROUTES[path] || null;
  }

  function getThemeToggle() {
    return document.getElementById('themeToggle');
  }

  function syncThemeToggleAria() {
    const toggle = getThemeToggle();
    if (!toggle) return;
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const isDark = currentTheme !== 'light';
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
  }

  function initThemeToggle() {
    const toggle = getThemeToggle();
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');

      document.documentElement.classList.add('theme-transition');

      if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        try {
          localStorage.setItem(THEME_KEY, 'light');
        } catch (e) {
          /* ignore */
        }
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        try {
          localStorage.setItem(THEME_KEY, 'dark');
        } catch (e) {
          /* ignore */
        }
      }

      syncThemeToggleAria();
    });
  }

  function initMobileMenu() {
    const burger = document.getElementById('nav-burger');
    const panel = document.getElementById('nav-mobile-panel');
    if (!burger || !panel) return;

    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('is-open');
      panel.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    panel.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        burger.classList.remove('is-open');
        panel.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) {
        burger.classList.remove('is-open');
        panel.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function initActiveNav() {
    const key = getPageKey();
    if (!key) return;

    document.querySelectorAll('[data-nav]').forEach((link) => {
      const isActive = link.getAttribute('data-nav') === key;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function initNavLoaded() {
    const nav = document.querySelector('.nav');
    requestAnimationFrame(() => nav?.classList.add('is-loaded'));
  }

  function initPageTransition() {
    const main = document.querySelector('.page-main');
    if (!main || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      main?.classList.add('is-visible');
      return;
    }
    requestAnimationFrame(() => main.classList.add('is-visible'));
  }

  /* Templates */
  function initTemplatesPage() {
    const grid = document.querySelector('.template-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.template-card'));
    const filters = document.querySelectorAll('.filter-chip');
    const search = document.getElementById('template-search');

    function applyFilters() {
      const query = (search?.value || '').trim().toLowerCase();
      const active = document.querySelector('.filter-chip.is-active');
      const category = active?.dataset.filter || 'all';

      cards.forEach((card) => {
        const cardCat = card.dataset.category || '';
        const text = card.textContent.toLowerCase();
        const matchCat = category === 'all' || cardCat === category;
        const matchSearch = !query || text.includes(query);
        const show = matchCat && matchSearch;
        card.classList.toggle('is-filtered-out', !show);
        card.classList.toggle('is-filtered-in', show);
      });
    }

    filters.forEach((chip) => {
      chip.addEventListener('click', () => {
        filters.forEach((c) => {
          c.classList.remove('is-active');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('is-active');
        chip.setAttribute('aria-pressed', 'true');
        applyFilters();
      });
    });

    search?.addEventListener('input', applyFilters);
    applyFilters();
  }

  /* How it works scroll steps */
  function initHowItWorksPage() {
    const track = document.querySelector('.hiw-steps');
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(track);
  }

  /* Pricing */
  function initPricingPage() {
    document.querySelectorAll('[data-pricing-action]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Checkout is coming soon — pricing UI is ready for integration.');
      });
    });
  }

  /* Blog */
  function initBlogPage() {
    const dialog = document.getElementById('article-dialog');
    if (!dialog) return;

    document.querySelectorAll('[data-article]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const title = link.getAttribute('data-article') || 'Article';
        const titleEl = dialog.querySelector('#article-dialog-title');
        if (titleEl) titleEl.textContent = title;
        if (typeof dialog.showModal === 'function') {
          dialog.showModal();
        } else {
          dialog.setAttribute('open', '');
        }
      });
    });

    dialog.querySelector('[data-close-dialog]')?.addEventListener('click', () => {
      dialog.close?.() || dialog.removeAttribute('open');
    });
  }

  /* Auth */
  function initAuthPage() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Authentication will be connected in the next stage.');
    });

    document.querySelector('[data-google-auth]')?.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Authentication will be connected in the next stage.');
    });
  }

  /* Contact */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thanks — your message form is ready to connect to a backend.');
      form.reset();
    });
  }

  let toastEl;
  function initToastContainer() {
    toastEl = document.getElementById('site-toast');
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'site-toast';
      toastEl.className = 'site-toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
  }

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toastEl.classList.remove('is-visible'), 4200);
  }

  window.PromptlySite = { showToast };
})();
