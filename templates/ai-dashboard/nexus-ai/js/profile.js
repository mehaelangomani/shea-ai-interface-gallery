(function () {
  'use strict';

  function showTab(id) {
    document.querySelectorAll('.profile-tab').forEach((t) => {
      t.classList.toggle('active', t.dataset.tab === id);
    });
    document.querySelectorAll('.tab-panel').forEach((p) => {
      p.classList.toggle('active', p.id === `tab-${id}`);
    });
  }

  function loadPlanUI() {
    const plan = NexusAI.getPlanState();
    const badge = document.getElementById('plan-badge');
    const price = document.getElementById('plan-price');
    const overview = document.getElementById('plan-overview-text');
    const billingPlan = document.getElementById('billing-plan-name');
    const invoiceAmount = document.getElementById('invoice-amount');

    if (badge) badge.textContent = plan.label;
    if (price) price.textContent = plan.priceText;
    if (overview) {
      overview.textContent =
        plan.plan === 'free'
          ? "You're on the Free plan. Upgrade for unlimited conversations and advanced models."
          : `You're on the ${plan.label.replace(' Plan', '')} plan with full access to projects, advanced models, and deep research.`;
    }
    if (billingPlan) billingPlan.textContent = plan.label.replace(' Plan', '');
    const amt = plan.plan === 'pro' ? (plan.billing === 'yearly' ? '₹7,670' : '₹799') : plan.plan === 'team' ? (plan.billing === 'yearly' ? '₹14,390' : '₹1,499') : '₹0';
    if (invoiceAmount) invoiceAmount.textContent = amt;
  }

  function loadProfile() {
    const profile = NexusAI.getProfile();
    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('profile-email').textContent = profile.email;
    document.getElementById('profile-avatar').textContent = (profile.name || 'M').charAt(0).toUpperCase();
    document.getElementById('edit-name').value = profile.name;
    document.getElementById('edit-email').value = profile.email;
    loadPlanUI();
  }

  document.addEventListener('DOMContentLoaded', () => {
    NexusAI.renderAppShell('profile');
    loadProfile();
    document.querySelectorAll('.profile-tab').forEach((tab) => {
      tab.addEventListener('click', () => showTab(tab.dataset.tab));
    });
    document.getElementById('edit-profile-btn')?.addEventListener('click', () => {
      NexusAI.openModal('edit-profile-modal');
    });
    document.getElementById('save-profile-modal')?.addEventListener('click', () => {
      const name = document.getElementById('edit-name').value;
      const email = document.getElementById('edit-email').value;
      NexusAI.saveProfile({ name, email });
      loadProfile();
      NexusAI.closeModal('edit-profile-modal');
      NexusAI.toast('Profile updated');
    });
    document.getElementById('manage-plan')?.addEventListener('click', () => {
      window.location.href = 'pricing.html';
    });
  });
})();
