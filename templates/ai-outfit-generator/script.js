/* Text-to-Garment — shared vanilla JS */

(function () {
  "use strict";

  const STORAGE_THEME = "ttg-theme";
  const STORAGE_ENTRANCE = "ttg-entrance-played";
  const STORAGE_COLLECTION = "ttg-collection";
  const STORAGE_PENDING = "ttg-pending-result";
  const STORAGE_SESSION = "ttg-demo-session";

  const LILY_FRONT =
    "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260808_192942_e1086505-d7da-433b-a59b-8220f4e6c808.png&w=1280&q=85";
  const LILY_REVEAL =
    "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260808_151324_bf318a5f-5525-4fc7-aab5-e9a341018828.png&w=1280&q=85";

  /* ===== Theme system ===== */
  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_THEME);
    } catch {
      return null;
    }
  }

  function applyTheme(theme) {
    const t = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem(STORAGE_THEME, t);
    } catch {
      /* ignore */
    }
    const btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
      btn.textContent = t === "dark" ? "☀" : "☾";
    }
  }

  function initTheme() {
    const stored = getStoredTheme();
    applyTheme(stored === "light" ? "light" : "dark");
    document.querySelector(".theme-toggle")?.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* ===== Page transitions ===== */
  function initPageTransitions() {
    document.body.classList.add("page-enter");
    document.querySelectorAll('a[href$=".html"]').forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("http") || link.target === "_blank") return;
      if (link.hasAttribute("data-no-transition")) return;
      link.addEventListener("click", (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin) return;
        e.preventDefault();
        document.body.classList.add("page-leaving");
        document.body.classList.remove("page-enter");
        setTimeout(() => {
          window.location.href = link.href;
        }, 280);
      });
    });
  }

  /* ===== Navigation / mobile menu ===== */
  function initMobileNav() {
    const burger = document.querySelector(".burger");
    const sheet = document.querySelector(".mobile-nav-sheet");
    const scrim = document.querySelector(".mobile-nav-scrim");
    if (!burger || !sheet || !scrim) return;

    const links = sheet.querySelectorAll("a");

    function setOpen(open) {
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      sheet.classList.toggle("is-open", open);
      scrim.classList.toggle("is-open", open);
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
      if (open) links[0]?.focus();
    }

    burger.addEventListener("click", () => {
      const open = burger.getAttribute("aria-expanded") !== "true";
      setOpen(open);
    });

    scrim.addEventListener("click", () => setOpen(false));
    links.forEach((a) => a.addEventListener("click", () => setOpen(false)));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        burger.focus();
      }
    });
  }

  function markCurrentNav() {
    const page = document.body.dataset.page;
    if (!page) return;
    document.querySelectorAll(`[data-nav="${page}"]`).forEach((el) => {
      el.setAttribute("aria-current", "page");
    });
  }

  function hasDemoSession() {
    try {
      return !!localStorage.getItem(STORAGE_SESSION);
    } catch {
      return false;
    }
  }

  function setDemoSession(payload) {
    try {
      localStorage.setItem(STORAGE_SESSION, JSON.stringify(payload));
      return true;
    } catch {
      return false;
    }
  }

  /* ===== Auth nav (Login / Profile) ===== */
  function initAuthNav() {
    const loggedIn = hasDemoSession();
    document.querySelectorAll("[data-nav-auth]").forEach((link) => {
      if (loggedIn) {
        link.textContent = "Profile";
        link.setAttribute("href", "generator.html");
        link.setAttribute("data-nav", "profile");
      } else {
        link.textContent = "Login";
        link.setAttribute("href", "login.html");
        link.setAttribute("data-nav", "login");
      }
    });
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  }

  function setFieldError(el, message) {
    if (el) el.textContent = message || "";
  }

  /* ===== Login page demo auth ===== */
  function initLogin() {
    const app = document.getElementById("login-app");
    if (!app) return;

    const views = {
      signin: document.getElementById("auth-signin"),
      signup: document.getElementById("auth-signup"),
      reset: document.getElementById("auth-reset"),
      resetDone: document.getElementById("auth-reset-done"),
      google: document.getElementById("auth-google"),
      loading: document.getElementById("auth-loading"),
      success: document.getElementById("auth-success"),
    };

    function showView(name) {
      Object.values(views).forEach((v) => v?.classList.add("is-hidden"));
      views[name]?.classList.remove("is-hidden");
    }

    document.getElementById("btn-show-signup")?.addEventListener("click", () => showView("signup"));
    document.getElementById("btn-show-signin-from-signup")?.addEventListener("click", () => showView("signin"));
    document.getElementById("btn-forgot")?.addEventListener("click", () => showView("reset"));
    document.getElementById("btn-back-signin-reset")?.addEventListener("click", () => showView("signin"));
    document.getElementById("btn-back-signin-done")?.addEventListener("click", () => showView("signin"));
    document.getElementById("btn-back-signin-google")?.addEventListener("click", () => showView("signin"));
    document.getElementById("btn-google")?.addEventListener("click", () => showView("google"));

    function validateSignIn() {
      const email = document.getElementById("signin-email");
      const password = document.getElementById("signin-password");
      const emailErr = document.getElementById("signin-email-error");
      const passErr = document.getElementById("signin-password-error");
      let ok = true;

      const emailVal = email?.value.trim() || "";
      const passVal = password?.value || "";

      setFieldError(emailErr, "");
      setFieldError(passErr, "");

      if (!emailVal) {
        setFieldError(emailErr, "Enter your email address.");
        ok = false;
      } else if (!isValidEmail(emailVal)) {
        setFieldError(emailErr, "Enter a valid email address.");
        ok = false;
      }

      if (!passVal) {
        setFieldError(passErr, "Enter your password.");
        ok = false;
      } else if (passVal.length < 8) {
        setFieldError(passErr, "Password must be at least 8 characters.");
        ok = false;
      }

      return ok
        ? {
            email: emailVal,
            password: passVal,
            remember: document.getElementById("signin-remember")?.checked,
          }
        : null;
    }

    function completeDemoAuth(email, name) {
      showView("loading");
      setTimeout(() => {
        showView("success");
        setDemoSession({
          email,
          name: name || email.split("@")[0],
          at: Date.now(),
          demo: true,
        });
        initAuthNav();
        setTimeout(() => {
          window.location.href = "generator.html";
        }, 1200);
      }, 1400);
    }

    document.getElementById("form-signin")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = validateSignIn();
      if (!data) return;
      completeDemoAuth(data.email);
    });

    document.getElementById("form-signup")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("signup-name");
      const email = document.getElementById("signup-email");
      const password = document.getElementById("signup-password");
      const confirm = document.getElementById("signup-confirm");
      const nameErr = document.getElementById("signup-name-error");
      const emailErr = document.getElementById("signup-email-error");
      const passErr = document.getElementById("signup-password-error");
      const confirmErr = document.getElementById("signup-confirm-error");

      [nameErr, emailErr, passErr, confirmErr].forEach((el) => setFieldError(el, ""));

      let ok = true;
      const nameVal = name?.value.trim() || "";
      const emailVal = email?.value.trim() || "";
      const passVal = password?.value || "";
      const confirmVal = confirm?.value || "";

      if (!nameVal) {
        setFieldError(nameErr, "Enter your name.");
        ok = false;
      }
      if (!emailVal) {
        setFieldError(emailErr, "Enter your email address.");
        ok = false;
      } else if (!isValidEmail(emailVal)) {
        setFieldError(emailErr, "Enter a valid email address.");
        ok = false;
      }
      if (!passVal) {
        setFieldError(passErr, "Enter your password.");
        ok = false;
      } else if (passVal.length < 8) {
        setFieldError(passErr, "Password must be at least 8 characters.");
        ok = false;
      }
      if (passVal !== confirmVal) {
        setFieldError(confirmErr, "Passwords do not match.");
        ok = false;
      }

      if (!ok) return;
      completeDemoAuth(emailVal, nameVal);
    });

    document.getElementById("form-reset")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("reset-email");
      const emailErr = document.getElementById("reset-email-error");
      setFieldError(emailErr, "");
      const emailVal = email?.value.trim() || "";
      if (!emailVal) {
        setFieldError(emailErr, "Enter your email address.");
        return;
      }
      if (!isValidEmail(emailVal)) {
        setFieldError(emailErr, "Enter a valid email address.");
        return;
      }
      showView("resetDone");
    });
  }

  /* ===== Morph trail + canvas masking ===== */
  const TRAIL_MAX_POINTS = 60;
  const TRAIL_HEAD_R = 140;
  const TRAIL_NOISE_AMP = 44;
  const TRAIL_BLOB_PTS = 24;
  const TRAIL_FADE_SPEED = 0.92;
  const TRAIL_SAMPLE_DIST = 8;

  function drawMorphBlob(ctx, x, y, r, alpha, seed, t, fillWhite) {
    if (alpha < 0.01 || r < 0.5) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    const pts = [];
    for (let i = 0; i < TRAIL_BLOB_PTS; i++) {
      const angle = (i / TRAIL_BLOB_PTS) * Math.PI * 2;
      const n1 = Math.sin(angle * 3 + t * 1.4 + seed) * 0.45;
      const n2 = Math.sin(angle * 5 - t * 0.9 + seed * 2.3) * 0.3;
      const n3 = Math.cos(angle * 2 + t * 1.8 + seed * 0.7) * 0.25;
      const noise = (n1 + n2 + n3) * TRAIL_NOISE_AMP * (r / TRAIL_HEAD_R);
      const rad = r + noise;
      pts.push({
        x: x + Math.cos(angle) * rad,
        y: y + Math.sin(angle) * rad,
      });
    }
    const p0 = pts[0];
    ctx.moveTo((p0.x + pts[pts.length - 1].x) / 2, (p0.y + pts[pts.length - 1].y) / 2);
    for (let i = 0; i < pts.length; i++) {
      const curr = pts[i];
      const next = pts[(i + 1) % pts.length];
      const mx = (curr.x + next.x) / 2;
      const my = (curr.y + next.y) / 2;
      ctx.quadraticCurveTo(curr.x, curr.y, mx, my);
    }
    ctx.closePath();
    ctx.fillStyle = fillWhite ? "#ffffff" : "#000000";
    ctx.fill();
    ctx.restore();
  }

  function initHeroLily() {
    const stage = document.querySelector(".hero-stage");
    const wrap = document.querySelector(".lily-wrap");
    if (!stage || !wrap) return;

    const frontImg = wrap.querySelector(".lily-layer--front img");
    const revealImg = wrap.querySelector(".lily-layer--reveal img");
    const canvasFront = wrap.querySelector('[data-mask="front"]');
    const canvasReveal = wrap.querySelector('[data-mask="reveal"]');
    if (!frontImg || !revealImg || !canvasFront || !canvasReveal) return;

    frontImg.src = LILY_FRONT;
    revealImg.src = LILY_REVEAL;

    const ctxF = canvasFront.getContext("2d");
    const ctxR = canvasReveal.getContext("2d");
    let w = 0;
    let h = 0;
    let dpr = 1;

    const trail = [];
    let hovering = false;
    let pointerX = 0;
    let pointerY = 0;
    let headRadius = 0;
    let targetR = 0;
    let time = 0;
    let lastSampleX = null;
    let lastSampleY = null;
    let rafId = 0;
    let maskThrottle = 0;

    function resize() {
      const rect = wrap.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasFront.width = w * dpr;
      canvasFront.height = h * dpr;
      canvasReveal.width = w * dpr;
      canvasReveal.height = h * dpr;
      ctxF.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctxR.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintMasks();
    }

    function localCoords(clientX, clientY) {
      const rect = wrap.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    }

    function addTrailPoint(x, y) {
      if (lastSampleX !== null) {
        const dx = x - lastSampleX;
        const dy = y - lastSampleY;
        if (Math.hypot(dx, dy) <= TRAIL_SAMPLE_DIST) return;
      }
      lastSampleX = x;
      lastSampleY = y;
      trail.push({
        x,
        y,
        r: headRadius,
        alpha: 1,
        seed: Math.random() * Math.PI * 2,
      });
      while (trail.length > TRAIL_MAX_POINTS) trail.shift();
    }

    function paintMasks() {
      ctxF.fillStyle = "#ffffff";
      ctxF.globalCompositeOperation = "source-over";
      ctxF.clearRect(0, 0, w, h);
      ctxF.fillRect(0, 0, w, h);

      ctxF.globalCompositeOperation = "destination-out";
      trail.forEach((p) => {
        drawMorphBlob(ctxF, p.x, p.y, p.r, p.alpha, p.seed, time, false);
      });
      if (hovering && headRadius > 1) {
        drawMorphBlob(
          ctxF,
          pointerX,
          pointerY,
          headRadius,
          1,
          time * 0.37,
          time,
          false
        );
      }

      ctxR.clearRect(0, 0, w, h);
      ctxR.globalCompositeOperation = "source-over";
      trail.forEach((p) => {
        drawMorphBlob(ctxR, p.x, p.y, p.r, p.alpha, p.seed, time, true);
      });
      if (hovering && headRadius > 1) {
        drawMorphBlob(
          ctxR,
          pointerX,
          pointerY,
          headRadius,
          1,
          time * 0.37,
          time,
          true
        );
      }

      const urlF = canvasFront.toDataURL();
      const urlR = canvasReveal.toDataURL();
      frontImg.style.webkitMaskImage = `url("${urlF}")`;
      frontImg.style.maskImage = `url("${urlF}")`;
      revealImg.style.webkitMaskImage = `url("${urlR}")`;
      revealImg.style.maskImage = `url("${urlR}")`;
    }

    function tick() {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      time += 0.016;

      targetR = hovering ? TRAIL_HEAD_R : 0;
      headRadius += (targetR - headRadius) * (hovering ? 0.14 : 0.04);

      if (hovering && !reduced) {
        addTrailPoint(pointerX, pointerY);
      }

      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].alpha *= TRAIL_FADE_SPEED;
        trail[i].r *= 0.995;
        if (trail[i].alpha < 0.01) trail.splice(i, 1);
      }

      if (!hovering && trail.length === 0 && headRadius < 0.5) {
        paintMasks();
        rafId = requestAnimationFrame(tick);
        return;
      }

      paintMasks();
      rafId = requestAnimationFrame(tick);
    }

    function onEnter(e) {
      hovering = true;
      const p = localCoords(e.clientX, e.clientY);
      pointerX = p.x;
      pointerY = p.y;
      lastSampleX = null;
      lastSampleY = null;
    }

    function onMove(e) {
      const p = localCoords(e.clientX, e.clientY);
      pointerX = p.x;
      pointerY = p.y;
    }

    function onLeave() {
      hovering = false;
      lastSampleX = null;
      lastSampleY = null;
    }

    stage.addEventListener("pointerenter", onEnter);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    stage.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch") onEnter(e);
    });

    window.addEventListener("resize", resize);
    resize();
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }

  /* ===== Entrance animation (once) ===== */
  function initEntrance() {
    let done = false;
    try {
      done = localStorage.getItem(STORAGE_ENTRANCE) === "1";
    } catch {
      done = false;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = {
      brand: document.querySelector(".brand-mark"),
      nav: document.querySelector(".nav-desktop"),
      pill: document.querySelector(".studio-pill"),
      lines: document.querySelectorAll(".hero-wordmark .line-inner"),
      lily: document.querySelector(".lily-wrap"),
      copies: document.querySelectorAll(".hero-copy"),
      cta: document.querySelector(".hero-cta"),
    };

    function reveal() {
      els.brand?.classList.add("is-visible");
      els.nav?.classList.add("is-visible");
      els.pill?.classList.add("is-visible");
      els.lines.forEach((l) => l.classList.add("is-visible"));
      els.lily?.classList.add("is-visible");
      els.copies.forEach((c) => c.classList.add("is-visible"));
      els.cta?.classList.add("is-visible");
    }

    if (done || reduced) {
      reveal();
      return;
    }

    requestAnimationFrame(() => {
      setTimeout(reveal, 80);
      try {
        localStorage.setItem(STORAGE_ENTRANCE, "1");
      } catch {
        /* ignore */
      }
    });
  }

  /* ===== Demo outfit data ===== */
  const OUTFIT_POOL = [
    {
      id: "midnight-structure",
      name: "Midnight Structure",
      description: "Black oversized blazer, silver hardware, wide-leg trousers.",
      styleKey: "minimal",
      color: "Black",
      fit: "Oversized",
      occasion: "Work",
      visual: "midnight",
    },
    {
      id: "soft-future",
      name: "Soft Future",
      description: "Pale pink structured top, flowing trousers, metallic accessories.",
      styleKey: "futuristic",
      color: "Pink",
      fit: "Regular",
      occasion: "Evening",
      visual: "soft",
    },
    {
      id: "editorial-noir",
      name: "Editorial Noir",
      description: "Long black coat, minimal silhouette, glossy fabric.",
      styleKey: "editorial",
      color: "Black",
      fit: "Slim",
      occasion: "Fashion Editorial",
      visual: "noir",
    },
    {
      id: "chrome-bloom",
      name: "Chrome Bloom",
      description: "Silver sculptural garment, soft pink accents, avant-garde silhouette.",
      styleKey: "editorial",
      color: "Silver",
      fit: "Relaxed",
      occasion: "Party",
      visual: "chrome",
    },
    {
      id: "street-pulse",
      name: "Street Pulse",
      description: "Layered street set with bold proportions and matte black base.",
      styleKey: "streetwear",
      color: "Black",
      fit: "Oversized",
      occasion: "Casual",
      visual: "street",
    },
    {
      id: "ivory-line",
      name: "Ivory Line",
      description: "Crisp white tailoring with relaxed drape and clean lines.",
      styleKey: "formal",
      color: "White",
      fit: "Regular",
      occasion: "Work",
      visual: "ivory",
    },
  ];

  function outfitSvg(type) {
    const pink = "#fd86db";
    const silver = "#c8c8c8";
    const black = "#161616";
    const white = "#f7f7f7";
    const maps = {
      midnight: `<svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="200" height="280" fill="transparent"/><path d="M55 40 L100 25 L145 40 L135 95 L140 270 L60 270 L65 95 Z" fill="${black}" stroke="${silver}" stroke-width="2"/><rect x="72" y="120" width="56" height="8" fill="${silver}"/><path d="M70 130 L130 130 L125 270 L75 270 Z" fill="#0d0d0d"/></svg>`,
      soft: `<svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M60 50 Q100 30 140 50 L150 110 Q100 130 50 110 Z" fill="${pink}"/><path d="M55 110 L145 110 L135 270 L65 270 Z" fill="${white}" stroke="${pink}" stroke-width="1.5"/><circle cx="100" cy="75" r="6" fill="${silver}"/></svg>`,
      noir: `<svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M45 35 L100 20 L155 35 L165 270 L35 270 Z" fill="${black}"/><path d="M70 35 L130 35 L125 100 L75 100 Z" fill="#2a2a2a" opacity="0.6"/></svg>`,
      chrome: `<svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><ellipse cx="100" cy="90" rx="55" ry="40" fill="${silver}"/><path d="M75 120 Q100 150 125 120 L140 270 L60 270 Z" fill="${silver}"/><path d="M85 140 L115 140 L110 200 L90 200 Z" fill="${pink}"/></svg>`,
      street: `<svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="50" y="45" width="100" height="70" rx="4" fill="${black}"/><rect x="55" y="115" width="90" height="155" fill="#222"/><line x1="60" y1="130" x2="140" y2="130" stroke="${pink}" stroke-width="3"/></svg>`,
      ivory: `<svg viewBox="0 0 200 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M65 40 L100 28 L135 40 L145 270 L55 270 Z" fill="${white}" stroke="${black}" stroke-width="1.2"/><path d="M80 100 L120 100 L118 270 L82 270 Z" fill="#eee"/></svg>`,
    };
    return maps[type] || maps.midnight;
  }

  function pickOutfit(options) {
    const style = (options.style || "").toLowerCase();
    let pool = OUTFIT_POOL;
    if (style) {
      const filtered = pool.filter((o) => o.styleKey === style);
      if (filtered.length) pool = filtered;
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /* ===== Collection state ===== */
  function loadCollection() {
    try {
      const raw = localStorage.getItem(STORAGE_COLLECTION);
      if (!raw) return getSeedCollection();
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return getSeedCollection();
      return parsed;
    } catch {
      return getSeedCollection();
    }
  }

  function saveCollection(items) {
    try {
      localStorage.setItem(STORAGE_COLLECTION, JSON.stringify(items));
    } catch {
      /* graceful */
    }
  }

  function itemUid(item) {
    return item.uid || `${item.id}-${item.createdAt || 0}`;
  }

  function getSeedCollection() {
    const seed = OUTFIT_POOL.slice(0, 3).map((o, i) => ({
      ...o,
      uid: `${o.id}-seed-${i}`,
      saved: i !== 1,
      favorite: i === 0,
      createdAt: Date.now() - i * 86400000,
    }));
    saveCollection(seed);
    return seed;
  }

  function upsertCollectionItem(item) {
    const list = loadCollection();
    const entry = {
      ...item,
      createdAt: item.createdAt || Date.now(),
      saved: item.saved ?? false,
      favorite: item.favorite ?? false,
    };
    entry.uid = item.uid || `${entry.id}-${entry.createdAt}`;
    const idx = list.findIndex((x) => itemUid(x) === entry.uid);
    if (idx >= 0) list[idx] = { ...list[idx], ...entry };
    else list.unshift(entry);
    saveCollection(list);
    return list;
  }

  /* ===== Generator demo ===== */
  function initGenerator() {
    const form = document.getElementById("generator-form");
    if (!form) return;

    const promptEl = document.getElementById("prompt");
    const errorEl = document.getElementById("prompt-error");
    const overlay = document.getElementById("gen-overlay");

    const state = {
      garment: "Full Outfit",
      style: "Minimal",
      color: "Black",
      fit: "Regular",
      occasion: "Casual",
    };

    form.querySelectorAll("[data-chip-group]").forEach((group) => {
      const key = group.dataset.chipGroup;
      group.querySelectorAll(".chip").forEach((chip) => {
        chip.addEventListener("click", () => {
          group.querySelectorAll(".chip").forEach((c) => {
            c.classList.remove("is-selected");
            c.setAttribute("aria-pressed", "false");
          });
          chip.classList.add("is-selected");
          chip.setAttribute("aria-pressed", "true");
          state[key] = chip.dataset.value;
        });
      });
    });

    const urlStyle = new URLSearchParams(window.location.search).get("style");
    if (urlStyle) {
      const chip = form.querySelector(`[data-chip-group="style"] .chip[data-value="${urlStyle}"]`);
      chip?.click();
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const prompt = (promptEl?.value || "").trim();
      if (!prompt) {
        if (errorEl) errorEl.textContent = "Describe your garment to continue.";
        promptEl?.focus();
        return;
      }
      if (errorEl) errorEl.textContent = "";

      overlay?.classList.add("is-active");
      overlay?.setAttribute("aria-hidden", "false");

      const outfit = pickOutfit({ style: state.style });
      const createdAt = Date.now();
      const result = {
        ...outfit,
        uid: `${outfit.id}-${createdAt}`,
        prompt,
        garment: state.garment,
        style: state.style,
        color: state.color,
        fit: state.fit,
        occasion: state.occasion,
        createdAt,
        saved: false,
        favorite: false,
      };

      setTimeout(() => {
        try {
          sessionStorage.setItem(STORAGE_PENDING, JSON.stringify(result));
        } catch {
          /* ignore */
        }
        window.location.href = "result.html";
      }, 2200);
    });
  }

  /* ===== Result page ===== */
  function initResult() {
    const root = document.getElementById("result-root");
    if (!root) return;

    let data = null;
    try {
      const raw = sessionStorage.getItem(STORAGE_PENDING);
      if (raw) data = JSON.parse(raw);
    } catch {
      data = null;
    }

    if (!data) {
      root.innerHTML =
        '<p class="page-lead">No generated look found. Start from the generator.</p><a class="btn-primary" href="generator.html">Go to generator</a>';
      return;
    }

    root.innerHTML = `
      <h1 class="page-title">Your <span class="grad">Generated</span> Look</h1>
      <p class="page-lead demo-note">Front-end demo — predefined concepts illustrate an AI garment workflow.</p>
      <div class="result-layout">
        <div class="outfit-visual" id="result-visual"></div>
        <div>
          <h2 class="page-title" style="font-size:2rem;margin-bottom:1rem">${escapeHtml(data.name)}</h2>
          <dl class="result-meta">
            <div><dt>Prompt</dt><dd>${escapeHtml(data.prompt)}</dd></div>
            <div><dt>Garment</dt><dd>${escapeHtml(data.garment)}</dd></div>
            <div><dt>Style</dt><dd>${escapeHtml(data.style)}</dd></div>
            <div><dt>Color</dt><dd>${escapeHtml(data.color)}</dd></div>
            <div><dt>Fit</dt><dd>${escapeHtml(data.fit)}</dd></div>
            <div><dt>Occasion</dt><dd>${escapeHtml(data.occasion)}</dd></div>
          </dl>
          <div class="result-actions">
            <button type="button" class="btn-ghost" id="btn-regenerate">Regenerate</button>
            <button type="button" class="btn-primary" id="btn-save">Save Look</button>
            <button type="button" class="btn-ghost" id="btn-favorite">Favorite</button>
            <a class="btn-ghost" href="generator.html">Create Another</a>
          </div>
          <p id="result-toast" class="form-error" role="status" aria-live="polite"></p>
        </div>
      </div>
    `;

    document.getElementById("result-visual").innerHTML = outfitSvg(data.visual);

    let saved = data.saved;
    let fav = data.favorite;

    const toast = document.getElementById("result-toast");
    const saveBtn = document.getElementById("btn-save");
    const favBtn = document.getElementById("btn-favorite");

    function syncButtons() {
      saveBtn.textContent = saved ? "Saved" : "Save Look";
      favBtn.textContent = fav ? "Favorited" : "Favorite";
    }
    syncButtons();

    saveBtn.addEventListener("click", () => {
      saved = !saved;
      data.saved = saved;
      upsertCollectionItem(data);
      try {
        sessionStorage.setItem(STORAGE_PENDING, JSON.stringify(data));
      } catch {
        /* ignore */
      }
      toast.textContent = saved ? "Look saved to collection." : "Removed from saved.";
      syncButtons();
    });

    favBtn.addEventListener("click", () => {
      fav = !fav;
      data.favorite = fav;
      if (fav) data.saved = true;
      saved = data.saved;
      upsertCollectionItem(data);
      try {
        sessionStorage.setItem(STORAGE_PENDING, JSON.stringify(data));
      } catch {
        /* ignore */
      }
      toast.textContent = fav ? "Added to favorites." : "Removed from favorites.";
      syncButtons();
    });

    document.getElementById("btn-regenerate").addEventListener("click", () => {
      const next = pickOutfit({ style: data.style });
      const createdAt = Date.now();
      data = {
        ...next,
        uid: `${next.id}-${createdAt}`,
        prompt: data.prompt,
        garment: data.garment,
        style: data.style,
        color: data.color,
        fit: data.fit,
        occasion: data.occasion,
        saved: data.saved,
        favorite: data.favorite,
        createdAt,
      };
      document.querySelector(".result-layout h2").textContent = data.name;
      document.getElementById("result-visual").innerHTML = outfitSvg(data.visual);
      const dds = document.querySelectorAll(".result-meta dd");
      /* prompt stays */
      try {
        sessionStorage.setItem(STORAGE_PENDING, JSON.stringify(data));
      } catch {
        /* ignore */
      }
      toast.textContent = "Regenerated with a new demo concept.";
      upsertCollectionItem(data);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ===== Styles page ===== */
  function initStylesPage() {
    const grid = document.getElementById("style-grid");
    if (!grid) return;

    let selected = null;
    const status = document.getElementById("style-status");
    const goBtn = document.getElementById("style-generate");

    grid.querySelectorAll(".style-tile").forEach((tile) => {
      tile.addEventListener("click", () => {
        grid.querySelectorAll(".style-tile").forEach((t) => t.classList.remove("is-selected"));
        tile.classList.add("is-selected");
        selected = tile.dataset.style;
        if (status) status.textContent = `Selected: ${selected}`;
        if (goBtn) goBtn.disabled = !selected;
      });

      tile.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          tile.click();
        }
      });
    });

    goBtn?.addEventListener("click", () => {
      if (!selected) return;
      const q = encodeURIComponent(selected.charAt(0).toUpperCase() + selected.slice(1));
      window.location.href = `generator.html?style=${q}`;
    });
  }

  /* ===== Collection page ===== */
  function initCollection() {
    const grid = document.getElementById("collection-grid");
    if (!grid) return;

    let tab = "all";
    const tabs = document.querySelectorAll(".collection-tabs button");

    function render() {
      let items = loadCollection();
      const now = Date.now();
      const week = 7 * 86400000;

      if (tab === "recent") items = items.filter((i) => now - i.createdAt < week);
      if (tab === "saved") items = items.filter((i) => i.saved);
      if (tab === "favorites") items = items.filter((i) => i.favorite);

      if (!items.length) {
        grid.innerHTML = '<p class="collection-empty">No looks in this view yet.</p>';
        return;
      }

      grid.innerHTML = items
        .map(
          (item) => `
        <article class="collection-card" data-uid="${escapeHtml(itemUid(item))}">
          <div class="collection-card-visual">${outfitSvg(item.visual)}</div>
          <h3>${escapeHtml(item.name)}</h3>
          <p class="page-lead" style="margin:0;font-size:0.85rem">${escapeHtml(item.prompt || item.description)}</p>
          <div class="collection-card-actions">
            <button type="button" data-action="view">View</button>
            <button type="button" data-action="save">${item.saved ? "Unsave" : "Save"}</button>
            <button type="button" data-action="favorite">${item.favorite ? "Unfavorite" : "Favorite"}</button>
            <button type="button" data-action="delete">Delete</button>
          </div>
        </article>`
        )
        .join("");

      grid.querySelectorAll(".collection-card").forEach((card) => {
        const uid = card.dataset.uid;
        card.querySelector('[data-action="view"]').addEventListener("click", () => {
          const item = loadCollection().find((x) => itemUid(x) === uid);
          if (!item) return;
          try {
            sessionStorage.setItem(STORAGE_PENDING, JSON.stringify(item));
          } catch {
            /* ignore */
          }
          window.location.href = "result.html";
        });

        card.querySelector('[data-action="save"]').addEventListener("click", () => {
          const list = loadCollection();
          const item = list.find((x) => itemUid(x) === uid);
          if (!item) return;
          item.saved = !item.saved;
          saveCollection(list);
          render();
        });

        card.querySelector('[data-action="favorite"]').addEventListener("click", () => {
          const list = loadCollection();
          const item = list.find((x) => itemUid(x) === uid);
          if (!item) return;
          item.favorite = !item.favorite;
          if (item.favorite) item.saved = true;
          saveCollection(list);
          render();
        });

        card.querySelector('[data-action="delete"]').addEventListener("click", () => {
          const list = loadCollection().filter((x) => itemUid(x) !== uid);
          saveCollection(list);
          render();
        });
      });
    }

    tabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        tabs.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        tab = btn.dataset.tab;
        render();
      });
    });

    render();
  }

  /* ===== Payment demo ===== */
  function initPayment() {
    const app = document.getElementById("payment-app");
    if (!app) return;

    const panels = {
      plans: document.getElementById("payment-plans"),
      free: document.getElementById("payment-free"),
      checkout: document.getElementById("payment-checkout"),
      success: document.getElementById("payment-success"),
    };

    const summaryPlan = document.getElementById("summary-plan");
    const summaryPrice = document.getElementById("summary-price");
    let activePlan = null;

    function showPanel(name) {
      Object.values(panels).forEach((panel) => panel?.classList.add("is-hidden"));
      panels[name]?.classList.remove("is-hidden");
    }

    document.getElementById("btn-start-free")?.addEventListener("click", () => {
      showPanel("free");
    });

    document.getElementById("btn-choose-studio")?.addEventListener("click", () => {
      activePlan = { name: "Studio", price: "₹499 / month" };
      if (summaryPlan) summaryPlan.textContent = activePlan.name;
      if (summaryPrice) summaryPrice.textContent = activePlan.price;
      showPanel("checkout");
    });

    document.getElementById("btn-choose-pro")?.addEventListener("click", () => {
      activePlan = { name: "Pro", price: "₹999 / month" };
      if (summaryPlan) summaryPlan.textContent = activePlan.name;
      if (summaryPrice) summaryPrice.textContent = activePlan.price;
      showPanel("checkout");
    });

    document.getElementById("btn-back-plans")?.addEventListener("click", () => {
      showPanel("plans");
    });

    document.getElementById("btn-back-plans-free")?.addEventListener("click", () => {
      showPanel("plans");
    });

    document.getElementById("checkout-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      showPanel("success");
    });

    document.getElementById("btn-back-plans-success")?.addEventListener("click", () => {
      showPanel("plans");
    });
  }

  /* ===== Boot ===== */
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initPageTransitions();
    initMobileNav();
    initAuthNav();
    markCurrentNav();
    initHeroLily();
    initEntrance();
    initGenerator();
    initResult();
    initStylesPage();
    initCollection();
    initPayment();
    initLogin();
  });
})();
