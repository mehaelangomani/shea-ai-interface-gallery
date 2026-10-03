/**
 * OBJECT AI — Shared footer render + active nav.
 */

const FOOTER_HTML = `
<div class="container footer-grid">
  <div class="footer-col footer-brand-col">
    <p class="footer-brand">OBJECT AI</p>
    <p class="footer-tagline">Intelligent visual identification.</p>
  </div>
  <div class="footer-col">
    <p class="footer-col-title">Product</p>
    <ul class="footer-links">
      <li><a href="analyze.html">Analyze</a></li>
      <li><a href="history.html">History</a></li>
      <li><a href="pricing.html">Pricing</a></li>
    </ul>
  </div>
  <div class="footer-col">
    <p class="footer-col-title">Account</p>
    <ul class="footer-links">
      <li><a href="signin.html">Sign In</a></li>
      <li><a href="signup.html">Sign Up</a></li>
      <li><a href="profile.html">Profile</a></li>
    </ul>
  </div>
  <div class="footer-col">
    <p class="footer-col-title">Legal</p>
    <ul class="footer-links">
      <li><span class="footer-muted">Privacy (demo)</span></li>
      <li><span class="footer-muted">Terms (demo)</span></li>
    </ul>
  </div>
</div>
<p class="footer-bottom">© ${new Date().getFullYear()} OBJECT AI. Computer vision product template.</p>
`;

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-site-footer]').forEach((el) => {
    el.classList.add('site-footer-red');
    el.innerHTML = FOOTER_HTML;
  });

  document.querySelectorAll('.site-header:not(.site-header-minimal)').forEach((el) => {
    if (!el.classList.contains('site-header-wine') && !el.classList.contains('site-header-minimal')) {
      el.classList.add('site-header-wine');
    }
  });

  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll(`.nav-link[data-nav="${page}"]`).forEach((a) => a.classList.add('is-active'));
    document.querySelectorAll('.nav-link').forEach((a) => {
      if (a.dataset.nav !== page) a.classList.remove('is-active');
    });
  }
});
