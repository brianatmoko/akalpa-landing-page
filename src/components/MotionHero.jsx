import React, { useEffect, useRef, useState } from 'react';
import { BRAND } from '../data/landingData';

const TOTAL_FRAMES = 50;
// Height multiplier: 300vh → scroll area panjang untuk 2x scroll = habiskan semua frame
const SCROLL_HEIGHT = '300vh';

export default function MotionHero() {
  const canvasRef    = useRef(null);
  const imagesRef    = useRef([]);
  const sectionRef   = useRef(null);
  const frameRef     = useRef(0);
  const rafRef       = useRef(null);

  const [loaded, setLoaded]       = useState(false);
  const [loadCount, setLoadCount] = useState(0);
  const [showCTA, setShowCTA]     = useState(false);

  /* ── 1. Preload semua frame ── */
  useEffect(() => {
    let count = 0;
    const imgs = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const num = String(i).padStart(3, '0');
      img.src = `/frame motion/ezgif-45560c8f299a909c-jpg/ezgif-frame-${num}.jpg`;
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
    }

    imagesRef.current = imgs;
  }, []);

  /* ── 2. Resize canvas ke layar ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  /* ── 3. Scroll → Frame index ── */
  useEffect(() => {
    if (!loaded) return;

    const canvas  = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const drawFrame = (index) => {
      const img = imagesRef.current[index];
      if (!img || !img.complete || !img.naturalWidth) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // cover: scale menjaga aspek ratio, tengah
      const cW = canvas.width, cH = canvas.height;
      const iW = img.naturalWidth, iH = img.naturalHeight;
      const scale = Math.max(cW / iW, cH / iH);
      const drawW = iW * scale, drawH = iH * scale;
      const x = (cW - drawW) / 2, y = (cH - drawH) / 2;
      ctx.drawImage(img, x, y, drawW, drawH);
    };

    // Draw frame pertama langsung
    drawFrame(0);

    const onScroll = () => {
      const rect    = section.getBoundingClientRect();
      const sHeight = section.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / sHeight);

      // Frame index dari progress
      const idx = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(progress * TOTAL_FRAMES)
      );

      if (idx !== frameRef.current) {
        frameRef.current = idx;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(idx));
      }

      // Tampilkan CTA setelah 60% scroll
      setShowCTA(progress >= 0.6);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // init
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [loaded]);

  /* ── Overlay gradient vignette untuk readability teks ── */
  const pct = loadCount / TOTAL_FRAMES;

  return (
    <section id="home" ref={sectionRef} style={{ height: SCROLL_HEIGHT, position: 'relative', background: '#0d1a26' }}>


      {/* Canvas sticky fullscreen */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            display: 'block',
          }}
        />

        {/* Loading bar */}
        {!loaded && (
          <div style={{
            position: 'absolute', inset: 0,
            background: '#0d1a26',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 20, zIndex: 10,
          }}>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1rem', fontWeight: 700,
              color: '#e9b824', letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>
              Loading Scene...
            </span>
            <div style={{
              width: 220, height: 6,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 99, overflow: 'hidden',
            }}>
              <div style={{
                width: `${pct * 100}%`, height: '100%',
                background: '#e9b824',
                borderRadius: 99,
                transition: 'width 0.1s ease',
              }} />
            </div>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', fontFamily: 'monospace' }}>
              {loadCount} / {TOTAL_FRAMES}
            </span>
          </div>
        )}

        {/* Gradient vignette — bottom untuk readability teks */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 55%, rgba(13,26,38,0.72) 100%)',
        }} />

        {/* ── CTA Overlay: fade-in setelah 60% scroll ── */}
        <div style={{
          position: 'absolute',
          bottom: '10%', left: '6%',
          zIndex: 5,
          opacity: showCTA ? 1 : 0,
          transform: showCTA ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          pointerEvents: showCTA ? 'auto' : 'none',
        }}>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: '20px',
            textShadow: '0 4px 24px rgba(0,0,0,0.5)',
            letterSpacing: '-0.02em',
          }}>
            Butuh tim<br />
            <span style={{ color: '#e9b824' }}>teknologi?</span>
          </h1>

          <a
            href={BRAND.ctaPrimary.url}
            target="_blank"
            rel="noopener noreferrer"
            id="cta-whatsapp-motion"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: '#e9b824',
              color: '#1b2a3a',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: '1rem',
              padding: '14px 28px',
              borderRadius: 14,
              border: '2.5px solid #1b2a3a',
              boxShadow: '4px 4px 0px #1b2a3a',
              textDecoration: 'none',
              letterSpacing: '0.01em',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translate(-2px,-2px)';
              e.currentTarget.style.boxShadow = '6px 6px 0px #1b2a3a';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translate(0,0)';
              e.currentTarget.style.boxShadow = '4px 4px 0px #1b2a3a';
            }}
          >
            {/* WhatsApp icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat WhatsApp
          </a>
        </div>

        {/* Scroll hint — hanya tampil sebelum CTA muncul */}
        <div style={{
          position: 'absolute',
          bottom: '8%', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          opacity: showCTA ? 0 : (loaded ? 1 : 0),
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.72rem', fontWeight: 700,
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '0.15em', textTransform: 'uppercase',
          }}>Scroll</span>
          <div style={{ animation: 'scrollBounce 1.6s ease-in-out infinite' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

      </div>

      {/* CSS animation for scroll bounce */}
      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }
      `}</style>
    </section>
  );
}

