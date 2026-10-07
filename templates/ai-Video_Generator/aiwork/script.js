const app = document.getElementById("app");
const modalRoot = document.getElementById("modalRoot");
const toastStack = document.getElementById("toastStack");
const siteHeader = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const menuClose = document.getElementById("menuClose");

const state = {
  currentPage: "home",
  prompt: localStorage.getItem("ff_prompt") || "",
  style: localStorage.getItem("ff_style") || "Cinematic",
  ratio: localStorage.getItem("ff_ratio") || "16:9",
  duration: localStorage.getItem("ff_duration") || "5 sec",
  camera: localStorage.getItem("ff_camera") || "Slow Zoom",
  theme: localStorage.getItem("ff_theme") || "light",
  loggedIn: localStorage.getItem("ff_loggedIn") === "true",
  favorites: JSON.parse(localStorage.getItem("ff_favorites") || "[]"),
  projects: JSON.parse(localStorage.getItem("ff_projects") || "[]"),
  scenes: [
    {id:1,title:"Opening",desc:"Establishing shot",duration:"5 sec"},
    {id:2,title:"The Journey",desc:"Main character enters the scene",duration:"5 sec"},
    {id:3,title:"The Reveal",desc:"A cinematic close-up",duration:"4 sec"},
    {id:4,title:"Final Frame",desc:"Wide cinematic ending",duration:"5 sec"}
  ]
};

const routes = ["home","create","director","storyboard","timeline","camera","projects","discover","pricing","login"];

function save() {
  localStorage.setItem("ff_prompt", state.prompt);
  localStorage.setItem("ff_style", state.style);
  localStorage.setItem("ff_ratio", state.ratio);
  localStorage.setItem("ff_duration", state.duration);
  localStorage.setItem("ff_camera", state.camera);
  localStorage.setItem("ff_theme", state.theme);
  localStorage.setItem("ff_favorites", JSON.stringify(state.favorites));
  localStorage.setItem("ff_projects", JSON.stringify(state.projects));
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastStack.appendChild(toast);
  setTimeout(() => toast.classList.add("out"), 2500);
  setTimeout(() => toast.remove(), 2800);
}

function icon(name) {
  const icons = {
    play:'▶',pause:'Ⅱ',edit:'✎',copy:'⧉',trash:'⌫',plus:'+',download:'↓',heart:'♡',search:'⌕'
  };
  return icons[name] || "•";
}

function bg() {
  return `<div class="cinematic-bg" aria-hidden="true"><div class="mountain"></div><div class="light-orb"></div></div>`;
}

function commonHeader(title, text) {
  return `<div class="section-heading"><h1>${title}</h1><p>${text}</p></div>`;
}

function sceneThumb(extra="") {
  return `<div class="scene-thumb" ${extra}></div>`;
}
function sceneVideo(id, className="scene-video") {
  const n=Math.max(1,Math.min(4,Number(id)||1));
  return `<video class="${className}" src="assets/scenes/scene${n}.mp4" muted loop playsinline preload="metadata" aria-label="Scene ${n} preview"></video>`;
}
function sceneVisual(s,className="scene-video") { return sceneVideo(s?.id||1,className); }
function generatorCard() {
  return `
  <section class="glass-generator" id="generatorCard">
    <h3>Create your video</h3>
    <p class="sub">Describe the scene you want to bring to life.</p>
    <div class="prompt-box">
      <textarea id="mainPrompt" placeholder="Describe your video... e.g. A cinematic sunset over a futuristic city, slow camera movement, dramatic lighting.">${escapeHtml(state.prompt)}</textarea>
      <div class="generator-controls">
        <label class="control-chip">✦ Style
          <select id="styleSelect"><option>Cinematic</option><option>Realistic</option><option>Anime</option><option>3D Animation</option><option>Minimal</option><option>Documentary</option></select>
        </label>
        <label class="control-chip">▣ Ratio
          <select id="ratioSelect"><option>16:9</option><option>9:16</option><option>1:1</option></select>
        </label>
        <label class="control-chip">◷ Duration
          <select id="durationSelect"><option>5 sec</option><option>10 sec</option><option>15 sec</option></select>
        </label>
        <label class="control-chip">⌁ Camera
          <select id="cameraSelect"><option>Static</option><option>Slow Zoom</option><option>Pan Left</option><option>Pan Right</option><option>Orbit</option><option>Tracking Shot</option></select>
        </label>
      </div>
    </div>
    <div class="generator-footer">
      <button class="attach-btn" id="attachBtn">＋ Add image</button>
      <button class="btn btn-dark" id="generateBtn">Generate Video →</button>
    </div>
  </section>`;
}

function wireGenerator() {
  const prompt = document.getElementById("mainPrompt");
  if (!prompt) return;
  const style = document.getElementById("styleSelect"), ratio = document.getElementById("ratioSelect");
  const duration = document.getElementById("durationSelect"), camera = document.getElementById("cameraSelect");
  style.value=state.style; ratio.value=state.ratio; duration.value=state.duration; camera.value=state.camera;
  prompt.addEventListener("input", e=>{state.prompt=e.target.value;save()});
  style.addEventListener("change",e=>{state.style=e.target.value;save()});
  ratio.addEventListener("change",e=>{state.ratio=e.target.value;save()});
  duration.addEventListener("change",e=>{state.duration=e.target.value;save()});
  camera.addEventListener("change",e=>{state.camera=e.target.value;save()});
  document.getElementById("attachBtn").onclick=()=>showToast("Demo image attachment added.");
  document.getElementById("generateBtn").onclick=()=>simulateGeneration(document.getElementById("generateBtn"));
}

function simulateGeneration(button) {
  const prompt = state.prompt.trim();
  if (!prompt) { showToast("Write a video prompt first."); document.getElementById("mainPrompt")?.focus(); return; }
  const original = button.innerHTML;
  const steps=["Creating...","Analyzing prompt...","Building scenes...","Rendering video...","Finalizing..."];
  let i=0; button.disabled=true;
  const timer=setInterval(()=>{
    button.textContent=steps[i++];
    if(i===steps.length){clearInterval(timer);button.disabled=false;button.innerHTML=original;addGeneratedProject(prompt);showGenerationModal(prompt)}
  },520);
}

