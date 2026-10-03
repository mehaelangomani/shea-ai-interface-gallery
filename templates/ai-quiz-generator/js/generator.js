(function () {
  'use strict';

  if (!QuizAI.requireAuth()) return;

  const heroTopic = sessionStorage.getItem('quizAIHeroTopic');
  const topicInput = document.querySelector('#generator-form [name="topic"]');
  if (heroTopic && topicInput && !topicInput.value) {
    topicInput.value = heroTopic;
    sessionStorage.removeItem('quizAIHeroTopic');
  }

  const QUESTION_BANK = {
    python: [
      { type: 'mcq', text: 'Which keyword is used to define a function in Python?', options: ['function', 'def', 'define', 'func'], answer: 1 },
      { type: 'mcq', text: 'What is the output of len("hello")?', options: ['4', '5', '6', 'Error'], answer: 1 },
      { type: 'mcq', text: 'Which data type is mutable?', options: ['tuple', 'str', 'list', 'int'], answer: 2 },
      { type: 'tf', text: 'Python lists are zero-indexed.', options: ['True', 'False'], answer: 0 },
      { type: 'mcq', text: 'Which operator is used for exponentiation?', options: ['^', '**', 'pow only', '%%'], answer: 1 },
      { type: 'mcq', text: 'What does `import math` allow you to use?', options: ['Math module', 'Matrix module', 'Machine module', 'None'], answer: 0 },
      { type: 'tf', text: 'Indentation is significant in Python.', options: ['True', 'False'], answer: 0 },
      { type: 'mcq', text: 'Which method adds an item to the end of a list?', options: ['push', 'append', 'add', 'insert_only'], answer: 1 },
      { type: 'mcq', text: 'What is a dictionary key type requirement (generally)?', options: ['Must be mutable', 'Must be hashable', 'Must be int', 'Must be str'], answer: 1 },
      { type: 'mcq', text: 'Which loop iterates over a sequence?', options: ['while', 'for', 'do-while', 'repeat'], answer: 1 },
      { type: 'mcq', text: 'What does `None` represent?', options: ['Zero', 'Null/absence of value', 'False', 'Empty string'], answer: 1 },
      { type: 'tf', text: 'Tuples can be used as dictionary keys.', options: ['True', 'False'], answer: 0 },
      { type: 'mcq', text: 'Which built-in returns the type of an object?', options: ['typeof', 'type', 'class', 'kind'], answer: 1 },
      { type: 'mcq', text: 'List comprehension syntax is written with:', options: ['{ }', '[ ]', '( )', '< >'], answer: 1 },
      { type: 'mcq', text: 'Which keyword handles exceptions?', options: ['catch', 'try/except', 'error', 'handle'], answer: 1 },
      { type: 'mcq', text: 'What is the file mode for reading text?', options: ['w', 'r', 'x', 'a only'], answer: 1 },
      { type: 'tf', text: 'Python supports multiple inheritance.', options: ['True', 'False'], answer: 0 },
      { type: 'mcq', text: 'Which function converts a string to integer?', options: ['str()', 'int()', 'float()', 'bool()'], answer: 1 },
      { type: 'mcq', text: 'What does `range(3)` produce?', options: ['0,1,2', '1,2,3', '0,1,2,3', '3 numbers starting at 1'], answer: 0 },
      { type: 'mcq', text: 'Which symbol starts a comment?', options: ['//', '#', '--', '/*'], answer: 1 },
    ],
    'data structures': [
      { type: 'mcq', text: 'What is the time complexity of accessing an array element by index?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], answer: 2 },
      { type: 'mcq', text: 'Which structure follows LIFO?', options: ['Queue', 'Stack', 'Tree', 'Graph'], answer: 1 },
      { type: 'mcq', text: 'A binary search requires:', options: ['Unsorted data', 'Sorted data', 'Linked list only', 'Hash table'], answer: 1 },
      { type: 'tf', text: 'A queue follows FIFO order.', options: ['True', 'False'], answer: 0 },
      { type: 'mcq', text: 'What is the worst-case search in an unsorted array?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(1) amortized'], answer: 2 },
      { type: 'mcq', text: 'Hash tables offer average-case lookup of:', options: ['O(n)', 'O(1)', 'O(n log n)', 'O(log n)'], answer: 1 },
      { type: 'mcq', text: 'Which traversal visits root, left, right?', options: ['Inorder', 'Preorder', 'Postorder', 'Level only'], answer: 1 },
      { type: 'tf', text: 'A linked list allows O(1) random access by index.', options: ['True', 'False'], answer: 1 },
      { type: 'mcq', text: 'What structure is best for undo operations?', options: ['Queue', 'Stack', 'Heap', 'B-tree'], answer: 1 },
      { type: 'mcq', text: 'Big-O of binary search is:', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], answer: 1 },
      { type: 'mcq', text: 'A graph edge can be:', options: ['Directed or undirected', 'Only directed', 'Only tree', 'Never weighted'], answer: 0 },
      { type: 'mcq', text: 'Which heap type gives min at root (min-heap)?', options: ['Max-heap', 'Min-heap', 'Binary tree', 'Stack'], answer: 1 },
      { type: 'tf', text: 'Dynamic arrays can resize when full.', options: ['True', 'False'], answer: 0 },
      { type: 'mcq', text: 'Collision resolution in hash tables may use:', options: ['Chaining', 'Sorting only', 'Stacks only', 'No solution'], answer: 0 },
      { type: 'mcq', text: 'DFS uses which auxiliary structure often?', options: ['Queue', 'Stack/recursion', 'Heap', 'Hash map only'], answer: 1 },
      { type: 'mcq', text: 'BFS typically uses a:', options: ['Stack', 'Queue', 'Priority queue only', 'Set only'], answer: 1 },
      { type: 'mcq', text: 'Adjacency list is space-efficient for:', options: ['Dense graphs', 'Sparse graphs', 'No graphs', 'Trees only'], answer: 1 },
      { type: 'tf', text: 'A tree with n nodes has n-1 edges (connected tree).', options: ['True', 'False'], answer: 0 },
      { type: 'mcq', text: 'Which sorting has O(n log n) average case?', options: ['Bubble sort', 'Merge sort', 'Selection sort', 'Insertion worst always n log n'], answer: 1 },
      { type: 'mcq', text: 'Deque allows operations at:', options: ['Front only', 'Both ends', 'Back only', 'Middle only'], answer: 1 },
    ],
    'machine learning': [
      { type: 'mcq', text: 'Supervised learning uses:', options: ['Labeled data', 'No data', 'Only rewards', 'Random labels ignored'], answer: 0 },
      { type: 'mcq', text: 'Overfitting means the model:', options: ['Generalizes well', 'Memorizes training noise', 'Always underfits', 'Has no parameters'], answer: 1 },
      { type: 'tf', text: 'Train/test split helps estimate generalization.', options: ['True', 'False'], answer: 0 },
      { type: 'mcq', text: 'Linear regression predicts:', options: ['Categories only', 'Continuous values', 'Images only', 'Graphs'], answer: 1 },
      { type: 'mcq', text: 'Which metric is common for classification accuracy?', options: ['MSE', 'Accuracy', 'RMSE only', 'BLEU only'], answer: 1 },
      { type: 'mcq', text: 'Gradient descent updates:', options: ['Labels', 'Model parameters', 'Dataset size', 'Hardware'], answer: 1 },
      { type: 'mcq', text: 'A decision tree splits based on:', options: ['Random choice', 'Feature criteria', 'Time only', 'User ID'], answer: 1 },
      { type: 'tf', text: 'More training data often helps generalization.', options: ['True', 'False'], answer: 0 },
      { type: 'mcq', text: 'K-means is an example of:', options: ['Supervised learning', 'Clustering', 'Reinforcement', 'Regression'], answer: 1 },
      { type: 'mcq', text: 'Regularization reduces:', options: ['Underfitting always', 'Overfitting tendency', 'Dataset size', 'Labels'], answer: 1 },
      { type: 'mcq', text: 'Neural networks contain layers of:', options: ['Neurons/nodes', 'Only trees', 'Queues', 'Disks'], answer: 0 },
      { type: 'mcq', text: 'Cross-validation helps:', options: ['Tune hyperparameters robustly', 'Remove all bias', 'Guarantee 100% accuracy', 'Skip testing'], answer: 0 },
      { type: 'tf', text: 'Unsupervised learning finds patterns without labels.', options: ['True', 'False'], answer: 0 },
      { type: 'mcq', text: 'Precision measures:', options: ['True positives among predicted positives', 'All errors', 'Only recall', 'Loss value'], answer: 0 },
      { type: 'mcq', text: 'ROC curve plots:', options: ['TPR vs FPR', 'Loss vs epoch only', 'Accuracy vs time', 'Features vs labels'], answer: 0 },
      { type: 'mcq', text: 'Feature scaling can help:', options: ['Gradient-based algorithms', 'Nothing', 'Only trees', 'Only kNN never'], answer: 0 },
      { type: 'mcq', text: 'Bias-variance tradeoff relates to:', options: ['Model complexity', 'GPU speed', 'File format', 'SQL joins'], answer: 0 },
      { type: 'tf', text: 'Ensemble methods combine multiple models.', options: ['True', 'False'], answer: 0 },
      { type: 'mcq', text: 'Dropout in neural nets helps:', options: ['Overfitting', 'Increase overfitting', 'Remove layers', 'Label data'], answer: 0 },
      { type: 'mcq', text: 'Loss function quantifies:', options: ['Prediction error', 'CPU usage', 'Memory', 'Batch size only'], answer: 0 },
    ],
    'computer science': [
      { type: 'mcq', text: 'CPU stands for:', options: ['Central Processing Unit', 'Computer Personal Unit', 'Core Program Utility', 'Cache Processing Unit'], answer: 0 },
      { type: 'mcq', text: 'Binary 101 equals decimal:', options: ['4', '5', '6', '7'], answer: 1 },
      { type: 'tf', text: 'RAM is volatile memory.', options: ['True', 'False'], answer: 0 },
      { type: 'mcq', text: 'HTTP is primarily used for:', options: ['Web communication', 'Disk formatting', 'GPU rendering', 'BIOS only'], answer: 0 },
      { type: 'mcq', text: 'An algorithm is:', options: ['Step-by-step procedure', 'Hardware chip', 'Only a loop', 'Database table'], answer: 0 },
      { type: 'mcq', text: 'IPv4 addresses are typically:', options: ['32-bit', '128-bit only', '16-bit', '64-char strings'], answer: 0 },
      { type: 'mcq', text: 'OS manages:', options: ['Resources & processes', 'Only keyboard', 'Only CSS', 'Compiler only'], answer: 0 },
      { type: 'tf', text: 'Compilation translates source to machine code (traditionally).', options: ['True', 'False'], answer: 0 },
      { type: 'mcq', text: 'SQL is used for:', options: ['Relational databases', '3D graphics', 'Kernel drivers', 'Audio only'], answer: 0 },
      { type: 'mcq', text: 'Cache memory is:', options: ['Faster & smaller than RAM', 'Slower than HDD always', 'Same as SSD', 'Only virtual'], answer: 0 },
      { type: 'mcq', text: 'Big-O describes:', options: ['Asymptotic growth', 'Exact runtime always', 'Memory brand', 'UI layout'], answer: 0 },
      { type: 'mcq', text: 'Encryption protects:', options: ['Data confidentiality', 'Screen brightness', 'Fan speed', 'Mouse DPI'], answer: 0 },
      { type: 'tf', text: 'Open source software source code is available to use/modify.', options: ['True', 'False'], answer: 0 },
      { type: 'mcq', text: 'Git is a:', options: ['Version control system', 'Spreadsheet', 'Game engine', 'Router OS'], answer: 0 },
      { type: 'mcq', text: 'TCP provides:', options: ['Reliable ordered delivery', 'Only broadcast', 'No connections', 'Physical wiring'], answer: 0 },
      { type: 'mcq', text: 'Boolean logic uses values:', options: ['True/False', 'Only integers', 'Colors', 'Pixels'], answer: 0 },
      { type: 'mcq', text: 'A compiler error occurs at:', options: ['Compile time', 'Never', 'Only runtime always', 'Deploy only'], answer: 0 },
      { type: 'tf', text: 'Multithreading can improve responsiveness.', options: ['True', 'False'], answer: 0 },
      { type: 'mcq', text: 'DNS translates domain names to:', options: ['IP addresses', 'CSS files', 'GPU cores', 'PDF pages'], answer: 0 },
      { type: 'mcq', text: 'Recursion requires:', options: ['Base case', 'Infinite calls always', 'No stack', 'Hardware GPU'], answer: 0 },
    ],
    mathematics: [
      { type: 'mcq', text: 'Derivative of x² is:', options: ['x', '2x', 'x²', '2'], answer: 1 },
      { type: 'mcq', text: 'Sum of angles in a triangle:', options: ['90°', '180°', '270°', '360°'], answer: 1 },
      { type: 'tf', text: '√4 equals 2.', options: ['True', 'False'], answer: 0 },
      { type: 'mcq', text: 'Solve: 2x + 4 = 10', options: ['x=2', 'x=3', 'x=4', 'x=5'], answer: 1 },
      { type: 'mcq', text: 'Area of circle formula:', options: ['πr²', '2πr', 'r²', 'πd'], answer: 0 },
      { type: 'mcq', text: 'Probability range is:', options: ['0 to 1', '-1 to 1', '0 to 100 only', 'Any real'], answer: 0 },
      { type: 'mcq', text: 'log₁₀(100) equals:', options: ['1', '2', '10', '100'], answer: 1 },
      { type: 'tf', text: 'A prime number has exactly two positive divisors.', options: ['True', 'False'], answer: 0 },
      { type: 'mcq', text: 'Slope formula uses:', options: ['(y₂-y₁)/(x₂-x₁)', 'x+y', 'x×y only', 'y/x only'], answer: 0 },
      { type: 'mcq', text: 'Integral of 1 dx is:', options: ['x + C', '1', '0', 'x²'], answer: 0 },
      { type: 'mcq', text: 'Pythagorean theorem: a²+b²=', options: ['c²', 'c', '2c', 'ab'], answer: 0 },
      { type: 'mcq', text: 'Mean of 2,4,6 is:', options: ['3', '4', '5', '6'], answer: 1 },
      { type: 'tf', text: '0! equals 1.', options: ['True', 'False'], answer: 0 },
      { type: 'mcq', text: 'sin(90°) equals:', options: ['0', '1', '-1', '0.5'], answer: 1 },
      { type: 'mcq', text: 'Quadratic formula solves:', options: ['ax²+bx+c=0', 'Linear only', 'No roots ever', 'Integrals'], answer: 0 },
      { type: 'mcq', text: '|−5| equals:', options: ['-5', '5', '0', '25'], answer: 1 },
      { type: 'mcq', text: 'Matrix multiplication order:', options: ['Matters (not commutative)', 'Never matters', 'Always commutative', 'Undefined'], answer: 0 },
      { type: 'tf', text: 'π is irrational.', options: ['True', 'False'], answer: 0 },
      { type: 'mcq', text: '5! equals:', options: ['120', '60', '24', '720'], answer: 0 },
      { type: 'mcq', text: 'Equation of line: y = mx + b, m is:', options: ['Slope', 'Intercept', 'Origin', 'Area'], answer: 0 },
    ],
    'general knowledge': [
      { type: 'mcq', text: 'Capital of France is:', options: ['Berlin', 'Paris', 'Madrid', 'Rome'], answer: 1 },
      { type: 'mcq', text: 'H₂O is commonly known as:', options: ['Salt', 'Water', 'Oxygen', 'Hydrogen'], answer: 1 },
      { type: 'tf', text: 'The Earth orbits the Sun.', options: ['True', 'False'], answer: 0 },
      { type: 'mcq', text: 'Largest planet in our solar system:', options: ['Earth', 'Mars', 'Jupiter', 'Venus'], answer: 2 },
      { type: 'mcq', text: 'WHO focuses on:', options: ['World health', 'Weather only', 'Trade only', 'Sports rules'], answer: 0 },
      { type: 'mcq', text: 'Photosynthesis occurs mainly in:', options: ['Plants', 'Rocks', 'Metals', 'Plastic'], answer: 0 },
      { type: 'mcq', text: 'UN stands for:', options: ['United Nations', 'Universal Network', 'Union Navy', 'United Nodes'], answer: 0 },
      { type: 'tf', text: 'Antarctica is a continent.', options: ['True', 'False'], answer: 0 },
      { type: 'mcq', text: 'Speed of light is approximately:', options: ['300,000 km/s', '300 km/s', '3 km/s', '30,000 m/s only'], answer: 0 },
      { type: 'mcq', text: 'Author of "Romeo and Juliet":', options: ['Dickens', 'Shakespeare', 'Austen', 'Twain'], answer: 1 },
      { type: 'mcq', text: 'Currency of Japan:', options: ['Yen', 'Euro', 'Dollar', 'Pound'], answer: 0 },
      { type: 'mcq', text: 'Great Wall is located in:', options: ['China', 'India', 'Egypt', 'Peru'], answer: 0 },
      { type: 'tf', text: 'Humans need oxygen to breathe.', options: ['True', 'False'], answer: 0 },
      { type: 'mcq', text: 'Olympics are held every:', options: ['2 years (summer cycle 4)', '1 year', '10 years', '6 months'], answer: 0 },
      { type: 'mcq', text: 'Primary colors of light (additive):', options: ['Red, Green, Blue', 'Red, Yellow, Blue paint only', 'Black, White', 'Cyan, Magenta only'], answer: 0 },
      { type: 'mcq', text: 'Continent with most countries (often cited):', options: ['Africa', 'Europe', 'Antarctica', 'Australia'], answer: 0 },
      { type: 'mcq', text: 'DNA stands for:', options: ['Deoxyribonucleic acid', 'Digital network array', 'Dynamic node access', 'None'], answer: 0 },
      { type: 'tf', text: 'Pacific Ocean is the largest ocean.', options: ['True', 'False'], answer: 0 },
      { type: 'mcq', text: 'Instrument for measuring temperature:', options: ['Thermometer', 'Barometer', 'Altimeter', 'Compass'], answer: 0 },
      { type: 'mcq', text: 'Renewable energy example:', options: ['Solar', 'Coal only', 'Oil only', 'Peat only'], answer: 0 },
    ],
  };

  const FALLBACK = QUESTION_BANK['general knowledge'];

  function matchTopic(topic) {
    const t = topic.toLowerCase();
    if (t.includes('python')) return 'python';
    if (t.includes('data struct')) return 'data structures';
    if (t.includes('machine learning') || t.includes('ml')) return 'machine learning';
    if (t.includes('computer') || t.includes('cs')) return 'computer science';
    if (t.includes('math')) return 'mathematics';
    if (t.includes('general') || t.includes('gk')) return 'general knowledge';
    for (const key of Object.keys(QUESTION_BANK)) {
      if (t.includes(key)) return key;
    }
    return null;
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function filterByType(questions, questionType) {
    if (questionType === 'mixed') return questions;
    if (questionType === 'mcq') return questions.filter((q) => q.type === 'mcq');
    if (questionType === 'tf') return questions.filter((q) => q.type === 'tf');
    return questions;
  }

  function buildQuiz(topic, count, difficulty, questionType, description) {
    const key = matchTopic(topic) || 'general knowledge';
    let pool = filterByType(QUESTION_BANK[key] || FALLBACK, questionType);
    if (pool.length < count) pool = [...pool, ...shuffle(FALLBACK)].slice(0, Math.max(count, 5));
    const selected = shuffle(pool).slice(0, count);
    return {
      id: Date.now().toString(),
      title: topic.trim() || 'Custom Quiz',
      topic: topic.trim(),
      description: description || '',
      difficulty,
      questionType,
      createdAt: new Date().toISOString(),
      questions: selected.map((q, i) => ({
        id: i + 1,
        text: q.text,
        options: q.options,
        correctIndex: q.answer,
        type: q.type,
      })),
    };
  }

  const form = document.getElementById('generator-form');
  const overlay = document.getElementById('loading-overlay');
  const submitBtn = document.getElementById('btn-generate');
  let isGenerating = false;

  function initPills(containerName, hiddenInputName, defaultVal) {
    const container = document.querySelector(`[data-pills="${containerName}"]`);
    const input = document.querySelector(`[name="${hiddenInputName}"]`);
    if (!container || !input) return;
    container.querySelectorAll('.option-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        container.querySelectorAll('.option-pill').forEach((p) => p.classList.remove('is-selected'));
        pill.classList.add('is-selected');
        input.value = pill.dataset.value;
      });
      if (pill.dataset.value === defaultVal) pill.classList.add('is-selected');
    });
  }

  initPills('difficulty', 'difficulty', 'medium');
  initPills('count', 'count', '10');
  initPills('questionType', 'questionType', 'mcq');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const topic = form.querySelector('[name="topic"]').value.trim();
      const description = form.querySelector('[name="description"]')?.value.trim() || '';
      const difficulty = form.querySelector('[name="difficulty"]').value;
      const count = parseInt(form.querySelector('[name="count"]').value, 10) || 10;
      const questionType = form.querySelector('[name="questionType"]').value;

      const topicGroup = form.querySelector('[name="topic"]').closest('.form-group');
      topicGroup?.classList.remove('is-invalid');

      if (!topic) {
        topicGroup?.classList.add('is-invalid');
        const err = topicGroup?.querySelector('.form-error');
        if (err) err.textContent = 'Please enter a topic to generate your quiz.';
        QuizAI.showToast('Please enter a topic.', 'error');
        return;
      }

      if (isGenerating) return;
      isGenerating = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.defaultLabel = submitBtn.dataset.defaultLabel || submitBtn.textContent;
        submitBtn.innerHTML = 'Creating Quiz<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span>';
      }

      overlay?.classList.add('is-visible');
      sessionStorage.removeItem('quizAIInProgress');

      setTimeout(() => {
        const quiz = buildQuiz(topic, count, difficulty, questionType, description);
        localStorage.setItem(QuizAI.keys.quiz, JSON.stringify(quiz));
        QuizAI.saveLibraryEntry({
          id: quiz.id,
          title: quiz.title,
          topic: quiz.topic,
          difficulty,
          questionType,
          questionCount: quiz.questions.length,
          createdAt: quiz.createdAt,
          status: 'in-progress',
          score: null,
          quizSnapshot: quiz,
        });
        overlay?.classList.remove('is-visible');
        QuizAI.showToast('Quiz generated successfully.');
        window.location.href = 'quiz.html';
      }, 1500);
    });
  }

  window.QuizAIGenerator = { buildQuiz, QUESTION_BANK };
})();
