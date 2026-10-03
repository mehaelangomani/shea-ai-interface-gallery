(function () {
  'use strict';

  if (!QuizAI.requireAuth()) return;

  const list = document.getElementById('history-list');
  const empty = document.getElementById('history-empty');
  const history = QuizAI.getHistory();

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  if (!history.length) {
    if (list) list.innerHTML = '';
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;

  list.innerHTML = history
    .map((item, index) => {
      const title = escapeHtml(item.title || 'Quiz');
      const score = Number(item.score) || 0;
      const questions = item.questions || item.result?.total || '—';
      return `<article class="card history-item card--hover">
        <div class="history-item__main">
          <h3>${title}</h3>
          <p>Completed · ${questions} questions · ${escapeHtml(item.date || '')}</p>
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <span class="score-badge ${score >= 80 ? 'score-badge--high' : ''}">${score}%</span>
          <button type="button" class="btn btn--secondary btn--sm" data-view="${index}">View Results</button>
        </div>
      </article>`;
    })
    .join('');

  list.querySelectorAll('[data-view]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = history[parseInt(btn.dataset.view, 10)];
      if (item?.result) {
        localStorage.setItem(QuizAI.keys.result, JSON.stringify(item.result));
        window.location.href = 'results.html';
      }
    });
  });
})();
