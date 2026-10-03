/**
 * QuizAI — single source of truth for pricing / plans
 */
(function () {
  'use strict';

  const PLAN_META = {
    free: {
      name: 'Free',
      features: ['5 quizzes per month', 'Basic topics', 'MCQ questions', 'Standard support'],
    },
    pro: {
      name: 'Pro',
      features: [
        'Unlimited quizzes',
        'All topics',
        'MCQ, True/False, Mixed',
        'Detailed explanations',
        'Quiz history',
        'Priority support',
      ],
    },
    premium: {
      name: 'Premium',
      features: [
        'Everything in Pro',
        'Advanced AI quiz modes',
        'Custom question sets',
        'Export quizzes',
        'Early access to new features',
        'Dedicated support',
      ],
    },
  };

  const PRICES = {
    monthly: { free: 0, pro: 9, premium: 19 },
    yearly: { free: 0, pro: 7, premium: 15 },
  };

  function normalizePlan(key) {
    const k = (key || 'pro').toLowerCase();
    return PLAN_META[k] ? k : 'pro';
  }

  window.QuizAI = window.QuizAI || {};

  QuizAI.plans = {
    PRICES,
    PLAN_META,

    getBilling() {
      return localStorage.getItem('quizAIBilling') || 'monthly';
    },

    setBilling(billing) {
      localStorage.setItem('quizAIBilling', billing === 'yearly' ? 'yearly' : 'monthly');
    },

    getSelectedPlanKey() {
      return normalizePlan(localStorage.getItem(QuizAI.keys?.plan || 'selectedPlan'));
    },

    setSelectedPlan(key) {
      localStorage.setItem(QuizAI.keys?.plan || 'selectedPlan', normalizePlan(key));
    },

    getPrice(planKey, billing) {
      const plan = normalizePlan(planKey);
      const cycle = billing === 'yearly' ? 'yearly' : 'monthly';
      return PRICES[cycle][plan] ?? 0;
    },

    getPlanName(planKey) {
      return PLAN_META[normalizePlan(planKey)]?.name || 'Pro';
    },

    getFeatures(planKey) {
      return PLAN_META[normalizePlan(planKey)]?.features || PLAN_META.pro.features;
    },

    getCheckoutSummary() {
      const planKey = this.getSelectedPlanKey();
      const billing = this.getBilling();
      const price = this.getPrice(planKey, billing);
      return {
        planKey,
        planName: this.getPlanName(planKey),
        billing,
        price,
        features: this.getFeatures(planKey),
        periodLabel: billing === 'yearly' ? '/ month (billed yearly)' : '/ month',
      };
    },
  };
})();
