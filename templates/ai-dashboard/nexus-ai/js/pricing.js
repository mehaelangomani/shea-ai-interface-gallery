(function () {

  'use strict';



  const MONTHLY = { free: 0, pro: 799, team: 1499 };

  const YEARLY = { free: 0, pro: 7670, team: 14390 };



  let billing = 'monthly';



  function formatInr(n) {

    return `₹${n.toLocaleString('en-IN')}`;

  }



  function updatePrices() {

    const yearly = billing === 'yearly';

    const p = yearly ? YEARLY : MONTHLY;

    const suffix = yearly ? '/ year' : '/ month';

    const teamSuffix = yearly ? '/ user / year' : '/ user / month';



    document.querySelectorAll('[data-price="pro"]').forEach((el) => {

      el.textContent = formatInr(p.pro);

    });

    document.querySelectorAll('[data-price="team"]').forEach((el) => {

      el.textContent = formatInr(p.team);

    });

    document.querySelectorAll('[data-price="free"]').forEach((el) => {

      el.textContent = formatInr(p.free);

    });

    document.querySelectorAll('[data-price-suffix]').forEach((el) => {

      const plan = el.dataset.priceSuffix;

      el.textContent = plan === 'team' ? teamSuffix : suffix;

    });



    const saveLabel = document.getElementById('yearly-save-label');

    if (saveLabel) saveLabel.hidden = !yearly;

  }



  function initBillingToggle() {

    document.querySelectorAll('[data-billing]').forEach((btn) => {

      btn.classList.toggle('active', btn.dataset.billing === billing);

      btn.addEventListener('click', () => {

        billing = btn.dataset.billing;

        localStorage.setItem(NexusAI.STORAGE_KEYS.planBilling, billing);

        document.querySelectorAll('[data-billing]').forEach((b) => {

          b.classList.toggle('active', b.dataset.billing === billing);

        });

        updatePrices();

      });

    });

  }



  function initUpgrade() {

    document.querySelectorAll('[data-upgrade]').forEach((btn) => {

      btn.addEventListener('click', () => {

        NexusAI.openModal('upgrade-modal');

      });

    });



    document.getElementById('confirm-upgrade')?.addEventListener('click', () => {

      NexusAI.setPlanState('pro', billing);

      NexusAI.closeModal('upgrade-modal');

      NexusAI.toast('Pro plan activated.');

    });



    document.querySelectorAll('.payment-option').forEach((opt) => {

      opt.addEventListener('click', () => {

        document.querySelectorAll('.payment-option').forEach((o) => o.classList.remove('selected'));

        opt.classList.add('selected');

        const radio = opt.querySelector('input');

        if (radio) radio.checked = true;

      });

    });

  }



  document.addEventListener('DOMContentLoaded', () => {
    billing = localStorage.getItem(NexusAI.STORAGE_KEYS.planBilling) || 'monthly';
    initBillingToggle();
    initUpgrade();
    updatePrices();
  });

})();


