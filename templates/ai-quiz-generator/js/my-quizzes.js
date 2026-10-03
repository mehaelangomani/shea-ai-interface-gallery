(function () {
  'use strict';

  if (!QuizAI.requireAuth()) return;

  const grid = document.getElementById('library-grid');
  const empty = document.getElementById('library-empty');
  const searchInput = document.getElementById('quiz-search');
  let filter = 'all';

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatDate(iso) {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '';
    }
  }

  function getFilteredItems() {
    const query = (searchInput?.value || '').trim().toLowerCase();
    let items = QuizAI.getLibrary();
    if (filter === 'completed') items = items.filter((q) => q.status === 'completed');
    if (filter === 'in-progress') items = items.filter((q) => q.status !== 'completed');
    if (query) {
      items = items.filter((q) => {
        const hay = `${q.title || ''} ${q.topic || ''}`.toLowerCase();
        return hay.includes(query);
      });
    }
    return items;
  }

  function render() {
    const items = getFilteredItems();

    if (!items.length) {
      if (grid) grid.innerHTML = '';
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;

    grid.innerHTML = items
      .map((q) => {
        const status = q.status === 'completed' ? 'Completed' : 'In Progress';
        const score = q.score != null ? `<span class="score-badge score-badge--high">${q.score}%</span>` : '';
        return `<article class="card quiz-library-card card--hover">
          <h3 style="margin:0;font-size:1.05rem">${escapeHtml(q.title || 'Quiz')}</h3>
          <div class="quiz-library-card__meta">
            <span>${escapeHtml(q.topic || 'General')}</span>
            <span>${q.questionCount || '—'} questions</span>
            <span>${escapeHtml(q.difficulty || 'medium')}</span>
          </div>
          <div class="quiz-library-card__meta">${status} ${score}</div>
          <p style="margin:0;font-size:12px;color:var(--text-muted)">${escapeHtml(formatDate(q.createdAt))}</p>
          <div style="display:flex;gap:8px;margin-top:4px">
            <button type="button" class="btn btn--primary btn--sm" data-action="open" data-quiz-id="${escapeHtml(q.id)}">${q.status === 'completed' ? 'Retake' : 'Continue'}</button>
            ${q.status === 'completed' ? `<button type="button" class="btn btn--secondary btn--sm" data-action="results" data-quiz-id="${escapeHtml(q.id)}">View</button>` : ''}
          </div>
        </article>`;
      })
      .join('');

    grid.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = QuizAI.getLibrary().find((q) => q.id === btn.dataset.quizId);
        if (!item?.quizSnapshot) {
          QuizAI.showToast('Quiz data not found. Generate a new quiz.', 'error');
          return;
        }
        if (btn.dataset.action === 'open') {
          localStorage.setItem(QuizAI.keys.quiz, JSON.stringify(item.quizSnapshot));
          sessionStorage.removeItem('quizAIInProgress');
          window.location.href = 'quiz.html';
          return;
        }
        const attempt = QuizAI.getHistory().find((h) => h.title === item.title && h.result);
        if (attempt?.result) {
          localStorage.setItem(QuizAI.keys.result, JSON.stringify(attempt.result));
          window.location.href = 'results.html';
        } else {
          QuizAI.showToast('No results saved for this quiz.', 'error');
        }
      });
    });
  }

  document.querySelectorAll('#library-filters .option-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#library-filters .option-pill').forEach((p) => p.classList.remove('is-selected'));
      pill.classList.add('is-selected');
      filter = pill.dataset.filter || 'all';
      render();
    });
  });

  searchInput?.addEventListener('input', render);
  render();
})();
