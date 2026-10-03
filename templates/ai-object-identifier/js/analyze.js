/**
 * OBJECT AI — Analyze page: upload, mock CV pipeline, results UI.
 */

const MAX_FILE_BYTES = 50 * 1024 * 1024;
const ACCEPTED_TYPES = {
  'image/jpeg': 'image',
  'image/jpg': 'image',
  'image/png': 'image',
  'image/webp': 'image',
  'video/mp4': 'video',
  'video/quicktime': 'video',
  'video/webm': 'video',
};

const EXT_MAP = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  webm: 'video/webm',
};

const MOCK_OBJECT_POOL = [
  { name: 'Laptop', category: 'Electronics', location: 'Center-left' },
  { name: 'Phone', category: 'Electronics', location: 'Center-right' },
  { name: 'Bottle', category: 'Container', location: 'Lower-center' },
  { name: 'Camera', category: 'Electronics', location: 'Upper-right' },
  { name: 'Chair', category: 'Furniture', location: 'Left' },
  { name: 'Car', category: 'Vehicle', location: 'Center' },
  { name: 'Person', category: 'Human', location: 'Center' },
  { name: 'Cup', category: 'Container', location: 'Lower-right' },
  { name: 'Keyboard', category: 'Electronics', location: 'Lower-left' },
  { name: 'Monitor', category: 'Electronics', location: 'Upper-center' },
];

/**
 * Replace with a real computer vision API call.
 * @param {{ mediaType: 'image'|'video', fileName: string, dataUrl?: string }} input
 * @returns {Promise<{ objects: Array }>}
 */
async function analyzeMedia(input) {
  await delay(400);
  const seed = hashString(input.fileName + (input.dataUrl?.length || 0));
  const count = 3 + (seed % 3);
  const shuffled = [...MOCK_OBJECT_POOL].sort((a, b) => hashString(a.name + seed) - hashString(b.name + seed));
  const picked = shuffled.slice(0, count);

  const objects = picked.map((obj, i) => {
    const confidence = 88 + ((seed + i * 7) % 11);
    const box = generateBoundingBox(seed + i * 13);
    return {
      id: `obj-${i}`,
      name: obj.name,
      category: obj.category,
      confidence,
      location: obj.location,
      count: 1,
      box,
    };
  });

  return { objects: objects.sort((a, b) => b.confidence - a.confidence) };
}

function generateBoundingBox(seed) {
  const w = 12 + (seed % 20);
  const h = 10 + ((seed * 3) % 22);
  const left = 8 + ((seed * 5) % (90 - w));
  const top = 10 + ((seed * 7) % (85 - h));
  return { left, top, width: w, height: h };
}

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return Math.abs(h);
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function resolveMime(file) {
  if (file.type && ACCEPTED_TYPES[file.type]) return file.type;
  const ext = file.name.split('.').pop()?.toLowerCase();
  return ext && EXT_MAP[ext] ? EXT_MAP[ext] : '';
}

function getMediaKind(mime) {
  const kind = ACCEPTED_TYPES[mime];
  return kind || null;
}

const state = {
  file: null,
  objectUrl: null,
  dataUrl: null,
  mediaType: null,
  analysisResult: null,
  savedId: null,
  highlightedId: null,
};

const els = {};

document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('.page-analyze')) return;
  cacheElements();
  bindUpload();
  bindAnalysisActions();
  bindModal();
  handleHistoryDeepLink();
});

function cacheElements() {
  els.uploadSection = document.getElementById('upload-section');
  els.analysisSection = document.getElementById('analysis-section');
  els.resultsSection = document.getElementById('results-section');
  els.dropZone = document.getElementById('drop-zone');
  els.fileInput = document.getElementById('file-input');
  els.emptyState = document.getElementById('empty-state');
  els.previewState = document.getElementById('preview-state');
  els.previewImage = document.getElementById('preview-image');
  els.previewVideo = document.getElementById('preview-video');
  els.metaName = document.getElementById('meta-name');
  els.metaSize = document.getElementById('meta-size');
  els.metaType = document.getElementById('meta-type');
  els.uploadError = document.getElementById('upload-error');
  els.analysisStatus = document.getElementById('analysis-status');
  els.analysisPhase = document.getElementById('analysis-phase');
  els.progressFill = document.getElementById('progress-fill');
  els.progressBar = document.querySelector('.progress-bar');
  els.progressPercent = document.getElementById('progress-percent');
  els.resultFileName = document.getElementById('result-file-name');
  els.resultDate = document.getElementById('result-date');
  els.resultObjectCount = document.getElementById('result-object-count');
  els.resultImage = document.getElementById('result-image');
  els.resultVideo = document.getElementById('result-video');
  els.boundingLayer = document.getElementById('bounding-layer');
  els.objectsList = document.getElementById('objects-list');
  els.modal = document.getElementById('object-detail-modal');
}

