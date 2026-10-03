(function () {
  'use strict';

  const PROGRESS_KEY = 'quizAIInProgress';

  let quiz = null;
  try {
    quiz = JSON.parse(localStorage.getItem(QuizAI.keys.quiz));
  } catch (_) {}

  if (!quiz || !quiz.questions?.length) {
    window.location.href = 'generator.html';
    return;
  }

  const TOTAL_TIME = Math.max(120, quiz.questions.length * 60);

  let currentIndex = 0;
  let answers = new Array(quiz.questions.length).fill(null);
  let timeRemaining = TOTAL_TIME;
  let timerInterval = null;
  let isSubmitting = false;

  const titleEl = document.getElementById('quiz-title');
  const progressText = document.getElementById('quiz-progress-text');
  const progressBar = document.querySelector('.progress-bar');
  const progressFill = document.getElementById('quiz-progress-fill');
  const questionText = document.getElementById('question-text');
  const optionsContainer = document.getElementById('quiz-options');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const timerEl = document.getElementById('quiz-timer');
  const timerWrap = document.getElementById('quiz-timer-wrap');

  function formatTime(sec) {
    const safe = Math.max(0, sec);
    const m = Math.floor(safe / 60);
    const s = safe % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function saveProgress() {
    try {
      sessionStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify({
          quizId: quiz.id,
          currentIndex,
          answers,
          timeRemaining,
        })
      );
    } catch (_) {}
  }

  function loadProgress() {
    try {
      const raw = sessionStorage.getItem(PROGRESS_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.quizId !== quiz.id) return;
      if (Array.isArray(data.answers) && data.answers.length === quiz.questions.length) {
        answers = data.answers;
      }
      if (typeof data.currentIndex === 'number' && data.currentIndex >= 0 && data.currentIndex < quiz.questions.length) {
        currentIndex = data.currentIndex;
      }
      if (typeof data.timeRemaining === 'number' && data.timeRemaining > 0) {
        timeRemaining = data.timeRemaining;
      }
    } catch (_) {}
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
      timeRemaining -= 1;
      if (timerEl) timerEl.textContent = formatTime(timeRemaining);
      if (timerWrap) timerWrap.classList.toggle('is-low', timeRemaining <= 60);
      if (timeRemaining <= 0) {
        stopTimer();
        QuizAI.showToast('Time is up — submitting your quiz.', 'error');
        submitQuiz(true);
      }
    }, 1000);
  }

  function updateProgress() {
    const n = quiz.questions.length;
    const current = currentIndex + 1;
    if (progressText) progressText.textContent = `Question ${current} of ${n}`;
    const pct = (current / n) * 100;
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressBar) {
      progressBar.setAttribute('aria-valuenow', String(Math.round(pct)));
      progressBar.setAttribute('aria-valuetext', `Question ${current} of ${n}`);
    }
  }

  function renderQuestion() {
    const q = quiz.questions[currentIndex];
    if (questionText) questionText.textContent = q.text;
    if (optionsContainer) {
      optionsContainer.innerHTML = q.options
        .map(
          (opt, i) => `
        <div class="quiz-option ${answers[currentIndex] === i ? 'is-selected' : ''}" data-index="${i}">
          <input type="radio" name="answer" id="opt-${currentIndex}-${i}" value="${i}" ${answers[currentIndex] === i ? 'checked' : ''} />
          <label for="opt-${currentIndex}-${i}">${opt}</label>
        </div>`
        )
        .join('');

      optionsContainer.querySelectorAll('.quiz-option').forEach((row) => {
        row.addEventListener('click', () => {
          const idx = parseInt(row.dataset.index, 10);
          answers[currentIndex] = idx;
          optionsContainer.querySelectorAll('.quiz-option').forEach((r) => r.classList.remove('is-selected'));
          row.classList.add('is-selected');
          const input = row.querySelector('input');
          if (input) input.checked = true;
          saveProgress();
        });
      });
    }

    if (btnPrev) btnPrev.disabled = currentIndex === 0;
    if (btnNext) {
      const isLast = currentIndex === quiz.questions.length - 1;
      btnNext.textContent = isLast ? 'Submit Quiz' : 'Next';
      btnNext.classList.toggle('btn--primary', isLast);
      btnNext.classList.toggle('btn--secondary', !isLast);
    }
    updateProgress();
    saveProgress();
  }

  function submitQuiz(autoSubmit) {
    if (isSubmitting) return;
    isSubmitting = true;
    stopTimer();
    sessionStorage.removeItem(PROGRESS_KEY);

    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct++;
    });
    const total = quiz.questions.length;
    const answered = answers.filter((a) => a !== null).length;
    const result = {
      quizId: quiz.id,
      title: quiz.title,
      correct,
      incorrect: total - correct,
      total,
      percentage: total ? Math.round((correct / total) * 100) : 0,
      answers,
      questions: quiz.questions,
      timeSpent: TOTAL_TIME - timeRemaining,
      answered,
      autoSubmitted: !!autoSubmit,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem(QuizAI.keys.result, JSON.stringify(result));
    QuizAI.updateLibraryEntry(quiz.id, {
      status: 'completed',
      score: result.percentage,
      completedAt: result.completedAt,
    });

    try {
      const history = JSON.parse(localStorage.getItem(QuizAI.keys.history) || '[]');
      history.unshift({
        title: quiz.title,
        questions: total,
        score: result.percentage,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        result,
      });
      localStorage.setItem(QuizAI.keys.history, JSON.stringify(history.slice(0, 20)));
    } catch (_) {}

    window.location.href = 'results.html';
  }

  window.addEventListener('pagehide', stopTimer);

  loadProgress();
  if (titleEl) titleEl.textContent = quiz.title;
  if (timerEl) timerEl.textContent = formatTime(timeRemaining);
  startTimer();
  renderQuestion();

  btnPrev?.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion();
    }
  });

  btnNext?.addEventListener('click', () => {
    if (answers[currentIndex] === null) {
      QuizAI.showToast('Please select an answer.', 'error');
      return;
    }
    if (currentIndex < quiz.questions.length - 1) {
      currentIndex++;
      renderQuestion();
    } else {
      submitQuiz(false);
    }
  });
})();
