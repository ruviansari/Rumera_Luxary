import React from 'react';
import { Sparkles, Gift, ShieldCheck, ArrowRight, Truck, Droplets, Clock } from 'lucide-react';
import { resolveImageUrl } from '../../services/api';

export default function FreeSampleBanner({ campaignConfig, onOpenClaimModal }) {
  const isRunning = campaignConfig?.is_running !== false;
  const remaining = campaignConfig?.remaining_count ?? 149;
  const heading = campaignConfig?.heading || "YOUR FIRST FRAGRANCE IS ON US!";
  const subheading = campaignConfig?.subheading || "Discover the luxury of RUMÉRA. Experience your favourite fragrance before you buy.";
  const offerBadge = campaignConfig?.offer_badge || "GET YOUR FREE PERFUME SAMPLE";
  const ctaText = campaignConfig?.cta_text || "CLAIM YOUR FREE SAMPLE";

  return (
    <section
      id="free-sample-campaign"
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #091310 0%, #14231F 50%, #080D0B 100%)',
        color: '#FAF7F0',
        padding: '76px 20px',
        borderTop: '1px solid rgba(183, 139, 69, 0.35)',
        borderBottom: '1px solid rgba(183, 139, 69, 0.35)',
        overflow: 'hidden',
      }}
    >
      {/* Royal Background Ornament Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(183, 139, 69, 0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Offer Details & Copy */}
          <div>
            {/* Offer Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '50px',
                backgroundColor: 'rgba(183, 139, 69, 0.18)',
                border: '1px solid #B78B45',
                color: '#E8CA89',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              <Gift size={14} color="#D4AF37" />
              <span>{offerBadge}</span>
            </div>

            {/* Main Heading */}
            <h2
              style={{
                fontFamily: 'var(--font-serif, "Cinzel", "Playfair Display", Georgia, serif)',
                fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                color: '#FAF7F0',
                letterSpacing: '-0.01em',
                marginBottom: '16px',
              }}
            >
              {heading.split('ON US').map((part, idx) => (
                <React.Fragment key={idx}>
                  {part}
                  {idx === 0 && heading.includes('ON US') && (
                    <span
                      style={{
                        background: 'linear-gradient(135deg, #F8E7B9 0%, #D4AF37 50%, #B78B45 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 20px rgba(212,175,55,0.3)',
                      }}
                    >
                      ON US!
                    </span>
                  )}
                </React.Fragment>
              ))}
            </h2>

            {/* Subheading */}
            <p
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.65,
                color: '#D1DDD6',
                marginBottom: '26px',
                maxWidth: '560px',
              }}
            >
              {subheading}
            </p>

            {/* Live Inventory Counter (Actual DB count) */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 18px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                marginBottom: '32px',
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: remaining > 15 ? '#10B981' : '#F59E0B',
                  boxShadow: `0 0 10px ${remaining > 15 ? '#10B981' : '#F59E0B'}`,
                }}
              />
              <span style={{ fontSize: '0.86rem', color: '#FAF7F0', fontWeight: 500 }}>
                Live Allotment:{' '}
                <strong style={{ color: '#E8CA89', fontWeight: 700, fontSize: '0.98rem' }}>
                  {remaining} Flacons Remaining
                </strong>{' '}
                in today's dispatch queue
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={onOpenClaimModal}
                disabled={!isRunning || remaining <= 0}
                className="btn-gold"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 34px',
                  borderRadius: '50px',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #C59B55 50%, #B78B45 100%)',
                  color: '#0D1714',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: isRunning && remaining > 0 ? 'pointer' : 'not-allowed',
                  boxShadow: '0 10px 30px rgba(183, 139, 69, 0.45)',
                  transition: 'all 0.28s ease',
                  opacity: isRunning && remaining > 0 ? 1 : 0.6,
                }}
              >
                <span>{ctaText}</span>
                <ArrowRight size={18} />
              </button>

              <a
                href="https://wa.me/919305988767?text=Hello%20RUMÉRA%20Concierge%2C%20I%20have%20a%20question%20regarding%20the%20Free%20Sample%20Campaign."
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '15px 24px',
                  borderRadius: '50px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FAF7F0',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>WhatsApp Enquiry</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                marginTop: '36px',
                paddingTop: '28px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Droplets size={16} color="#D4AF37" />
                <span style={{ fontSize: '0.78rem', color: '#B6C4BC' }}>Pure Non-Alcoholic</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={16} color="#D4AF37" />
                <span style={{ fontSize: '0.78rem', color: '#B6C4BC' }}>Pan-India Delivery</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="#D4AF37" />
                <span style={{ fontSize: '0.78rem', color: '#B6C4BC' }}>Authentic Awadh Craft</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Luxury Flacon Showcase */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {/* Ambient Backlight halo */}
            <div
              style={{
                position: 'absolute',
                width: '320px',
                height: '320px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(212,175,55,0.28) 0%, rgba(20,35,31,0.2) 60%, transparent 80%)',
                filter: 'blur(25px)',
              }}
            />

            {/* Luxury Flacon Presentation Card */}
            <div
              style={{
                position: 'relative',
                background: 'linear-gradient(160deg, #101F1B 0%, #0A1311 100%)',
                border: '1px solid #B78B45',
                borderRadius: '20px',
                padding: '24px',
                maxWidth: '420px',
                width: '100%',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(183, 139, 69, 0.25)',
                textAlign: 'center',
              }}
            >
              {/* Top Tag */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  fontSize: '0.74rem',
                  color: '#E8CA89',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid rgba(183, 139, 69, 0.2)',
                  paddingBottom: '10px',
                }}
              >
                <span>Maison RUMÉRA</span>
                <span>Atelier Discovery Vial • 2.5 ml</span>
              </div>

              {/* Flacon Image */}
              <div
                style={{
                  position: 'relative',
                  height: '280px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: '#070C0A',
                  marginBottom: '18px',
                }}
              >
                <img
                  src={resolveImageUrl('/images/rumera_founder_edition.jpg')}
                  alt="Rumera Discovery Sample"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                  onError={(e) => {
                    e.currentTarget.src = '/images/rumera_white_oud_hero.jpg';
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(10, 19, 17, 0.88)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid #B78B45',
                    color: '#FAF7F0',
                    padding: '4px 10px',
                    borderRadius: '50px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  Complimentary 100%
                </div>
              </div>

              {/* Flacon Caption */}
              <h4
                style={{
                  fontFamily: 'var(--font-serif, Georgia, serif)',
                  fontSize: '1.25rem',
                  color: '#FAF7F0',
                  margin: '0 0 6px',
                }}
              >
                Experience Awadh Royalty
              </h4>
              <p
                style={{
                  fontSize: '0.82rem',
                  color: '#B6C4BC',
                  margin: '0 0 16px',
                  lineHeight: 1.5,
                }}
              >
                Hand-poured in antique copper degs. Aged wild Assam agarwood, Damascus roses, and sacred Mysore sandalwood.
              </p>

              {/* Sample Voucher Callout */}
              <div
                style={{
                  backgroundColor: 'rgba(183, 139, 69, 0.12)',
                  border: '1px dashed #D4AF37',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '0.78rem', color: '#FAF7F0' }}>Bonus Voucher with Sample</span>
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#E8CA89',
                    letterSpacing: '0.06em',
                  }}
                >
                  15% OFF Full Bottle
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

