import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Droplets, Award, Compass, Shield, Trees, ShieldCheck, Hourglass, CheckCircle2, Crown, Gem, Eye, X, ZoomIn, ChevronLeft, ChevronRight, Sparkles, Gift, Layers } from 'lucide-react';
import ProductCard from '../../components/catalog/ProductCard';
import FreeSampleBanner from '../campaign/FreeSampleBanner';
import SampleTestimonials from '../campaign/SampleTestimonials';
import HomeScrollHero from './HomeScrollHero';

const ROYAL_FLACONS = [
  {
    id: 'founder-edition',
    image: '/images/rumera_founder_edition.jpg',
    title: 'Ruméra Founder Edition',
    edition: 'Er. Rumana Ansari Signature Coffret',
    notes: 'Aged Wild Assam Oud • Royal Damascena Rose • White Ambergris • Mysore Teak',
    craft: '24K Gold Multifaceted Crystal Flacon & Serialized Founder Coffret',
    description: 'The crowning masterpiece of Maison Rumera: personally formulated, olfactory-tested on pulse points, and signed by Master Perfumer Er. Rumana Ansari. Accompanied by the commemorative Founder Edition black & gold coffret.',
    slug: 'rumera-white-oud-extrait',
    volume: '50 ml Royal Extrait',
    category: 'dehn-al-oud'
  },
  {
    id: 'amber',
    image: '/images/showcase/royal_amber_flacon.jpg',
    title: 'Royal Amber Crystal Flacon',
    edition: 'Awadhi Golden Vault Edition',
    notes: '30-Year Aged Ambergris • Wild Civet Accord • Roasted Shamama Botanicals',
    craft: 'Octagonal Beveled Crystal with 24K Royal Crown Cap',
    description: 'A radiant golden jewel capturing the spirit of 19th-century royal courts. Distilled in antique copper cauldrons with pure golden ambergris and ceremonial spices.',
    slug: 'shamama-shahi-1984',
    volume: '10 ml Concentré',
    category: 'attar-concentrate'
  },
  {
    id: 'emerald',
    image: '/images/showcase/royal_emerald_flacon.jpg',
    title: 'Emerald Imperial Extrait',
    edition: '24K Crown Emerald Reserve',
    notes: 'Wild Assam Dehn Al Oud • Mysore Sandalwood • Taif Damascena Rose',
    craft: 'Hand-Carved Crystal Flacon with 24-Karat Gold Royal Finial',
    description: 'An architectural jewel inspired by imperial Awadhi treasures. Handcrafted green emerald crystal encased in solid gold filigree, housing concentrated non-alcoholic Dehn Al Oud extrait matured over a decade.',
    slug: 'rumera-white-oud-extrait',
    volume: '12 ml Pure Extrait',
    category: 'dehn-al-oud'
  },
  {
    id: 'cage-front',
    image: '/images/showcase/artisanal_gold_cage_front.jpg',
    title: 'Sultani Gold Cage Flacon',
    edition: 'Artisanal Filigree Atelier',
    notes: 'Kannauj Rooh Motia • Indian Jasmine Sambac • Vintage Vetiver',
    craft: 'Gilded Mughal Jali Lattice Cage with Onion Dome Finial',
    description: 'A hand-wrought golden cage reminiscent of royal palace jali screens. Holds 100% pure steam-distilled floral rooh hydro-distilled in traditional copper deg-bapka.',
    slug: 'rooh-gulab-kannauj',
    volume: '6 ml Pure Attar',
    category: 'pure-rooh'
  },
  {
    id: 'cage-angle',
    image: '/images/showcase/artisanal_gold_cage_angle.jpg',
    title: 'The Golden Lattice Flacon',
    edition: 'Master Perfumer Serialized Reserve',
    notes: 'Vintage Ruh Khus (Wild Vetiver) • Assam Agarwood Smoke • Golden Amber',
    craft: 'Multi-Perspective Golden Lattice Work & Serialized Seal',
    description: 'Every flacon is individually numbered and certified by Er. Rumana Ansari. Hand-poured with aged Ruh Khus distilled from roots harvested along the riverbanks of Rajasthan.',
    slug: 'ruh-khus-rajasthan',
    volume: '12 ml Flacon',
    category: 'attar-concentrate'
  },
  {
    id: 'trio',
    image: '/images/showcase/royal_trio_collection.jpg',
    title: 'The Royal Tawaif Trinity',
    edition: 'Imperial Awadh Heritage Vault',
    notes: 'Pure Rooh Gulab • Wild Assam Oud • Sacred Ruh Khus',
    craft: 'Three Historic Museum-Grade Flacons in Velvet Presentation Box',
    description: 'The collector masterpiece: Three distinct hand-gilded flacons representing the holy trinity of Indian haute perfumery. Hand-distilled without alcohol or synthetic fixatives.',
    slug: 'rumera-royal-discovery-vault',
    volume: '3 × 10 ml Collector Set',
    category: 'pure-rooh'
  }
];

