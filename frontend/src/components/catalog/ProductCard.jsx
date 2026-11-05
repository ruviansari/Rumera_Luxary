import React from 'react';
import { ShoppingBag, Eye, Heart } from 'lucide-react';

const BESPOKE_PRODUCT_IMAGES = {
  'royal-quadrumvirate-gift-coffret': '/images/showcase/royal_trio_collection.jpg',
  'gulab-e-khas-ruh-gulab': '/images/showcase/artisanal_gold_cage_front.jpg',
  'rooh-al-assam-vintage': '/images/showcase/royal_emerald_flacon.jpg',
  'rumera-white-oud-extrait': '/images/rumera_white_oud_hero.jpg',
  'kashmir-shamama-tul-amber': '/images/showcase/royal_amber_flacon.jpg',
  'musk-al-sultani-white-musk': '/images/showcase/artisanal_gold_cage_angle.jpg',
  'oud-imperial-extrait-de-parfum': '/images/showcase/royal_amber_flacon.jpg',
};

export default function ProductCard({ product, onSelect, onQuickAdd, isWishlisted = false, onToggleWishlist }) {
  const activeVariant = product.variants?.[0];
  const inStock = activeVariant ? activeVariant.stock_quantity > 0 : false;

  // Resolve unique bespoke Rumera bottle image
  const cardImage = BESPOKE_PRODUCT_IMAGES[product.slug] || product.primary_image || '/images/showcase/royal_amber_flacon.jpg';

  // Clean volume size string so '(Complete Set)' or '(1/4 Tola)' doesn't cause awkward line wraps
  const rawSize = activeVariant?.volume_size || '3 ml';
  const cleanSize = rawSize.replace(/\s*\([^)]*\)/g, '').trim();

  // Primary badge priority: Bestseller > Rare Reserve
  const badgeLabel = product.is_bestseller ? 'Bestseller' : (product.is_featured ? 'Rare Reserve' : null);

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #EAE5D8',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        boxShadow: '0 4px 18px rgba(20, 35, 31, 0.04)'
      }}
      className="product-card"
    >
      {/* Refined Single Floating Badge with Luxury Frosted Aesthetic */}
      {badgeLabel && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 2,
            backgroundColor: 'rgba(15, 26, 23, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(212, 175, 55, 0.45)',
            color: '#F0D495',
            fontSize: '0.62rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '3px 10px',
            borderRadius: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
          }}
        >
          {badgeLabel}
        </div>
      )}

      {/* Floating Wishlist Heart */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist && onToggleWishlist(product.id);
        }}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 3,
          backgroundColor: 'rgba(15, 26, 23, 0.75)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(212, 175, 55, 0.45)',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0
        }}
        title="Royal Wishlist"
      >
        <Heart size={15} color="#F0D495" fill={isWishlisted ? "#D4AF37" : "none"} />
      </button>

      {/* Image Area with luxury hover zoom */}
      <div
        onClick={() => onSelect(product.slug)}
        style={{
          position: 'relative',
          paddingTop: '86%',
          backgroundColor: '#0F1A17',
          cursor: 'pointer',
          overflow: 'hidden'
        }}
      >
        <img
          src={cardImage}
          alt={product.name}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 25%',
            transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="product-img"
        />

        {/* Olfactory category tag overlay (Refined Glass Pill) */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            backgroundColor: 'rgba(15, 26, 23, 0.82)',
            backdropFilter: 'blur(8px)',
            color: '#E8CA89',
            border: '1px solid rgba(183, 139, 69, 0.4)',
            fontSize: '0.62rem',
            padding: '3px 10px',
            borderRadius: '20px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          {product.category?.name || 'Pure Attar'}
        </div>
      </div>

      {/* Product Content Details (Clean Luxury Layout with Reduced Clutter) */}
      <div style={{ padding: '16px 16px 14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {/* Eyebrow Subtitle */}
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#B78B45', fontWeight: 600, marginBottom: '4px' }}>
            {product.concentration || 'Pure Perfume Oil'}
          </div>

          {/* Product Title (Consistent 2-line height alignment) */}
          <h3
            onClick={() => onSelect(product.slug)}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.08rem',
              color: '#14231F',
              cursor: 'pointer',
              lineHeight: 1.3,
              minHeight: '2.8rem',
              marginBottom: '6px',
              fontWeight: 500,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              transition: 'color 0.25s ease'
            }}
            className="product-title"
          >
            {product.name}
          </h3>

          {/* Single-line Fragrance Accord Hook (Clean & Professional, replaces bulky paragraph) */}
          <p
            style={{
              fontSize: '0.74rem',
              color: '#6E7C74',
              fontStyle: 'italic',
              lineHeight: 1.3,
              marginBottom: '10px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {product.fragrance_family || product.short_description || 'Artisanal Reserve Extrait'}
          </p>
        </div>

        <div>
          {/* Volume size & Price (Clean Single-Line Alignment, No Awkward Wrap) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #EFEAE0', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '0.7rem', color: '#8E9B94', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Size:</span>
              <span style={{ fontSize: '0.76rem', fontWeight: 600, color: '#14231F' }}>
                {cleanSize}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px' }}>
              {activeVariant?.compare_at_price && (
                <span style={{ fontSize: '0.76rem', color: '#9AA7A0', textDecoration: 'line-through' }}>
                  ₹{Number(activeVariant.compare_at_price).toLocaleString('en-IN')}
                </span>
              )}
              <span style={{ fontSize: '1.12rem', fontWeight: 700, color: '#B78B45', fontFamily: 'var(--font-serif)' }}>
                ₹{Number(product.base_price || (activeVariant ? activeVariant.price : 0)).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Action Buttons (Refined Proportions & Smooth Luxury Glow) */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => onSelect(product.slug)}
              className="product-explore-btn"
            >
              <Eye size={13} />
              <span>Explore Notes</span>
            </button>

            {inStock ? (
              <button
                onClick={() => onQuickAdd(activeVariant.id)}
                className="product-cart-btn"
                title="Quick Add to Cart"
                aria-label="Add to Cart"
              >
                <ShoppingBag size={15} />
              </button>
            ) : (
              <span style={{ fontSize: '0.72rem', color: '#963832', display: 'flex', alignItems: 'center', fontWeight: 600, padding: '0 6px' }}>
                Sold Out
              </span>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .product-card {
          border-radius: 16px;
          overflow: hidden;
        }
        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(20, 35, 31, 0.1), 0 0 20px rgba(183, 139, 69, 0.15);
          border-color: #B78B45 !important;
        }
        .product-card:hover .product-img {
          transform: scale(1.06);
        }
        .product-card:hover .product-title {
          color: #B78B45 !important;
        }

        .product-explore-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          height: 36px;
          border-radius: 9999px;
          border: 1.5px solid #14231F;
          background: transparent;
          color: #14231F;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .product-explore-btn:hover {
          background: #14231F;
          color: #FAF7F0;
          box-shadow: 0 4px 14px rgba(20, 35, 31, 0.2);
          transform: translateY(-1px);
        }
        .product-explore-btn:active {
          transform: translateY(0);
        }

        .product-cart-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid #14231F;
          background: #14231F;
          color: #FFFFFF;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          flex-shrink: 0;
        }
        .product-cart-btn:hover {
          background: linear-gradient(135deg, #B78B45, #D2A862);
          border-color: #B78B45;
          color: #14231F;
          box-shadow: 0 6px 18px rgba(183, 139, 69, 0.4);
          transform: translateY(-1px) scale(1.04);
        }
        .product-cart-btn:active {
          transform: translateY(0) scale(0.98);
        }
      `}</style>
    </div>
  );
}
