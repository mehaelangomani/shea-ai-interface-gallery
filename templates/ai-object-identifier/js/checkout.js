/**
 * OBJECT AI — Checkout (simulated).
 */

const PLANS = {
  pro: {
    id: 'pro',
    name: 'PRO',
    price: 499,
    cycle: 'month',
  },
  team: {
    id: 'team',
    name: 'TEAM',
    price: 1499,
    cycle: 'month',
  },
};

document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('.page-checkout')) return;

  const params = new URLSearchParams(window.location.search);
  const planId = params.get('plan') || 'pro';
  const plan = PLANS[planId];

  const formWrap = document.getElementById('checkout-form-wrap');
  const success = document.getElementById('checkout-success');

  if (!plan) {
    window.location.replace('pricing.html');
    return;
  }

  document.getElementById('checkout-plan-name').textContent = `${plan.name} PLAN`;
  document.getElementById('checkout-plan-label').textContent = plan.name;
  document.getElementById('checkout-plan-price').textContent = `₹${plan.price}`;
  document.getElementById('checkout-summary-price').textContent = `₹${plan.price} / ${plan.cycle}`;
  document.getElementById('checkout-total').textContent = `₹${plan.price}`;

  document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    ObjectAIAuth.setActivePlan(plan.id);
    if (typeof syncProfileUI === 'function') syncProfileUI();
    formWrap.hidden = true;
    success.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
