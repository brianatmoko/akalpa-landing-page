import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Heart, MessageCircle } from 'lucide-react';
import { BRAND } from '../data/landingData';

const sectionStyle = {
  position: 'relative',
  background: 'var(--navy)',
  color: 'var(--cream)',
  padding: '72px 0 40px',
  overflow: 'hidden',
  borderTop: '3px solid var(--gold)',
};

const linkStyle = {
  color: 'rgba(245,240,230,0.75)',
  textDecoration: 'none',
  fontSize: '0.92rem',
  transition: 'color 0.2s ease',
};

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={sectionStyle}>
      {/* Dot pattern */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(233,184,36,0.10) 1.2px, transparent 1.2px)',
        backgroundSize: '30px 30px',
      }} />

      {/* Mascot kecil di pojok kanan bawah */}
      <motion.img
        src="/mascot/bagus.png"
        alt="Maskot Akalpa"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '3%',
          width: 130,
          zIndex: 5,
          pointerEvents: 'none',
        }}
        className="mascot-float bagus-corner"
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.6fr 1fr 1fr',
          gap: '40px',
          paddingBottom: '48px',
          borderBottom: '1px solid rgba(245,240,230,0.15)',
        }} className="footer-grid">
          {/* Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                width: 44, height: 44, borderRadius: 14,
                background: 'var(--gold)', color: 'var(--navy)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 22,
                boxShadow: '3px 3px 0px var(--cream)',
              }}>
                A
              </span>
              <div style={{ lineHeight: 1.1 }}>
                <div className="font-heading" style={{ fontWeight: 800, fontSize: 22 }}>
                  {BRAND.name}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                  Custom Website Studio
                </div>
              </div>
            </div>
            <p style={{ color: 'rgba(245,240,230,0.7)', fontSize: '0.92rem', maxWidth: 380, lineHeight: 1.7 }}>
              {BRAND.tagline}. Berdiri sejak {BRAND.since}, kami bantu bisnis tampil beda di dunia digital.
            </p>
            <a
              href={BRAND.ctaPrimary.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ alignSelf: 'flex-start', padding: '10px 18px', fontSize: '0.85rem' }}
            >
              <MessageCircle size={15} />
              Konsultasi Gratis
            </a>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="font-heading" style={{ fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
              Navigasi
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li><a href="#home" style={linkStyle} onMouseOver={(e) => { e.target.style.color = 'var(--gold)'; }} onMouseOut={(e) => { e.target.style.color = 'rgba(245,240,230,0.75)'; }}>Beranda</a></li>
              <li><a href="#services" style={linkStyle} onMouseOver={(e) => { e.target.style.color = 'var(--gold)'; }} onMouseOut={(e) => { e.target.style.color = 'rgba(245,240,230,0.75)'; }}>Layanan</a></li>
              <li><a href="#social-media" style={linkStyle} onMouseOver={(e) => { e.target.style.color = 'var(--gold)'; }} onMouseOut={(e) => { e.target.style.color = 'rgba(245,240,230,0.75)'; }}>Media Sosial</a></li>
            </ul>
          </div>

          {/* Hubungi */}
          <div>
            <h4 className="font-heading" style={{ fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
              Hubungi Kami
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li style={{ color: 'rgba(245,240,230,0.75)', fontSize: '0.92rem' }}>
                WhatsApp: <span style={{ color: 'var(--cream)', fontWeight: 600 }}>+62 851 9124 0994</span>
              </li>
              <li><a href="https://natifly.com" target="_blank" rel="noopener noreferrer" style={linkStyle} onMouseOver={(e) => { e.target.style.color = 'var(--gold)'; }} onMouseOut={(e) => { e.target.style.color = 'rgba(245,240,230,0.75)'; }}>
                Powered by Natifly.com
              </a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          paddingTop: '28px',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: 16,
          fontSize: '0.8rem', color: 'rgba(245,240,230,0.55)',
        }}>
          <div>
            © {new Date().getFullYear()} <strong style={{ color: 'var(--cream)' }}>{BRAND.name} Studio</strong>. Semua hak dilindungi.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              Dibuat dengan <Heart size={14} style={{ color: 'var(--gold)', fill: 'var(--gold)' }} /> oleh {BRAND.name}
            </span>
            <button
              onClick={scrollToTop}
              title="Kembali ke atas"
              style={{
                padding: '10px 14px', borderRadius: 12, cursor: 'pointer',
                background: 'rgba(245,240,230,0.08)', color: 'var(--cream)',
                border: '2px solid rgba(245,240,230,0.35)',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.78rem',
              }}
            >
              <ArrowUp size={15} /> Ke Atas
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}