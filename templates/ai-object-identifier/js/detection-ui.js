/**
 * OBJECT AI — Detection label positioning (avoid overlaps).
 */

window.ObjectAIDetectionUI = {
  positionLabels(root) {
    const container = typeof root === 'string' ? document.querySelector(root) : root;
    if (!container) return;

    const boxes = container.querySelectorAll('.det-box, .demo-box, .bbox');
    boxes.forEach((box) => {
      box.classList.remove('label-bottom', 'label-right');

      const rect = box.getBoundingClientRect();
      const parent = box.offsetParent?.getBoundingClientRect();
      if (!parent || !rect.width) return;

      const relTop = rect.top - parent.top;
      if (relTop < 22) box.classList.add('label-bottom');

      const relRight = parent.right - rect.right;
      if (relRight < 8 && rect.width > parent.width * 0.35) box.classList.add('label-right');
    });

    const labels = [...container.querySelectorAll('.det-box, .demo-box')];
    for (let i = 0; i < labels.length; i++) {
      for (let j = i + 1; j < labels.length; j++) {
        if (elementsOverlap(labels[i], labels[j])) {
          labels[j].classList.add('label-bottom');
        }
      }
    }
  },
};

function elementsOverlap(a, b) {
  const ra = a.getBoundingClientRect();
  const rb = b.getBoundingClientRect();
  const pad = 4;
  return !(
    ra.right < rb.left - pad ||
    ra.left > rb.right + pad ||
    ra.bottom < rb.top - pad ||
    ra.top > rb.bottom + pad
  );
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.vision-scene, .demo-scene, .understanding-scene').forEach((el) => {
    ObjectAIDetectionUI.positionLabels(el);
  });
});
