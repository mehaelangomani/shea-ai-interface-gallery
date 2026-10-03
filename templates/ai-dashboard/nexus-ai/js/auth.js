(function () {
  'use strict';

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setFieldError(input, message) {
    const field = input.closest('.field');
    let err = field?.querySelector('.field-error');
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      if (!err && field) {
        err = document.createElement('p');
        err.className = 'field-error';
        field.appendChild(err);
      }
      if (err) err.textContent = message;
    } else {
      input.removeAttribute('aria-invalid');
      if (err) err.remove();
    }
  }

  function initPasswordToggle() {
    document.querySelectorAll('[data-toggle-password]').forEach((btn) => {
      const id = btn.getAttribute('data-toggle-password');
      const input = document.getElementById(id);
      if (!input) return;
      btn.addEventListener('click', () => {
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.textContent = show ? 'Hide' : 'Show';
      });
    });
  }

  function passwordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }

  function updateStrengthUI(password) {
    const fill = document.getElementById('strength-fill');
    const label = document.getElementById('strength-label');
    if (!fill) return;
    const score = passwordStrength(password);
    const widths = ['0%', '25%', '50%', '75%', '100%'];
    const colors = ['var(--border)', 'var(--danger)', '#E8A317', 'var(--blue)', 'var(--success)'];
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    fill.style.width = widths[score];
    fill.style.background = colors[score];
    if (label) label.textContent = labels[score] || '';
  }

  function initLogin() {
    const form = document.getElementById('login-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('#email');
      const password = form.querySelector('#password');
      let valid = true;
      if (!validateEmail(email.value.trim())) {
        setFieldError(email, 'Enter a valid email address.');
        valid = false;
      } else setFieldError(email, '');
      if (password.value.length < 6) {
        setFieldError(password, 'Password must be at least 6 characters.');
        valid = false;
      } else setFieldError(password, '');
      if (valid) {
        NexusAI.toast('Welcome back!');
        window.location.href = 'workspace.html';
      }
    });
    document.querySelectorAll('.auth-social button').forEach((btn) => {
      btn.addEventListener('click', () => {
        NexusAI.toast('Signing in with Google…');
        setTimeout(() => { window.location.href = 'workspace.html'; }, 800);
      });
    });
  }

  function initSignup() {
    const form = document.getElementById('signup-form');
    const pw = document.getElementById('password');
    pw?.addEventListener('input', () => updateStrengthUI(pw.value));

    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const password = form.querySelector('#password');
      const confirm = form.querySelector('#confirm');
      let valid = true;
      if (!name.value.trim()) {
        setFieldError(name, 'Name is required.');
        valid = false;
      } else setFieldError(name, '');
      if (!validateEmail(email.value.trim())) {
        setFieldError(email, 'Enter a valid email address.');
        valid = false;
      } else setFieldError(email, '');
      if (password.value.length < 8) {
        setFieldError(password, 'Use at least 8 characters.');
        valid = false;
      } else setFieldError(password, '');
      if (confirm.value !== password.value) {
        setFieldError(confirm, 'Passwords do not match.');
        valid = false;
      } else setFieldError(confirm, '');
      if (valid) {
        NexusAI.saveProfile({ name: name.value.trim(), email: email.value.trim() });
        NexusAI.toast('Account created successfully!');
        window.location.href = 'workspace.html';
      }
    });
    document.querySelectorAll('.auth-social button').forEach((btn) => {
      btn.addEventListener('click', () => {
        NexusAI.toast('Creating account with Google…');
        setTimeout(() => { window.location.href = 'workspace.html'; }, 800);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initPasswordToggle();
    initLogin();
    initSignup();
  });
})();