function bindUpload() {
  document.getElementById('choose-file-btn')?.addEventListener('click', () => els.fileInput.click());
  els.fileInput?.addEventListener('change', () => {
    const file = els.fileInput.files?.[0];
    if (file) handleFile(file);
  });

  els.dropZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    els.dropZone.classList.add('is-dragover');
  });
  els.dropZone?.addEventListener('dragleave', () => {
    els.dropZone.classList.remove('is-dragover');
  });
  els.dropZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    els.dropZone.classList.remove('is-dragover');
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  });

  els.dropZone?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      els.fileInput.click();
    }
  });

  document.getElementById('remove-file-btn')?.addEventListener('click', resetUpload);
}

function bindAnalysisActions() {
  document.getElementById('analyze-btn')?.addEventListener('click', startAnalysis);
  document.getElementById('new-analysis-btn')?.addEventListener('click', () => {
    resetAll();
    showUploadOnly();
  });
  document.getElementById('save-result-btn')?.addEventListener('click', saveCurrentResult);
}

function bindModal() {
  els.modal?.querySelector('.modal-close')?.addEventListener('click', () => {
    els.modal.close();
    clearHighlight();
  });
  els.modal?.addEventListener('close', clearHighlight);
}

function showError(message) {
  els.uploadError.hidden = false;
  els.uploadError.textContent = message;
}

function clearError() {
  els.uploadError.hidden = true;
  els.uploadError.textContent = '';
}

function handleFile(file) {
  clearError();
  const mime = resolveMime(file);
  const kind = getMediaKind(mime);

  if (!kind) {
    showError('Unsupported file type. Please upload an image or video.');
    return;
  }
  if (file.size > MAX_FILE_BYTES) {
    showError('File is too large. Please choose a smaller file.');
    return;
  }

  revokeObjectUrl();
  state.file = file;
  state.mediaType = kind;
  state.objectUrl = URL.createObjectURL(file);
  state.analysisResult = null;
  state.savedId = null;

  els.emptyState.hidden = true;
  els.previewState.hidden = false;

  els.metaName.textContent = file.name;
  els.metaSize.textContent = ObjectAI.formatFileSize(file.size);
  els.metaType.textContent = kind === 'image' ? 'Image' : 'Video';

  if (kind === 'image') {
    els.previewVideo.hidden = true;
    els.previewImage.hidden = false;
    els.previewImage.src = state.objectUrl;
    readDataUrl(file).then((url) => {
      state.dataUrl = url;
    });
  } else {
    els.previewImage.hidden = true;
    els.previewVideo.hidden = false;
    els.previewVideo.src = state.objectUrl;
    state.dataUrl = null;
    if (file.size <= 8 * 1024 * 1024) {
      readDataUrl(file).then((url) => {
        state.dataUrl = url;
      });
    }
  }
}

function readDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function revokeObjectUrl() {
  if (state.objectUrl) {
    URL.revokeObjectURL(state.objectUrl);
    state.objectUrl = null;
  }
}

function resetUpload() {
  clearError();
  els.fileInput.value = '';
  revokeObjectUrl();
  state.file = null;
  state.dataUrl = null;
  state.mediaType = null;
  els.previewImage.removeAttribute('src');
  els.previewVideo.removeAttribute('src');
  els.emptyState.hidden = false;
  els.previewState.hidden = true;
}

function resetAll() {
  resetUpload();
  state.analysisResult = null;
  state.savedId = null;
  els.objectsList.innerHTML = '';
  els.boundingLayer.innerHTML = '';
  document.getElementById('save-toast')?.setAttribute('hidden', '');
}

function showUploadOnly() {
  els.uploadSection.hidden = false;
  els.analysisSection.hidden = true;
  els.resultsSection.hidden = true;
}

