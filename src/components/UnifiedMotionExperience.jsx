import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, ChevronDown } from 'lucide-react';
import { BRAND } from '../data/landingData';

// 50 frames (hero) + 40 frames (section2) + 40 frames (section3) = 130 frames total
const TOTAL_FRAMES = 130;
const SCROLL_HEIGHT = '700vh';

// Bangun array URL untuk 130 frame berurutan
const buildFramePaths = () => {
  const paths = [];
  // Hero (50 frames: index 0 .. 49)
  for (let i = 1; i <= 50; i++) {
    const num = String(i).padStart(3, '0');
    paths.push(`/frame motion/ezgif-45560c8f299a909c-jpg/ezgif-frame-${num}.jpg`);
  }
  // Section 2 (40 frames: index 50 .. 89)
  for (let i = 1; i <= 40; i++) {
    const num = String(i).padStart(3, '0');
    paths.push(`/section2/ezgif-frame-${num}.jpg`);
  }
  // Section 3 (40 frames: index 90 .. 129)
  for (let i = 1; i <= 40; i++) {
    const num = String(i).padStart(3, '0');
    paths.push(`/section3/ezgif-frame-${num}.jpg`);
  }
  return paths;
};

const FRAME_PATHS = buildFramePaths();

/**
 * Pemetaan Kurva Scroll Timeline (0.00 - 1.00) ke Index Frame (0 - 129) & State Teks
 * Mengatur scroll weight (plateaus) & kemunculan kata per 25 frame.
 */
function calculateTimelineState(scrollRatio) {
  let frameIndex = 0;
  let activeCard = null; // 'hero-end', 'sec2-step1', 'sec2-step2', 'sec3-step1', 'sec3-step2'
  let activeMilestoneIndex = 0; // 0: Hero, 1: Tentang, 2: Layanan

  if (scrollRatio < 0.22) {
    // ── STAGE 1: Hero Animation Playback (Frame 0 -> 49)
    // Teks Hero BELUM MUNCUL di sini, visual murni berjalan
    const p = Math.min(1, scrollRatio / 0.22);
    frameIndex = Math.min(49, Math.floor(p * 50));
    activeCard = null;
    activeMilestoneIndex = 0;
  } else if (scrollRatio >= 0.22 && scrollRatio < 0.35) {
    // ── STAGE 2: Hero Frame 50 + Scroll Weight / Plateau
    // Frame tertahan di Frame 49 (Frame 50 Hero), Teks Hero & CTA MUNCUL & TERTAHAN
    frameIndex = 49;
    activeCard = 'hero-end';
    activeMilestoneIndex = 0;
  } else if (scrollRatio >= 0.35 && scrollRatio < 0.48) {
    // ── STAGE 3: Section 2 Playback Part 1 (Frame 50 -> 74 / Sec2 Frame 1 -> 25)
    const p = (scrollRatio - 0.35) / 0.13;
    frameIndex = 50 + Math.min(24, Math.floor(p * 25));
    // Teks muncul di frame 25 (sekitar scrollRatio >= 0.44)
    activeCard = p >= 0.6 ? 'sec2-step1' : null;
    activeMilestoneIndex = 1;
  } else if (scrollRatio >= 0.48 && scrollRatio < 0.65) {
    // ── STAGE 4: Section 2 Playback Part 2 (Frame 75 -> 89 / Sec2 Frame 26 -> 40) + Plateau
    const p = Math.min(1, (scrollRatio - 0.48) / 0.12);
    frameIndex = 75 + Math.min(14, Math.floor(p * 15));
    // Teks & CTA Section 2 muncul di frame 40 & tertahan di plateau
    activeCard = 'sec2-step2';
    activeMilestoneIndex = 1;
  } else if (scrollRatio >= 0.65 && scrollRatio < 0.78) {
    // ── STAGE 5: Section 3 Playback Part 1 (Frame 90 -> 114 / Sec3 Frame 1 -> 25)
    const p = (scrollRatio - 0.65) / 0.13;
    frameIndex = 90 + Math.min(24, Math.floor(p * 25));
    // Teks muncul di frame 25 Section 3
    activeCard = p >= 0.6 ? 'sec3-step1' : null;
    activeMilestoneIndex = 2;
  } else if (scrollRatio >= 0.78 && scrollRatio < 0.94) {
    // ── STAGE 6: Section 3 Playback Part 2 (Frame 115 -> 129 / Sec3 Frame 26 -> 40) + Final Plateau
    const p = Math.min(1, (scrollRatio - 0.78) / 0.12);
    frameIndex = 115 + Math.min(14, Math.floor(p * 15));
    // Teks & CTA Section 3 muncul di frame 40 & tertahan di plateau akhir
    activeCard = 'sec3-step2';
    activeMilestoneIndex = 2;
  } else {
    // ── STAGE 7: Footer Transition (> 0.94)
    frameIndex = 129;
    activeCard = 'sec3-step2';
    activeMilestoneIndex = 2;
  }

  return { frameIndex, activeCard, activeMilestoneIndex };
}

