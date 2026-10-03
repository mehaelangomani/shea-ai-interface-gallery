(function () {
  'use strict';

  let result = null;
  try {
    result = JSON.parse(localStorage.getItem(QuizAI.keys.result));
  } catch (_) {}

  if (!result) {
    result = {
      title: 'Demo Quiz',
      correct: 4,
      incorrect: 1,
      total: 5,
      percentage: 80,
    };
  }

  const titleEl = document.getElementById('results-title');
  const scoreText = document.getElementById('results-score-text');
  const pctEl = document.getElementById('results-percent');
  const ringFill = document.getElementById('score-ring-fill');
  const correctEl = document.getElementById('stat-correct');
  const incorrectEl = document.getElementById('stat-incorrect');
  const totalEl = document.getElementById('stat-total');

  if (titleEl) titleEl.textContent = result.title || 'Quiz Complete';
  if (scoreText) scoreText.textContent = `${result.correct} out of ${result.total}`;
  if (pctEl) pctEl.textContent = `${result.percentage}%`;
  if (correctEl) correctEl.textContent = result.correct;
  if (incorrectEl) incorrectEl.textContent = result.incorrect;
  if (totalEl) totalEl.textContent = result.total;

  const circumference = 2 * Math.PI * 70;
  if (ringFill) {
    ringFill.style.strokeDasharray = circumference;
    const offset = circumference - (result.percentage / 100) * circumference;
    requestAnimationFrame(() => {
      setTimeout(() => {
        ringFill.style.strokeDashoffset = offset;
      }, 200);
    });
  }

  function confetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ['#39AEB4', '#CDEFE7', '#D9EEF8', '#F9DCCB'];
    const pieces = Array.from({ length: 48 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: 6 + Math.random() * 6,
      h: 4 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vy: 1 + Math.random() * 2,
      vx: -1 + Math.random() * 2,
      rot: Math.random() * 360,
    }));

    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        p.rot += 2;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      if (frame < 120) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    draw();
  }

  if (result.percentage >= 70 && !QuizAI.prefersReducedMotion()) confetti();

  document.getElementById('btn-review')?.addEventListener('click', () => {
    const review = document.getElementById('review-section');
    if (!review || !result.questions) return;
    review.hidden = false;
    review.innerHTML = `
      <h3>Answer Review</h3>
      ${result.questions
        .map((q, i) => {
          const userAns = result.answers?.[i];
          const ok = userAns === q.correctIndex;
          return `<div class="card card__body" style="margin-top:16px;text-align:left">
            <p style="font-weight:600;color:var(--text)">${i + 1}. ${q.text}</p>
            <p style="font-size:14px;margin:8px 0 0">Your answer: ${q.options[userAns] ?? '—'}</p>
            <p style="font-size:14px;color:${ok ? 'var(--primary)' : '#c45c5c'}">${ok ? 'Correct' : `Correct: ${q.options[q.correctIndex]}`}</p>
          </div>`;
        })
        .join('')}`;
    review.scrollIntoView({ behavior: 'smooth' });
  });
})();
