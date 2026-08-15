/* ═══════════════════════════════════════════════════════════════════════
   Akalpa Inovasi | main.js v2 (vanilla)
   Hero canvas 40-frame (siang → malam) · parallax halus · UI interaktif
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── 1. HERO | canvas scroll animation (40 frame: siang → malam) ──── */
  const HERO_FRAMES = 40;
  const HERO_BASE = "assets/frames/hero3/";
  const TEXT_AT = 0.6;      // teks muncul saat frame mulai gelap
  const DARK_AT = 0.45;     // nav/scrim beralih ke mode gelap

  const heroStory = $("#hero");
  const heroCanvas = $("#heroCanvas");
  const preloader = $("#heroPreloader");
  const preloaderFill = $("#preloaderFill");
  const preloaderCount = $("#preloaderCount");
  const heroContent = $("#heroContent");
  const heroMascot = $("#heroMascot");
  const scrollHint = $("#scrollHint");

  let frameImages = [];
  let heroLoaded = false;
  let currentFrame = -1;

  function preloadFrames() {
    if (!heroCanvas) return;
    let done = 0;
    const count = HERO_FRAMES;
    const onOne = () => {
      done += 1;
      if (preloaderFill) preloaderFill.style.width = Math.round((done / count) * 100) + "%";
      if (preloaderCount) preloaderCount.textContent = done + " / " + count;
      if (done === count) {
        heroLoaded = true;
        if (preloader) preloader.classList.add("is-done");
        setTimeout(() => { if (preloader) preloader.remove(); }, 700);
        drawFrame(0);
        computeHero();
      }
    };
    for (let i = 1; i <= count; i++) {
      const img = new Image();
      const num = String(i).padStart(3, "0");
      img.src = HERO_BASE + num + ".jpg";
      img.onload = onOne;
      img.onerror = onOne;
      frameImages.push(img);
    }
  }

  function sizeCanvas() {
    if (!heroCanvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    heroCanvas.width = Math.floor(heroStory.clientWidth * dpr);
    heroCanvas.height = Math.floor(window.innerHeight * dpr);
  }

  function drawFrame(index) {
    const img = frameImages[index];
    if (!img || !img.complete || !img.naturalWidth) return;
    const ctx = heroCanvas.getContext("2d");
    const cW = heroCanvas.width, cH = heroCanvas.height;
    const iW = img.naturalWidth, iH = img.naturalHeight;
    ctx.clearRect(0, 0, cW, cH);
    const scale = Math.max(cW / iW, cH / iH);
    const dw = iW * scale, dh = iH * scale;
    ctx.drawImage(img, (cW - dw) / 2, (cH - dh) / 2, dw, dh);
  }

  function computeHero() {
    if (!heroStory || !heroCanvas) return;
    const rect = heroStory.getBoundingClientRect();
    const sHeight = heroStory.offsetHeight - window.innerHeight;
    const p = Math.max(0, Math.min(1, -rect.top / sHeight));

    if (heroLoaded) {
      const idx = Math.min(HERO_FRAMES - 1, Math.floor(p * HERO_FRAMES));
      window.__heroFrame = idx; // debug hook
      if (idx !== currentFrame) {
        currentFrame = idx;
        requestAnimationFrame(() => drawFrame(idx));
      }
    }

    // mode gelap: scrim + nav cream saat frame meredup
    document.body.classList.toggle("hero-dark", p >= DARK_AT);

    // teks + maskot muncul saat frame gelap; scrim gelap 45% ikut aktif
    // agar headline selalu terbaca jelas di atas canvas.
    const show = p >= TEXT_AT;
    document.body.classList.toggle("hero-text", show);
    if (heroContent) heroContent.classList.toggle("is-visible", show);
    if (heroMascot) heroMascot.classList.toggle("is-visible", show);
    if (scrollHint) scrollHint.classList.toggle("is-hidden", p > 0.92);
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { computeHero(); updateHeader(); updateParallax(); ticking = false; });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => { sizeCanvas(); if (heroLoaded) drawFrame(currentFrame); });

  if (!prefersReduced) {
    sizeCanvas();
    preloadFrames();
  } else {
    // reduced motion: frame terakhir statis + konten langsung
    const img = new Image();
    img.src = HERO_BASE + "040.jpg";
    img.onload = () => {
      frameImages[39] = img;
      sizeCanvas();
      drawFrame(39);
      if (preloader) preloader.remove();
      if (heroContent) heroContent.classList.add("is-visible");
      if (heroMascot) heroMascot.classList.add("is-visible");
      document.body.classList.add("hero-dark");
      document.body.classList.add("hero-text");
    };
  }

  /* ── 2. HEADER | 3 state (transparan terang / gelap / solid) ──────── */
  const header = $("#siteHeader");
  function updateHeader() {
    if (!header || !heroStory) return;
    const y = window.scrollY;
    const heroEnd = heroStory.offsetHeight - window.innerHeight;
    header.classList.toggle("is-scrolled", y >= heroEnd);
  }
  updateHeader();

  /* ── 3. Mobile menu ───────────────────────────────────────────────── */
  const burger = $("#navBurger");
  const mobileMenu = $("#mobileMenu");
  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("is-open");
    mobileMenu.hidden = true;
    if (burger) {
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Buka menu");
      burger.innerHTML = WPB.ICONS["menu"];
    }
  }
  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      const open = !mobileMenu.classList.contains("is-open");
      mobileMenu.classList.toggle("is-open", open);
      mobileMenu.hidden = !open;
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
      burger.innerHTML = open ? WPB.ICONS["x"] : WPB.ICONS["menu"];
    });
  }

  /* ── 4. Anchor scroll halus (offset header) ───────────────────────── */
  function scrollToTarget(target) {
    const el = typeof target === "string" ? $(target) : target;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 66;
    window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
    closeMobileMenu();
  }
  $$("[data-scroll]").forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        scrollToTarget(href);
      } else if (a.hasAttribute("data-scroll")) {
        e.preventDefault();
        const target = a.getAttribute("data-scroll");
        scrollToTarget(target === "hero" ? "#hero" : "#" + target);
      }
    });
  });

  /* ── 5. Section masuk/keluar + object berurutan ──────────────────────
     Urutan animasi: section masuk duluan (sec-inner), lalu setiap object
     (reveal) di dalamnya masuk berurutan via stagger. Wave & dekorasi
     absolut TIDAK ikut animasi → tidak ada celah terpotong di perbatasan. */
  const animSecs = $$(".sec-anim");
  const revealIn = (sec) => {
    $$(".reveal, .reveal-l, .reveal-scale", sec).forEach((el, i) => {
      el.classList.remove("is-visible");
      void el.offsetWidth; /* restart transisi */
      setTimeout(() => el.classList.add("is-visible"), 90 + i * 65);
    });
  };
  const revealOut = (sec) => {
    $$(".reveal, .reveal-l, .reveal-scale", sec).forEach((el) => el.classList.remove("is-visible"));
  };
  if ("IntersectionObserver" in window && !prefersReduced) {
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const sec = en.target;
        if (en.isIntersecting) {
          sec.classList.add("is-in");
          sec.classList.remove("is-out");
          revealIn(sec);
        } else {
          sec.classList.add("is-out");
          sec.classList.remove("is-in");
          revealOut(sec);
        }
      });
    }, { threshold: 0.06, rootMargin: "0px 0px -6% 0px" });
    animSecs.forEach((s) => sio.observe(s));
  } else {
    animSecs.forEach((s) => { s.classList.add("is-in"); s.classList.remove("is-out"); });
    $$(".reveal, .reveal-l, .reveal-scale").forEach((el) => el.classList.add("is-visible"));
  }

  /* ── 6. Countup ───────────────────────────────────────────────────── */
  const counters = $$(".countup");
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    if (prefersReduced) { el.textContent = target; return; }
    const dur = 1300;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          animateCount(en.target);
          cio.unobserve(en.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach((el) => { el.textContent = el.dataset.count; });
  }

  /* ── 7. Carousel testimoni ────────────────────────────────────────── */
  const track = $("#testimonialTrack");
  const dotsWrap = $("#carouselDots");
  const prevBtn = $("#carouselPrev");
  const nextBtn = $("#carouselNext");
  if (track && dotsWrap) {
    const slides = $$(".testimonial-slide", track);
    let index = 0;
    let timer = null;
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", "Testimoni " + (i + 1));
      b.addEventListener("click", () => { goTo(i); restart(); });
      dotsWrap.appendChild(b);
    });
    const dots = $$("button", dotsWrap);
    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach((d, di) => d.classList.toggle("is-active", di === index));
    }
    function restart() {
      if (timer) clearInterval(timer);
      if (!prefersReduced) timer = setInterval(() => goTo(index + 1), 5500);
    }
    if (prevBtn) prevBtn.addEventListener("click", () => { goTo(index - 1); restart(); });
    if (nextBtn) nextBtn.addEventListener("click", () => { goTo(index + 1); restart(); });
    goTo(0);
    restart();
  }

  /* ── 8a. GitHub contribution cells | pola deterministik ────────────── */
  const ghCells = $("#ghCells");
  if (ghCells) {
    // baris × kolom; level 0..3 (0 = kosong). Pola statis agar deterministik.
    const ROWS = 4, COLS = 15;
    const PATTERN = [
      0, 1, 2, 0, 3, 0, 1, 2, 0, 3, 1, 0, 2, 1, 3,
      1, 0, 3, 1, 0, 2, 0, 3, 1, 0, 2, 3, 0, 1, 0,
      2, 3, 0, 2, 1, 0, 3, 0, 2, 1, 3, 0, 1, 2, 1,
      0, 1, 1, 3, 2, 1, 0, 1, 3, 2, 0, 1, 2, 0, 2,
    ];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const lvl = PATTERN[r * COLS + c] || 0;
        const cell = document.createElement("i");
        if (lvl > 0) cell.classList.add("l" + lvl);
        ghCells.appendChild(cell);
      }
    }
  }

  /* ── 8b. Marquee | duplikat konten agar loop mulus ─────────────────── */
  const marqueeInner = $("#marqueeInner");
  if (marqueeInner) {
    marqueeInner.innerHTML += marqueeInner.innerHTML;
  }

  /* ── 9. Back to top ───────────────────────────────────────────────── */
  const backTop = $("#backTop");
  if (backTop) {
    backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" }));
  }

  /* ── 10. Tahun footer ─────────────────────────────────────────────── */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── 11. Parallax halus | [data-parallax="kecepatan"] ─────────────── */
  const parallaxEls = $$("[data-parallax]");
  function updateParallax() {
    if (prefersReduced || !parallaxEls.length) return;
    const vh = window.innerHeight;
    parallaxEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) return;
      const speed = parseFloat(el.dataset.parallax) || 0.08;
      const center = rect.top + rect.height / 2;
      const offset = (vh / 2 - center) * speed;
      el.style.transform = "translateY(" + offset.toFixed(1) + "px)";
    });
  }
  updateParallax();
})();
