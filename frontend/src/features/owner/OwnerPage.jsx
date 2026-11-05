import React, { useState, useEffect } from 'react';
import { Share2, Globe, Mail, ArrowRight, RefreshCw, Feather, Phone } from 'lucide-react';
import { api } from '../../services/api';

export default function OwnerPage({ onNavigate }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOwnerProfile()
      .then((data) => setProfile(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 24px', backgroundColor: '#F8F4EC', minHeight: '80vh' }}>
        <RefreshCw size={32} color="#B78B45" style={{ animation: 'spin 1.5s linear infinite' }} />
        <p style={{ marginTop: '16px', color: '#5C6B63', fontSize: '0.95rem' }}>Loading Founder's Archive...</p>
      </div>
    );
  }

  const p = profile || {
    display_name: 'Er. Rumana Ansari',
    title: 'Founder & Master Perfumer',
    portrait_url: '/images/rumana_ansari.png',
    short_bio: 'Dedicated to reviving the royal heritage of pure Indian attars with contemporary artisanal craftsmanship.',
    full_story: 'Rumera Luxury Atra was founded with an unyielding reverence for the timeless tradition of Indian perfumery. Sourcing the rarest botanicals, wild-harvested resins, and ancient deg-bhapka distilled agarwood, every bottle is a masterpiece of quiet luxury.',
    brand_vision: 'To establish Indian attars and natural extracts as the pinnacle of global luxury perfumery, honoring sustainability, artisanal distillers, and unmatched purity.',
    values: '100% Pure Non-Alcoholic Oils • Ethically Sourced Wild Aquilaria • Hydro-Distilled in Traditional Degs • Aged in Vintage Leather & Teak',
    quote: 'Fragrance is the invisible architecture of emotion, etched in memories that never fade.',
    instagram_url: 'https://instagram.com/rumeraluxuryatra',
    linkedin_url: 'https://linkedin.com/company/rumera-luxury-atra'
  };

  return (
    <div style={{ backgroundColor: '#F8F4EC', minHeight: '100vh', padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        {/* Editorial Masthead */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="editorial-sub">The Atelier & The Custodian</div>
          <h1 className="editorial-title" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', marginBottom: '14px' }}>
            Meet The Master Distiller
          </h1>
          <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.05rem)', color: '#5C6B63', maxWidth: '640px', margin: '0 auto', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
            "{p.quote}"
          </p>
        </div>

        {/* Founder Portrait & Core Overview */}
        <div className="owner-overview-card">
          <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto', width: '100%' }}>
            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(183, 139, 69, 0.8)', boxShadow: '0 16px 40px rgba(0,0,0,0.18)' }}>
              <img
                src={p.portrait_url || '/images/rumera_founder_edition.jpg'}
                alt={p.display_name}
                className="owner-portrait-img"
                style={{ width: '100%', height: 'auto', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'rgba(20, 35, 31, 0.9)', backdropFilter: 'blur(8px)', border: '1px solid #B78B45', borderRadius: '20px', padding: '5px 12px', fontSize: '0.72rem', color: '#FAF7F0', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                👑 Founder Edition • Olfactory Evaluation Ritual
              </div>
            </div>
            <div className="owner-badge">
              Master Perfumer • Er. Rumana Ansari
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#B78B45', fontWeight: 600, marginBottom: '6px' }}>
              {p.title}
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: '#14231F', marginBottom: '16px' }}>
              {p.display_name}
            </h2>
            <p style={{ fontSize: '0.98rem', color: '#3A4842', lineHeight: 1.8, marginBottom: '24px' }}>
              {p.short_bio}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #EFEAE0' }}>
              <a href="tel:+919305988767" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#14231F', fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none' }}>
                <Phone size={17} color="#B78B45" />
                <span>+91 9305988767 (Direct Atelier)</span>
              </a>
              <a href="mailto:ruviansari144@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#14231F', fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none' }}>
                <Mail size={17} color="#B78B45" />
                <span>ruviansari144@gmail.com</span>
              </a>
              {p.instagram_url && (
                <a href={p.instagram_url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#14231F', fontSize: '0.85rem', textDecoration: 'none' }}>
                  <Share2 size={17} color="#B78B45" />
                  <span>Instagram</span>
                </a>
              )}
              {p.linkedin_url && (
                <a href={p.linkedin_url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#14231F', fontSize: '0.85rem', textDecoration: 'none' }}>
                  <Globe size={17} color="#B78B45" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Full Story & Philosophy */}
        <div className="owner-odyssey-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Feather size={20} color="#B78B45" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 3.5vw, 1.8rem)', color: '#F8F4EC' }}>
              The Custodian’s Full Odyssey
            </h3>
          </div>
          <p style={{ fontSize: '1rem', lineHeight: 1.85, color: '#C6D4CD', whiteSpace: 'pre-line', marginBottom: '28px' }}>
            {p.full_story}
          </p>

          {/* Brand Vision */}
          {p.brand_vision && (
            <div style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '6px', borderLeft: '4px solid #B78B45' }}>
              <div style={{ fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B78B45', marginBottom: '6px' }}>
                The Rumera Vision
              </div>
              <p style={{ fontSize: '0.94rem', color: '#FAF7F0', lineHeight: 1.7 }}>
                {p.brand_vision}
              </p>
            </div>
          )}
        </div>

        {/* Core Values Strip */}
        {p.values && (
          <div className="owner-values-card" style={{ backgroundColor: '#FFFFFF', padding: '36px', borderRadius: '8px', border: '1px solid #E5DFC9', textAlign: 'center', marginBottom: '40px' }}>
            <div className="editorial-sub">Sacred Foundations</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.3rem, 3vw, 1.6rem)', color: '#14231F', marginBottom: '14px' }}>
              Guiding Principles of Rumera Atra
            </h3>
            <p style={{ fontSize: '0.94rem', color: '#5C6B63', maxWidth: '780px', margin: '0 auto', lineHeight: 1.8 }}>
              {p.values}
            </p>
          </div>
        )}

        {/* Explore Collection Banner */}
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => onNavigate('shop')} className="btn-gold btn-primary" style={{ padding: '15px 32px', fontSize: '0.92rem' }}>
            <span>Explore The Master's Formulations</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .owner-overview-card {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 48px;
          align-items: center;
          margin-bottom: 64px;
          background-color: #FFFFFF;
          padding: 44px;
          border-radius: 8px;
          border: 1px solid #E5DFC9;
          box-shadow: var(--shadow-sm);
        }

        .owner-badge {
          position: absolute;
          bottom: -12px;
          right: -12px;
          background-color: #14231F;
          color: #B78B45;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 0.76rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: 1px solid #B78B45;
        }

        .owner-odyssey-card {
          background-color: #14231F;
          color: #F8F4EC;
          padding: 48px 44px;
          border-radius: 8px;
          margin-bottom: 48px;
          border: 1px solid rgba(183, 139, 69, 0.3);
        }

        @media (max-width: 860px) {
          .owner-overview-card {
            grid-template-columns: 1fr;
            gap: 36px;
            padding: 32px 24px;
          }
          .owner-portrait-img {
            height: auto !important;
            aspect-ratio: 4 / 3;
          }
        }

        @media (max-width: 600px) {
          .owner-overview-card {
            padding: 20px 16px;
          }
          .owner-odyssey-card {
            padding: 24px 18px;
          }
          .owner-values-card {
            padding: 24px 16px !important;
          }
          .owner-portrait-img {
            height: auto !important;
            aspect-ratio: 4 / 3;
          }
          .owner-badge {
            bottom: 8px;
            right: 8px;
            background-color: rgba(20, 35, 31, 0.94);
          }
        }
      `}</style>
    </div>
  );
}
