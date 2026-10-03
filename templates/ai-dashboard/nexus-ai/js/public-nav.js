/**
 * Consistent public header navigation (landing, pricing, auth).
 * Set document.body.dataset.publicPage to: landing | pricing | login | signup
 */
(function () {
  'use strict';

  const LINKS = [
    { id: 'features', label: 'Features', href: 'index.html#features' },
    { id: 'how', label: 'How it works', href: 'index.html#how-it-works' },
    { id: 'pricing', label: 'Pricing', href: 'pricing.html' },
    { id: 'about', label: 'About', href: 'index.html#about' },
  ];

  function isActive(linkId, page) {
    if (linkId === 'pricing' && page === 'pricing') return true;
    if (page === 'landing' && linkId === 'features') return false;
    return false;
  }

  function markActiveNav(page) {
    document.querySelectorAll('.landing-nav a[data-nav-id]').forEach((a) => {
      const id = a.getAttribute('data-nav-id');
      let active = false;
      if (page === 'pricing' && id === 'pricing') active = true;
      if (page === 'landing') {
        const hash = window.location.hash;
        if (id === 'features' && (hash === '#features' || hash === '')) active = true;
        if (id === 'how' && hash === '#how-it-works') active = true;
        if (id === 'about' && hash === '#about') active = true;
      }
      a.classList.toggle('is-active', active);
    });
  }

  function initPublicNav() {
    const page = document.body.dataset.publicPage || 'landing';
    markActiveNav(page);
    window.addEventListener('hashchange', () => {
      if (page === 'landing') markActiveNav('landing');
    });
  }

  document.addEventListener('DOMContentLoaded', initPublicNav);
})();