const HERO_HANGING_FLACONS = [
  {
    id: 'hang-emerald',
    title: 'Rumera Emerald Extrait',
    flaconIndex: 1,
    image: '/images/showcase/royal_emerald_flacon.jpg',
    className: 'hang-pos-1',
    threadHeight: '52px'
  },
  {
    id: 'hang-sapphire',
    title: 'Rumera Sapphire Attar',
    flaconIndex: 2,
    image: '/images/showcase/royal_sapphire_flacon.jpg',
    className: 'hang-pos-2',
    threadHeight: '44px'
  },
  {
    id: 'hang-amber',
    title: 'Rumera Amber Crystal',
    flaconIndex: 0,
    image: '/images/showcase/royal_amber_flacon_v2.jpg',
    className: 'hang-pos-3',
    threadHeight: '60px'
  },
  {
    id: 'hang-aquamarine',
    title: 'Rumera Aquamarine Reserve',
    flaconIndex: 3,
    image: '/images/showcase/royal_aquamarine_flacon.jpg',
    className: 'hang-pos-4',
    threadHeight: '48px'
  }
];

const BESPOKE_CATEGORY_IMAGES = {
  'dehn-al-oud': '/images/showcase/royal_emerald_flacon.jpg',
  'artisanal-attars': '/images/showcase/royal_sapphire_flacon.jpg',
  'amber-musk': '/images/showcase/royal_amber_flacon_v2.jpg',
  'extrait-de-parfum': '/images/showcase/royal_aquamarine_flacon.jpg',
  'gift-coffrets': '/images/showcase/royal_trio_collection.jpg',
  'gift-sets': '/images/showcase/royal_trio_collection.jpg',
};

const FALLBACK_CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Dehn Al Oud',
    slug: 'dehn-al-oud',
    product_count: 1,
    subtitle: 'Imperial Assam & Cambodian Agarwood',
    image_url: '/images/showcase/royal_emerald_flacon.jpg'
  },
  {
    id: 'cat-2',
    name: 'Artisanal Attars',
    slug: 'artisanal-attars',
    product_count: 1,
    subtitle: 'Kannauj Deg-Bhapka Steam Concentrates',
    image_url: '/images/showcase/royal_sapphire_flacon.jpg'
  },
  {
    id: 'cat-3',
    name: 'Amber & Royal Musk',
    slug: 'amber-musk',
    product_count: 2,
    subtitle: 'Warm Golden Ambers & Sacred Vegan Musks',
    image_url: '/images/showcase/royal_amber_flacon_v2.jpg'
  },
  {
    id: 'cat-4',
    name: 'Extrait de Parfum',
    slug: 'extrait-de-parfum',
    product_count: 1,
    subtitle: 'High-Concentration French-Oriental Sprays',
    image_url: '/images/showcase/royal_aquamarine_flacon.jpg'
  },
  {
    id: 'cat-5',
    name: 'Luxury Gift Coffrets',
    slug: 'gift-coffrets',
    product_count: 1,
    subtitle: 'Bespoke Velvet Presentation Discovery Sets',
    image_url: '/images/showcase/royal_trio_collection.jpg'
  }
];

const CATEGORY_SUBTITLES = {
  'dehn-al-oud': 'Imperial Assam Oud',
  'artisanal-attars': 'Kannauj Steam Attar',
  'amber-musk': 'Golden Amber & Musk',
  'extrait-de-parfum': 'Pure Extrait Parfum',
  'gift-coffrets': 'Imperial Discovery Vault',
};

