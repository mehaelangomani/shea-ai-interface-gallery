(function () {
  'use strict';

  function showPanel(id) {
    document.querySelectorAll('.settings-panel').forEach((p) => {
      p.classList.toggle('active', p.id === `panel-${id}`);
    });
    document.querySelectorAll('.settings-nav button').forEach((b) => {
      b.classList.toggle('active', b.dataset.panel === id);
    });
  }

  function bindToggles() {
    const settings = NexusAI.getSettings();
    const map = {
      'toggle-email': 'emailNotifications',
      'toggle-updates': 'productUpdates',
      'toggle-usage': 'usageAlerts',
      'toggle-history': 'chatHistory',
      'toggle-sharing': 'dataSharing',
      'toggle-autosave': 'autoSaveChats',
    };
    Object.entries(map).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.checked = settings[key];
      el.addEventListener('change', () => {
        NexusAI.saveSettings({ [key]: el.checked });
        NexusAI.toast('Settings saved');
      });
    });
  }

  function bindTheme() {
    const settings = NexusAI.getSettings();
    const theme = localStorage.getItem(NexusAI.STORAGE_KEYS.theme) || settings.theme || 'light';
    document.querySelectorAll('.theme-option').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
      btn.addEventListener('click', () => {
        document.querySelectorAll('.theme-option').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        NexusAI.saveSettings({ theme: btn.dataset.theme });
        NexusAI.applyTheme(btn.dataset.theme);
        NexusAI.toast('Theme updated');
      });
    });
  }

  function loadGeneral() {
    const profile = NexusAI.getProfile();
    const name = document.getElementById('settings-name');
    const email = document.getElementById('settings-email');
    const avatar = document.getElementById('settings-avatar');
    if (name) name.value = profile.name;
    if (email) email.value = profile.email;
    if (avatar) avatar.textContent = (profile.name || 'M').charAt(0).toUpperCase();
    const planLabel = document.getElementById('settings-plan-label');
    if (planLabel) planLabel.textContent = NexusAI.getPlanState().label.replace(' Plan', '');
    document.getElementById('save-general')?.addEventListener('click', () => {
      NexusAI.saveProfile({ name: name.value, email: email.value });
      if (avatar) avatar.textContent = (name.value || 'M').charAt(0).toUpperCase();
      NexusAI.toast('Profile updated');
    });
  }

  function loadAiPrefs() {
    const s = NexusAI.getSettings();
    const model = document.getElementById('default-model');
    const style = document.getElementById('response-style');
    const lang = document.getElementById('language-select');
    if (model) model.value = s.defaultModel;
    if (style) style.value = s.responseStyle;
    if (lang) lang.value = s.language;
    model?.addEventListener('change', () => NexusAI.saveSettings({ defaultModel: model.value }));
    style?.addEventListener('change', () => NexusAI.saveSettings({ responseStyle: style.value }));
    lang?.addEventListener('change', () => {
      NexusAI.saveSettings({ language: lang.value });
      NexusAI.toast('Language preference saved');
    });
  }

  function loadConnectedApps() {
    const githubStatus = document.getElementById('github-status');
    const githubBtn = document.getElementById('github-toggle');
    const driveStatus = document.getElementById('drive-status');
    const driveBtn = document.getElementById('connect-drive');

    function renderGithub() {
      const connected = NexusAI.getSettings().githubConnected;
      if (githubStatus) {
        githubStatus.textContent = connected ? 'Connected as @meha' : 'Not connected';
      }
      if (githubBtn) {
        githubBtn.textContent = connected ? 'Disconnect' : 'Connect';
      }
    }

    renderGithub();

    githubBtn?.addEventListener('click', () => {
      const connected = NexusAI.getSettings().githubConnected;
      if (connected) {
        NexusAI.saveSettings({ githubConnected: false });
        NexusAI.toast('GitHub disconnected');
      } else {
        NexusAI.saveSettings({ githubConnected: true });
        NexusAI.toast('GitHub connected');
      }
      renderGithub();
    });

    driveBtn?.addEventListener('click', () => {
      const isConnect = driveBtn.textContent === 'Connect';
      if (isConnect) {
        if (driveStatus) driveStatus.textContent = 'Connected';
        driveBtn.textContent = 'Disconnect';
        NexusAI.toast('Google Drive connected');
      } else {
        if (driveStatus) driveStatus.textContent = 'Not connected';
        driveBtn.textContent = 'Connect';
        NexusAI.toast('Google Drive disconnected');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    NexusAI.renderAppShell('settings');
    document.querySelectorAll('.settings-nav button').forEach((btn) => {
      btn.addEventListener('click', () => showPanel(btn.dataset.panel));
    });
    showPanel('general');
    bindToggles();
    bindTheme();
    loadGeneral();
    loadAiPrefs();
    loadConnectedApps();
  });
})();
