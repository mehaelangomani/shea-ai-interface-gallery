/**

 * OBJECT AI — Global app shell: theme, layout, navigation, profile.

 */



const STORAGE_KEYS = {

  theme: 'object-ai-theme',
  themeLegacy: 'objectai_theme',

  analyses: 'objectai_analyses',

  autoSave: 'objectai_auto_save',

  layout: 'objectai_layout',

};



const ObjectAI = {

  getTheme() {

    return (
      localStorage.getItem(STORAGE_KEYS.theme) ||
      localStorage.getItem(STORAGE_KEYS.themeLegacy) ||
      'light'
    );

  },



  setTheme(theme) {

    const next = theme === 'dark' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', next);

    localStorage.setItem(STORAGE_KEYS.theme, next);

    localStorage.setItem(STORAGE_KEYS.themeLegacy, next);

    ObjectAI.syncThemeUI();

    window.dispatchEvent(new CustomEvent('objectai:themechange', { detail: { theme: next } }));

    return next;

  },



  toggleTheme() {

    const current = ObjectAI.getTheme();

    return ObjectAI.setTheme(current === 'light' ? 'dark' : 'light');

  },



  syncThemeUI() {

    const theme = ObjectAI.getTheme();

    document.querySelectorAll('.theme-toggle').forEach((btn) => {

      const label = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';

      btn.setAttribute('aria-label', label);

      btn.title = 'Toggle theme';

    });

    document.querySelectorAll('[data-theme-choice]').forEach((btn) => {

      const choice = btn.getAttribute('data-theme-choice');

      const pressed = choice === theme;

      btn.setAttribute('aria-pressed', pressed ? 'true' : 'false');

    });

  },



  getLayout() {

    return localStorage.getItem(STORAGE_KEYS.layout) || 'comfortable';

  },



  setLayout(layout) {

    const next = layout === 'compact' ? 'compact' : 'comfortable';

    document.documentElement.setAttribute('data-layout', next);

    localStorage.setItem(STORAGE_KEYS.layout, next);

    document.querySelectorAll('[data-layout]').forEach((btn) => {

      if (btn.classList.contains('segmented-btn')) {

        const val = btn.getAttribute('data-layout');

        btn.setAttribute('aria-pressed', val === next ? 'true' : 'false');

      }

    });

    return next;

  },



  getAutoSave() {

    return localStorage.getItem(STORAGE_KEYS.autoSave) === 'true';

  },



  setAutoSave(enabled) {

    localStorage.setItem(STORAGE_KEYS.autoSave, enabled ? 'true' : 'false');

  },



  getAnalyses() {

    try {

      const raw = localStorage.getItem(STORAGE_KEYS.analyses);

      return raw ? JSON.parse(raw) : [];

    } catch {

      return [];

    }

  },



  saveAnalysis(record) {

    const list = ObjectAI.getAnalyses();

    const idx = list.findIndex((a) => a.id === record.id);

    if (idx >= 0) {

      list[idx] = record;

    } else {

      list.unshift(record);

    }

    localStorage.setItem(STORAGE_KEYS.analyses, JSON.stringify(list));

    return record;

  },



  getAnalysisById(id) {

    return ObjectAI.getAnalyses().find((a) => a.id === id) || null;

  },



  clearAnalyses() {

    localStorage.removeItem(STORAGE_KEYS.analyses);

  },



  formatFileSize(bytes) {

    if (bytes < 1024) return `${bytes} B`;

    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  },



  formatDate(iso) {

    const d = new Date(iso);

    return d.toLocaleDateString(undefined, {

      year: 'numeric',

      month: 'long',

      day: 'numeric',

    });

  },



  generateId() {

    return `oa-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  },

};



function initTheme() {

  const theme = ObjectAI.getTheme();

  document.documentElement.setAttribute('data-theme', theme);

  ObjectAI.syncThemeUI();

}



function initLayout() {

  ObjectAI.setLayout(ObjectAI.getLayout());

}



function initNav() {

  const toggle = document.querySelector('.nav-toggle');

  const nav = document.querySelector('.site-nav');



  toggle?.addEventListener('click', () => {

    const open = nav.classList.toggle('is-open');

    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');

    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');

  });



  document.addEventListener('click', (e) => {

    if (!nav?.classList.contains('is-open')) return;

    if (nav.contains(e.target) || toggle?.contains(e.target)) return;

    nav.classList.remove('is-open');

    toggle?.setAttribute('aria-expanded', 'false');

  });



  document.querySelectorAll('.theme-toggle').forEach((btn) => {

    btn.addEventListener('click', () => ObjectAI.toggleTheme());

  });

}



function initProfile() {

  const trigger = document.querySelector('.profile-trigger');

  const menu = document.getElementById('profile-menu');

  if (!trigger || !menu) return;



  const close = () => {

    menu.classList.remove('is-open');

    menu.hidden = true;

    trigger.setAttribute('aria-expanded', 'false');

  };



  trigger.addEventListener('click', (e) => {

    e.stopPropagation();

    const open = menu.hidden;

    if (open) {

      menu.hidden = false;

      requestAnimationFrame(() => menu.classList.add('is-open'));

    } else {

      menu.classList.remove('is-open');

      menu.hidden = true;

    }

    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');

  });



  document.addEventListener('click', (e) => {

    if (!menu.contains(e.target) && !trigger.contains(e.target)) close();

  });



  document.addEventListener('keydown', (e) => {

    if (e.key === 'Escape') close();

  });



  syncProfileUI();

}



function syncProfileUI() {

  const user = window.ObjectAIAuth?.getCurrentUser();

  const navSignIn = document.getElementById('nav-signin-link');

  const loggedOutMenu = document.querySelector('.profile-menu-logged-out');

  const loggedInMenu = document.querySelector('.profile-menu-logged-in');

  const iconWrap = document.querySelector('.profile-trigger .profile-icon-wrap');

  const avatarInitial = document.querySelector('.profile-trigger .avatar-initial');

  const dropdownInitial = document.querySelector('[data-dropdown-initial]');

  const nameEl = document.querySelector('.profile-menu-logged-in .profile-name');

  const emailEl = document.querySelector('.profile-menu-logged-in .profile-email');

  const settingsName = document.getElementById('settings-account-name');

  const settingsEmail = document.getElementById('settings-account-email');

  const settingsAccount = document.getElementById('settings-account-section');

  const settingsSignOut = document.getElementById('settings-signout-btn');

  const settingsPlan = document.getElementById('settings-account-plan');

  const planLabel = formatAccountPlan(window.ObjectAIAuth?.getActivePlan());



  if (user) {

    document.body.classList.add('is-logged-in');

    document.body.classList.remove('is-logged-out');

    if (navSignIn) navSignIn.hidden = true;

    if (loggedOutMenu) loggedOutMenu.hidden = true;

    if (loggedInMenu) loggedInMenu.hidden = false;

    if (iconWrap) iconWrap.hidden = true;

    if (avatarInitial) {

      avatarInitial.hidden = false;

      avatarInitial.textContent = ObjectAIAuth.getInitial(user.name);

    }

    if (dropdownInitial) dropdownInitial.textContent = ObjectAIAuth.getInitial(user.name);

    if (nameEl) nameEl.textContent = user.name;

    if (emailEl) emailEl.textContent = user.email;

    if (settingsName) settingsName.textContent = user.name;

    if (settingsEmail) settingsEmail.textContent = user.email;

    if (settingsPlan) settingsPlan.textContent = planLabel;

    if (settingsAccount) settingsAccount.hidden = false;

  } else {

    document.body.classList.add('is-logged-out');

    document.body.classList.remove('is-logged-in');

    if (navSignIn) navSignIn.hidden = false;

    if (loggedOutMenu) loggedOutMenu.hidden = false;

    if (loggedInMenu) loggedInMenu.hidden = true;

    if (iconWrap) iconWrap.hidden = false;

    if (avatarInitial) avatarInitial.hidden = true;

    if (settingsAccount) settingsAccount.hidden = true;

  }

}



function handleSignOut() {

  if (!window.ObjectAIAuth?.getCurrentUser()) return;

  ObjectAIAuth.logout();

  syncProfileUI();

  window.location.href = 'index.html';

}



function formatAccountPlan(plan) {
  const key = (plan || 'free').toLowerCase();
  if (key === 'pro') return 'Pro';
  if (key === 'team') return 'Team';
  return 'Free';
}

window.syncProfileUI = syncProfileUI;

window.handleSignOut = handleSignOut;



function applyEarlyTheme() {

  try {

    const theme =
      localStorage.getItem(STORAGE_KEYS.theme) ||
      localStorage.getItem(STORAGE_KEYS.themeLegacy) ||
      'light';

    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');

    const layout = localStorage.getItem(STORAGE_KEYS.layout) || 'comfortable';

    document.documentElement.setAttribute('data-layout', layout);

  } catch {

    /* ignore */

  }

}



applyEarlyTheme();



document.addEventListener('DOMContentLoaded', () => {

  initTheme();

  initLayout();

  initNav();

  initProfile();

  syncProfileUI();



  document.getElementById('settings-signout-btn')?.addEventListener('click', handleSignOut);

});



window.ObjectAI = ObjectAI;

window.STORAGE_KEYS = STORAGE_KEYS;