function addGeneratedProject(prompt){
  const project={id:Date.now(),title:prompt.length>34?prompt.slice(0,34)+"…":prompt,date:new Date().toLocaleDateString(),duration:state.duration,status:"Generated"};
  state.projects.unshift(project); state.projects=state.projects.slice(0,12); save();
}

function showGenerationModal(prompt){
  modal(`
    <div class="modal-head"><div><h3>Your video is ready</h3><span style="font-size:10px;color:#777">Frontend generation simulation complete</span></div><button class="modal-close" data-close>×</button></div>
    <div class="modal-video">${sceneThumb()}<div class="preview-controls"><button id="modalPlay">▶</button><span>0:00</span><div class="bar"><i></i></div><span>${state.duration.replace(" sec","s")}</span><button>⛶</button></div></div>
    <div class="modal-video-info"><div><b>${escapeHtml(prompt.slice(0,60))}</b><span> · ${state.style} · ${state.ratio}</span></div><div style="display:flex;gap:7px"><button class="btn btn-ghost compact" id="downloadVideo">↓ Download</button><button class="btn btn-dark compact" id="regenerateVideo">Regenerate</button></div></div>
  `);
  document.getElementById("modalPlay").onclick=(e)=>{e.target.textContent=e.target.textContent==="▶"?"Ⅱ":"▶";showToast(e.target.textContent==="Ⅱ"?"Preview playing":"Preview paused")};
  document.getElementById("downloadVideo").onclick=()=>showToast("Demo video download prepared.");
  document.getElementById("regenerateVideo").onclick=()=>{closeModal();showPage("create");setTimeout(()=>document.getElementById("generateBtn")?.click(),100)};
}

function homePage(){
  return `<section class="page hero-page">${bg()}<div class="hero-content">
    <div class="pill"><strong>Now</strong> FrameFlow is ready for your next story</div>
    <h1 class="hero-title">Turn your ideas into cinematic stories.</h1>
    <p class="hero-copy">Create stunning videos from simple prompts, scenes, camera direction, and sound — all inside one creative workspace.</p>
    <div class="hero-actions"><button class="btn btn-dark" data-route="create">Create a Video →</button><button class="btn btn-ghost" data-route="discover">Explore Discover</button></div>
    <div class="hero-generator">${generatorCard()}</div>
    <div class="feature-strip">
      <div class="feature-card"><b>Scene Direction</b><span>Shape every shot visually.</span></div>
      <div class="feature-card"><b>Timeline Control</b><span>Build a complete sequence.</span></div>
      <div class="feature-card"><b>Cinematic Camera</b><span>Direct movement and focus.</span></div>
      <div class="feature-card"><b>Sound Design</b><span>Layer music and voice.</span></div>
    </div>
  </div></section>`;
}

function createPage(){
  return `<section class="page">${commonHeader("Video Studio","Build a complete video from prompt to final scene.")}<div class="workspace create-workspace"><div class="workspace-head"><div class="workspace-title">Untitled cinematic project</div><div class="workspace-tools"><button class="btn btn-ghost compact" data-route="storyboard">Storyboard</button><button class="btn btn-dark compact" id="studioGenerate">Generate Video →</button></div></div><div class="workspace-body create-workspace-body"><div class="create-layout"><div class="create-video-column"><div class="preview-panel">${createPreviewVideo()}<div class="preview-controls"><button id="studioPlay">▶</button><span>0:00 / ${state.duration.replace(" sec","")}s</span><div class="bar"><i></i></div><button>⛶</button></div></div></div><aside class="create-side-card"><div class="create-tabs"><button class="create-tab active" data-create-tab="controls">Creative Controls</button><button class="create-tab" data-create-tab="scenes">Scenes</button></div><div class="create-tab-panel active" data-create-panel="controls"><div class="settings-card-inner">${settingsForm()}<button class="btn btn-dark" id="studioGenerate2" style="width:100%;margin-top:5px">Generate Video →</button></div></div><div class="create-tab-panel" data-create-panel="scenes"><div class="scenes-panel-head"><div><h3>Scenes</h3><p>Arrange and refine your cinematic sequence.</p></div><button class="mini-btn" id="addScene">＋ Add</button></div><div class="scene-stack">${state.scenes.map(sceneCard).join("")}</div></div></aside></div></div></div></section>`;
}
function settingsForm(){
 return `<h3>Creative controls</h3><div class="field"><label>Prompt</label><textarea id="studioPrompt" placeholder="Describe your video...">${escapeHtml(state.prompt)}</textarea></div><div class="field"><label>Style</label><select id="studioStyle"><option>Cinematic</option><option>Realistic</option><option>Anime</option><option>3D Animation</option><option>Minimal</option><option>Documentary</option></select></div><div class="field"><label>Aspect ratio</label><select id="studioRatio"><option>16:9</option><option>9:16</option><option>1:1</option></select></div><div class="field"><label>Duration</label><select id="studioDuration"><option>5 sec</option><option>10 sec</option><option>15 sec</option></select></div><div class="field"><label>Camera motion</label><select id="studioCamera"><option>Static</option><option>Slow Zoom</option><option>Pan Left</option><option>Pan Right</option><option>Orbit</option><option>Tracking Shot</option></select></div><div class="switch-row">Background music <button class="switch on" data-switch><i></i></button></div><div class="switch-row">Voiceover <button class="switch" data-switch><i></i></button></div>`;
}

function sceneCard(s){
 return `<div class="scene-card" data-scene-card="${s.id}"><button class="scene-preview-trigger" type="button" data-scene-preview="${s.id}" aria-label="Preview ${escapeHtml(s.title)}">${sceneVisual(s)}<span>▶</span></button><div class="scene-info"><b>Scene ${s.id} · ${escapeHtml(s.title)}</b><p>${escapeHtml(s.desc)} · ${s.duration}</p></div><div class="scene-actions"><button class="mini-btn" data-scene-preview="${s.id}">▶ Preview</button><button class="mini-btn" data-scene-edit="${s.id}">✎</button><button class="mini-btn" data-scene-copy="${s.id}">⧉</button><button class="mini-btn danger" data-scene-delete="${s.id}">⌫</button></div></div>`;
}

