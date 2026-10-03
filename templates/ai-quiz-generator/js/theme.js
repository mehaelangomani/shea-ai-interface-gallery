(function () {
  'use strict';
  try {
    var theme = localStorage.getItem('quizAITheme');
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  } catch (_) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
