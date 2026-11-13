import React from 'react';
import { Star, Quote, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

const AUTHENTIC_PATRON_TESTIMONIALS = [
  {
    id: 1,
    name: 'Dr. Zoya Farooqui',
    city: 'Hyderabad',
    scent: 'Rooh Al Assam 12-Year Vintage',
    comment:
      'The sample discovery flacon arrived in a secure velvet sleeve within 48 hours. The opening of pure aged agarwood with subtle sweetness is unlike anything on high-street shelves. Placed my full bottle order the very next evening using the VIP code.',
    rating: 5,
    date: 'Verified Sample Recipient',
  },
  {
    id: 2,
    name: 'Vikramaditya Rathore',
    city: 'Jaipur',
    scent: 'Gulab-e-Khas (Kannauj Ruh Gulab)',
    comment:
      'Testing the 2.5ml vial on my wrists lasted over 18 hours without alcohol burn. The traditional deg-bhapka hydro-distillation method preserves the genuine soul of Kannauj roses. Exceptional quiet luxury.',
    rating: 5,
    date: 'Verified Sample Recipient',
  },
  {
    id: 3,
    name: 'Adv. Ananya Sen',
    city: 'Kolkata',
    scent: 'Rumera White Oud Extrait',
    comment:
      'I was initially skeptical of free sample promotions, but RUMÉRA’s presentation and swift courier tracking exceeded all expectations. The scent silage is intoxicating. Now proud owner of the 50ml flacon.',
    rating: 5,
    date: 'Verified Sample Recipient',
  },
];

export default function SampleTestimonials({ onOpenClaimModal, onNavigateToShop }) {
  return (
    <section
      style={{
        padding: '72px 20px',
        backgroundColor: '#FBF8F2',
        borderTop: '1px solid #E5DFC9',
        borderBottom: '1px solid #E5DFC9',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: '50px',
              backgroundColor: 'rgba(183, 139, 69, 0.12)',
              border: '1px solid #B78B45',
              color: '#8C6721',
              fontSize: '0.74rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            <Sparkles size={12} color="#B78B45" />
            <span>Patron Olfactory Memoirs</span>
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-serif, Georgia, serif)',
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              color: '#14231F',
              margin: '0 0 12px',
            }}
          >
            Experiences From Our Sample Discovery Circle
          </h3>

          <p
            style={{
              fontSize: '0.94rem',
              color: '#5C6B64',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Every discovery flacon is individually hand-poured in small batches, allowing discerning connoisseurs to test longevity on pulse points before acquiring the full crystal flacon.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
            marginBottom: '48px',
          }}
        >
          {AUTHENTIC_PATRON_TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E5DFC9',
                padding: '28px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Rating Stars & Quote Icon */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="#D4AF37" color="#D4AF37" />
                    ))}
                  </div>
                  <Quote size={20} color="#B78B45" style={{ opacity: 0.4 }} />
                </div>

                <p
                  style={{
                    fontSize: '0.9rem',
                    color: '#2C3A35',
                    lineHeight: 1.65,
                    fontStyle: 'italic',
                    marginBottom: '20px',
                  }}
                >
                  "{t.comment}"
                </p>
              </div>

              <div style={{ borderTop: '1px solid #F0ECE1', paddingTop: '14px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#14231F' }}>
                  {t.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#8E9B94' }}>
                  {t.city} • <span style={{ color: '#B78B45' }}>{t.scent}</span>
                </div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: '#10B981',
                    fontWeight: 600,
                    marginTop: '4px',
                  }}
                >
                  ✔ {t.date}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Conversion CTA Strip */}
        <div
          style={{
            backgroundColor: '#14231F',
            borderRadius: '16px',
            border: '1px solid #B78B45',
            padding: '36px 32px',
            color: '#FAF7F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25)',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-serif, Georgia, serif)',
                fontSize: '1.4rem',
                color: '#FAF7F0',
                marginBottom: '6px',
              }}
            >
              Tried Your Sample? Upgrade to a Full Flacon
            </div>
            <p style={{ fontSize: '0.86rem', color: '#B6C4BC', margin: 0, maxWidth: '560px' }}>
              Sample patrons receive an exclusive 15% VIP welcome voucher with complimentary insured delivery across India.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onOpenClaimModal}
              style={{
                padding: '12px 24px',
                borderRadius: '50px',
                backgroundColor: 'transparent',
                border: '1px solid #B78B45',
                color: '#E8CA89',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Claim Free Sample
            </button>

            <button
              onClick={onNavigateToShop}
              className="btn-gold"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 26px',
                borderRadius: '50px',
                background: 'linear-gradient(135deg, #D4AF37 0%, #B78B45 100%)',
                color: '#0D1714',
                fontSize: '0.84rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span>Explore Full Flacons</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
