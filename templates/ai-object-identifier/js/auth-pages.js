/**
 * OBJECT AI — Sign in / Sign up forms.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSignIn();
  initSignUp();
});

function initSignIn() {
  const form = document.getElementById('signin-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value;
    const error = document.getElementById('signin-error');
    const result = ObjectAIAuth.login({ email, password });
    if (!result.ok) {
      error.hidden = false;
      error.textContent = result.error;
      return;
    }
    error.hidden = true;
    window.location.href = 'index.html';
  });
}

function initSignUp() {
  const form = document.getElementById('signup-form');
  if (!form) return;

  const password = form.password;
  const strengthBar = document.getElementById('password-strength-bar');
  const strengthLabel = document.getElementById('password-strength-label');

  password?.addEventListener('input', () => {
    const score = scorePassword(password.value);
    if (strengthBar) strengthBar.style.width = `${score.percent}%`;
    if (strengthLabel) strengthLabel.textContent = score.label;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const error = document.getElementById('signup-error');
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const pass = form.password.value;
    const confirm = form.confirm.value;

    if (pass.length < 8) {
      error.hidden = false;
      error.textContent = 'Password must be at least 8 characters.';
      return;
    }
    if (pass !== confirm) {
      error.hidden = false;
      error.textContent = 'Passwords do not match.';
      return;
    }

    const result = ObjectAIAuth.register({ name, email, password: pass });
    if (!result.ok) {
      error.hidden = false;
      error.textContent = result.error;
      return;
    }
    error.hidden = true;
    window.location.href = 'index.html';
  });
}

function scorePassword(value) {
  if (!value) return { percent: 0, label: 'Enter a password' };
  let score = 0;
  if (value.length >= 8) score += 25;
  if (value.length >= 12) score += 15;
  if (/[A-Z]/.test(value)) score += 20;
  if (/[0-9]/.test(value)) score += 20;
  if (/[^A-Za-z0-9]/.test(value)) score += 20;
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const idx = Math.min(3, Math.floor(score / 25));
  return { percent: Math.min(100, score), label: labels[idx] };
}