const FRAMEFLOW_THEME_CUTS = [
  "assets/frameflow_cuts/scene1.mp4",
  "assets/frameflow_cuts/scene2.mp4",
  "assets/frameflow_cuts/scene3.mp4",
  "assets/frameflow_cuts/scene4.mp4"
];
const FRAMEFLOW_PAGE_CUTS = {
  create: "assets/frameflow_cuts/create.mp4",
  timeline: "assets/frameflow_cuts/timeline.mp4",
  camera: "assets/frameflow_cuts/camera.mp4"
};
function localFiveSecondVideo(src, className="frameflow-theme-video", controls=false) {
  return `<video class="${className}" src="${src}" ${controls ? "controls" : ""} autoplay muted loop playsinline preload="auto" aria-label="FrameFlow 5 second cinematic preview"></video>`;
}
function directorSceneVideo(id) {
  const n=((Number(id)||1)-1)%FRAMEFLOW_THEME_CUTS.length;
  return localFiveSecondVideo(FRAMEFLOW_THEME_CUTS[n],"scene-video director-scene-video");
}
function storySceneVideo(index) {
  const n=((Number(index)||0)%FRAMEFLOW_THEME_CUTS.length);
  return localFiveSecondVideo(FRAMEFLOW_THEME_CUTS[n],"scene-video story-scene-video");
}
function createPreviewVideo() { return localFiveSecondVideo(FRAMEFLOW_PAGE_CUTS.create,"create-theme-video"); }
function timelinePreviewVideo() { return localFiveSecondVideo(FRAMEFLOW_PAGE_CUTS.timeline,"timeline-theme-video"); }
function cameraPreviewVideo() { return localFiveSecondVideo(FRAMEFLOW_PAGE_CUTS.camera,"camera-theme-video"); }

function directorSceneCard(s){
 return `<div class="scene-card director-scene-card" data-scene-card="${s.id}"><button class="scene-preview-trigger" type="button" data-scene-preview="${s.id}" aria-label="Preview ${escapeHtml(s.title)}">${directorSceneVideo(s.id)}<span>5 sec · Preview</span></button><div class="scene-info"><b>Scene ${s.id} · ${escapeHtml(s.title)}</b><p>${escapeHtml(s.desc)} · ${s.duration}</p></div><div class="scene-actions"><button class="mini-btn" data-scene-preview="${s.id}">▶ Preview</button><button class="mini-btn" data-scene-edit="${s.id}">✎</button><button class="mini-btn" data-scene-copy="${s.id}">⧉</button><button class="mini-btn danger" data-scene-delete="${s.id}">⌫</button></div></div>`;
}

function directorPage(){
 return `<section class="page">${commonHeader("AI Director","Turn one idea into a complete cinematic sequence.")}<div class="workspace"><div class="workspace-head"><div class="workspace-title">Scene-to-scene director</div><button class="btn btn-dark compact" id="generateScenes">Generate Scenes →</button></div><div class="workspace-main"><div class="ai-layout"><div><div class="director-prompt"><textarea id="directorPrompt" placeholder="Example: A girl walks through a futuristic city at night, exploring neon streets, then looks at the skyline from a rooftop.">${escapeHtml(state.prompt)}</textarea><div class="director-actions"><button class="btn btn-dark compact" id="directorGenerate">Generate Scenes →</button></div></div><div class="scene-grid" id="directorScenes">${state.scenes.map(directorSceneCard).join("")}</div></div><aside class="scene-settings"><h3>Scene settings</h3><div class="field"><label>Selected scene</label><select><option>Scene 01</option><option>Scene 02</option><option>Scene 03</option><option>Scene 04</option></select></div><div class="field"><label>Description</label><textarea>Establish the visual world and opening movement.</textarea></div><div class="field"><label>Duration</label><select><option>5 seconds</option><option>8 seconds</option><option>10 seconds</option></select></div><div class="field"><label>Style</label><select><option>Cinematic</option><option>Realistic</option><option>Documentary</option></select></div><button class="btn btn-ghost" id="regenScene" style="width:100%">Regenerate Scene</button></aside></div></div></div></section>`;
}

function storyboardPage(){
 return `<section class="page">${commonHeader("Storyboard","Arrange and refine the visual story before you render it.")}<div class="workspace storyboard-workspace"><div class="workspace-head"><div class="workspace-title">${state.scenes.length} scenes · ${state.duration} each</div><div class="workspace-tools"><button class="btn btn-ghost compact" id="playStoryboard">▶ Play Storyboard</button><button class="btn btn-dark compact" id="addStoryboardScene">＋ Add Scene</button></div></div><div class="workspace-main"><div class="storyboard-grid" id="storyboardGrid">${state.scenes.map((s,i)=>`<div class="story-card" draggable="true" data-story="${s.id}"><button class="story-preview-trigger" type="button" data-scene-preview="${s.id}" aria-label="Preview ${escapeHtml(s.title)}">${storySceneVideo(i)}<span>5 sec · Preview</span></button><div class="story-meta"><b>${String(i+1).padStart(2,"0")} · ${escapeHtml(s.title)}</b><p>${escapeHtml(s.desc)}</p><div class="story-actions"><button class="mini-btn" data-scene-preview="${s.id}">▶ Preview</button><button class="mini-btn" data-scene-edit="${s.id}">✎ Edit</button><button class="mini-btn" data-scene-copy="${s.id}">⧉</button><button class="mini-btn danger" data-scene-delete="${s.id}">⌫</button></div></div></div>`).join("")}<button class="story-card add-story-card" id="addStoryboardScene2" type="button"><span>＋ Add Scene</span></button></div></div></div></section>`;
}

