/**
 * OBJECT AI — Apply saved theme/layout before first paint (prevents flash).
 */
(function () {
  try {
    const theme =
      localStorage.getItem('object-ai-theme') ||
      localStorage.getItem('objectai_theme') ||
      'dark';
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    const layout = localStorage.getItem('objectai_layout') || 'comfortable';
    document.documentElement.setAttribute('data-layout', layout);
  } catch {
    /* ignore */
  }
})();