const PROGRESS_STAGES = [
  { until: 30, status: 'SCANNING VISUAL', phase: 'Scanning visual content' },
  { until: 65, status: 'DETECTING OBJECTS', phase: 'Detecting objects' },
  { until: 90, status: 'CLASSIFYING', phase: 'Classifying objects' },
  { until: 100, status: 'GENERATING RESULTS', phase: 'Preparing results' },
];

async function startAnalysis() {
  if (!state.file || !state.mediaType) return;

  els.uploadSection.hidden = true;
  els.resultsSection.hidden = true;
  els.analysisSection.hidden = false;
  setupAnalysisPreview();

  const analysisPromise = analyzeMedia({
    mediaType: state.mediaType,
    fileName: state.file.name,
    dataUrl: state.dataUrl,
  });

  await runProgressSimulation();

  const result = await analysisPromise;
  const analyzedAt = new Date().toISOString();

  state.analysisResult = {
    id: ObjectAI.generateId(),
    fileName: state.file.name,
    fileSize: state.file.size,
    mediaType: state.mediaType,
    mime: resolveMime(state.file),
    analyzedAt,
    objects: result.objects,
    thumbnail: state.mediaType === 'image' ? state.dataUrl : null,
    mediaDataUrl: state.dataUrl || null,
  };

  els.analysisSection.hidden = true;
  renderResults(state.analysisResult);

  if (ObjectAI.getAutoSave()) {
    persistResult(state.analysisResult);
    showSaveToast();
  }
}

function runProgressSimulation() {
  return new Promise((resolve) => {
    let progress = 0;
    const tick = () => {
      progress += 1.2 + Math.random() * 2.5;
      if (progress > 100) progress = 100;

      const stage = PROGRESS_STAGES.find((s) => progress <= s.until) || PROGRESS_STAGES[3];
      els.analysisStatus.textContent = stage.status;
      els.analysisPhase.textContent = stage.phase;
      els.progressFill.style.width = `${progress}%`;
      els.progressPercent.textContent = `${Math.round(progress)}%`;
      els.progressBar?.setAttribute('aria-valuenow', String(Math.round(progress)));

      if (progress >= 100) {
        resolve();
        return;
      }
      requestAnimationFrame(() => setTimeout(tick, 45));
    };
    tick();
  });
}

function renderResults(data, fromHistory = false) {
  document.getElementById('video-unavailable-note')?.remove();
  els.resultsSection.hidden = false;
  els.resultFileName.textContent = data.fileName;
  els.resultDate.textContent = ObjectAI.formatDate(data.analyzedAt);
  els.resultObjectCount.textContent = String(data.objects.length);
  const summaryCount = document.getElementById('result-summary-count');
  if (summaryCount) {
    summaryCount.textContent = `${data.objects.length} OBJECT${data.objects.length === 1 ? '' : 'S'} DETECTED`;
  }

  const mediaSrc = data.mediaType === 'image'
    ? (data.thumbnail || data.mediaDataUrl)
    : data.mediaDataUrl;

  if (data.mediaType === 'image') {
    els.resultVideo.hidden = true;
    els.resultImage.hidden = false;
    els.resultImage.src = mediaSrc || '';
  } else {
    els.resultImage.hidden = true;
    els.resultVideo.hidden = !mediaSrc;
    if (mediaSrc) {
      els.resultVideo.src = mediaSrc;
    } else {
      els.resultVideo.removeAttribute('src');
      if (!document.getElementById('video-unavailable-note')) {
        const note = document.createElement('p');
        note.id = 'video-unavailable-note';
        note.className = 'drop-meta';
        note.style.padding = '2rem';
        note.textContent = 'Video preview unavailable for this saved item (file was too large to store locally). Detection results are still shown below.';
        els.resultVideo.parentElement?.appendChild(note);
      }
    }
  }

  renderBoundingBoxes(data.objects);
  renderObjectCards(data.objects);

  if (fromHistory) {
    state.analysisResult = data;
    state.savedId = data.id;
    els.uploadSection.hidden = true;
  }
}

function setupAnalysisPreview() {
  const wrap = document.getElementById('analysis-preview-wrap');
  const img = document.getElementById('analysis-preview-img');
  const vid = document.getElementById('analysis-preview-video');
  if (!wrap) return;
  wrap.hidden = false;
  if (state.mediaType === 'image' && state.objectUrl) {
    img.hidden = false;
    vid.hidden = true;
    img.src = state.objectUrl;
  } else if (state.objectUrl) {
    img.hidden = true;
    vid.hidden = false;
    vid.src = state.objectUrl;
  }
}

