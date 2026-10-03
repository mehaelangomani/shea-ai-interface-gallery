(function () {
  'use strict';

  if (!window.QuizAI?.plans) return;

  const summary = QuizAI.plans.getCheckoutSummary();
  const summaryPlan = document.getElementById('summary-plan');
  const summaryPrice = document.getElementById('summary-price');
  const summaryTotal = document.getElementById('summary-total');
  const summaryFeatures = document.getElementById('summary-features');
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutMain = document.getElementById('checkout-main');
  const checkoutSuccess = document.getElementById('checkout-success');

  if (summary.planKey === 'free') {
    window.location.href = 'pricing.html';
    return;
  }

  if (summaryPlan) summaryPlan.textContent = `${summary.planName} Plan`;
  if (summaryPrice) summaryPrice.textContent = `$${summary.price} ${summary.periodLabel}`;
  if (summaryTotal) summaryTotal.textContent = `$${summary.price.toFixed(2)}`;

  if (summaryFeatures) {
    summaryFeatures.innerHTML = summary.features.map((f) => `<li>${f}</li>`).join('');
  }

  const user = QuizAI.getUser();
  if (user && checkoutForm) {
    const nameInput = checkoutForm.querySelector('[name="fullName"]');
    const emailInput = checkoutForm.querySelector('[name="email"]');
    if (nameInput && !nameInput.value) nameInput.value = user.name || '';
    if (emailInput && !emailInput.value) emailInput.value = user.email || '';
  }

  function luhnCheck(num) {
    const digits = num.replace(/\D/g, '');
    if (digits.length < 13) return false;
    let sum = 0;
    let alt = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let n = parseInt(digits[i], 10);
      if (alt) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      alt = !alt;
    }
    return sum % 10 === 0;
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      checkoutForm.querySelectorAll('.form-group').forEach((g) => g.classList.remove('is-invalid'));

      const fullName = checkoutForm.querySelector('[name="fullName"]').value.trim();
      const email = checkoutForm.querySelector('[name="email"]').value.trim();
      const country = checkoutForm.querySelector('[name="country"]').value.trim();
      const card = checkoutForm.querySelector('[name="card"]').value.trim();
      const expiry = checkoutForm.querySelector('[name="expiry"]').value.trim();
      const cvv = checkoutForm.querySelector('[name="cvv"]').value.trim();

      if (!fullName) {
        checkoutForm.querySelector('[name="fullName"]').closest('.form-group').classList.add('is-invalid');
        valid = false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        checkoutForm.querySelector('[name="email"]').closest('.form-group').classList.add('is-invalid');
        valid = false;
      }
      if (!country) {
        checkoutForm.querySelector('[name="country"]').closest('.form-group').classList.add('is-invalid');
        valid = false;
      }
      if (!luhnCheck(card)) {
        checkoutForm.querySelector('[name="card"]').closest('.form-group').classList.add('is-invalid');
        valid = false;
      }
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        checkoutForm.querySelector('[name="expiry"]').closest('.form-group').classList.add('is-invalid');
        valid = false;
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        checkoutForm.querySelector('[name="cvv"]').closest('.form-group').classList.add('is-invalid');
        valid = false;
      }

      if (!valid) {
        QuizAI.showToast('Please check your payment details.', 'error');
        return;
      }

      const u = QuizAI.getUser() || { name: fullName, email };
      u.plan = summary.planName;
      QuizAI.setUser(u);

      document.querySelectorAll('.checkout-step').forEach((s, i) => {
        s.classList.remove('is-active');
        s.classList.toggle('is-done', i < 2);
        if (i === 2) s.classList.add('is-active');
      });

      checkoutMain?.setAttribute('hidden', '');
      checkoutSuccess?.removeAttribute('hidden');
      const successText = document.getElementById('checkout-success-plan');
      if (successText) successText.textContent = `Your ${summary.planName} plan is now active.`;
      QuizAI.showToast('Payment successful!');
    });
  }
})();