function timelinePage(){
 const sceneClips=state.scenes.map((s,i)=>`<button type="button" class="clip timeline-scene-clip" data-timeline-scene="${i}" data-start="${i*5}" aria-label="Jump to Scene 0${i+1}">Scene 0${i+1}<small style="display:block;opacity:.65">${s.duration}</small></button>`).join("");
 return `<section class="page">${commonHeader("Timeline Editor","Fine-tune timing, pacing, audio and text across your video.")}<div class="workspace"><div class="workspace-head"><div class="workspace-title">00:20 total duration</div><div class="workspace-tools"><button class="btn btn-ghost compact" id="timelinePlay">▶ Play</button><button class="btn btn-dark compact" id="exportTimeline">Export</button></div></div><div class="workspace-main"><div class="preview-panel" style="min-height:310px;max-width:650px;margin:auto">${timelinePreviewVideo()}<div class="preview-controls"><button id="timelinePreviewPlay">▶</button><span id="timelineTime">00:00 / 00:20</span><div class="bar"><i id="timelinePreviewBar" style="width:0%"></i></div><button id="timelineFullscreen">⛶</button></div></div><div class="timeline-wrap" style="margin-top:18px"><div class="timeline-header"><button class="mini-btn" id="timelineZoomOut" type="button" aria-label="Zoom timeline out">−</button><button class="mini-btn" id="timelineZoomIn" type="button" aria-label="Zoom timeline in">＋</button><div class="timeline-scale" id="timelineScale"><span>0s</span><span>5s</span><span>10s</span><span>15s</span><span>20s</span></div></div><div class="track"><div class="track-label">Video</div><div class="track-content timeline-video-track" id="timelineVideoTrack">${sceneClips}<div class="playhead" id="timelinePlayhead" tabindex="0" role="slider" aria-label="Timeline position" aria-valuemin="0" aria-valuemax="20" aria-valuenow="0"></div></div></div><div class="track"><div class="track-label">Audio</div><div class="track-content"><button type="button" class="clip audio timeline-audio-clip" id="timelineAudioClip">Background Music · Cinematic Rise</button></div></div><div class="track"><div class="track-label">Voiceover</div><div class="track-content"><div class="clip voice" style="min-width:250px">Voiceover 01</div><div class="clip voice" style="min-width:170px">Voiceover 02</div></div></div><div class="track"><div class="track-label">Text</div><div class="track-content"><button type="button" class="clip timeline-text-clip" id="timelineTextClip">A new journey begins.</button></div></div></div></div></div></section>`;
}

function cameraPage(){
 return `<section class="page">${commonHeader("Camera Director","Direct the virtual camera to shape the perfect shot.")}<div class="workspace camera-page-workspace"><div class="workspace-head"><div class="workspace-title">Camera movement · Scene 02</div><button class="btn btn-ghost compact" id="resetCamera">Reset Camera</button></div><div class="workspace-body camera-workspace-body"><div class="camera-layout"><div class="camera-video-column"><div class="preview-panel">${cameraPreviewVideo()}<div class="preview-controls"><button id="cameraPlay">▶</button><span id="cameraTime">0:00 / 5s</span><div class="bar"><i id="cameraProgress" style="width:0%"></i></div><button id="cameraFullscreen">⛶</button></div></div></div><aside class="camera-controls"><div class="dial"><span class="dial-arrow up">↑</span><span class="dial-arrow down">↓</span><span class="dial-arrow left">←</span><span class="dial-arrow right">→</span><div class="dial-center">●</div></div>${["Zoom","Pan X","Pan Y","Tilt","Camera Shake","Focus"].map((x,i)=>`<div class="slider-row"><label><span>${x}</span><span id="val${i}">${i?0:1}x</span></label><input type="range" min="0" max="100" value="${i?35:50}" data-slider="${i}"></div>`).join("")}<div class="field"><label>Camera motion</label><select id="cameraMotion"><option>Smooth</option><option>Dynamic</option><option>Handheld</option><option>Locked</option></select></div><div class="switch-row">Depth of field <button class="switch on" data-switch><i></i></button></div></aside></div></div></div></section>`;
}

function projectsPage(){
 const projects=state.projects.length?state.projects:[
  {id:1,title:"Mountain Escape",date:"Today",duration:"00:15",status:"Generated"},
  {id:2,title:"Midnight Drive",date:"Yesterday",duration:"00:20",status:"Draft"},
  {id:3,title:"Ocean Dreams",date:"3 days ago",duration:"00:12",status:"Generated"}
 ];
 return `<section class="page">${commonHeader("My Projects","Manage your videos, drafts, scenes and finished stories.")}<div class="dashboard-tabs"><button class="active">All Projects</button><button>Drafts</button><button>Generated</button><button>Favorites</button><button id="newProject">＋ New Project</button></div><div class="projects-grid">${projects.map(p=>`<article class="project-card">${sceneThumb()}<div class="project-body"><b>${escapeHtml(p.title)}</b><p>${escapeHtml(p.date)} · ${escapeHtml(p.duration)} · ${escapeHtml(p.status)}</p><div class="project-actions"><button class="mini-btn" data-project-play="${p.id}">▶ Play</button><button class="mini-btn" data-route="create">✎ Edit</button><button class="mini-btn" data-project-copy="${p.id}">⧉</button><button class="mini-btn danger" data-project-delete="${p.id}">⌫</button></div></div></article>`).join("")}</div></section>`;
}

