(function () {
  'use strict';

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setInvalid(group, message) {
    group.classList.add('is-invalid');
    const err = group.querySelector('.form-error');
    if (err) err.textContent = message;
  }

  function clearInvalid(group) {
    group.classList.remove('is-invalid');
  }

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const emailGroup = loginForm.querySelector('[data-field="email"]')?.closest('.form-group');
      const passGroup = loginForm.querySelector('[data-field="password"]')?.closest('.form-group');
      const email = loginForm.querySelector('[name="email"]')?.value.trim();
      const password = loginForm.querySelector('[name="password"]')?.value;

      clearInvalid(emailGroup);
      clearInvalid(passGroup);

      if (!email || !validateEmail(email)) {
        setInvalid(emailGroup, 'Please enter a valid email address.');
        valid = false;
      }
      if (!password || password.length < 6) {
        setInvalid(passGroup, 'Password must be at least 6 characters.');
        valid = false;
      }
      if (!valid) return;

      const existing = QuizAI.getUser();
      QuizAI.setUser({
        name: existing?.name || 'Meha',
        email,
        plan: existing?.plan || QuizAI.getPlan(),
        bio: existing?.bio || '',
      });
      QuizAI.showToast('Welcome back!');
      window.location.href = 'dashboard.html';
    });

    document.querySelectorAll('.auth-social .btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        QuizAI.setUser({ name: 'Meha', email: 'demo@quizai.app', plan: QuizAI.getPlan() });
        QuizAI.showToast('Signed in with demo account');
        window.location.href = 'dashboard.html';
      });
    });
  }

  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const fields = {
        name: signupForm.querySelector('[name="name"]'),
        email: signupForm.querySelector('[name="email"]'),
        password: signupForm.querySelector('[name="password"]'),
        confirm: signupForm.querySelector('[name="confirm"]'),
      };

      Object.values(fields).forEach((input) => clearInvalid(input.closest('.form-group')));

      if (!fields.name.value.trim() || fields.name.value.trim().length < 2) {
        setInvalid(fields.name.closest('.form-group'), 'Please enter your full name.');
        valid = false;
      }
      if (!validateEmail(fields.email.value.trim())) {
        setInvalid(fields.email.closest('.form-group'), 'Please enter a valid email.');
        valid = false;
      }
      if (fields.password.value.length < 8) {
        setInvalid(fields.password.closest('.form-group'), 'Password must be at least 8 characters.');
        valid = false;
      }
      if (fields.password.value !== fields.confirm.value) {
        setInvalid(fields.confirm.closest('.form-group'), 'Passwords do not match.');
        valid = false;
      }
      if (!valid) return;

      QuizAI.setUser({
        name: fields.name.value.trim(),
        email: fields.email.value.trim(),
        plan: 'Free',
        bio: '',
      });
      QuizAI.showToast('Account created successfully!');
      window.location.href = 'dashboard.html';
    });

    document.querySelectorAll('.auth-social .btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        QuizAI.setUser({ name: 'Meha', email: 'demo@quizai.app', plan: 'Free' });
        window.location.href = 'dashboard.html';
      });
    });
  }
})();
