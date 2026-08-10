import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight, Globe, Code2, Zap } from 'lucide-react';
import { BRAND, STATS, TECH_MARQUEE, SERVICES } from '../data/landingData';

const Hero3D = lazy(() => import('./Hero3D'));
const AndeanScene = lazy(() => import('./AndeanScene'));

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        background: `var(--cream)`,
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '100px',
        paddingBottom: '60px',
      }}
    >
      {/* Dot Background Pattern */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(27,42,58,0.12) 1.2px, transparent 1.2px)',
        backgroundSize: '28px 28px',
      }} />

      {/* Gold blob decorative */}
      <div style={{
        position: 'absolute', top: '8%', right: '-4%',
        width: 380, height: 380,
        background: 'radial-gradient(circle, rgba(233,184,36,0.22) 0%, transparent 70%)',
        pointerEvents: 'none', borderRadius: '50%'
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '-5%',
        width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(27,42,58,0.07) 0%, transparent 70%)',
        pointerEvents: 'none', borderRadius: '50%'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          alignItems: 'center',
          minHeight: '80vh',
        }}
          className="hero-grid"
        >

          {/* ── LEFT: Content ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* Badge */}
            <motion.div variants={fadeUp}>
              <span className="badge badge-gold">
                <span className="deco-dot" style={{ width: 7, height: 7 }} />
                Jasa Custom Website
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 className="text-display" variants={fadeUp}>
              Website yang{' '}
              <span style={{
                background: `linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Benar-Benar
              </span>
              <br />Ngomong untuk<br />Bisnis Kamu
            </motion.h1>

            {/* Sub-tagline */}
            <motion.p
              variants={fadeUp}
              style={{
                fontSize: '1.1rem',
                color: 'var(--navy)',
                opacity: 0.72,
                maxWidth: 480,
                lineHeight: 1.7
              }}
            >
              Kami bikin website kustom — cantik, cepat, dan punya karakter.{' '}
              Dari ide sampai online, <strong style={{ color: 'var(--navy)', opacity: 1 }}>kami urus semuanya.</strong>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '4px' }}
            >
              <a
                href={BRAND.ctaPrimary.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                id="cta-whatsapp-hero"
              >
                <MessageCircle size={18} />
                {BRAND.ctaPrimary.label}
              </a>
              <a href="#services" className="btn-secondary">
                Layanan Kami
                <ArrowRight size={16} />
              </a>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              variants={fadeUp}
              style={{
                display: 'flex', gap: '28px', flexWrap: 'wrap', paddingTop: '12px',
                borderTop: '2px solid rgba(27,42,58,0.12)', marginTop: '8px'
              }}
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 900,
                    fontSize: '1.7rem',
                    color: 'var(--navy)',
                    lineHeight: 1
                  }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--navy)', opacity: 0.6, marginTop: '3px' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: 3D Scene + Mascot + Floating Deco ── */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }} className="hero-visual">

            {/* Three.js scene di balik maskot */}
            <Suspense fallback={null}>
              <Hero3D />
            </Suspense>
            {/* World 2D Andes berparallax di depan 3D */}
            <Suspense fallback={null}>
              <AndeanScene />
            </Suspense>

            {/* Floating deco elements */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', top: '12%', left: '4%',
                background: 'var(--gold)', color: 'var(--navy)',
                borderRadius: '12px', border: '2.5px solid var(--navy)',
                padding: '10px 16px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800, fontSize: '0.82rem',
                boxShadow: '3px 3px 0px var(--navy)',
                display: 'flex', alignItems: 'center', gap: 6,
                whiteSpace: 'nowrap', zIndex: 3
              }}
            >
              <Code2 size={14} /> React + Vite
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              style={{
                position: 'absolute', top: '18%', right: '2%',
                background: 'var(--white)', color: 'var(--navy)',
                borderRadius: '12px', border: '2.5px solid var(--navy)',
                padding: '10px 16px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800, fontSize: '0.82rem',
                boxShadow: '3px 3px 0px var(--navy)',
                display: 'flex', alignItems: 'center', gap: 6,
                whiteSpace: 'nowrap', zIndex: 3
              }}
            >
              <Globe size={14} /> Mobile Ready
            </motion.div>

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              style={{
                position: 'absolute', bottom: '22%', right: '4%',
                background: 'var(--navy)', color: 'var(--cream)',
                borderRadius: '12px', border: '2.5px solid var(--navy)',
                padding: '10px 16px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800, fontSize: '0.82rem',
                boxShadow: '3px 3px 0px var(--gold)',
                display: 'flex', alignItems: 'center', gap: 6,
                whiteSpace: 'nowrap', zIndex: 3
              }}
            >
              <Zap size={14} color="var(--gold)" /> Fast & SEO
            </motion.div>

            {/* Gold circle behind mascot */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 340,
              height: 340,
              background: 'var(--gold)',
              borderRadius: '50%',
              border: '3px solid var(--navy)',
              opacity: 0.35,
            }} />

            {/* Decorative stars */}
            <motion.span
              style={{ position: 'absolute', top: '5%', right: '18%', fontSize: '2rem', zIndex: 2 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            >✦</motion.span>
            <motion.span
              style={{ position: 'absolute', top: '35%', left: '2%', fontSize: '1.4rem', zIndex: 2, color: 'var(--navy)', opacity: 0.5 }}
              animate={{ rotate: -360 }}
              transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            >✦</motion.span>

            {/* Mascot — sapaan.png */}
            <motion.img
              src="/mascot/sapaan.png"
              alt="Maskot Akalpa menyambut Anda"
              className="mascot-float"
              initial={{ opacity: 0, scale: 0.85, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'relative', zIndex: 4,
                maxHeight: '520px',
                width: 'auto',
                filter: 'drop-shadow(8px 12px 20px rgba(27,42,58,0.18))',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{
          marginTop: '60px',
          borderTop: '2.5px solid var(--navy)',
          paddingTop: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '0.78rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--navy)',
            opacity: 0.55,
            whiteSpace: 'nowrap'
          }}>
            Tech Stack Kami
          </span>
          <div style={{ flex: 1 }}>
            {/* Marquee */}
            <div className="marquee-track">
              <div className="marquee-inner">
                {[...TECH_MARQUEE, ...TECH_MARQUEE].map((t, i) => (
                  <span key={i} className="marquee-item">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Services Section ── */}
      <div id="services" style={{
        marginTop: '80px',
        background: 'var(--navy)',
        padding: '72px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(233,184,36,0.08) 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <span className="section-label" style={{ color: 'var(--gold)' }}>
                <span style={{ background: 'var(--gold)', width: 28, height: 3, display: 'block', borderRadius: 2 }} />
                Layanan Kami
              </span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
              color: 'var(--cream)',
              lineHeight: 1.2
            }}>
              Website untuk Semua Kebutuhan
            </h2>
            <p style={{ color: 'var(--cream)', opacity: 0.65, marginTop: '12px', maxWidth: '500px', margin: '12px auto 0' }}>
              Dari landing page sederhana sampai platform komunitas kompleks — kami bisa bikin semuanya.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px'
          }}>
            {SERVICES.map((svc) => (
              <motion.div
                key={svc.id}
                whileHover={{ y: -6, scale: 1.02 }}
                style={{
                  background: 'rgba(245,240,230,0.07)',
                  border: '2px solid rgba(245,240,230,0.18)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px',
                  cursor: 'default',
                  position: 'relative',
                  transition: 'border-color 0.2s ease'
                }}
              >
                {svc.popular && (
                  <div style={{
                    position: 'absolute', top: -13, left: 20,
                    background: 'var(--gold)',
                    color: 'var(--navy)',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '0.7rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    border: '2px solid var(--navy)'
                  }}>
                    Paling Diminati
                  </div>
                )}
                <div style={{ fontSize: '2.2rem', marginBottom: '14px' }}>{svc.icon}</div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  color: 'var(--cream)',
                  marginBottom: '10px'
                }}>{svc.title}</h3>
                <p style={{ color: 'var(--cream)', opacity: 0.65, fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '16px' }}>
                  {svc.desc}
                </p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {svc.tags.map((t) => (
                    <span key={t} style={{
                      background: 'rgba(233,184,36,0.15)',
                      color: 'var(--gold)',
                      border: '1.5px solid rgba(233,184,36,0.35)',
                      borderRadius: '6px',
                      padding: '3px 10px',
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Banner di akhir services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              marginTop: '48px',
              background: 'var(--gold)',
              borderRadius: 'var(--radius-xl)',
              border: '3px solid var(--cream)',
              padding: '36px 40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 900,
                fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                color: 'var(--navy)',
                marginBottom: '6px'
              }}>
                Siap bikin website impianmu? 🚀
              </div>
              <p style={{ color: 'var(--navy)', opacity: 0.75, fontSize: '0.95rem' }}>
                Konsultasi gratis, tanpa tekanan. Kami jawab semua pertanyaanmu via WhatsApp.
              </p>
            </div>
            <a
              href={BRAND.ctaPrimary.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ background: 'var(--navy)', color: 'var(--cream)', boxShadow: '4px 4px 0px rgba(0,0,0,0.3)', whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              <MessageCircle size={18} color="var(--gold)" />
              Chat WhatsApp Sekarang
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