const discoverItems=[
 ["Neon Tokyo","Luna Vale","Cinematic","https://images.pexels.com/photos/33879836/pexels-photo-33879836.jpeg?cs=srgb&dl=pexels-jakobandersson-33879836.jpg&fm=jpg"],
 ["Golden Hour","Aria Studio","Nature","https://images.pexels.com/photos/29447967/pexels-photo-29447967.jpeg?cs=srgb&dl=pexels-michael-pointner-134459625-29447967.jpg&fm=jpg"],
 ["Ocean Dreams","Mika Chen","Travel","https://www.worldplacesexplained.com/r2/og/places/triglav-national-park-full.webp"],
 ["Future Architecture","North Lab","Architecture","https://cdn.fondecranvip.com/2025/06/3PJqufsU-fond-decran-Orange-19.webp"],
 ["Desert Motion","Kai Films","Cinematic","https://images.rawpixel.com/image_social_landscape/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI1LTA3L3NyLWltYWdlLTE3MDYyNS1iZTE4LXMtMTcyMS5qcGc.jpg"],
 ["Midnight Drive","NOVA","Fashion","https://img.goodfon.com/original/2048x1326/7/80/gory-tuman-les-zakat-vecher.jpg"],
 ["Dream Sequence","Mori Studio","Animation","https://soravideo.art/images/nano-banana-pro/use-case-landscape-nature.webp"],
 ["Urban Bloom","Frame Lab","Documentary","https://images.pexels.com/photos/32151458/pexels-photo-32151458.jpeg?cs=srgb&dl=pexels-ahmetyuksek-32151458.jpg&fm=jpg"]
];
function discoverPage(){
 return `<section class="page">${commonHeader("Discover","Explore cinematic stories created by the FrameFlow community.")}<div class="discover-toolbar"><button class="filter active" data-filter="All">All</button>${["Cinematic","Nature","Travel","Animation","Fashion","Architecture","Documentary"].map(x=>`<button class="filter" data-filter="${x}">${x}</button>`).join("")}</div><div class="discover-grid" id="discoverGrid">${discoverItems.map((x,i)=>discoverCard(x,i)).join("")}</div></section>`;
}
function discoverCard(x,i){
 const liked=state.favorites.includes(x[0]);
 return `<article class="discover-card" data-category="${x[2]}"><div class="discover-thumb"><img src="${x[3]}" alt="${x[0]} preview" loading="lazy"><button class="play" data-preview="${i}">▶</button></div><div class="discover-body"><b>${x[0]}</b><div class="discover-meta"><span>${x[1]} · ${x[2]}</span><button class="like-btn ${liked?"liked":""}" data-like="${x[0]}">♡</button></div></div></article>`;
}

function pricingPage(){
 return `<section class="page">${commonHeader("Create without limits.","Choose the plan that fits your creative workflow.")}<div class="pricing-grid">${[
 ["FREE","$0",["10 generations / month","720p exports","Basic styles","Community Discover"],"Start Free"],
 ["PRO","$19",["200 generations / month","1080p exports","All styles","Priority generation","Commercial use"],"Get Pro"],
 ["CREATOR","$49",["Unlimited projects","4K exports","Advanced controls","Priority rendering","Commercial use","Early access"],"Start Creating"]
].map((p,i)=>`<article class="price-card ${i===1?"pro":""}">${i===1?'<span class="popular">MOST POPULAR</span>':""}<h3>${p[0]}</h3><div class="price">${p[1]}<small>/ month</small></div><ul class="features">${p[2].map(f=>`<li>${f}</li>`).join("")}</ul><button class="btn ${i===1?"btn-dark":"btn-ghost"}" data-checkout="${p[0]}">${p[3]}</button></article>`).join("")}</div></section>`;
}

function loginPage(signup=false){
 return `<section class="auth-page"><div class="auth-bg"></div><div class="auth-card"><a class="brand" data-route="home"><span class="brand-mark"><svg viewBox="0 0 32 32" fill="none"><rect x="3" y="3" width="26" height="26" rx="9" stroke="currentColor" stroke-width="2"/><path d="M12 9.8L23 16L12 22.2V9.8Z" fill="currentColor"/></svg></span>FrameFlow</a><div style="height:20px"></div><h1>${signup?"Create your account":"Welcome back"}</h1><p>${signup?"Start building cinematic stories.":"Sign in to continue your creative journey."}</p><div class="auth-tabs"><button class="${!signup?"active":""}" id="loginTab">Log in</button><button class="${signup?"active":""}" id="signupTab">Sign up</button></div>${signup?`<form id="authForm"><div class="field"><label>Name</label><input name="name" required placeholder="Your name"></div><div class="field"><label>Email</label><input name="email" type="email" required placeholder="you@example.com"></div><div class="field"><label>Password</label><input name="password" type="password" minlength="6" required placeholder="••••••••"></div><div class="field"><label>Confirm Password</label><input name="confirm" type="password" minlength="6" required placeholder="••••••••"></div><button class="btn btn-dark form-btn">Create Account</button></form>`:`<form id="authForm"><div class="field"><label>Email</label><input name="email" type="email" required placeholder="you@example.com"></div><div class="field"><label>Password</label><input name="password" type="password" required placeholder="••••••••"></div><div style="display:flex;justify-content:space-between;align-items:center"><label style="font-size:10px"><input type="checkbox"> Remember me</label><button type="button" class="link-btn" id="forgot">Forgot password?</button></div><button class="btn btn-dark form-btn">Log in</button></form><div class="divider">OR</div><div class="socials"><button class="btn btn-ghost" id="googleLogin">◉ Google</button><button class="btn btn-ghost" id="appleLogin">● Apple</button></div>`}<div class="auth-note">${signup?"Already have an account?":"Don't have an account?"} <button id="switchAuth">${signup?"Log in":"Sign up"}</button></div></div></section>`;
}

function renderLogin(){app.innerHTML=loginPage(false);wireAuth(false)}
function wireAuth(signup){
 document.getElementById("loginTab").onclick=()=>showPage("login");
 document.getElementById("signupTab").onclick=()=>showPage("signup");
 document.getElementById("switchAuth").onclick=()=>showPage(signup?"login":"signup");
 document.getElementById("authForm").onsubmit=e=>{
  e.preventDefault();
  if(signup && e.target.password.value!==e.target.confirm.value){showToast("Passwords do not match.");return}
  state.loggedIn=true;localStorage.setItem("ff_loggedIn","true");save();
  showToast(signup?"Account created successfully!":"Demo login successful");
  setTimeout(()=>showPage("create"),500);
 };
 document.getElementById("forgot")?.addEventListener("click",()=>showToast("Demo reset link prepared."));
 document.getElementById("googleLogin")?.addEventListener("click",()=>showToast("Google login is disabled in this prototype."));
 document.getElementById("appleLogin")?.addEventListener("click",()=>showToast("Apple login is disabled in this prototype."));
}

