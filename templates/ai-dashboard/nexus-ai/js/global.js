/**
 * NEXUSAI — Global utilities, navigation, theme, modals, toasts
 */
(function () {
  'use strict';

  const STORAGE_KEYS = {
    theme: 'nexusai_theme',
    settings: 'nexusai_settings',
    profile: 'nexusai_profile',
    chats: 'nexusai_chat_history',
    projects: 'nexusai_projects',
    plan: 'nexusai_plan',
    planBilling: 'nexusai_plan_billing',
    activeProject: 'nexusai_active_project',
    activeChat: 'nexusai_active_chat', // legacy alias
    templatePrompt: 'nexusai_template_prompt',
    templateTitle: 'nexusai_template_title',
    workspacePrompt: 'nexusai_workspace_prompt',
    pendingWorkspaceAi: 'nexusai_pending_workspace_ai',
    library: 'nexusai_library',
  };

  const LEGACY_CHAT_KEY = 'nexusai_chats';

  const DEFAULT_PROFILE = {
    name: 'Meha',
    email: 'meha@example.com',
  };

  const PROJECT_ID_ALIASES = {
    portfolio: 'portfolio-design',
    'study-plan': 'ai-study-plan',
    marketing: 'marketing-strategy',
    python: 'python-examples',
  };

  const DEFAULT_SETTINGS = {
    theme: 'light',
    emailNotifications: true,
    productUpdates: true,
    usageAlerts: false,
    defaultModel: 'nexus-pro',
    responseStyle: 'balanced',
    autoSaveChats: true,
    chatHistory: true,
    dataSharing: false,
    language: 'en',
    githubConnected: true,
  };

  function getJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function setJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getProfile() {
    return { ...DEFAULT_PROFILE, ...getJSON(STORAGE_KEYS.profile, {}) };
  }

  function saveProfile(data) {
    setJSON(STORAGE_KEYS.profile, { ...getProfile(), ...data });
  }

  function getSettings() {
    return { ...DEFAULT_SETTINGS, ...getJSON(STORAGE_KEYS.settings, {}) };
  }

  function saveSettings(data) {
    const next = { ...getSettings(), ...data };
    setJSON(STORAGE_KEYS.settings, next);
    if (data.theme) applyTheme(data.theme);
    return next;
  }

  function applyTheme(mode) {
    const resolved =
      mode === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : mode;
    document.documentElement.setAttribute('data-theme', resolved === 'dark' ? 'dark' : 'light');
    localStorage.setItem(STORAGE_KEYS.theme, mode);
  }

  function initTheme() {
    const settings = getSettings();
    const stored = localStorage.getItem(STORAGE_KEYS.theme) || settings.theme || 'light';
    applyTheme(stored);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const mode = localStorage.getItem(STORAGE_KEYS.theme) || 'light';
      if (mode === 'system') applyTheme('system');
    });
  }

  function toast(message, type = 'success', duration = 3200) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 200);
    }, duration);
  }

  function openModal(id) {
    const backdrop = document.getElementById(id);
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(id) {
    const backdrop = document.getElementById(id);
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function initModals() {
    document.querySelectorAll('[data-modal-close]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const backdrop = btn.closest('.modal-backdrop');
        if (backdrop) closeModal(backdrop.id);
      });
    });
    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal(backdrop.id);
      });
    });
  }

  const NAV_ITEMS = [
    { id: 'workspace', label: 'Home', href: 'workspace.html', icon: 'home' },
    { id: 'chat', label: 'Chat', href: 'chat.html?fresh=1', icon: 'chat' },
    { id: 'projects', label: 'Projects', href: 'projects.html', icon: 'folder' },
    { id: 'explore', label: 'Templates', href: 'explore.html', icon: 'grid' },
    { id: 'library', label: 'Library', href: 'library.html', icon: 'library' },
  ];

  const PAGE_IDS = {
    'workspace.html': 'workspace',
    'chat.html': 'chat',
    'projects.html': 'projects',
    'explore.html': 'explore',
    'library.html': 'library',
    'settings.html': 'settings',
    'profile.html': 'profile',
  };

  const NAV_FOOTER = [
    { id: 'settings', label: 'Settings', href: 'settings.html', icon: 'settings' },
    { id: 'profile', label: 'Profile', href: 'profile.html', icon: 'user' },
  ];

  function iconSvg(name) {
    const icons = {
      home: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z"/></svg>',
      chat: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4v8z"/></svg>',
      folder: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7a2 2 0 012-2h5l2 2h9a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/></svg>',
      grid: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
      library: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
      settings: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
      user: '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>',
      menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    };
    return icons[name] || '';
  }

  function resolveActivePage(explicit) {
    if (explicit) return explicit;
    const file = window.location.pathname.split('/').pop() || 'workspace.html';
    return PAGE_IDS[file] || 'workspace';
  }

  function getActiveProjectId() {
    return (
      localStorage.getItem(STORAGE_KEYS.activeProject) ||
      localStorage.getItem(STORAGE_KEYS.activeChat) ||
      null
    );
  }

  function setActiveProjectId(id) {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.activeProject, id);
      localStorage.setItem(STORAGE_KEYS.activeChat, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.activeProject);
      localStorage.removeItem(STORAGE_KEYS.activeChat);
    }
  }

  function getPlanState() {
    let plan = localStorage.getItem(STORAGE_KEYS.plan) || 'free';
    if (plan && plan.startsWith('"')) {
      try {
        plan = JSON.parse(plan);
      } catch {
        plan = 'free';
      }
    }
    const billing = localStorage.getItem(STORAGE_KEYS.planBilling) || 'monthly';
    const labels = { free: 'Free Plan', pro: 'Pro Plan', team: 'Team Plan' };
    let priceText = '₹0 / month';
    if (plan === 'pro') {
      priceText = billing === 'yearly' ? '₹7,670 / year' : '₹799 / month';
    } else if (plan === 'team') {
      priceText = billing === 'yearly' ? '₹14,390 / year' : '₹1,499 / user / month';
    }
    return { plan, billing, label: labels[plan] || 'Free Plan', priceText };
  }

  function setPlanState(plan, billing) {
    localStorage.setItem(STORAGE_KEYS.plan, plan);
    if (billing) localStorage.setItem(STORAGE_KEYS.planBilling, billing);
  }

  function renderAppShell(activePage) {
    const shell = document.querySelector('.app-shell');
    if (!shell || shell.dataset.shellInit) return;
    shell.dataset.shellInit = 'true';
    shell.classList.add('has-sidebar');
    const currentPage = resolveActivePage(activePage);

    const navHtml = (items) =>
      items
        .map((item) => {
          const active = item.id === currentPage ? ' active' : '';
          return `<a href="${item.href}" class="nav-item${active}" data-nav="${item.id}">${iconSvg(item.icon)}${item.label}</a>`;
        })
        .join('');

    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    sidebar.id = 'app-sidebar';
    sidebar.innerHTML = `
      <div class="sidebar-header">
        <a href="workspace.html" class="logo">
          <span class="logo-mark sm">NX</span>
          NexusAI
        </a>
      </div>
      <nav class="sidebar-nav" aria-label="Main">${navHtml(NAV_ITEMS)}</nav>
      <div class="sidebar-divider"></div>
      <nav class="sidebar-nav sidebar-footer" aria-label="Account">${navHtml(NAV_FOOTER)}</nav>
    `;

    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.id = 'sidebar-overlay';

    const main = shell.querySelector('.app-main');
    const topbar = document.createElement('header');
    topbar.className = 'mobile-topbar';
    topbar.innerHTML = `
      <button type="button" class="btn btn-icon btn-ghost" id="sidebar-toggle" aria-label="Open menu">${iconSvg('menu')}</button>
      <a href="workspace.html" class="logo"><span class="logo-mark sm">NX</span>NexusAI</a>
      <a href="profile.html" class="btn btn-icon btn-ghost" aria-label="Profile">${iconSvg('user')}</a>
    `;

    shell.insertBefore(sidebar, main);
    shell.insertBefore(overlay, main);
    if (main) main.insertBefore(topbar, main.firstChild);

    function toggleSidebar(open) {
      sidebar.classList.toggle('open', open);
      overlay.classList.toggle('visible', open);
    }

    const toggleBtn = document.getElementById('sidebar-toggle');
    toggleBtn?.addEventListener('click', () => {
      const open = !sidebar.classList.contains('open');
      toggleSidebar(open);
      toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    overlay.addEventListener('click', () => {
      toggleSidebar(false);
      toggleBtn?.setAttribute('aria-expanded', 'false');
    });
    sidebar.querySelectorAll('.nav-item').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          toggleSidebar(false);
          toggleBtn?.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  function initDropdowns() {
    document.querySelectorAll('[data-dropdown-toggle]').forEach((toggle) => {
      const parent = toggle.closest('.dropdown');
      if (!parent) return;
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.dropdown.open').forEach((d) => {
          if (d !== parent) d.classList.remove('open');
        });
        parent.classList.toggle('open');
      });
    });
    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown.open').forEach((d) => d.classList.remove('open'));
    });
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 48);
  }

  function formatRelativeDate(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  function defaultProjects() {
    return [
      { id: 'travel-japan', title: 'Travel Website — Japan', type: 'chat', updated: new Date().toISOString(), status: 'generate' },
      { id: 'college-research', title: 'College Research', type: 'document', updated: new Date(Date.now() - 86400000 * 2).toISOString(), status: 'plan' },
      { id: 'portfolio-design', title: 'Portfolio Design', type: 'design', updated: new Date(Date.now() - 86400000 * 5).toISOString(), status: 'research' },
      { id: 'ai-study-plan', title: 'AI Study Plan', type: 'chat', updated: new Date(Date.now() - 86400000 * 7).toISOString(), status: 'understanding' },
      { id: 'marketing-strategy', title: 'Marketing Strategy', type: 'document', updated: new Date(Date.now() - 86400000 * 10).toISOString(), status: 'plan' },
      { id: 'python-examples', title: 'Python Code Examples', type: 'code', updated: new Date(Date.now() - 86400000 * 14).toISOString(), status: 'generate' },
    ];
  }

  function normalizeProjectId(id) {
    return PROJECT_ID_ALIASES[id] || id;
  }

  function getProjects() {
    const defaults = defaultProjects();
    const stored = getJSON(STORAGE_KEYS.projects, null);
    if (!stored) {
      setJSON(STORAGE_KEYS.projects, defaults);
      return defaults;
    }
    const merged = defaults.map((def) => {
      const found = stored.find((p) => normalizeProjectId(p.id) === def.id);
      return found ? { ...def, ...found, id: def.id } : def;
    });
    const extra = stored.filter((p) => !defaults.some((d) => d.id === normalizeProjectId(p.id)));
    const list = [...merged, ...extra.map((p) => ({ ...p, id: normalizeProjectId(p.id) }))];
    setJSON(STORAGE_KEYS.projects, list);
    return list;
  }

  function addProject(project) {
    const list = getProjects();
    list.unshift(project);
    setJSON(STORAGE_KEYS.projects, list);
    return project;
  }

  function defaultChats() {
    return {
      'travel-japan': {
        id: 'travel-japan',
        title: 'Travel Website — Japan',
        model: 'nexus-pro',
        messages: [
          { role: 'user', content: 'Create a modern travel website for Japan with a clean and minimal design.' },
          { role: 'assistant', content: 'mock:travel-japan' },
        ],
      },
      'college-research': {
        id: 'college-research',
        title: 'College Research',
        model: 'nexus-research',
        messages: [
          { role: 'user', content: 'Help me research and compare top computer science programs with strong AI focus.' },
          { role: 'assistant', content: 'mock:college-research' },
        ],
      },
      'portfolio-design': {
        id: 'portfolio-design',
        title: 'Portfolio Design',
        model: 'nexus-pro',
        messages: [
          { role: 'user', content: 'Design a minimal portfolio homepage for a product designer.' },
          { role: 'assistant', content: 'mock:portfolio-design' },
        ],
      },
      'ai-study-plan': {
        id: 'ai-study-plan',
        title: 'AI Study Plan',
        model: 'nexus-pro',
        messages: [
          { role: 'user', content: 'Create a 6-week study plan for AI fundamentals.' },
          { role: 'assistant', content: 'mock:ai-study-plan' },
        ],
      },
      'marketing-strategy': {
        id: 'marketing-strategy',
        title: 'Marketing Strategy',
        model: 'nexus-pro',
        messages: [
          { role: 'user', content: 'Draft a go-to-market strategy for a B2B SaaS analytics tool.' },
          { role: 'assistant', content: 'mock:marketing-strategy' },
        ],
      },
      'python-examples': {
        id: 'python-examples',
        title: 'Python Code Examples',
        model: 'nexus-fast',
        messages: [
          { role: 'user', content: 'Show Python sorting examples with explanations for beginners.' },
          { role: 'assistant', content: 'mock:python-examples' },
        ],
      },
    };
  }

  function readChatStore() {
    let stored = getJSON(STORAGE_KEYS.chats, null);
    if (!stored) {
      const legacy = getJSON(LEGACY_CHAT_KEY, null);
      if (legacy) {
        stored = legacy;
        setJSON(STORAGE_KEYS.chats, legacy);
      }
    }
    return stored || {};
  }

  function getChats() {
    const defaults = defaultChats();
    const stored = readChatStore();
    const merged = { ...defaults };
    Object.keys(stored).forEach((key) => {
      const id = normalizeProjectId(key);
      merged[id] = { ...merged[id], ...stored[key], id };
    });
    return merged;
  }

  function saveChats(chats) {
    setJSON(STORAGE_KEYS.chats, chats);
  }

  function defaultLibrary() {
    return [
      { id: 'lib-japan-hero', title: 'Japan Travel Hero', type: 'images', saved: true, favorite: true, date: new Date().toISOString() },
      { id: 'lib-travel-mock', title: 'Travel Website Mockup', type: 'images', saved: true, favorite: false, date: new Date(Date.now() - 86400000).toISOString() },
      { id: 'lib-college-pdf', title: 'College Research PDF', type: 'documents', saved: true, favorite: true, date: new Date(Date.now() - 86400000 * 3).toISOString() },
      { id: 'lib-python-sort', title: 'Python Sorting Example', type: 'code', saved: true, favorite: false, date: new Date(Date.now() - 86400000 * 4).toISOString() },
      { id: 'lib-portfolio', title: 'Portfolio Homepage', type: 'images', saved: true, favorite: false, date: new Date(Date.now() - 86400000 * 6).toISOString() },
      { id: 'lib-study-notes', title: 'AI Study Notes', type: 'documents', saved: true, favorite: true, date: new Date(Date.now() - 86400000 * 8).toISOString() },
      { id: 'lib-marketing', title: 'Marketing Strategy', type: 'documents', saved: true, favorite: false, date: new Date(Date.now() - 86400000 * 9).toISOString() },
      { id: 'lib-presentation', title: 'Presentation Outline', type: 'saved', saved: true, favorite: false, date: new Date(Date.now() - 86400000 * 11).toISOString() },
    ];
  }

  function getLibrary() {
    const stored = getJSON(STORAGE_KEYS.library, null);
    if (!stored) {
      setJSON(STORAGE_KEYS.library, defaultLibrary());
      return defaultLibrary();
    }
    return stored;
  }

  function saveLibrary(items) {
    setJSON(STORAGE_KEYS.library, items);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initModals();
    initDropdowns();
  });

  window.NexusAI = {
    STORAGE_KEYS,
    getJSON,
    setJSON,
    getProfile,
    saveProfile,
    getSettings,
    saveSettings,
    applyTheme,
    toast,
    openModal,
    closeModal,
    renderAppShell,
    slugify,
    formatRelativeDate,
    getProjects,
    addProject,
    getChats,
    saveChats,
    getLibrary,
    saveLibrary,
    getActiveProjectId,
    setActiveProjectId,
    getPlanState,
    setPlanState,
    normalizeProjectId,
    escapeHtml,
    iconSvg,
    resolveActivePage,
  };
})();
