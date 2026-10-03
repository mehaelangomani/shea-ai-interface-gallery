(function () {
  'use strict';

  const TEMPLATES = [
    { id: 'blog', title: 'Blog Post Writer', desc: 'Outline and draft engaging blog posts from a topic or brief.', category: 'writing', icon: '✎', prompt: 'Write a well-structured blog post about [topic] with an engaging intro and clear sections.' },
    { id: 'youtube', title: 'YouTube Script', desc: 'Hook, structure, and CTA for video scripts.', category: 'writing', icon: '▶', prompt: 'Create a YouTube script with hook, main points, and call to action for: ' },
    { id: 'instagram', title: 'Instagram Posts', desc: 'Caption sets and carousel ideas for social.', category: 'design', icon: '◫', prompt: 'Generate 5 Instagram post captions and carousel ideas for a brand about: ' },
    { id: 'presentation', title: 'Presentation', desc: 'Slide outlines and speaker notes.', category: 'business', icon: '▤', prompt: 'Build a presentation outline with slide titles and bullet points for: ' },
    { id: 'study', title: 'Study Plan', desc: 'Schedules and milestones for learning goals.', category: 'education', icon: '📋', prompt: 'Create a 4-week study plan with daily tasks for learning: ' },
    { id: 'travel', title: 'Travel Itinerary', desc: 'Day-by-day plans with tips and budgets.', category: 'lifestyle', icon: '✈', prompt: 'Create a 7-day travel itinerary for Japan.' },
    { id: 'resume', title: 'Resume Builder', desc: 'Professional summaries and experience bullets.', category: 'productivity', icon: '◎', prompt: 'Help me write resume bullet points and a summary for a role as: ' },
    { id: 'email', title: 'Email Writer', desc: 'Professional emails for any situation.', category: 'business', icon: '✉', prompt: 'Draft a professional email that: ' },
    { id: 'website', title: 'Website Builder', desc: 'Site structure, copy, and layout guidance.', category: 'code', icon: '◇', prompt: 'Design a modern website structure and copy for: ' },
    { id: 'research', title: 'Research Assistant', desc: 'Compare options and summarize findings.', category: 'productivity', icon: '⌕', prompt: 'Research and compare the best options for: ' },
  ];

  let category = 'all';
  let query = '';

  function render() {
    const grid = document.getElementById('templates-grid');
    if (!grid) return;
    const list = TEMPLATES.filter((t) => {
      const catOk = category === 'all' || t.category === category;
      const q = query.toLowerCase();
      const searchOk = !q || t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
      return catOk && searchOk;
    });
    grid.innerHTML = list
      .map(
        (t) => `
      <article class="template-card" data-id="${t.id}">
        <div class="template-icon" aria-hidden="true">${t.icon}</div>
        <h3>${NexusAI.escapeHtml(t.title)}</h3>
        <p>${NexusAI.escapeHtml(t.desc)}</p>
        <button type="button" class="btn btn-secondary btn-sm use-template" data-template-id="${t.id}">Use Template</button>
      </article>`
      )
      .join('');

    grid.querySelectorAll('.use-template').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tpl = TEMPLATES.find((t) => t.id === btn.dataset.templateId);
        if (tpl) {
          localStorage.setItem(NexusAI.STORAGE_KEYS.templatePrompt, tpl.prompt);
          localStorage.setItem(NexusAI.STORAGE_KEYS.templateTitle, tpl.title);
          NexusAI.setActiveProjectId(null);
        }
        window.location.href = 'chat.html';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    NexusAI.renderAppShell('explore');
    document.getElementById('template-search')?.addEventListener('input', (e) => {
      query = e.target.value;
      render();
    });
    document.querySelectorAll('.category-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        category = tab.dataset.category;
        document.querySelectorAll('.category-tab').forEach((t) => t.classList.toggle('active', t === tab));
        render();
      });
    });
    render();
  });
})();