export default function HomePage({
  categories = [],
  featuredProducts = [],
  ownerProfile = null,
  onNavigate,
  onQuickAdd,
  wishlist = [],
  onToggleWishlist,
  campaignConfig = null,
  onOpenSampleModal = () => {}
}) {
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [selectedFlacon, setSelectedFlacon] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);



  // Hero showcase image is fixed on the iconic Royal Amber Crystal Flacon
  const activeFlacon = ROYAL_FLACONS[activeHeroIndex];

  return (
    <div>
      {/* 1. Scroll-Linked Luxury Flacon Hero (Bottle Falls Down and Up with Scroll) */}
      <HomeScrollHero
        onNavigate={onNavigate}
        onOpenSampleModal={onOpenSampleModal}
      />

      {/* 3.5. Free Perfume Sample Marketing Campaign Hero Banner */}
      <FreeSampleBanner
        campaignConfig={campaignConfig}
        onOpenClaimModal={onOpenSampleModal}
      />

      {/* 4. Featured Masterpiece Reserves */}
      <section style={{ padding: '80px 0', backgroundColor: '#FFFFFF', borderTop: '1px solid #E5DFC9', borderBottom: '1px solid #E5DFC9' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', gap: '16px' }}>
            <div>
              <div className="editorial-sub">Royal Archives</div>
              <h2 className="editorial-title">Featured Curations</h2>
            </div>
            <button onClick={() => onNavigate('shop')} className="btn-secondary" style={{ padding: '10px 22px' }}>
              <span>View All Creations</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
            {featuredProducts.slice(0, 12).map((product) => {
              const isWishlisted = wishlist.some(item => (item.product?.id || item.product_id || item.id) === product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(slug) => onNavigate('product', { slug })}
                  onQuickAdd={onQuickAdd}
                  isWishlisted={isWishlisted}
                  onToggleWishlist={onToggleWishlist}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Owner & Master Nose Preview Banner */}
      <section style={{ backgroundColor: '#14231F', color: '#F8F4EC', padding: '72px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="container founder-preview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          {/* Portrait & Founder Edition Showcase */}
          <div style={{ position: 'relative', maxWidth: '540px', margin: '0 auto', width: '100%' }}>
            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(183, 139, 69, 0.75)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65), 0 0 30px rgba(183, 139, 69, 0.25)' }}>
              <img
                src={ownerProfile?.portrait_url || '/images/rumera_founder_edition.jpg'}
                alt={ownerProfile?.display_name || 'Er. Rumana Ansari - Founder Edition'}
                className="founder-preview-img"
                style={{ width: '100%', height: 'auto', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', top: '14px', left: '14px', backgroundColor: 'rgba(20, 35, 31, 0.9)', backdropFilter: 'blur(8px)', border: '1px solid #B78B45', borderRadius: '20px', padding: '6px 14px', fontSize: '0.72rem', color: '#FAF7F0', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                👑 Founder Edition • Master Perfumer Olfactory Evaluation
              </div>
            </div>
            <div
              className="founder-atelier-badge"
              style={{
                position: 'absolute',
                bottom: '-16px',
                right: '-12px',
                backgroundColor: '#0D1714',
                border: '1px solid #B78B45',
                padding: '14px 22px',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#B78B45', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>Founder & Master Perfumer</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#FFFFFF' }}>
                {ownerProfile?.display_name || 'Er. Rumana Ansari'}
              </div>
            </div>
          </div>

          {/* Editorial Content */}
          <div>
            <div className="editorial-sub" style={{ color: '#B78B45' }}>From The Founder's Atelier</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', lineHeight: 1.2, marginBottom: '24px', color: '#FAF7F0' }}>
              "{ownerProfile?.quote || 'Fragrance is the invisible architecture of emotion, etched in memories that never fade.'}"
            </h2>
            <p style={{ color: '#B6C4BC', fontSize: '0.96rem', lineHeight: 1.8, marginBottom: '28px' }}>
              {ownerProfile?.short_bio || 'Dedicated to reviving the royal heritage of pure Indian attars with contemporary artisanal craftsmanship.'}
            </p>

            <button
              onClick={() => onNavigate('owner')}
              className="btn-gold btn-primary"
              style={{ padding: '14px 28px' }}
            >
              <span>Read The Founder's Journey</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Pure Craftsmanship Standards */}
      <section style={{ padding: '80px 0', backgroundColor: '#F8F4EC' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <div className="editorial-sub">Artisanal Purity Charter</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#14231F' }}>
              Crafted Without Compromise
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '32px' }}>
            <div className="craft-card">
              <div className="craft-icon-badge">
                <Trees size={30} strokeWidth={1.75} />
              </div>
              <h4 className="craft-title">
                Ethical Assamese Aquilaria
              </h4>
              <p className="craft-desc">
                Direct stewardship partnerships with Assam cultivators ensuring sustainable wild tree replenishment with zero chemical induction.
              </p>
              <div className="craft-footer-tag">
                <CheckCircle2 size={13} color="#B78B45" />
                <span>Assam Valley Certified</span>
              </div>
            </div>

            <div className="craft-card">
              <div className="craft-icon-badge">
                <ShieldCheck size={30} strokeWidth={1.75} />
              </div>
              <h4 className="craft-title">
                Zero Alcohol or Synthetics
              </h4>
              <p className="craft-desc">
                Every flacon contains 100% pure concentrated oil extract. Safe for sensitive skin, ceremonial prayers, and daily meditation.
              </p>
              <div className="craft-footer-tag">
                <CheckCircle2 size={13} color="#B78B45" />
                <span>100% Attar Concentré</span>
              </div>
            </div>

            <div className="craft-card">
              <div className="craft-icon-badge">
                <Hourglass size={30} strokeWidth={1.75} />
              </div>
              <h4 className="craft-title">
                Slow Barrel Aging
              </h4>
              <p className="craft-desc">
                Distillates mature in porous clay vessels and antique teakwood barrels for up to twelve years to round sharp top edges into velvety perfection.
              </p>
              <div className="craft-footer-tag">
                <CheckCircle2 size={13} color="#B78B45" />
                <span>12-Year Teakwood Matured</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Royal Flacon Inspection Modal */}
      {selectedFlacon && (
        <div
          onClick={() => setSelectedFlacon(null)}
          className="flacon-modal-overlay"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flacon-modal-box"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedFlacon(null)}
              className="flacon-modal-close-btn"
              aria-label="Close Modal"
            >
              <X size={18} />
            </button>

            {/* Modal Left: Flacon Showcase Image (Complete Bottle Visible) */}
            <div className="flacon-modal-img-card">
              <img
                src={selectedFlacon.image}
                alt={selectedFlacon.title}
                className="flacon-modal-img"
              />
            </div>

            {/* Modal Right: Flacon Details & Story */}
            <div className="flacon-modal-info" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#F8F4EC' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#D4AF37', fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
                <Crown size={14} color="#D4AF37" />
                <span>Haute Parfumerie Flacon</span>
                <span>•</span>
                <span>{selectedFlacon.volume}</span>
              </div>

              <h2 className="flacon-modal-title">
                {selectedFlacon.title}
              </h2>

              <div style={{ fontSize: '0.84rem', color: '#E8CA89', fontStyle: 'italic', marginBottom: '14px' }}>
                {selectedFlacon.craft}
              </div>

              <div className="flacon-modal-notes-box" style={{ backgroundColor: '#0F1C18', border: '1px solid rgba(183, 139, 69, 0.25)', padding: '14px 18px', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B78B45', fontWeight: 700, marginBottom: '4px' }}>
                  Olfactory Notes Profile
                </div>
                <div style={{ fontSize: '0.88rem', color: '#FAF7F0', lineHeight: 1.5 }}>
                  {selectedFlacon.notes}
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: '#B6C4BC', lineHeight: 1.6, marginBottom: '20px' }}>
                {selectedFlacon.description}
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    setSelectedFlacon(null);
                    onNavigate('shop', { category: selectedFlacon.category });
                  }}
                  className="btn-gold btn-primary"
                  style={{ flex: 1, padding: '12px', fontSize: '0.86rem' }}
                >
                  <span>Acquire In Shop</span>
                  <ArrowRight size={16} />
                </button>

                <a
                  href="tel:+919305988767"
                  className="btn-secondary"
                  style={{
                    padding: '12px 18px',
                    fontSize: '0.86rem',
                    color: '#FAF7F0',
                    borderColor: 'rgba(183, 139, 69, 0.45)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none'
                  }}
                >
                  <span>Concierge Inquiry</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5.5. Free Sample Patron Testimonials & Conversion Section */}
      <SampleTestimonials
        onOpenClaimModal={onOpenSampleModal}
        onNavigateToShop={() => onNavigate('shop')}
      />

      <style>{`
        /* 1. Perfume Floating / Levitation Animation */
        .perfume-floating-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: perfumeLevitate 5s ease-in-out infinite;
          z-index: 2;
        }

        @keyframes perfumeLevitate {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-9px) rotate(0.4deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }

        /* 2. Dynamic Crystal Light Sheen Sweep Across Glass */
        .perfume-shimmer-sheen {
          position: absolute;
          top: -60%;
          left: -80%;
          width: 50%;
          height: 220%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(212, 175, 55, 0.03) 25%,
            rgba(255, 248, 220, 0.28) 50%,
            rgba(212, 175, 55, 0.03) 75%,
            transparent 100%
          );
          transform: rotate(25deg);
          pointer-events: none;
          animation: lightSheenSweep 5.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          z-index: 3;
        }

        @keyframes lightSheenSweep {
          0% {
            transform: translateX(-160%) rotate(25deg);
          }
          32%, 100% {
            transform: translateX(450%) rotate(25deg);
          }
        }

        /* 3. Ambient Golden Breathing Aura in Background */
        .perfume-ambient-aura {
          position: absolute;
          inset: 12%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.32) 0%, rgba(183, 139, 69, 0.12) 50%, transparent 72%);
          filter: blur(28px);
          animation: auraPulse 4s ease-in-out infinite alternate;
          pointer-events: none;
          z-index: 1;
        }

        .perfume-card-aura {
          position: absolute;
          inset: 18%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.22) 0%, rgba(183, 139, 69, 0.08) 50%, transparent 72%);
          filter: blur(22px);
          animation: auraPulse 4s ease-in-out infinite alternate;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes auraPulse {
          0% {
            transform: scale(0.92);
            opacity: 0.35;
          }
          100% {
            transform: scale(1.15);
            opacity: 0.8;
          }
        }

        /* 4. Floating Gold Dust Particles */
        .gold-dust-sparkle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #E8CA89;
          box-shadow: 0 0 6px #D4AF37;
          pointer-events: none;
          z-index: 2;
          animation: goldDustDrift 6s infinite ease-in-out;
        }
        .gds-1 { top: 35%; left: 22%; animation-delay: 0s; }
        .gds-2 { top: 60%; left: 78%; animation-delay: 1.5s; width: 4px; height: 4px; }
        .gds-3 { top: 75%; left: 30%; animation-delay: 3s; width: 2.5px; height: 2.5px; }
        .gds-4 { top: 25%; left: 72%; animation-delay: 4.5s; }

        @keyframes goldDustDrift {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.6);
          }
          40% {
            opacity: 0.85;
            transform: translateY(-8px) scale(1.1);
          }
          80% {
            opacity: 0.4;
            transform: translateY(-20px) scale(0.8);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px) scale(0.5);
          }
        }

        /* 5. Luxury Bottle Switching Entry Animation */
        @keyframes bottleSwitchLuxury {
          0% {
            opacity: 0.25;
            transform: scale(0.94) translateY(10px);
            filter: brightness(1.2) contrast(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: brightness(1) contrast(1);
          }
        }

        /* 6. Card Hover Interactions */
        .hero-bottle-card:hover {
          box-shadow: 0 35px 80px -10px rgba(0, 0, 0, 0.95), 0 0 50px rgba(212, 175, 55, 0.45) !important;
          border-color: #D4AF37 !important;
          transform: translateY(-4px);
        }
        .hero-bottle-card:hover .hero-bottle-img {
          transform: scale(1.05);
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .flacon-atelier-card {
          transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .flacon-atelier-card:hover {
          transform: translateY(-8px);
          border-color: #D4AF37 !important;
          box-shadow: 0 24px 50px rgba(0, 0, 0, 0.75), 0 0 30px rgba(183, 139, 69, 0.4) !important;
        }
        .flacon-atelier-card:hover .flacon-card-img {
          transform: scale(1.07) translateY(-4px);
          filter: drop-shadow(0 15px 25px rgba(212, 175, 55, 0.35));
        }

        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
        }
        .category-card:hover .cat-img {
          transform: scale(1.08);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Flacon Inspection Modal Styles */
        .flacon-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background-color: rgba(9, 18, 16, 0.94);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: fadeIn 0.25s ease;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .flacon-modal-box {
          position: relative;
          background-color: #14231F;
          border: 1px solid #B78B45;
          border-radius: 16px;
          max-width: 920px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.8), 0 0 40px rgba(183, 139, 69, 0.3);
          display: grid;
          grid-template-columns: minmax(320px, 1fr) 1.2fr;
          gap: 32px;
          padding: 36px;
          box-sizing: border-box;
        }

        .flacon-modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: rgba(9, 18, 16, 0.85);
          border: 1px solid rgba(183, 139, 69, 0.4);
          color: #FAF7F0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.25s ease;
        }
        .flacon-modal-close-btn:hover {
          background-color: #D4AF37;
          color: #091210;
        }

        .flacon-modal-img-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(183, 139, 69, 0.45);
          background-color: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          min-height: 340px;
          box-sizing: border-box;
        }

        .flacon-modal-img {
          width: 100%;
          height: 100%;
          max-height: 440px;
          object-fit: contain;
          display: block;
        }

        .flacon-modal-title {
          font-family: var(--font-serif);
          font-size: 2.1rem;
          color: #FAF7F0;
          margin-bottom: 10px;
          line-height: 1.2;
        }

        @media (max-width: 768px) {
          .flacon-modal-overlay {
            padding: 12px 10px !important;
            align-items: center !important;
          }

          .flacon-modal-box {
            display: flex !important;
            flex-direction: column !important;
            grid-template-columns: 1fr !important;
            padding: 18px 16px 22px !important;
            gap: 14px !important;
            max-height: 88vh !important;
            border-radius: 14px !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            overflow-x: hidden !important;
          }

          /* User request: Reduce card height on mobile */
          .flacon-modal-img-card {
            min-height: unset !important;
            height: 195px !important;
            max-height: 205px !important;
            padding: 10px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }

          .flacon-modal-img {
            max-height: 175px !important;
            width: auto !important;
            height: 100% !important;
            object-fit: contain !important;
          }

          .flacon-modal-title {
            font-size: 1.35rem !important;
            line-height: 1.25 !important;
            margin-bottom: 6px !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
          }

          .flacon-modal-close-btn {
            top: 10px !important;
            right: 10px !important;
            width: 32px !important;
            height: 32px !important;
          }

          .flacon-modal-notes-box {
            padding: 10px 14px !important;
            margin-bottom: 12px !important;
          }

          .flacon-card-img-container {
            height: 210px !important;
          }
        }

        @media (max-width: 640px) {
          .hero-container {
            padding: 36px 16px !important;
          }
          .hero-content-grid {
            gap: 28px !important;
          }
          .founder-preview-grid {
            gap: 32px !important;
          }
          .founder-preview-img {
            height: auto !important;
            aspect-ratio: 4 / 3;
          }
          .founder-atelier-badge {
            bottom: 8px !important;
            right: 8px !important;
            padding: 10px 14px !important;
            background-color: rgba(13, 23, 20, 0.94) !important;
          }
        }

        @media (max-width: 380px) {
          .flacon-modal-box {
            padding: 16px 12px 18px !important;
          }
          .flacon-modal-img-card {
            height: 170px !important;
          }
          .flacon-modal-img {
            max-height: 155px !important;
          }
          .flacon-modal-title {
            font-size: 1.2rem !important;
          }
          .flacon-card-img-container {
            height: 190px !important;
          }
        }
      `}</style>
    </div>
  );
}
