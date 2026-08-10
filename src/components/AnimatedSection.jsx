import React, { useEffect, useRef, useState } from 'react';
import { BRAND } from '../data/landingData';

const TOTAL_FRAMES = 40;
const SCROLL_HEIGHT = '250vh';

export default function AnimatedSection({ 
  folderPath, 
  sectionId, 
  title, 
  subtitle, 
  ctaText,
  badgeText = 'Akalpa Studio'
}) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const sectionRef = useRef(null);
  const frameRef = useRef(0);
  const rafRef = useRef(null);

  const [loaded, setLoaded] = useState(false);
  const [loadCount, setLoadCount] = useState(0);
  const [progress, setProgress] = useState(0);

  /* ── 1. Preload semua frame ── */
  useEffect(() => {
    let count = 0;
    const imgs = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const num = String(i).padStart(3, '0');
      img.src = `/${folderPath}/ezgif-frame-${num}.jpg`;
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
  }, [folderPath]);

  /* ── 2. Resize canvas ke window ── */
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

  /* ── 3. Scroll → Draw frame ── */
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
      const prog = Math.min(1, Math.max(0, scrolled / sHeight));

      setProgress(prog);

      const idx = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(prog * TOTAL_FRAMES)
      );

      if (idx !== frameRef.current) {
        frameRef.current = idx;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(idx));
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [loaded]);

  const pct = (loadCount / TOTAL_FRAMES) * 100;
  const showCTA = progress >= 0.45;

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      style={{
        position: 'relative',
        height: SCROLL_HEIGHT,
        background: '#0d1a26',
      }}
    >
      {/* Canvas sticky container (HANYA sticky di dalam section ini) */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
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

        {/* Loading Overlay */}
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
                width: `${pct}%`, height: '100%',
                background: '#e9b824',
                borderRadius: 99,
                transition: 'width 0.1s ease',
              }} />
            </div>
          </div>
        )}

        {/* Gradient vignette untuk kontras teks */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(13,26,38,0.5) 0%, rgba(13,26,38,0.2) 40%, rgba(13,26,38,0.85) 100%)',
        }} />

        {/* Text & CTA Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px',
          pointerEvents: 'none',
        }}>
          <div style={{
            maxWidth: 720,
            pointerEvents: 'auto',
            transform: `translateY(${Math.max(0, (1 - progress * 2) * 20)}px)`,
            transition: 'transform 0.3s ease-out',
          }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#e9b824',
              color: '#1b2a3a',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '6px 16px',
              borderRadius: 999,
              border: '2px solid #1b2a3a',
              boxShadow: '3px 3px 0px #1b2a3a',
              marginBottom: 20,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1b2a3a' }} />
              {badgeText}
            </div>

            {/* Title */}
            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              lineHeight: 1.15,
              color: '#ffffff',
              marginBottom: 16,
              textShadow: '0 4px 20px rgba(0,0,0,0.6)',
              letterSpacing: '-0.02em',
            }}>
              {title}
            </h2>

            {/* Subtitle */}
            <p style={{
              fontSize: 'clamp(0.95rem, 1.8vw, 1.2rem)',
              color: 'rgba(255,255,255,0.88)',
              lineHeight: 1.65,
              maxWidth: 580,
              margin: '0 auto 28px',
              textShadow: '0 2px 12px rgba(0,0,0,0.6)',
            }}>
              {subtitle}
            </p>

            {/* CTA Button */}
            <div style={{
              opacity: showCTA ? 1 : 0,
              transform: showCTA ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              pointerEvents: showCTA ? 'auto' : 'none',
            }}>
              <a
                href={BRAND.ctaPrimary.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  background: '#e9b824',
                  color: '#1b2a3a',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  fontSize: '1rem',
                  padding: '14px 30px',
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {ctaText}
              </a>
            </div>
          </div>
        </div>

        {/* Scroll hint indicator */}
        <div style={{
          position: 'absolute',
          bottom: '6%', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          opacity: showCTA ? 0 : (loaded ? 1 : 0),
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
          zIndex: 5,
        }}>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '0.7rem', fontWeight: 700,
            color: 'rgba(255,255,255,0.75)',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            textShadow: '0 1px 6px rgba(0,0,0,0.5)',
          }}>Scroll</span>
          <div style={{ animation: 'scrollBounce 1.6s ease-in-out infinite' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.5))' }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }
      `}</style>
    </section>
  );
}