function renderBoundingBoxes(objects) {
  els.boundingLayer.innerHTML = '';
  objects.forEach((obj, i) => {
    const box = document.createElement('div');
    box.className = 'bbox bbox-enter';
    box.dataset.objectId = obj.id;
    box.style.left = `${obj.box.left}%`;
    box.style.top = `${obj.box.top}%`;
    box.style.width = `${obj.box.width}%`;
    box.style.height = `${obj.box.height}%`;
    box.style.animationDelay = `${i * 0.12}s`;
    const label = document.createElement('span');
    label.className = 'bbox-label';
    label.textContent = `${obj.name} · ${obj.confidence}%`;
    box.appendChild(label);
    const coord = document.createElement('span');
    coord.className = 'bbox-coord tech-label';
    coord.textContent = `x:${Math.round(obj.box.left * 4)} y:${Math.round(obj.box.top * 4)}`;
    box.appendChild(coord);
    els.boundingLayer.appendChild(box);
  });
  window.ObjectAIDetectionUI?.positionLabels(els.boundingLayer.parentElement);
}

function renderObjectCards(objects) {
  els.objectsList.innerHTML = '';
  objects.forEach((obj) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'object-card';
    btn.innerHTML = `
      <p class="object-card-name">${escapeHtml(obj.name)}</p>
      <p class="object-card-pct">${obj.confidence}%</p>
      <p class="object-card-category">${escapeHtml(obj.category)}</p>
      <div class="confidence-bar-wrap" aria-hidden="true">
        <div class="confidence-bar" data-confidence="${obj.confidence}"></div>
      </div>
    `;
    btn.addEventListener('click', () => {
      highlightObject(obj.id);
      openObjectDetail(obj);
    });
    li.appendChild(btn);
    els.objectsList.appendChild(li);
  });

  requestAnimationFrame(() => {
    document.querySelectorAll('.confidence-bar').forEach((bar) => {
      const val = bar.getAttribute('data-confidence');
      bar.style.width = `${val}%`;
    });
  });
}

function openObjectDetail(obj) {
  highlightObject(obj.id);
  document.getElementById('modal-object-name').textContent = obj.name;
  document.getElementById('modal-confidence').textContent = `${obj.confidence}%`;
  document.getElementById('modal-category').textContent = obj.category;
  document.getElementById('modal-count').textContent = `${obj.count} object${obj.count > 1 ? 's' : ''}`;
  document.getElementById('modal-location').textContent = obj.location;
  els.modal.showModal();
}

function highlightObject(id) {
  state.highlightedId = id;
  els.boundingLayer.querySelectorAll('.bbox').forEach((el) => {
    el.classList.toggle('is-highlighted', el.dataset.objectId === id);
  });
}

function clearHighlight() {
  state.highlightedId = null;
  els.boundingLayer.querySelectorAll('.bbox').forEach((el) => el.classList.remove('is-highlighted'));
}

function persistResult(data) {
  const toStore = {
    ...data,
    thumbnail: data.mediaType === 'image' ? data.thumbnail || data.mediaDataUrl : data.thumbnail,
    mediaDataUrl:
      data.mediaType === 'image'
        ? data.thumbnail || data.mediaDataUrl
        : state.dataUrl || (data.mediaDataUrl?.startsWith('data:') ? data.mediaDataUrl : null),
  };
  ObjectAI.saveAnalysis(toStore);
  state.savedId = toStore.id;
}

function saveCurrentResult() {
  if (!state.analysisResult) return;
  try {
    persistResult(state.analysisResult);
    showSaveToast();
  } catch {
    window.alert('Could not save result. Storage may be full for large files.');
  }
}

function showSaveToast() {
  const toast = document.getElementById('save-toast');
  toast.hidden = false;
  setTimeout(() => {
    toast.hidden = true;
  }, 3000);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function handleHistoryDeepLink() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;

  const record = ObjectAI.getAnalysisById(id);
  if (!record) return;

  els.uploadSection.hidden = true;
  els.analysisSection.hidden = true;
  renderResults(record, true);
}

window.analyzeMedia = analyzeMedia;
