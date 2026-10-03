(function () {
  'use strict';

  if (!QuizAI.requireAuth()) return;

  const user = QuizAI.getUser();
  const panels = document.querySelectorAll('.settings-panel');
  const navBtns = document.querySelectorAll('[data-settings-tab]');
  const profileForm = document.getElementById('profile-form');

  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.settingsTab;
      navBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      panels.forEach((p) => p.classList.toggle('is-active', p.id === `panel-${tab}`));
    });
  });

  if (profileForm && user) {
    profileForm.querySelector('[name="name"]').value = user.name || '';
    profileForm.querySelector('[name="email"]').value = user.email || '';
    profileForm.querySelector('[name="bio"]').value = user.bio || '';

    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = profileForm.querySelector('[name="name"]').value.trim();
      const email = profileForm.querySelector('[name="email"]').value.trim();
      const nameGroup = profileForm.querySelector('[name="name"]').closest('.form-group');
      const emailGroup = profileForm.querySelector('[name="email"]').closest('.form-group');
      nameGroup?.classList.remove('is-invalid');
      emailGroup?.classList.remove('is-invalid');

      if (!name || name.length < 2) {
        nameGroup?.classList.add('is-invalid');
        QuizAI.showToast('Please enter your full name.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailGroup?.classList.add('is-invalid');
        QuizAI.showToast('Please enter a valid email.', 'error');
        return;
      }

      user.name = name;
      user.email = email;
      user.bio = profileForm.querySelector('[name="bio"]').value.trim();
      QuizAI.setUser(user);
      QuizAI.showToast('Changes saved.');
    });
  }

  const subPlan = document.getElementById('current-plan-name');
  if (subPlan) subPlan.textContent = user?.plan || 'Free';

  QuizAI.initTheme();
  document.querySelectorAll('[data-theme-option]').forEach((btn) => {
    btn.addEventListener('click', () => {
      QuizAI.setTheme(btn.dataset.themeOption);
      QuizAI.showToast(btn.dataset.themeOption === 'dark' ? 'Dark theme enabled.' : 'Light theme enabled.');
    });
  });

  document.getElementById('btn-save-notifications')?.addEventListener('click', () => {
    QuizAI.showToast('Notification preferences saved.');
  });
})();
