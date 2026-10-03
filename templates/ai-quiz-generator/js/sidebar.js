/**
 * Shared app sidebar markup — keep in sync across app pages.
 * Rendered once per page in HTML; active state set via main.js setActiveSidebarItem().
 */
(function () {
  'use strict';
  window.QuizAISidebar = {
    navItems: [
      { href: 'dashboard.html', nav: 'dashboard', label: 'Dashboard', icon: 'grid' },
      { href: 'generator.html', nav: 'generator', label: 'Generate Quiz', icon: 'spark' },
      { href: 'my-quizzes.html', nav: 'my-quizzes', label: 'My Quizzes', icon: 'book' },
      { href: 'history.html', nav: 'history', label: 'History', icon: 'clock' },
      { href: 'settings.html', nav: 'settings', label: 'Settings', icon: 'settings' },
    ],
  };
})();
