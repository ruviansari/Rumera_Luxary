import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ShoppingBag, Crown, Sparkles, Check, Gift } from 'lucide-react';
import { api } from '../../services/api';

const BESPOKE_PRODUCT_IMAGES = {
  'royal-quadrumvirate-gift-coffret': '/images/showcase/royal_trio_collection.jpg',
  'gulab-e-khas-ruh-gulab': '/images/showcase/artisanal_gold_cage_front.jpg',
  'rooh-al-assam-vintage': '/images/showcase/royal_emerald_flacon.jpg',
  'rumera-white-oud-extrait': '/images/rumera_white_oud_hero.jpg',
  'kashmir-shamama-tul-amber': '/images/showcase/royal_amber_flacon.jpg',
  'musk-al-sultani-white-musk': '/images/showcase/artisanal_gold_cage_angle.jpg',
  'oud-imperial-extrait-de-parfum': '/images/showcase/royal_amber_flacon.jpg',
};

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onCheckout,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon
}) {
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = cart?.subtotal || 0;
  const freeShippingThreshold = 1999;
  const freeShippingLeft = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const shippingCost = (subtotal - discountAmount) >= freeShippingThreshold || subtotal === 0 ? 0 : 150;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyCoupon = async (e) => {
    if (e) e.preventDefault();
    const codeToApply = couponCode.trim();
    if (!codeToApply) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await api.validateCoupon(codeToApply, subtotal);
      if (res.valid) {
        onApplyCoupon(res);
        setCouponCode('');
      } else {
        setCouponError(res.message);
      }
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleQuickCoupon = async (code) => {
    setCouponCode(code);
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await api.validateCoupon(code, subtotal);
      if (res.valid) {
        onApplyCoupon(res);
        setCouponCode('');
      } else {
        setCouponError(res.message);
      }
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2500, display: 'flex', justifyContent: 'flex-end', backgroundColor: 'rgba(9, 18, 16, 0.78)', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.25s ease' }}>
      {/* Backdrop click dismiss */}
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />

      {/* Drawer Surface */}
      <div
        className="royal-cart-drawer"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#FAF8F4',
          boxShadow: '-12px 0 40px rgba(0,0,0,0.45)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
          borderLeft: '1px solid rgba(183, 139, 69, 0.35)',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* 1. Royal Atelier Header */}
        <div
          style={{
            padding: '18px 22px',
            backgroundColor: '#14231F',
            color: '#FAF7F0',
            borderBottom: '1px solid rgba(183, 139, 69, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 18px rgba(0,0,0,0.25)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: 'rgba(183, 139, 69, 0.18)', border: '1px solid #B78B45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Crown size={17} color="#D4AF37" />
            </div>
            <div>
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 700 }}>
                Maison Ruméra Atelier
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#FAF7F0', margin: 0, lineHeight: 1.2 }}>
                Your Olfactory Vault
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#D4AF37', backgroundColor: 'rgba(183,139,69,0.15)', border: '1px solid rgba(183,139,69,0.3)', padding: '3px 9px', borderRadius: '20px', fontWeight: 600 }}>
              {cart?.total_items || 0} {cart?.total_items === 1 ? 'Flacon' : 'Flacons'}
            </span>
            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#FAF7F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Close Vault"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* 2. Free Express Shipping Progress Banner */}
        <div style={{ padding: '12px 22px', backgroundColor: '#F3EFE7', borderBottom: '1px solid #E5DFC9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', marginBottom: '6px' }}>
            {freeShippingLeft > 0 ? (
              <span style={{ color: '#4A5B53' }}>
                Add <strong style={{ color: '#14231F' }}>₹{freeShippingLeft.toLocaleString('en-IN')}</strong> for Complimentary Express Courier
              </span>
            ) : (
              <span style={{ color: '#1E5E41', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Check size={14} color="#1E5E41" />
                <span>Complimentary Express Shipping Unlocked!</span>
              </span>
            )}
            <span style={{ fontSize: '0.7rem', color: '#B78B45', fontWeight: 700 }}>
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#E2DBD0', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #B78B45 0%, #E8CA89 50%, #B78B45 100%)',
                boxShadow: '0 0 8px rgba(183, 139, 69, 0.6)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* 3. Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {(!cart?.items || cart.items.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '60px 16px', margin: 'auto 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(183, 139, 69, 0.12)', border: '1px solid rgba(183, 139, 69, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <ShoppingBag size={28} color="#B78B45" />
              </div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#14231F', marginBottom: '6px' }}>
                Your Olfactory Vault is Empty
              </h4>
              <p style={{ fontSize: '0.84rem', color: '#687870', maxWidth: '300px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                Reserve your pure Assamese agarwoods, Kannauj rose extracts, and royal signature flacons.
              </p>
              <button
                onClick={onClose}
                className="btn-gold btn-primary"
                style={{ padding: '10px 22px', fontSize: '0.82rem', borderRadius: '24px' }}
              >
                Explore Collection
              </button>
            </div>
          ) : (
            cart.items.map((item) => {
              const bespokeImg = BESPOKE_PRODUCT_IMAGES[item.product_slug] || item.product_image || '/images/showcase/royal_emerald_flacon.jpg';
              return (
                <div
                  key={item.id}
                  className="cart-item-card"
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '14px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #EAE4D6',
                    boxShadow: '0 2px 12px rgba(20, 35, 31, 0.04)',
                    position: 'relative',
                    transition: 'all 0.25s ease'
                  }}
                >
                  {/* Flacon Visual Frame */}
                  <div
                    style={{
                      width: '76px',
                      height: '88px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#0A1412',
                      border: '1px solid rgba(183, 139, 69, 0.3)',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    <img
                      src={bespokeImg}
                      alt={item.product_name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }}
                    />
                  </div>

                  {/* Item Content Details */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                    <div>
                      <div style={{ fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B78B45', fontWeight: 700, marginBottom: '2px' }}>
                        Haute Concentré
                      </div>
                      <h4
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1rem',
                          color: '#14231F',
                          lineHeight: 1.25,
                          margin: '0 0 4px 0',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                        title={item.product_name}
                      >
                        {item.product_name}
                      </h4>

                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#5C6B63', backgroundColor: '#FAF8F4', padding: '2px 8px', borderRadius: '4px', border: '1px solid #ECE7DC' }}>
                        <span>Flacon:</span>
                        <strong style={{ color: '#14231F' }}>{item.variant.volume_size}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                      {/* Price Lockup */}
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: '#14231F', fontWeight: 700 }}>
                        ₹{Number(item.variant.price * item.quantity).toLocaleString('en-IN')}
                        {item.quantity > 1 && (
                          <span style={{ fontSize: '0.68rem', color: '#8E9B94', fontWeight: 500, marginLeft: '4px' }}>
                            (₹{Number(item.variant.price).toLocaleString('en-IN')} ea)
                          </span>
                        )}
                      </div>

                      {/* Controls (Stepper + Remove) */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #D8D0BC', borderRadius: '20px', backgroundColor: '#FAF8F4', height: '28px', padding: '0 2px' }}>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            style={{ width: '24px', height: '100%', color: '#5C6B63', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Decrease quantity"
                          >
                            <Minus size={11} />
                          </button>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, padding: '0 6px', color: '#14231F' }}>
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            style={{ width: '24px', height: '100%', color: '#5C6B63', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Increase quantity"
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, 0)}
                          style={{ color: '#963832', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', opacity: 0.7, transition: 'opacity 0.2s' }}
                          title="Remove item"
                          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7'; }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 4. Luxury Footer & Checkout Summary */}
        {cart?.items?.length > 0 && (
          <div
            style={{
              padding: '18px 22px',
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid #E5DFC9',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 -8px 24px rgba(0,0,0,0.04)'
            }}
          >
            {/* Promo Code Input & Privilege Chip */}
            <div>
              {appliedCoupon ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(183,139,69,0.12)', border: '1px dashed #B78B45', padding: '8px 12px', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                    <Tag size={14} color="#B78B45" />
                    <span>Royal Privilege <strong>{appliedCoupon.code}</strong> applied (-₹{Number(appliedCoupon.discount).toLocaleString('en-IN')})</span>
                  </div>
                  <button onClick={onRemoveCoupon} style={{ color: '#963832', fontSize: '0.72rem', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="text"
                      placeholder="ENTER PRIVILEGE CODE (E.G. ROYAL10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #D8D0BC',
                        borderRadius: '6px',
                        textTransform: 'uppercase',
                        fontSize: '0.76rem',
                        letterSpacing: '0.04em',
                        backgroundColor: '#FCFAF6'
                      }}
                    />
                    <button
                      type="submit"
                      disabled={couponLoading}
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '0.74rem', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </form>

                  {/* 1-Tap Coupon Chip */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.68rem', color: '#7E9187' }}>Royal Privilege:</span>
                    <button
                      type="button"
                      onClick={() => handleQuickCoupon('ROYAL10')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.68rem',
                        color: '#8F6627',
                        backgroundColor: 'rgba(183, 139, 69, 0.1)',
                        border: '1px solid rgba(183, 139, 69, 0.3)',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      <Sparkles size={11} color="#B78B45" />
                      <span>Use ROYAL10 (10% Off)</span>
                    </button>
                  </div>
                </div>
              )}
              {couponError && <div style={{ color: '#963832', fontSize: '0.74rem', marginTop: '4px' }}>{couponError}</div>}
            </div>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.82rem', color: '#5C6B63', borderTop: '1px solid #F0ECE2', paddingTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span style={{ color: '#14231F', fontWeight: 600 }}>₹{Number(subtotal).toLocaleString('en-IN')}</span>
              </div>
              {appliedCoupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#1E5E41', fontWeight: 600 }}>
                  <span>Privilege Voucher ({appliedCoupon.code})</span>
                  <span>-₹{Number(discountAmount).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Luxury Gifting Box & Wand</span>
                <span style={{ color: '#1E5E41', fontWeight: 600 }}>Complimentary</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Pan-India Insured Express</span>
                <span>{shippingCost === 0 ? <strong style={{ color: '#1E5E41' }}>FREE</strong> : `₹${shippingCost}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '1.25rem', fontWeight: 700, color: '#14231F', paddingTop: '8px', borderTop: '1px solid #EBE4D5' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>Total Payable</span>
                  <div style={{ fontSize: '0.64rem', color: '#8E9B94', fontWeight: 400, marginTop: '-2px' }}>Taxes included</div>
                </div>
                <span style={{ fontFamily: 'var(--font-serif)', color: '#14231F', fontSize: '1.4rem' }}>
                  ₹{Number(finalTotal).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => { onClose(); onCheckout(); }}
              className="btn-gold btn-primary"
              style={{
                width: '100%',
                padding: '13px 20px',
                fontSize: '0.86rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                borderRadius: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(183, 139, 69, 0.35)',
                cursor: 'pointer'
              }}
            >
              <Crown size={15} />
              <span>Proceed to Royal Checkout</span>
              <ArrowRight size={15} />
            </button>

            {/* Trust Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.7rem', color: '#8E9B94' }}>
              <ShieldCheck size={13} color="#2A684C" />
              <span>256-Bit SSL Encrypted • Serialized Awadhi Hydro-Distillations</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .cart-item-card:hover {
          border-color: #D4AF37 !important;
          box-shadow: 0 4px 18px rgba(183, 139, 69, 0.15) !important;
        }
      `}</style>
    </div>
  );
}
