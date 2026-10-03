(function () {
  'use strict';

  const TYPE_ICONS = {
    images: '🖼',
    documents: '📄',
    code: '⌨',
    saved: '★',
  };

  let filter = 'all';
  let query = '';

  function matchesFilter(item) {
    if (filter === 'all') return true;
    if (filter === 'saved') return item.saved === true;
    const map = { images: 'images', documents: 'documents', code: 'code' };
    return item.type === map[filter];
  }

  function render() {
    const grid = document.getElementById('library-grid');
    const empty = document.getElementById('library-empty');
    if (!grid) return;

    const items = NexusAI.getLibrary().filter((item) => {
      const q = query.toLowerCase();
      const searchOk = !q || item.title.toLowerCase().includes(q);
      return matchesFilter(item) && searchOk;
    });

    if (items.length === 0) {
      grid.innerHTML = '';
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;

    grid.innerHTML = items
      .map((item) => {
        const thumbClass = item.type === 'documents' ? 'doc' : item.type === 'code' ? 'code' : '';
        const icon = TYPE_ICONS[item.type] || '📁';
        return `
        <article class="library-card" data-id="${item.id}">
          <div class="library-actions">
            <button type="button" class="lib-icon-btn${item.favorite ? ' favorited' : ''}" data-fav aria-label="Toggle favorite">♥</button>
            <button type="button" class="lib-icon-btn" data-menu aria-label="Asset menu">⋯</button>
          </div>
          <div class="library-thumb ${thumbClass}" aria-hidden="true">${icon}</div>
          <h3>${NexusAI.escapeHtml(item.title)}</h3>
          <div class="library-meta">
            <span class="library-type">${NexusAI.escapeHtml(item.type)}</span>
            <span>${NexusAI.formatRelativeDate(item.date)}</span>
          </div>
        </article>`;
      })
      .join('');

    grid.querySelectorAll('.library-card').forEach((card) => {
      const id = card.dataset.id;
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-fav]')) return;
        if (e.target.closest('[data-menu]')) return;
        NexusAI.openModal('library-view-modal');
        const item = NexusAI.getLibrary().find((i) => i.id === id);
        const title = document.getElementById('library-view-title');
        const body = document.getElementById('library-view-body');
        if (title) title.textContent = item?.title || 'Asset';
        if (body) {
          body.textContent = `Preview of "${item?.title}" (${item?.type}). Full export would be available in a production build.`;
        }
      });

      card.querySelector('[data-fav]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const list = NexusAI.getLibrary();
        const item = list.find((i) => i.id === id);
        if (item) {
          item.favorite = !item.favorite;
          NexusAI.saveLibrary(list);
          render();
          NexusAI.toast(item.favorite ? 'Added to favorites' : 'Removed from favorites');
        }
      });

      card.querySelector('[data-menu]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const list = NexusAI.getLibrary();
        const item = list.find((i) => i.id === id);
        if (!item) return;
        if (confirm(`Remove "${item.title}" from your library?`)) {
          NexusAI.saveLibrary(list.filter((i) => i.id !== id));
          NexusAI.toast('Removed from library');
          render();
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    NexusAI.renderAppShell('library');
    document.getElementById('library-search')?.addEventListener('input', (e) => {
      query = e.target.value;
      render();
    });
    document.querySelectorAll('.library-filters .filter-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        filter = tab.dataset.filter;
        document.querySelectorAll('.library-filters .filter-tab').forEach((t) => {
          t.classList.toggle('active', t === tab);
        });
        render();
      });
    });
    render();
  });
})();
