(function () {
  'use strict';

  if (!QuizAI.requireAuth()) return;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  const library = QuizAI.getLibrary();
  const history = QuizAI.getHistory();

  const createdEl = document.getElementById('stat-created');
  const avgEl = document.getElementById('stat-avg');
  const topicsEl = document.getElementById('stat-topics');
  const timeEl = document.getElementById('stat-time');

  if (createdEl) createdEl.textContent = String(library.length);
  if (topicsEl) {
    const topics = new Set(library.map((q) => (q.topic || q.title || '').toLowerCase()).filter(Boolean));
    topicsEl.textContent = String(topics.size);
  }
  if (avgEl) {
    const scores = history.map((h) => Number(h.score)).filter((n) => !Number.isNaN(n));
    if (scores.length) {
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      avgEl.textContent = `${avg}%`;
    } else {
      avgEl.textContent = '—';
    }
  }
  if (timeEl) {
    const seconds = history.reduce((sum, h) => sum + (h.result?.timeSpent || 0), 0);
    const mins = Math.max(1, Math.round(seconds / 60));
    timeEl.textContent = mins >= 60 ? `${Math.round(mins / 60)}h` : `${mins}m`;
  }

  const tbody = document.getElementById('recent-activity-body');
  const empty = document.getElementById('recent-empty');
  const wrap = document.getElementById('recent-table-wrap');
  if (!tbody) return;

  const recent = history.slice(0, 3);
  if (!recent.length) {
    if (wrap) wrap.hidden = true;
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;
  if (wrap) wrap.hidden = false;

  tbody.innerHTML = recent
    .map((item, index) => {
      const title = escapeHtml(item.title || 'Quiz');
      const score = Number(item.score) || 0;
      return `<tr>
        <td data-label="Quiz"><span class="quiz-table__title">${title}</span></td>
        <td data-label="Score"><span class="score-badge ${score >= 80 ? 'score-badge--high' : ''}">${score}%</span></td>
        <td data-label="Date">${escapeHtml(item.date || '')}</td>
        <td data-label=""><button type="button" class="btn btn--secondary btn--sm" data-history-index="${index}">View</button></td>
      </tr>`;
    })
    .join('');

  tbody.querySelectorAll('[data-history-index]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = recent[parseInt(btn.dataset.historyIndex, 10)];
      if (item?.result) {
        localStorage.setItem(QuizAI.keys.result, JSON.stringify(item.result));
        window.location.href = 'results.html';
      }
    });
  });
})();
