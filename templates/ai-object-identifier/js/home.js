/**
 * OBJECT AI — Home interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('.page-home')) return;

  initHeroParallax();
  initHomeDemo();
  initDemoHover();
  initUnderstandingTabs();
  initHeroEntrance();
});

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initHeroEntrance() {
  if (prefersReducedMotion()) {
    document.querySelectorAll('.hero .reveal-up, .hero .reveal-right').forEach((el) => el.classList.add('is-revealed'));
    return;
  }
  const sequence = [
    '.hero-bg',
    '.hero-content .eyebrow',
    '.hero-title-split',
    '.hero-lead',
    '.hero-cta-row',
    '.hero-visual-wrap',
  ];
  sequence.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 120 + i * 100);
  });

  setTimeout(() => {
    ObjectAIDetectionUI?.positionLabels(document.querySelector('.hero .vision-scene'));
  }, 1100);
}

function initHeroParallax() {
  const hero = document.querySelector('.hero');
  const panel = document.querySelector('.hero-panel');
  const floats = document.querySelectorAll('.hero-float');
  const coords = document.querySelectorAll('.vision-coord');
  const bg = hero?.querySelector('.hero-bg');
  if (!hero || prefersReducedMotion()) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    targetX = x;
    targetY = y;
  });

  hero.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  function tick() {
    currentX += (targetX - currentX) * 0.07;
    currentY += (targetY - currentY) * 0.07;
    if (bg) bg.style.transform = `translate(${currentX * 2}px, ${currentY * 1.5}px)`;
    if (panel) panel.style.transform = `translate(${currentX * 8}px, ${currentY * 6}px)`;
    floats.forEach((el) => {
      const depth = el.classList.contains('depth-front') ? 7 : el.classList.contains('depth-mid') ? 5 : 4;
      el.style.transform = `translate(${currentX * depth}px, ${currentY * depth}px)`;
    });
    coords.forEach((el, i) => {
      el.style.transform = `translate(${currentX * (3 + i)}px, ${currentY * 2}px)`;
    });
    requestAnimationFrame(tick);
  }
  tick();
}

function initUnderstandingTabs() {
  const tabs = document.querySelectorAll('.understanding-tab');
  const scene = document.querySelector('.understanding-scene');
  if (!tabs.length || !scene) return;

  const layers = {
    detect: scene.querySelectorAll('[data-layer="detect"]'),
    classify: scene.querySelectorAll('[data-layer="classify"]'),
    confidence: scene.querySelectorAll('[data-layer="confidence"]'),
  };

  function setMode(mode) {
    tabs.forEach((t) => {
      const active = t.dataset.mode === mode;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    Object.keys(layers).forEach((key) => {
      layers[key].forEach((el) => {
        const show = key === mode;
        el.hidden = !show;
        el.setAttribute('aria-hidden', show ? 'false' : 'true');
      });
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => setMode(tab.dataset.mode));
  });

  setMode('detect');
  ObjectAIDetectionUI?.positionLabels(scene);
}

function initHomeDemo() {
  const demo = document.getElementById('home-demo');
  if (!demo || prefersReducedMotion()) return;

  const status = demo.querySelector('.demo-status');
  const count = demo.querySelector('.demo-count');
  const boxes = demo.querySelectorAll('.demo-scene .demo-box');
  const steps = [
    { text: 'SCANNING...', count: '', show: [] },
    { text: 'SCANNING...', count: '1 OBJECT DETECTED', show: [0] },
    { text: 'SCANNING...', count: '2 OBJECTS DETECTED', show: [0, 1] },
    { text: 'COMPLETE', count: '3 OBJECTS DETECTED', show: [0, 1, 2] },
  ];
  let step = 0;

  function run() {
    const s = steps[step];
    if (status) status.textContent = s.text;
    if (count) {
      count.textContent = s.count;
      count.hidden = !s.count;
    }
    boxes.forEach((box, i) => {
      box.classList.toggle('is-visible', s.show.includes(i));
      box.classList.remove('is-active', 'is-dimmed');
    });
    ObjectAIDetectionUI?.positionLabels(demo.querySelector('.demo-scene'));
    step = (step + 1) % steps.length;
  }

  run();
  setInterval(run, 2600);
}

function initDemoHover() {
  const boxes = document.querySelectorAll('#home-demo .demo-box');
  const tip = document.getElementById('demo-tip');
  if (!boxes.length || !tip) return;

  boxes.forEach((box) => {
    box.addEventListener('mouseenter', () => {
      boxes.forEach((b) => b.classList.toggle('is-dimmed', b !== box));
      box.classList.add('is-active');
      tip.hidden = false;
      tip.classList.add('is-visible');
      tip.innerHTML = `<strong>OBJECT</strong> ${box.dataset.label}<br>CATEGORY: ${box.dataset.category}<br>CONFIDENCE: ${box.dataset.confidence}`;
      const parent = box.offsetParent;
      if (!parent) return;
      const pr = parent.getBoundingClientRect();
      const br = box.getBoundingClientRect();
      tip.style.left = `${Math.min(br.left - pr.left, parent.clientWidth - 160)}px`;
      tip.style.top = `${Math.max(8, br.top - pr.top - 56)}px`;
    });
    box.addEventListener('mouseleave', () => {
      box.classList.remove('is-active');
      boxes.forEach((b) => b.classList.remove('is-dimmed'));
      tip.classList.remove('is-visible');
      tip.hidden = true;
    });
  });
}
