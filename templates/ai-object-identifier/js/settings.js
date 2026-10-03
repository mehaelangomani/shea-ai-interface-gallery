/**
 * OBJECT AI — Settings page (synced with global theme state).
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('.page-settings')) return;

  const autoSaveToggle = document.getElementById('auto-save-toggle');
  if (autoSaveToggle) {
    autoSaveToggle.checked = ObjectAI.getAutoSave();
    autoSaveToggle.addEventListener('change', () => {
      ObjectAI.setAutoSave(autoSaveToggle.checked);
    });
  }

  document.querySelectorAll('[data-theme-choice]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme-choice');
      ObjectAI.setTheme(theme);
    });
  });

  document.querySelectorAll('[data-layout].segmented-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      ObjectAI.setLayout(btn.getAttribute('data-layout'));
    });
  });

  ObjectAI.syncThemeUI();
  ObjectAI.setLayout(ObjectAI.getLayout());

  window.addEventListener('objectai:themechange', () => {
    ObjectAI.syncThemeUI();
  });

  if (typeof syncProfileUI === 'function') syncProfileUI();
});
