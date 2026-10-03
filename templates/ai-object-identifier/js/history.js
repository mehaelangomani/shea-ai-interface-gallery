/**
 * OBJECT AI — History page: list, search, filter, open saved results.
 */

let filterType = 'all';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('.page-history')) return;

  document.getElementById('history-search')?.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderHistory();
  });

  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      filterType = btn.getAttribute('data-filter') || 'all';
      renderHistory();
    });
  });

  document.getElementById('clear-history-btn')?.addEventListener('click', () => {
    if (!window.confirm('Clear all saved analyses? This cannot be undone.')) return;
    ObjectAI.clearAnalyses();
    renderHistory();
  });

  renderHistory();
});

function renderHistory() {
  const list = ObjectAI.getAnalyses();
  const empty = document.getElementById('history-empty');
  const listEl = document.getElementById('history-list');
  const toolbar = document.getElementById('history-toolbar');
  const clearBtn = document.getElementById('clear-history-btn');

  const filtered = list.filter(matchesFilters);

  if (list.length === 0) {
    empty.hidden = false;
    listEl.hidden = true;
    toolbar.hidden = true;
    clearBtn.hidden = true;
    listEl.innerHTML = '';
    return;
  }

  empty.hidden = true;
  toolbar.hidden = false;
  clearBtn.hidden = false;
  listEl.hidden = false;
  listEl.innerHTML = '';

  if (filtered.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty-state card';
    li.innerHTML = '<p class="empty-title">No matches</p><p class="empty-desc">Try a different search or filter.</p>';
    listEl.appendChild(li);
    return;
  }

  filtered.forEach((item) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'history-item';

    const topObject = item.objects?.[0];
    const thumb = createThumbnail(item);

    btn.appendChild(thumb);
    const body = document.createElement('div');
    body.innerHTML = `
      <p class="history-item-title">${escapeHtml(item.fileName)}</p>
      <p class="history-item-meta">${ObjectAI.formatDate(item.analyzedAt)} · ${item.objects?.length || 0} objects</p>
      <p class="history-item-tags">Main: <strong>${escapeHtml(topObject?.name || '—')}</strong></p>
    `;
    btn.appendChild(body);

    btn.addEventListener('click', () => {
      window.location.href = `analyze.html?id=${encodeURIComponent(item.id)}`;
    });

    li.appendChild(btn);
    listEl.appendChild(li);
  });
}

function matchesFilters(item) {
  if (filterType === 'image' && item.mediaType !== 'image') return false;
  if (filterType === 'video' && item.mediaType !== 'video') return false;

  if (!searchQuery) return true;
  const hay = [
    item.fileName,
    item.objects?.map((o) => o.name).join(' '),
  ]
    .join(' ')
    .toLowerCase();
  return hay.includes(searchQuery);
}

function createThumbnail(item) {
  if (item.mediaType === 'image' && item.thumbnail) {
    const img = document.createElement('img');
    img.className = 'history-thumb';
    img.src = item.thumbnail;
    img.alt = '';
    return img;
  }

  const div = document.createElement('div');
  div.className = 'history-thumb history-thumb-video';
  div.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
  return div;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
