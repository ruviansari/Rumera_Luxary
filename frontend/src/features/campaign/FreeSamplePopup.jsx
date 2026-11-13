import React, { useState, useEffect } from 'react';
import { X, Gift, Sparkles, ArrowRight } from 'lucide-react';
import { resolveImageUrl } from '../../services/api';

export default function FreeSamplePopup({ onOpenClaimModal }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if popup was already shown in this visitor session
    const hasSeen = sessionStorage.getItem('rumera_sample_popup_seen');
    if (hasSeen) return;

    // Show after 6.5 seconds (within 5–8 second requirement)
    const timer = setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem('rumera_sample_popup_seen', 'true');
    }, 6500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleClaim = () => {
    setIsVisible(false);
    onOpenClaimModal();
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 1000,
        maxWidth: '420px',
        width: 'calc(100vw - 48px)',
        backgroundColor: '#0F1D19',
        border: '1px solid #B78B45',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75), 0 0 30px rgba(183, 139, 69, 0.3)',
        color: '#FAF7F0',
        animation: 'slideUpPopup 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <style>{`
        @keyframes slideUpPopup {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      {/* Close Button */}
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          background: 'none',
          border: 'none',
          color: '#8E9B94',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.2s',
        }}
        title="Dismiss"
      >
        <X size={18} />
      </button>

      {/* Header Pill */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '50px',
          backgroundColor: 'rgba(183, 139, 69, 0.2)',
          border: '1px solid #B78B45',
          color: '#E8CA89',
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '12px',
        }}
      >
        <Sparkles size={12} color="#D4AF37" />
        <span>WAIT! A LITTLE LUXURY FOR YOU</span>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
        <img
          src={resolveImageUrl('/images/rumera_founder_edition.jpg')}
          alt="Rumera Flacon Sample"
          style={{
            width: '74px',
            height: '74px',
            borderRadius: '10px',
            objectFit: 'cover',
            border: '1px solid rgba(183,139,69,0.3)',
            backgroundColor: '#070C0A',
            flexShrink: 0,
          }}
          onError={(e) => {
            e.currentTarget.src = '/images/rumera_white_oud_hero.jpg';
          }}
        />
        <div>
          <h4
            style={{
              fontFamily: 'var(--font-serif, Georgia, serif)',
              fontSize: '1.15rem',
              color: '#FAF7F0',
              margin: '0 0 6px',
              lineHeight: 1.25,
            }}
          >
            Complimentary Discovery Flacon
          </h4>
          <p
            style={{
              fontSize: '0.82rem',
              color: '#B6C4BC',
              margin: 0,
              lineHeight: 1.45,
            }}
          >
            Get a complimentary RUMÉRA fragrance sample and discover your signature scent.
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleClaim}
        className="btn-gold"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px 20px',
          borderRadius: '50px',
          background: 'linear-gradient(135deg, #D4AF37 0%, #C59B55 50%, #B78B45 100%)',
          color: '#0D1714',
          fontWeight: 700,
          fontSize: '0.84rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(183, 139, 69, 0.4)',
        }}
      >
        <span>CLAIM MY FREE SAMPLE</span>
        <ArrowRight size={15} />
      </button>

      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#8E9B94',
            fontSize: '0.74rem',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          No thank you, I'll explore without a sample
        </button>
      </div>
    </div>
  );
}

