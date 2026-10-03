(function () {
  'use strict';

  const TYPE_MAP = {
    chat: 'Chats',
    document: 'Documents',
    design: 'Images',
    code: 'Code',
  };

  let filter = 'all';
  let query = '';

  function matchesFilter(p) {
    if (filter === 'all') return true;
    const map = { chats: 'chat', images: 'design', documents: 'document', code: 'code' };
    return p.type === map[filter];
  }

  function render() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    const projects = NexusAI.getProjects().filter((p) => {
      const q = query.toLowerCase();
      return matchesFilter(p) && (!q || p.title.toLowerCase().includes(q));
    });
    grid.innerHTML = projects
      .map((p) => {
        const thumbClass = p.type === 'code' ? 'code' : p.type === 'design' ? 'design' : '';
        return `
        <article class="project-card" data-id="${p.id}">
          <div class="project-thumb ${thumbClass}"></div>
          <button type="button" class="card-menu-btn" aria-label="Menu" data-menu>⋯</button>
          <div class="project-body">
            <h3>${NexusAI.escapeHtml(p.title)}</h3>
            <div class="project-meta">
              <span class="project-type">${TYPE_MAP[p.type] || p.type}</span>
              <span>${NexusAI.formatRelativeDate(p.updated)}</span>
            </div>
          </div>
        </article>`;
      })
      .join('');

    grid.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-menu]')) {
          NexusAI.toast('Project options');
          return;
        }
        NexusAI.setActiveProjectId(NexusAI.normalizeProjectId(card.dataset.id));
        window.location.href = 'chat.html';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    NexusAI.renderAppShell('projects');
    document.getElementById('project-search')?.addEventListener('input', (e) => {
      query = e.target.value;
      render();
    });
    document.querySelectorAll('.filter-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        filter = tab.dataset.filter;
        document.querySelectorAll('.filter-tab').forEach((t) => t.classList.toggle('active', t === tab));
        render();
      });
    });
    document.getElementById('new-project')?.addEventListener('click', () => {
      window.location.href = 'workspace.html';
    });
    render();
  });
})();
