document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('.page-profile')) return;

  const user = ObjectAIAuth?.getCurrentUser();
  if (!user) {
    window.location.href = 'signin.html';
    return;
  }

  const plan = ObjectAIAuth.getActivePlan() || 'free';
  const planLabel = plan === 'pro' ? 'Pro' : plan === 'team' ? 'Team' : 'Free';
  const analyses = ObjectAI.getAnalyses().length;
  const limit = plan === 'team' ? 9999 : plan === 'pro' ? 500 : 50;
  const pct = Math.min(100, (analyses / limit) * 100);

  document.getElementById('profile-avatar-lg').textContent = ObjectAIAuth.getInitial(user.name);
  document.getElementById('profile-display-name').textContent = user.name;
  document.getElementById('profile-display-email').textContent = user.email;
  document.getElementById('profile-info-name').textContent = user.name;
  document.getElementById('profile-info-email').textContent = user.email;
  document.getElementById('profile-plan').textContent = planLabel;

  const since = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : 'October 2026';
  document.getElementById('profile-since').textContent = since;

  document.getElementById('profile-usage-text').textContent = `${analyses} / ${plan === 'team' ? '∞' : limit}`;
  document.getElementById('profile-usage-bar').style.width = `${pct}%`;
});
