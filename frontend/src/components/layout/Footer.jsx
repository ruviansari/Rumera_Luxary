import React from 'react';
import { ShieldCheck, Award, Truck, Droplets, Share2, Globe, Mail, Phone, Clock, Crown } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer style={{ backgroundColor: '#09120F', color: '#FFFFFF', borderTop: '2px solid rgba(183, 139, 69, 0.35)', paddingTop: '48px', paddingBottom: '30px' }}>
      {/* 1. Trust & Craftsmanship Bar */}
      <div className="container" style={{ borderBottom: '1px solid rgba(183, 139, 69, 0.2)', paddingBottom: '36px', marginBottom: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          <div className="footer-trust-card" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div className="trust-icon-box">
              <Droplets size={18} color="#D4AF37" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px', color: '#FAF7F0', fontWeight: 600, transition: 'color 0.25s' }}>
                100% Pure Oil Concentrates
              </h4>
              <p style={{ fontSize: '0.74rem', color: '#8E9F96', lineHeight: 1.55 }}>
                Undiluted natural botanicals, wild agarwood resins, zero ethyl alcohol or synthetic extenders.
              </p>
            </div>
          </div>

          <div className="footer-trust-card" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div className="trust-icon-box">
              <Award size={18} color="#D4AF37" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px', color: '#FAF7F0', fontWeight: 600, transition: 'color 0.25s' }}>
                Kannauj Deg-Bhapka Heritage
              </h4>
              <p style={{ fontSize: '0.74rem', color: '#8E9F96', lineHeight: 1.55 }}>
                Slow hydro-distillation in wood-fired copper cauldrons over genuine aged sandalwood receivers.
              </p>
            </div>
          </div>

          <div className="footer-trust-card" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div className="trust-icon-box">
              <Truck size={18} color="#D4AF37" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px', color: '#FAF7F0', fontWeight: 600, transition: 'color 0.25s' }}>
                Insured White-Glove Dispatch
              </h4>
              <p style={{ fontSize: '0.74rem', color: '#8E9F96', lineHeight: 1.55 }}>
                Discreet tamper-evident packaging with real-time end-to-end tracking to every Indian postal code.
              </p>
            </div>
          </div>

          <div className="footer-trust-card" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div className="trust-icon-box">
              <ShieldCheck size={18} color="#D4AF37" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px', color: '#FAF7F0', fontWeight: 600, transition: 'color 0.25s' }}>
                Artisanal Guarantee
              </h4>
              <p style={{ fontSize: '0.74rem', color: '#8E9F96', lineHeight: 1.55 }}>
                Every flacon carries a serialized batch certificate authenticated by Er. Rumana Ansari.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Columns with Crisp High-Contrast Legibility */}
      <div className="container footer-columns-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '36px', marginBottom: '38px' }}>
        {/* Brand & Direct Contact Column */}
        <div className="footer-brand-col">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <img
              src="/images/rumera_crest_emblem.png"
              alt="Rumera Logo"
              style={{
                height: '40px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 8px rgba(183, 139, 69, 0.45))',
                transition: 'transform 0.3s ease'
              }}
              className="footer-crest-img"
            />
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', letterSpacing: '0.14em', color: '#FAF7F0', fontWeight: 600, lineHeight: 1.15 }}>
                RUMERA LUXURY ATRA
              </div>
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.2em', color: '#D4AF37', textTransform: 'uppercase', marginTop: '2px' }}>
                Haute Parfumerie Heritage
              </div>
            </div>
          </div>
          <p style={{ fontSize: '0.76rem', color: '#8E9F96', lineHeight: 1.6, marginBottom: '16px' }}>
            Handcrafted natural attars, vintage Assamese Dehn Al Oud, and royal floral roohs hydro-distilled in traditional copper cauldrons.
          </p>

          {/* Prominent Direct Phone & WhatsApp Box */}
          <div className="footer-concierge-card" style={{ backgroundColor: 'rgba(20, 35, 31, 0.75)', border: '1px solid rgba(183, 139, 69, 0.35)', padding: '12px 14px', borderRadius: '8px', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 700, marginBottom: '4px' }}>
              Direct Concierge & Orders
            </div>
            <a
              href="tel:+919305988767"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FAF7F0', fontSize: '1rem', fontWeight: 700, textDecoration: 'none', transition: 'color 0.2s' }}
              className="concierge-phone-link"
            >
              <Phone size={15} color="#D4AF37" />
              <span>+91 9305988767</span>
            </a>
            <a
              href="mailto:ruviansari144@gmail.com"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E8CA89', fontSize: '0.84rem', fontWeight: 600, textDecoration: 'none', marginTop: '6px' }}
            >
              <Mail size={14} color="#D4AF37" />
              <span>ruviansari144@gmail.com</span>
            </a>
            <div style={{ fontSize: '0.68rem', color: '#7E9187', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={11} color="#A0B2A9" />
              <span>Call / WhatsApp • 10:00 AM – 8:00 PM IST</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <a href="tel:+919305988767" className="footer-pill-btn">
              <Phone size={13} />
              <span>Call Us</span>
            </a>
            <a href="mailto:ruviansari144@gmail.com" className="footer-pill-btn">
              <Mail size={13} />
              <span>ruviansari144@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Olfactory Collections */}
        <div className="footer-nav-col footer-col-collections">
          <h4 className="footer-heading" style={{ fontSize: '0.74rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '16px', fontWeight: 700 }}>
            The Collections
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><button onClick={() => onNavigate('shop', { category: 'dehn-al-oud' })} className="footer-link">Vintage Dehn Al Oud</button></li>
            <li><button onClick={() => onNavigate('shop', { category: 'artisanal-attars' })} className="footer-link">Kannauj Ruh Gulab & Attars</button></li>
            <li><button onClick={() => onNavigate('shop', { category: 'amber-musk' })} className="footer-link">Royal Shamama & White Musk</button></li>
            <li><button onClick={() => onNavigate('shop', { category: 'extrait-de-parfum' })} className="footer-link">Extrait de Parfum (Atomizers)</button></li>
            <li><button onClick={() => onNavigate('shop', { category: 'gift-sets' })} className="footer-link">Luxury Discovery Coffrets</button></li>
          </ul>
        </div>

        {/* The House & Founder */}
        <div className="footer-nav-col footer-col-house">
          <h4 className="footer-heading" style={{ fontSize: '0.74rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '16px', fontWeight: 700 }}>
            The House
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <button onClick={() => onNavigate('owner')} className="footer-link">
                <span>Founder:&nbsp;</span>
                <span style={{ color: '#E8CA89', fontWeight: 600 }}>Er.&nbsp;Rumana&nbsp;Ansari</span>
              </button>
            </li>
            <li><button onClick={() => onNavigate('about')} className="footer-link">Our Distillation Heritage</button></li>
            <li><button onClick={() => onNavigate('shop')} className="footer-link">The Royal Flacon Atelier</button></li>
            <li><button onClick={() => onNavigate('order-tracking')} className="footer-link">Track Consignment (AWB)</button></li>
            <li>
              <a href="tel:+919305988767" className="footer-link" style={{ color: '#D4AF37' }}>
                <span>Helpline:&nbsp;</span>
                <span style={{ fontWeight: 600 }}>+91&nbsp;9305988767</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Client Care & Legal Policies */}
        <div className="footer-nav-col footer-col-policies">
          <h4 className="footer-heading" style={{ fontSize: '0.74rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '16px', fontWeight: 700 }}>
            Client Care & Policies
          </h4>
          <ul className="footer-policies-list" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><button onClick={() => onNavigate('policy', { slug: 'shipping-policy' })} className="footer-link">Shipping & Delivery Policy</button></li>
            <li><button onClick={() => onNavigate('policy', { slug: 'returns-refunds' })} className="footer-link">Returns & Guarantee Policy</button></li>
            <li><button onClick={() => onNavigate('policy', { slug: 'faq' })} className="footer-link">Frequently Asked Questions</button></li>
            <li><button onClick={() => onNavigate('policy', { slug: 'privacy-policy' })} className="footer-link">Privacy Policy</button></li>
            <li><button onClick={() => onNavigate('policy', { slug: 'terms' })} className="footer-link">Terms of Service</button></li>
          </ul>
        </div>
      </div>

      {/* 3. Bottom Legal & Contact Strip */}
      <div className="container footer-bottom-strip" style={{ borderTop: '1px solid rgba(183, 139, 69, 0.15)', paddingTop: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#7E9187', gap: '12px' }}>
        <div className="footer-copyright-text">
          © {new Date().getFullYear()} <strong style={{ color: '#FAF7F0', fontWeight: 600 }}>Rumera Luxury Atra</strong>. Formulated under the guidance of <span style={{ color: '#D4AF37', whiteSpace: 'nowrap' }}>Er.&nbsp;Rumana&nbsp;Ansari</span>. All rights reserved.
        </div>
        <div className="footer-bottom-badges">
          <a href="tel:+919305988767" className="footer-badge-item bottom-phone-link">
            <Phone size={12} color="#D4AF37" />
            <span>+91 9305988767</span>
          </a>
          <span className="footer-badge-dot">•</span>
          <a href="mailto:ruviansari144@gmail.com" className="footer-badge-item bottom-phone-link">
            <Mail size={12} color="#D4AF37" />
            <span>ruviansari144@gmail.com</span>
          </a>
          <span className="footer-badge-dot">•</span>
          <span className="footer-badge-item">
            <Truck size={12} color="#D4AF37" />
            <span>Pan-India Insured Express</span>
          </span>
          <span className="footer-badge-dot">•</span>
          <span className="footer-badge-item">
            <ShieldCheck size={12} color="#D4AF37" />
            <span>INR (₹) Standard</span>
          </span>
        </div>
      </div>

      <style>{`
        /* Trust Badges Styling & Hover */
        .trust-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(183, 139, 69, 0.1);
          border: 1px solid rgba(183, 139, 69, 0.28);
          flex-shrink: 0;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .footer-trust-card {
          transition: transform 0.3s ease;
        }
        .footer-trust-card:hover {
          transform: translateY(-2px);
        }
        .footer-trust-card:hover .trust-icon-box {
          background: rgba(212, 175, 55, 0.22);
          border-color: #D4AF37;
          box-shadow: 0 0 14px rgba(212, 175, 55, 0.35);
          transform: scale(1.06);
        }
        .footer-trust-card:hover h4 {
          color: #E8CA89 !important;
        }

        /* Concierge Card Hover */
        .footer-concierge-card {
          transition: all 0.3s ease;
        }
        .footer-concierge-card:hover {
          border-color: #D4AF37 !important;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6), 0 0 16px rgba(183, 139, 69, 0.2);
          transform: translateY(-2px);
        }
        .concierge-phone-link:hover {
          color: #D4AF37 !important;
        }

        /* Contact Pill Buttons Hover */
        .footer-pill-btn {
          color: #FAF7F0 !important;
          padding: 6px 14px;
          background: rgba(183, 139, 69, 0.12);
          border: 1px solid rgba(183, 139, 69, 0.32);
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.74rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .footer-pill-btn:hover {
          background: linear-gradient(135deg, #B78B45 0%, #D2A862 100%);
          color: #14231F !important;
          border-color: #D2A862;
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(183, 139, 69, 0.4);
        }

        /* Footer Links - Clean luxury typography with no dashes, hyphens, or pseudo-dots */
        .footer-link {
          background: none;
          border: none;
          padding: 4px 0;
          cursor: pointer;
          text-align: left;
          display: inline-block;
          color: #9EABA4;
          font-size: 0.84rem;
          letter-spacing: 0.02em;
          text-decoration: none;
          transition: color 0.22s ease;
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        .footer-link:hover,
        .footer-link:focus-visible {
          color: #E8CA89 !important;
        }

        .footer-link:active {
          color: #D4AF37 !important;
        }

        .footer-badge-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          color: #8E9F96;
          text-decoration: none;
          transition: color 0.2s;
        }

        .bottom-phone-link {
          color: #E8CA89 !important;
        }
        .bottom-phone-link:hover {
          color: #D4AF37 !important;
        }

        .footer-crest-img:hover {
          transform: scale(1.06);
        }

        /* Mobile Layout: 2 Columns Side-by-Side Rows */
        @media (max-width: 768px) {
          .footer-columns-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px 16px !important;
            margin-bottom: 26px !important;
          }
          .footer-brand-col {
            grid-column: 1 / -1 !important;
          }
          .footer-col-collections {
            grid-column: 1 !important;
          }
          .footer-col-house {
            grid-column: 2 !important;
          }
          .footer-col-policies {
            grid-column: 1 / -1 !important;
            border-top: 1px solid rgba(183, 139, 69, 0.2) !important;
            padding-top: 18px !important;
            margin-top: 6px !important;
          }
          .footer-policies-list {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 6px 16px !important;
          }
          .footer-heading {
            font-size: 0.74rem !important;
            letter-spacing: 0.12em !important;
            margin-bottom: 10px !important;
          }
          .footer-link {
            font-size: 0.8rem !important;
            padding: 3px 0 !important;
            line-height: 1.35 !important;
          }
          .footer-bottom-strip {
            flex-direction: column !important;
            text-align: center !important;
            gap: 14px !important;
            padding-top: 20px !important;
          }
          .footer-copyright-text {
            font-size: 0.74rem !important;
            line-height: 1.6 !important;
            color: #8E9F96 !important;
          }
          .footer-bottom-badges {
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 8px 10px !important;
            width: 100% !important;
          }
          .footer-badge-item {
            white-space: nowrap !important;
            background: rgba(183, 139, 69, 0.08) !important;
            border: 1px solid rgba(183, 139, 69, 0.25) !important;
            border-radius: 9999px !important;
            padding: 5px 12px !important;
            font-size: 0.72rem !important;
            color: #DCD7CE !important;
          }
          .footer-badge-dot {
            display: none !important;
          }
        }

        @media (max-width: 380px) {
          .footer-columns-grid {
            gap: 20px 10px !important;
          }
          .footer-policies-list {
            gap: 6px 10px !important;
          }
          .footer-heading {
            font-size: 0.7rem !important;
          }
          .footer-link {
            font-size: 0.76rem !important;
          }
        }
      `}</style>
    </footer>
  );
}