export default function UnifiedMotionExperience() {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const sectionRef = useRef(null);
  const frameRef = useRef(0);
  const rafRef = useRef(null);

  const [loaded, setLoaded] = useState(false);
  const [loadCount, setLoadCount] = useState(0);
  const [scrollRatio, setScrollRatio] = useState(0);

  /* ── 1. Preload 130 Frame Images ── */
  useEffect(() => {
    let count = 0;
    const imgs = [];

    FRAME_PATHS.forEach((path) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        count++;
        setLoadCount(count);
        if (count === TOTAL_FRAMES) setLoaded(true);
      };
      img.onerror = () => {
        count++;
        setLoadCount(count);
        if (count === TOTAL_FRAMES) setLoaded(true);
      };
      imgs.push(img);
    });

    imagesRef.current = imgs;
  }, []);

  /* ── 2. Resize Canvas ke Screen ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  /* ── 3. Scroll Listener → Render Canvas sesuai Kurva Timeline ── */
  useEffect(() => {
    if (!loaded) return;

    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const drawFrame = (index) => {
      const img = imagesRef.current[index];
      if (!img || !img.complete || !img.naturalWidth) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cW = canvas.width, cH = canvas.height;
      const iW = img.naturalWidth, iH = img.naturalHeight;
      const scale = Math.max(cW / iW, cH / iH);
      const drawW = iW * scale, drawH = iH * scale;
      const x = (cW - drawW) / 2, y = (cH - drawH) / 2;

      ctx.drawImage(img, x, y, drawW, drawH);
    };

    drawFrame(0);

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const sHeight = section.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const ratio = Math.min(1, Math.max(0, scrolled / sHeight));

      setScrollRatio(ratio);

      const { frameIndex } = calculateTimelineState(ratio);

      if (frameIndex !== frameRef.current) {
        frameRef.current = frameIndex;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [loaded]);

  const scrollToRatio = (targetRatio) => {
    const section = sectionRef.current;
    if (!section) return;
    const sHeight = section.offsetHeight - window.innerHeight;
    const targetScrollY = section.offsetTop + (sHeight * targetRatio);
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  };

  const { activeCard, activeMilestoneIndex } = calculateTimelineState(scrollRatio);
  const pct = (loadCount / TOTAL_FRAMES) * 100;

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        height: SCROLL_HEIGHT,
        background: '#0d1a26',
      }}
    >
      {/* ── 1 Viewport Master Fixed/Sticky Canvas ── */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}>
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />

        {/* Preloader Screen */}
        {!loaded && (
          <div style={{
            position: 'absolute', inset: 0,
            background: '#0d1a26',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 20, zIndex: 30,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16, background: '#e9b824',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 26, color: '#1b2a3a',
              boxShadow: '4px 4px 0px #ffffff',
            }}>
              A
            </div>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1rem', fontWeight: 800,
              color: '#ffffff', letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>
              Memuat Pengalaman Motion...
            </span>
            <div style={{
              width: 260, height: 8,
              background: 'rgba(255,255,255,0.12)',
              borderRadius: 99, overflow: 'hidden',
              border: '1px solid rgba(233,184,36,0.3)',
            }}>
              <div style={{
                width: `${pct}%`, height: '100%',
                background: '#e9b824',
                borderRadius: 99,
                transition: 'width 0.15s ease',
              }} />
            </div>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
              {loadCount} / {TOTAL_FRAMES} Frame
            </span>
          </div>
        )}

        {/* Ambient Dark Gradient Vignette */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
          background: 'radial-gradient(circle at center, transparent 35%, rgba(13,26,38,0.75) 100%), linear-gradient(to bottom, rgba(13,26,38,0.65) 0%, transparent 25%, transparent 65%, rgba(13,26,38,0.92) 100%)',
        }} />

        {/* ── Dynamic Storytelling Overlays (Triggered at Frame 50 & 25-frame milestones) ── */}

        {/* HERO CARD (MUNCUL HANYA SAAT SCROLL MENCAPAI FRAME 50) */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 5,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 24px',
          opacity: activeCard === 'hero-end' ? 1 : 0,
          transform: activeCard === 'hero-end' ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          pointerEvents: activeCard === 'hero-end' ? 'auto' : 'none',
        }}>
          <div style={{ maxWidth: 780 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#e9b824', color: '#1b2a3a',
              fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.82rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '6px 18px', borderRadius: 999,
              border: '2px solid #1b2a3a', boxShadow: '3px 3px 0px #1b2a3a', marginBottom: 24,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1b2a3a' }} />
              Akalpa Studio
            </div>
            <h1 style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 900,
              fontSize: 'clamp(2.5rem, 5.5vw, 4.8rem)', lineHeight: 1.1,
              color: '#ffffff', marginBottom: 20,
              textShadow: '0 4px 30px rgba(0,0,0,0.85)', letterSpacing: '-0.02em',
            }}>
              Solusi Website Kreatif &<br />
              <span style={{ color: '#e9b824' }}>Berkarakter Tinggi</span>
            </h1>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.92)',
              lineHeight: 1.65, maxWidth: 620, margin: '0 auto 32px',
              textShadow: '0 2px 14px rgba(0,0,0,0.85)',
            }}>
              Kami membangun pengalaman website kustom berkinerja tinggi, visual elegan, dan motion seamless untuk membawa brand Anda ke level berikutnya.
            </p>
            <a
              href={BRAND.ctaPrimary.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: '#e9b824', color: '#1b2a3a',
                fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1rem',
                padding: '15px 32px', borderRadius: 14,
                border: '2.5px solid #1b2a3a', boxShadow: '4px 4px 0px #1b2a3a',
                textDecoration: 'none',
              }}
            >
              <MessageCircle size={18} />
              Konsultasi Gratis
            </a>
          </div>
        </div>

        {/* SECTION 2 - STEP 1 (MUNCUL DI GAMBAR 25 SECTION 2) */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 5,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 24px',
          opacity: activeCard === 'sec2-step1' ? 1 : 0,
          transform: activeCard === 'sec2-step1' ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          pointerEvents: activeCard === 'sec2-step1' ? 'auto' : 'none',
        }}>
          <div style={{
            background: 'rgba(27,42,58,0.85)', backdropFilter: 'blur(16px)',
            border: '2.5px solid #e9b824', borderRadius: 24, padding: '36px 44px',
            maxWidth: 680, boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: '#e9b824', fontFamily: "'Outfit', sans-serif", fontWeight: 800,
              fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12,
            }}>
              ✦ Presisi & Detail Visual ✦
            </div>
            <h3 style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 900,
              fontSize: 'clamp(1.8rem, 3.8vw, 3rem)', color: '#ffffff', lineHeight: 1.2, marginBottom: 14,
            }}>
              Setiap Piksel Dibuat Dengan Dedikasi
            </h3>
            <p style={{ color: 'rgba(245,240,230,0.88)', fontSize: '1.05rem', lineHeight: 1.65 }}>
              Kami tidak menggunakan template pasaran. Setiap baris kode dan elemen motion dirancang kustom untuk memperkuat identitas unik bisnis Anda.
            </p>
          </div>
        </div>

        {/* SECTION 2 - STEP 2 (MUNCUL DI GAMBAR 40/50 SECTION 2) */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 5,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 24px',
          opacity: activeCard === 'sec2-step2' ? 1 : 0,
          transform: activeCard === 'sec2-step2' ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          pointerEvents: activeCard === 'sec2-step2' ? 'auto' : 'none',
        }}>
          <div style={{ maxWidth: 760 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#e9b824', color: '#1b2a3a',
              fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.82rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '6px 18px', borderRadius: 999,
              border: '2px solid #1b2a3a', boxShadow: '3px 3px 0px #1b2a3a', marginBottom: 24,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1b2a3a' }} />
              Tentang Akalpa
            </div>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 900,
              fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', lineHeight: 1.15,
              color: '#ffffff', marginBottom: 20,
              textShadow: '0 4px 30px rgba(0,0,0,0.85)', letterSpacing: '-0.02em',
            }}>
              Bukan Cuma Website,<br />
              <span style={{ color: '#e9b824' }}>Tapi Solusi Bisnis</span>
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 1.9vw, 1.2rem)', color: 'rgba(255,255,255,0.92)',
              lineHeight: 1.7, maxWidth: 600, margin: '0 auto 32px',
              textShadow: '0 2px 14px rgba(0,0,0,0.85)',
            }}>
              Akalpa Inovasi membantu mentransformasi kehadiran digital Anda menjadi mesin pertumbuhan bisnis dengan kecepatan tinggi dan konversi optimal.
            </p>
            <a
              href={BRAND.ctaPrimary.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: '#e9b824', color: '#1b2a3a',
                fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1rem',
                padding: '15px 32px', borderRadius: 14,
                border: '2.5px solid #1b2a3a', boxShadow: '4px 4px 0px #1b2a3a',
                textDecoration: 'none',
              }}
            >
              <MessageCircle size={18} />
              Mulai Konsultasi
            </a>
          </div>
        </div>

        {/* SECTION 3 - STEP 1 (MUNCUL DI GAMBAR 25 SECTION 3) */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 5,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 24px',
          opacity: activeCard === 'sec3-step1' ? 1 : 0,
          transform: activeCard === 'sec3-step1' ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          pointerEvents: activeCard === 'sec3-step1' ? 'auto' : 'none',
        }}>
          <div style={{
            background: 'rgba(27,42,58,0.85)', backdropFilter: 'blur(16px)',
            border: '2.5px solid #e9b824', borderRadius: 24, padding: '36px 44px',
            maxWidth: 680, boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: '#e9b824', fontFamily: "'Outfit', sans-serif", fontWeight: 800,
              fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12,
            }}>
              ✦ Ekosistem Layanan ✦
            </div>
            <h3 style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 900,
              fontSize: 'clamp(1.8rem, 3.8vw, 3rem)', color: '#ffffff', lineHeight: 1.2, marginBottom: 14,
            }}>
              Landing Page Hingga Web App Kompleks
            </h3>
            <p style={{ color: 'rgba(245,240,230,0.88)', fontSize: '1.05rem', lineHeight: 1.65 }}>
              Dari tampilan animasi interaktif hingga integrasi backend mendalam — kami menyediakan stack teknologi lengkap yang disesuaikan dengan kebutuhan Anda.
            </p>
          </div>
        </div>

        {/* SECTION 3 - STEP 2 (MUNCUL DI GAMBAR 40 SECTION 3) */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 5,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 24px',
          opacity: activeCard === 'sec3-step2' ? 1 : 0,
          transform: activeCard === 'sec3-step2' ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          pointerEvents: activeCard === 'sec3-step2' ? 'auto' : 'none',
        }}>
          <div style={{ maxWidth: 760 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#e9b824', color: '#1b2a3a',
              fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.82rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '6px 18px', borderRadius: 999,
              border: '2px solid #1b2a3a', boxShadow: '3px 3px 0px #1b2a3a', marginBottom: 24,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1b2a3a' }} />
              Layanan Kami
            </div>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 900,
              fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', lineHeight: 1.15,
              color: '#ffffff', marginBottom: 20,
              textShadow: '0 4px 30px rgba(0,0,0,0.85)', letterSpacing: '-0.02em',
            }}>
              Layanan Profesional<br />
              <span style={{ color: '#e9b824' }}>Untuk Bisnis Impianmu</span>
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 1.9vw, 1.2rem)', color: 'rgba(255,255,255,0.92)',
              lineHeight: 1.7, maxWidth: 600, margin: '0 auto 32px',
              textShadow: '0 2px 14px rgba(0,0,0,0.85)',
            }}>
              Siap membangun website berstandar internasional? Tim pakar kami siap merealisasikan ide digital Anda sekarang.
            </p>
            <a
              href={BRAND.ctaPrimary.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: '#e9b824', color: '#1b2a3a',
                fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1rem',
                padding: '15px 32px', borderRadius: 14,
                border: '2.5px solid #1b2a3a', boxShadow: '4px 4px 0px #1b2a3a',
                textDecoration: 'none',
              }}
            >
              <MessageCircle size={18} />
              Mulai Project Baru
            </a>
          </div>
        </div>

        {/* ── Floating Side Milestone Indicator ── */}
        <div style={{
          position: 'absolute',
          right: '28px', top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column', gap: 16,
          zIndex: 15,
        }}>
          {[
            { label: 'Beranda', ratio: 0.26, index: 0 },
            { label: 'Tentang', ratio: 0.55, index: 1 },
            { label: 'Layanan', ratio: 0.85, index: 2 },
          ].map((item) => {
            const isActive = activeMilestoneIndex === item.index;
            return (
              <button
                key={item.index}
                onClick={() => scrollToRatio(item.ratio)}
                title={`Pindah ke ${item.label}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  padding: '4px 8px', outline: 'none',
                }}
              >
                <span style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: 700,
                  color: isActive ? '#e9b824' : 'rgba(255,255,255,0.4)',
                  opacity: isActive ? 1 : 0.6,
                  transition: 'color 0.3s ease',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  {item.label}
                </span>
                <span style={{
                  width: isActive ? 12 : 8,
                  height: isActive ? 12 : 8,
                  borderRadius: '50%',
                  background: isActive ? '#e9b824' : 'rgba(255,255,255,0.3)',
                  border: isActive ? '2px solid #1b2a3a' : 'none',
                  boxShadow: isActive ? '0 0 10px rgba(233,184,36,0.8)' : 'none',
                  transition: 'all 0.3s ease',
                }} />
              </button>
            );
          })}
        </div>

        {/* ── Scroll Hint Indicator ── */}
        <div style={{
          position: 'absolute',
          bottom: '5%', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          opacity: loaded && scrollRatio < 0.9 ? 1 : 0,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
          zIndex: 10,
        }}>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.72rem', fontWeight: 800,
            color: '#e9b824', letterSpacing: '0.18em', textTransform: 'uppercase',
            textShadow: '0 2px 8px rgba(0,0,0,0.85)',
          }}>
            Scroll Untuk Motion
          </span>
          <div style={{ animation: 'scrollBounce 1.6s ease-in-out infinite' }}>
            <ChevronDown size={22} color="#e9b824" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.85))' }} />
          </div>
        </div>

      </div>

      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }
      `}</style>
    </div>
  );
}
