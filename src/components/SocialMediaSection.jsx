import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Users, ExternalLink } from 'lucide-react';
import { SOCIAL_LINKS } from '../data/landingData';

const sectionStyle = {
  position: 'relative',
  background: 'var(--cream-dark)',
  padding: '96px 0',
  overflow: 'hidden',
  borderTop: '2.5px solid var(--navy)',
};

const cardStyle = {
  background: 'var(--white)',
  border: '2.5px solid var(--navy)',
  borderRadius: 'var(--radius-lg)',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '18px',
  position: 'relative',
  boxShadow: '4px 4px 0px var(--navy)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
};

export default function SocialMediaSection() {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyLink = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="social-media" style={sectionStyle}>
      {/* Mascot menunjuk ke kartu */}
      <motion.img
        src="/mascot/menunjuk.png"
        alt="Maskot Akalpa menunjuk kartu media sosial"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'absolute',
          top: '70px',
          right: '3%',
          width: 150,
          zIndex: 5,
          pointerEvents: 'none',
        }}
        className="mascot-pointer"
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 56px' }}>
          <span className="badge badge-outline" style={{ marginBottom: 14 }}>
            <Users size={12} /> Koneksi &amp; Komunitas
          </span>
          <h2 className="text-h2">
            Tetap Terhubung dengan{' '}
            <span style={{ color: 'var(--gold-dark)' }}>Ekosistem Akalpa</span>
          </h2>
          <p className="text-body" style={{ marginTop: 12, margin: '12px auto 0', maxWidth: 560 }}>
            Dapatkan update project, tips web design, dan diskusi komunitas kreatif
            di berbagai platform media sosial kami.
          </p>
        </div>

        {/* Grid Kartu Sosmed */}
        <div className="card-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {SOCIAL_LINKS.map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '7px 7px 0px var(--gold)'; e.currentTarget.style.borderColor = 'var(--gold-dark)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '4px 4px 0px var(--navy)'; e.currentTarget.style.borderColor = 'var(--navy)'; }}
              style={{ ...cardStyle }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{
                    width: 48, height: 48, borderRadius: 14, fontSize: '1.6rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: item.bgAccent, border: '2px solid var(--navy)',
                  }}>
                    {item.emoji}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-heading)', fontWeight: 700,
                    fontSize: '0.68rem', letterSpacing: '0.06em', textTransform: 'uppercase',
                    background: 'var(--cream)', border: '2px solid var(--navy)',
                    borderRadius: 999, padding: '3px 12px', color: 'var(--navy)', opacity: 0.8,
                  }}>
                    {item.followers}
                  </span>
                </div>

                <h3 className="text-h3" style={{ marginBottom: 2 }}>{item.name}</h3>
                <p className="font-heading" style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--gold-dark)', marginBottom: 10 }}>
                  {item.handle}
                </p>
                <p className="text-body" style={{ fontSize: '0.92rem', marginBottom: 18 }}>
                  {item.desc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 16, borderTop: '2px solid rgba(27,42,58,0.12)' }}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem' }}
                >
                  <span>{item.buttonText}</span>
                  <ExternalLink size={15} />
                </a>
                <button
                  onClick={() => handleCopyLink(item.url, item.id)}
                  title="Salin link"
                  style={{
                    padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                    background: 'var(--cream)', color: 'var(--navy)',
                    border: '2px solid var(--navy)', display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  {copiedId === item.id ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}