function modal(content){
 modalRoot.innerHTML=`<div class="modal-backdrop" id="modalBackdrop"><div class="modal">${content}</div></div>`;
 document.querySelector("[data-close]")?.addEventListener("click",closeModal);
 document.getElementById("modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal()});
}
function closeModal(){modalRoot.innerHTML=""}

function showPage(page, push=true){
 if(page==="signup"){app.innerHTML=loginPage(true);wireAuth(true);updateNav("login");closeMobile();return}
 if(!routes.includes(page)) page="home";
 state.currentPage=page;
 const pages={home:homePage,create:createPage,director:directorPage,storyboard:storyboardPage,timeline:timelinePage,camera:cameraPage,projects:projectsPage,discover:discoverPage,pricing:pricingPage};
 if(page==="login"){renderLogin();updateNav("login");closeMobile();if(push)history.pushState({}, "", "#login");return}
 app.innerHTML = pages[page]();
updateNav(page);
closeMobile();

startPageTitleTyping();
 if(push)history.pushState({}, "", "#"+page);
 wirePage(page);
 window.scrollTo({top:0,behavior:"smooth"});
}
function updateNav(page){document.querySelectorAll("[data-route]").forEach(b=>b.classList.toggle("active",b.dataset.route===page))}
function wirePage(page){
 if(page==="home"){wireGenerator()}
 if(page==="create"){
   const ids=[["studioPrompt","prompt"],["studioStyle","style"],["studioRatio","ratio"],["studioDuration","duration"],["studioCamera","camera"]];
   ids.forEach(([id,key])=>{const el=document.getElementById(id);if(el){if(key!=="prompt")el.value=state[key];el.addEventListener("change",()=>{state[key]=el.value;save()});el.addEventListener("input",()=>{state[key]=el.value;save()})}});
   ["studioGenerate","studioGenerate2"].forEach(id=>document.getElementById(id)?.addEventListener("click",e=>{state.prompt=document.getElementById("studioPrompt").value.trim();save();simulateGeneration(e.currentTarget)}));
   document.getElementById("studioPlay")?.addEventListener("click",e=>{e.currentTarget.textContent=e.currentTarget.textContent==="▶"?"Ⅱ":"▶"});
   document.getElementById("addScene")?.addEventListener("click",addScene);
   document.querySelectorAll("[data-create-tab]").forEach(tab=>tab.addEventListener("click",()=>{
     const target=tab.dataset.createTab;
     document.querySelectorAll("[data-create-tab]").forEach(t=>t.classList.toggle("active",t===tab));
     document.querySelectorAll("[data-create-panel]").forEach(panel=>panel.classList.toggle("active",panel.dataset.createPanel===target));
   }));
 }
 if(page==="director"){document.getElementById("directorGenerate").onclick=generateScenes;document.getElementById("generateScenes").onclick=generateScenes;document.getElementById("regenScene").onclick=()=>showToast("Scene regenerated in demo mode.")}
 if(page==="storyboard"){
  document.getElementById("playStoryboard").onclick=()=>showToast("Storyboard preview playing.");
  ["addStoryboardScene","addStoryboardScene2"].forEach(id=>document.getElementById(id)?.addEventListener("click",addScene));
  document.querySelectorAll(".story-card[data-story]").forEach(card=>card.addEventListener("click",e=>{
    if(e.target.closest("button")) return;
    document.querySelectorAll(".story-card[data-story]").forEach(c=>c.classList.remove("selected"));
    card.classList.add("selected");
    showScenePreview(Number(card.dataset.story));
  }));
}
 if(page==="timeline"){
  const preview=document.querySelector(".timeline-theme-video");
  const playBtn=document.getElementById("timelinePlay");
  const previewPlay=document.getElementById("timelinePreviewPlay");
  const previewBar=document.getElementById("timelinePreviewBar");
  const timeLabel=document.getElementById("timelineTime");
  const playhead=document.getElementById("timelinePlayhead");
  const videoTrack=document.getElementById("timelineVideoTrack");
  const scale=document.getElementById("timelineScale");
  const zoomOut=document.getElementById("timelineZoomOut");
  const zoomIn=document.getElementById("timelineZoomIn");
  let zoom=1;
  const total=20;
  const formatTime=t=>{const sec=Math.max(0,Math.min(total,Number(t)||0));return `00:${String(Math.floor(sec)).padStart(2,"0")}`};
  const setPlayhead=(seconds,seekVideo=true)=>{
   const t=Math.max(0,Math.min(total,Number(seconds)||0));
   const pct=(t/total);
   const trackWidth=videoTrack.clientWidth;
   const usableWidth=Math.max(0,trackWidth-20);
   playhead.style.left=`${10+(usableWidth*pct)}px`;
   playhead.setAttribute("aria-valuenow",String(Math.round(t)));
   if(previewBar) previewBar.style.width=`${pct*100}%`;
   if(timeLabel) timeLabel.textContent=`${formatTime(t)} / 00:20`;
   if(seekVideo && preview && Number.isFinite(preview.duration) && preview.duration>0){try{preview.currentTime=Math.min(t,preview.duration)}catch(e){}}
  };
  const applyZoom=()=>{
   const width=800*zoom;
   videoTrack.style.minWidth=`${width}px`;
   videoTrack.parentElement.style.minWidth=`${Math.max(900,width+90)}px`;
   scale.style.minWidth=`${width}px`;
  };
  setPlayhead(0,false); applyZoom();
  playBtn?.addEventListener("click",()=>{
   if(!preview)return;
   if(preview.paused){preview.play().catch(()=>{});playBtn.textContent="Ⅱ";previewPlay.textContent="Ⅱ";}
   else{preview.pause();playBtn.textContent="▶ Play";previewPlay.textContent="▶";}
  });
  previewPlay?.addEventListener("click",()=>playBtn?.click());
  preview?.addEventListener("timeupdate",()=>{
   const duration=Math.min(total,Number(preview.duration)||total);
   const current=Math.min(duration,Number(preview.currentTime)||0);
   if(timeLabel) timeLabel.textContent=`${formatTime(current)} / 00:20`;
   if(previewBar) previewBar.style.width=`${(current/total)*100}%`;
  });
  preview?.addEventListener("ended",()=>{if(playBtn)playBtn.textContent="▶ Play";if(previewPlay)previewPlay.textContent="▶";});
  document.getElementById("timelineFullscreen")?.addEventListener("click",()=>{const panel=document.querySelector(".timeline-theme-video")?.closest(".preview-panel");if(panel?.requestFullscreen)panel.requestFullscreen().catch(()=>{});});
  document.querySelectorAll("[data-timeline-scene]").forEach(btn=>btn.addEventListener("click",()=>{
   const start=Number(btn.dataset.start)||0;
   document.querySelectorAll("[data-timeline-scene]").forEach(x=>x.classList.remove("active"));
   btn.classList.add("active");
   setPlayhead(start);
   showToast(`Scene 0${Number(btn.dataset.timelineScene)+1} selected at ${start}s.`);
  }));
  const positionFromPointer=e=>{
   const rect=videoTrack.getBoundingClientRect();
   const x=Math.max(0,Math.min(rect.width,e.clientX-rect.left));
   return (x/rect.width)*total;
  };
  let dragging=false;
  playhead.addEventListener("pointerdown",e=>{dragging=true;playhead.setPointerCapture?.(e.pointerId);e.preventDefault();});
  videoTrack.addEventListener("pointermove",e=>{if(!dragging)return;setPlayhead(positionFromPointer(e));});
  videoTrack.addEventListener("pointerup",()=>{dragging=false;});
  videoTrack.addEventListener("pointercancel",()=>{dragging=false;});
  videoTrack.addEventListener("click",e=>{if(e.target.closest(".timeline-scene-clip"))return;setPlayhead(positionFromPointer(e));});
  playhead.addEventListener("keydown",e=>{let t=Number(playhead.getAttribute("aria-valuenow"))||0;if(e.key==="ArrowRight")t+=1;else if(e.key==="ArrowLeft")t-=1;else if(e.key==="Home")t=0;else if(e.key==="End")t=total;else return;e.preventDefault();setPlayhead(t);});
  zoomIn?.addEventListener("click",()=>{zoom=Math.min(2.5,zoom+0.25);applyZoom();showToast(`Timeline zoom ${Math.round(zoom*100)}%.`);});
  zoomOut?.addEventListener("click",()=>{zoom=Math.max(0.75,zoom-0.25);applyZoom();showToast(`Timeline zoom ${Math.round(zoom*100)}%.`);});
  document.getElementById("timelineAudioClip")?.addEventListener("click",()=>showToast("Background music track selected."));
  document.getElementById("timelineTextClip")?.addEventListener("click",()=>showToast("Text clip selected."));
  document.getElementById("exportTimeline").onclick=()=>showToast("Demo timeline export prepared.");
 }
 if(page==="camera"){document.querySelectorAll("[data-slider]").forEach(s=>s.oninput=()=>document.getElementById("val"+s.dataset.slider).textContent=(s.value/50).toFixed(1)+"x");document.querySelectorAll("[data-camera]").forEach(b=>b.onclick=()=>{state.camera=b.dataset.camera;save();showToast("Camera set to "+b.dataset.camera)});document.getElementById("resetCamera").onclick=()=>showToast("Camera controls reset.")}
 if(page==="projects"){document.getElementById("newProject")?.addEventListener("click",()=>showPage("create"));document.querySelectorAll("[data-project-delete]").forEach(b=>b.onclick=()=>confirmDelete(Number(b.dataset.projectDelete)));document.querySelectorAll("[data-project-copy]").forEach(b=>b.onclick=()=>showToast("Project duplicated."));document.querySelectorAll("[data-project-play]").forEach(b=>b.onclick=()=>showGenerationModal("Project preview"))}
 if(page==="discover"){document.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.querySelectorAll(".discover-card").forEach(c=>c.style.display=(b.dataset.filter==="All"||c.dataset.category===b.dataset.filter)?"":"none")});document.querySelectorAll("[data-like]").forEach(b=>b.onclick=()=>toggleLike(b));document.querySelectorAll("[data-preview]").forEach(b=>b.onclick=()=>showDiscoverPreview(Number(b.dataset.preview)))}
 if(page==="pricing"){document.querySelectorAll("[data-checkout]").forEach(b=>b.onclick=()=>modal(`<div class="modal-head"><h3>Checkout</h3><button class="modal-close" data-close>×</button></div><p style="font-size:13px;color:#666;line-height:1.7">Checkout is disabled in this frontend prototype. Your selected plan is <b>${b.dataset.checkout}</b>.</p><button class="btn btn-dark" data-close style="margin-top:20px;width:100%">Got it</button>`))}
 document.querySelectorAll("[data-scene-preview]").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();showScenePreview(Number(b.dataset.scenePreview));}));
 document.querySelectorAll("[data-scene-card]").forEach(card=>card.addEventListener("click",e=>{if(e.target.closest("button")) return;showScenePreview(Number(card.dataset.sceneCard));}));
 document.querySelectorAll(".scene-preview-trigger video,.story-preview-trigger video").forEach(v=>{v.addEventListener("mouseenter",()=>v.play().catch(()=>{}));v.addEventListener("mouseleave",()=>{v.pause();v.currentTime=0;});});
 document.querySelectorAll("video[data-story-five-sec],video[data-director-five-sec]").forEach(v=>{
   v.addEventListener("timeupdate",()=>{if(v.currentTime>=5){v.currentTime=0;if(!v.paused)v.play().catch(()=>{});}});
 });
 document.querySelectorAll("[data-scene-delete]").forEach(b=>b.onclick=()=>deleteScene(Number(b.dataset.sceneDelete)));
 document.querySelectorAll("[data-scene-copy]").forEach(b=>b.onclick=()=>duplicateScene(Number(b.dataset.sceneCopy)));
 document.querySelectorAll("[data-scene-edit]").forEach(b=>b.onclick=()=>showToast("Scene editing panel opened in demo mode."));
 document.querySelectorAll("[data-switch]").forEach(b=>b.onclick=()=>b.classList.toggle("on"));
}
function generateScenes(){const p=(document.getElementById("directorPrompt")?.value||state.prompt).trim();if(!p){showToast("Add an idea first.");return}state.prompt=p;save();const btn=document.getElementById("directorGenerate");if(btn){btn.disabled=true;btn.textContent="Building scenes..."}setTimeout(()=>{state.scenes=[{id:1,title:"Establishing Shot",desc:"Wide opening that establishes the world",duration:"5 sec"},{id:2,title:"Main Movement",desc:"Character moves through the environment",duration:"5 sec"},{id:3,title:"Close-up",desc:"Emotional visual detail",duration:"4 sec"},{id:4,title:"Final Reveal",desc:"Wide cinematic ending",duration:"5 sec"}];showPage("director",false);showToast("4 cinematic scenes generated.")},1200)}
function addScene(){const id=Date.now();state.scenes.push({id,title:"New Scene",desc:"Describe this scene",duration:"5 sec"});showPage(state.currentPage,false);showToast("New scene added.")}
function deleteScene(id){if(state.scenes.length<=1){showToast("Keep at least one scene.");return}confirmDelete(id,"scene")}
function duplicateScene(id){const s=state.scenes.find(x=>x.id===id);if(s){state.scenes.push({...s,id:Date.now(),title:s.title+" Copy"});showPage(state.currentPage,false);showToast("Scene duplicated.")}}
function confirmDelete(id,type="project"){modal(`<div class="modal-head"><h3>Delete ${type}?</h3><button class="modal-close" data-close>×</button></div><p style="font-size:12px;color:#666">This is a frontend demo. The item will be removed from the current prototype state.</p><div style="display:flex;gap:8px;margin-top:20px;justify-content:flex-end"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-dark" id="confirmDelete">Delete</button></div>`);document.getElementById("confirmDelete").onclick=()=>{if(type==="scene"){state.scenes=state.scenes.filter(s=>s.id!==id)}else{state.projects=state.projects.filter(p=>p.id!==id);save()}closeModal();showPage(state.currentPage,false);showToast("Deleted.")}}
function toggleLike(btn){const name=btn.dataset.like;if(state.favorites.includes(name))state.favorites=state.favorites.filter(x=>x!==name);else state.favorites.push(name);save();btn.classList.toggle("liked");showToast(state.favorites.includes(name)?"Added to favorites":"Removed from favorites")}
function showScenePreview(id){
 const scene=state.scenes.find(s=>String(s.id)===String(id));
 if(!scene) return;
 const sceneIndex=Math.max(0,state.scenes.findIndex(s=>String(s.id)===String(scene.id)));
 const videoSrc=STORYBOARD_ONLINE_VIDEOS[sceneIndex%STORYBOARD_ONLINE_VIDEOS.length];
 modal(`<div class="modal-head"><div><h3>Scene ${scene.id} · ${escapeHtml(scene.title)}</h3><span style="font-size:10px;color:#777">Interactive scene preview · ${scene.duration}</span></div><button class="modal-close" data-close>×</button></div><div class="modal-video"><video src="${videoSrc}" controls autoplay playsinline data-story-five-sec="true"></video></div><div class="modal-video-info"><div><b>${escapeHtml(scene.title)}</b><span> · ${escapeHtml(scene.desc)}</span></div><button class="btn btn-dark compact" id="selectScene">Select Scene</button></div>`);
 document.getElementById("selectScene")?.addEventListener("click",()=>{closeModal();showToast(`Selected ${scene.title}.`)});
}
function showDiscoverPreview(i){const x=discoverItems[i];modal(`<div class="modal-head"><h3>${x[0]}</h3><button class="modal-close" data-close>×</button></div><div class="modal-video discover-modal-image"><img src="${x[3]}" alt="${x[0]} preview"><div class="preview-controls"><button id="lightPlay">▶</button><span>Preview</span><div class="bar"><i style="width:22%"></i></div><button>⛶</button></div></div><div class="modal-video-info"><div><b>${x[0]}</b><span> · ${x[1]} · ${x[2]}</span></div><button class="btn btn-dark compact" id="usePrompt">Use this prompt</button></div>`);document.getElementById("lightPlay").onclick=e=>e.currentTarget.textContent=e.currentTarget.textContent==="▶"?"Ⅱ":"▶";document.getElementById("usePrompt").onclick=()=>{state.prompt=`A cinematic ${x[0]} scene with expressive lighting and smooth camera movement.`;save();closeModal();showPage("create")}}
function closeMobile(){mobileMenu.classList.remove("open");menuToggle.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");mobileMenu.setAttribute("aria-hidden","true");document.body.style.overflow=""}
function openMobile(){mobileMenu.classList.add("open");menuToggle.classList.add("open");menuToggle.setAttribute("aria-expanded","true");mobileMenu.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

document.addEventListener("click",e=>{const route=e.target.closest("[data-route]");if(route){e.preventDefault();showPage(route.dataset.route)}});
menuToggle.onclick=()=>mobileMenu.classList.contains("open")?closeMobile():openMobile();
menuClose.onclick=closeMobile;
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeMobile();closeModal()}});
window.addEventListener("scroll",()=>siteHeader.classList.toggle("scrolled",scrollY>30));
window.addEventListener("popstate",()=>showPage(location.hash.replace("#","")||"home",false));
window.addEventListener("resize",()=>{if(innerWidth>900)closeMobile()});

const initial=(location.hash||"#home").replace("#","");
showPage(routes.includes(initial)?initial:"home",false);
/* =====================================================
   FRAMEFLOW — PAGE TITLE TYPEWRITER
   ===================================================== */

function startPageTitleTyping() {
  const titles = document.querySelectorAll(
    ".hero-title, .section-heading h1"
  );

  titles.forEach((title, elementIndex) => {
    const text = title.textContent.trim();

    if (!text) return;

    title.classList.remove("page-title-typing");

    // Force animation to restart every time a page opens
    void title.offsetWidth;

    title.textContent = "";
    title.classList.add("page-title-typing");

    let characterIndex = 0;

    setTimeout(() => {
      function writeCharacter() {
        if (characterIndex < text.length) {
          title.textContent += text.charAt(characterIndex);
          characterIndex++;

          setTimeout(writeCharacter, 42);
        }
      }

      writeCharacter();
    }, elementIndex * 150);
  });
}