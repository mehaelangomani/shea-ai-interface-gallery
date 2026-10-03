/**
 * Apply theme before first paint. Default: dark.
 * Storage key: promptly-theme-v2
 */
(function () {
  'use strict';
  var THEME_KEY = 'promptly-theme-v2';
  var savedTheme = null;

  try {
    if (localStorage.getItem(THEME_KEY) === null) {
      localStorage.removeItem('promptly-theme');
    }
    savedTheme = localStorage.getItem(THEME_KEY);
  } catch (e) {
    savedTheme = null;
  }

  document.documentElement.setAttribute(
    'data-theme',
    savedTheme === 'light' ? 'light' : 'dark'
  );
})();
