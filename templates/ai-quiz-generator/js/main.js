/**
 * QuizAI — shared utilities, navigation, theme
 */
(function () {
  'use strict';

  const STORAGE_KEYS = {
    user: 'quizAIUser',
    plan: 'selectedPlan',
    quiz: 'currentQuiz',
    result: 'quizResult',
    history: 'quizHistory',
    library: 'quizAILibrary',
    settings: 'quizAISettings',
    theme: 'quizAITheme',
  };

  const PUBLIC_NAV_MAP = {
    'index.html': 'home',
    'features.html': 'features',
    'pricing.html': 'pricing',
    'login.html': 'login',
  };

  const SIDEBAR_NAV_MAP = {
    'dashboard.html': 'dashboard',
    'generator.html': 'generator',
    'my-quizzes.html': 'my-quizzes',
    'history.html': 'history',
    'settings.html': 'settings',
  };

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function getPageFileName() {
    const path = window.location.pathname || '';
    let file = path.split('/').pop() || '';
    if (!file || !file.includes('.')) {
      const href = window.location.href.split('?')[0].split('#')[0];
      const parts = href.split('/');
      file = parts[parts.length - 1] || 'index.html';
    }
    if (file === '' || file.endsWith('/')) file = 'index.html';
    return file.toLowerCase();
  }

  window.QuizAI = {
    keys: STORAGE_KEYS,
    prefersReducedMotion,
    getPageFileName,

    getUser() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.user);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    },

    setUser(user) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
      this.refreshUserUI();
    },

    clearUser() {
      localStorage.removeItem(STORAGE_KEYS.user);
    },

    isLoggedIn() {
      return !!this.getUser();
    },

    requireAuth() {
      if (!this.isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
      }
      return true;
    },

    getPlan() {
      const user = this.getUser();
      return user?.plan || localStorage.getItem(STORAGE_KEYS.plan) || 'Free';
    },

    getTheme() {
      return localStorage.getItem(STORAGE_KEYS.theme) === 'dark' ? 'dark' : 'light';
    },

    syncThemeControls() {
      const value = this.getTheme();
      document.documentElement.setAttribute('data-theme', value);
      document.querySelectorAll('[data-theme-option]').forEach((btn) => {
        const selected = btn.dataset.themeOption === value;
        btn.classList.toggle('is-selected', selected);
        btn.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
    },

    setTheme(theme) {
      const value = theme === 'dark' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEYS.theme, value);
      this.syncThemeControls();
    },

    initTheme() {
      this.syncThemeControls();
    },

    getLibrary() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.library);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    },

    saveLibraryEntry(entry) {
      const lib = this.getLibrary();
      lib.unshift(entry);
      localStorage.setItem(STORAGE_KEYS.library, JSON.stringify(lib.slice(0, 50)));
    },

    updateLibraryEntry(quizId, updates) {
      const lib = this.getLibrary();
      const idx = lib.findIndex((q) => q.id === quizId);
      if (idx === -1) return;
      lib[idx] = { ...lib[idx], ...updates };
      localStorage.setItem(STORAGE_KEYS.library, JSON.stringify(lib));
    },

    getHistory() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.history);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    },

    showToast(message, type = 'success') {
      let container = document.querySelector('.toast-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        container.setAttribute('aria-live', 'polite');
        document.body.appendChild(container);
      }
      const toast = document.createElement('div');
      toast.className = `toast toast--${type}`;
      toast.setAttribute('role', 'status');
      toast.textContent = message;
      container.appendChild(toast);
      const duration = prefersReducedMotion() ? 2000 : 3200;
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    },

    refreshUserUI() {
      const user = this.getUser();
      if (!user) return;

      const initials = (user.name || 'U')
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

      const displayName = user.name || 'Meha';
      const firstName = displayName.split(' ')[0];

      document.querySelectorAll('[data-user-name]').forEach((el) => {
        el.textContent = el.dataset.userNameMode === 'full' ? displayName : firstName;
      });
      document.querySelectorAll('[data-user-plan]').forEach((el) => {
        el.textContent = user.plan || 'Free';
      });
      document.querySelectorAll('[data-user-avatar]').forEach((el) => {
        el.textContent = initials;
      });
    },

    setActivePublicNav() {
      const page = getPageFileName();
      const activeKey = PUBLIC_NAV_MAP[page] || null;
      document.querySelectorAll('[data-public-nav]').forEach((link) => {
        link.classList.remove('is-active');
      });
      if (activeKey) {
        document.querySelectorAll(`[data-public-nav="${activeKey}"]`).forEach((link) => {
          link.classList.add('is-active');
        });
      }
    },

    setActiveSidebarItem() {
      const page = getPageFileName();
      const activeKey = SIDEBAR_NAV_MAP[page] || null;
      document.querySelectorAll('.app-sidebar__link[data-nav]').forEach((link) => {
        link.classList.remove('is-active');
      });
      if (activeKey) {
        const target = document.querySelector(`.app-sidebar__link[data-nav="${activeKey}"]`);
        target?.classList.add('is-active');
      }
    },

    initPageEnter() {
      if (!prefersReducedMotion()) {
        document.body.classList.add('page-enter');
      }
    },

    initPublicNav() {
      this.setActivePublicNav();

      const mobileNav = document.querySelector('.mobile-nav');
      document.querySelectorAll('.nav-toggle:not([data-sidebar-open])').forEach((toggle) => {
        if (!mobileNav) return;
        toggle.addEventListener('click', () => {
          const open = mobileNav.classList.toggle('is-open');
          toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
          document.body.classList.toggle('mobile-nav-open', open);
        });
      });

      mobileNav?.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          mobileNav.classList.remove('is-open');
          document.body.classList.remove('mobile-nav-open');
          document.querySelectorAll('.nav-toggle:not([data-sidebar-open])').forEach((t) => {
            t.setAttribute('aria-expanded', 'false');
          });
        });
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav?.classList.contains('is-open')) {
          mobileNav.classList.remove('is-open');
          document.body.classList.remove('mobile-nav-open');
        }
      });
    },

    initAppShell() {
      if (document.body.dataset.appShellInit === 'true') {
        this.refreshUserUI();
        this.setActiveSidebarItem();
        return;
      }
      document.body.dataset.appShellInit = 'true';

      this.refreshUserUI();
      this.setActiveSidebarItem();

      const sidebar = document.querySelector('.app-sidebar');
      const overlay = document.querySelector('.sidebar-overlay');
      const openBtn = document.querySelector('[data-sidebar-open]');

      const closeSidebar = () => {
        sidebar?.classList.remove('is-open');
        overlay?.classList.remove('is-visible');
        document.body.classList.remove('sidebar-open');
      };

      openBtn?.addEventListener('click', () => {
        sidebar?.classList.add('is-open');
        overlay?.classList.add('is-visible');
        document.body.classList.add('sidebar-open');
      });
      overlay?.addEventListener('click', closeSidebar);

      document.querySelectorAll('[data-logout]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.clearUser();
          window.location.href = 'login.html';
        });
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar?.classList.contains('is-open')) closeSidebar();
      });
    },

    initScrollReveal() {
      if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
        document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    },
  };

  document.addEventListener('DOMContentLoaded', () => {
    QuizAI.initTheme();
    QuizAI.initPageEnter();
    QuizAI.initPublicNav();
    QuizAI.initAppShell();
    QuizAI.initScrollReveal();
  });
})();
