import React, { useState, useEffect } from 'react';
import UnifiedMotionExperience from './components/UnifiedMotionExperience';
import Footer from './components/Footer';
import { Menu, X, MessageCircle } from 'lucide-react';
import { BRAND } from './data/landingData';

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToRatio = (ratio) => {
    const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: totalScrollable * ratio, behavior: 'smooth' });
    setMobileOpen(false);
  };

  const headerStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
    padding: scrolled ? '12px 24px' : '20px 24px',
    background: scrolled ? 'rgba(27,42,58,0.92)' : 'transparent',
    borderBottom: scrolled ? '2px solid rgba(233,184,36,0.25)' : 'none',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
    transition: 'all 0.3s ease',
  };

  return (
    <div>
      <header style={headerStyle}>
        <nav className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollToRatio(0); }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
          >
            <span style={{
              width: 42, height: 42, borderRadius: 14, background: 'var(--gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: 22, color: 'var(--navy)',
              boxShadow: '3px 3px 0px #ffffff',
            }}>
              A
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span className="font-heading" style={{ fontWeight: 800, fontSize: 20, color: '#ffffff' }}>
                {BRAND.name}
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                Custom Website Studio
              </span>
            </span>
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <nav className="nav-desktop" style={{ display: 'flex', gap: 26 }}>
              <a
                href="#home"
                className="nav-link"
                style={{ color: '#ffffff' }}
                onClick={(e) => { e.preventDefault(); scrollToRatio(0); }}
              >
                Beranda
              </a>
              <a
                href="#tentang"
                className="nav-link"
                style={{ color: '#ffffff' }}
                onClick={(e) => { e.preventDefault(); scrollToRatio(0.45); }}
              >
                Tentang
              </a>
              <a
                href="#layanan"
                className="nav-link"
                style={{ color: '#ffffff' }}
                onClick={(e) => { e.preventDefault(); scrollToRatio(0.82); }}
              >
                Layanan
              </a>
            </nav>
            <a
              href={BRAND.ctaPrimary.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ padding: '10px 18px', fontSize: '0.88rem' }}
            >
              <MessageCircle size={16} />
              Konsultasi Gratis
            </a>
            <button
              className="nav-burger"
              aria-label="Menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: 'none', background: 'var(--gold)', color: 'var(--navy)',
                border: '2.5px solid var(--navy)', borderRadius: 12, padding: 8,
                cursor: 'pointer', boxShadow: '3px 3px 0px var(--navy)',
              }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div style={{
            background: 'var(--navy)', borderTop: '2px solid rgba(233,184,36,0.3)',
            padding: '14px 24px 20px', display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <a
              href="#home"
              className="nav-link"
              style={{ color: '#ffffff' }}
              onClick={(e) => { e.preventDefault(); scrollToRatio(0); }}
            >
              Beranda
            </a>
            <a
              href="#tentang"
              className="nav-link"
              style={{ color: '#ffffff' }}
              onClick={(e) => { e.preventDefault(); scrollToRatio(0.45); }}
            >
              Tentang
            </a>
            <a
              href="#layanan"
              className="nav-link"
              style={{ color: '#ffffff' }}
              onClick={(e) => { e.preventDefault(); scrollToRatio(0.82); }}
            >
              Layanan
            </a>
            <a
              href={BRAND.ctaPrimary.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ justifyContent: 'center' }}
              onClick={() => setMobileOpen(false)}
            >
              <MessageCircle size={16} />
              Konsultasi Gratis
            </a>
          </div>
        )}
      </header>

      <main>
        <UnifiedMotionExperience />
      </main>

      <Footer />
    </div>
  );
}


