(function () {
  'use strict';

  if (!window.QuizAI?.plans) return;

  let billing = QuizAI.plans.getBilling();
  const toggleBtns = document.querySelectorAll('[data-billing]');
  const priceEls = document.querySelectorAll('[data-price-plan]');

  function updatePrices() {
    priceEls.forEach((el) => {
      const plan = el.dataset.pricePlan;
      const val = QuizAI.plans.getPrice(plan, billing);
      el.textContent = `$${val}`;
    });
    document.querySelectorAll('[data-period]').forEach((el) => {
      el.textContent = billing === 'yearly' ? '/ month (billed yearly)' : '/ month';
    });
  }

  toggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      billing = btn.dataset.billing;
      QuizAI.plans.setBilling(billing);
      toggleBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      updatePrices();
    });
  });

  if (toggleBtns.length) {
    toggleBtns.forEach((b) => b.classList.toggle('is-active', b.dataset.billing === billing));
  }
  updatePrices();

  document.querySelectorAll('[data-select-plan]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const plan = btn.dataset.selectPlan;
      QuizAI.plans.setSelectedPlan(plan);
      QuizAI.plans.setBilling(billing);

      if (plan === 'free') {
        const user = QuizAI.getUser();
        if (user) {
          user.plan = 'Free';
          QuizAI.setUser(user);
        }
        QuizAI.showToast('Free plan selected.');
        window.location.href = QuizAI.isLoggedIn() ? 'dashboard.html' : 'signup.html';
        return;
      }

      QuizAI.showToast(`${QuizAI.plans.getPlanName(plan)} plan selected.`);
      window.location.href = 'checkout.html';
    });
  });
})();
