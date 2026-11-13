import React, { useState, useEffect } from 'react';
import {
  X,
  Gift,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Truck,
  Copy,
  ExternalLink,
  MessageCircle,
  ArrowRight,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { api, resolveImageUrl } from '../../services/api';

const InstagramIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',
  'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function FreeSampleModal({
  isOpen,
  onClose,
  campaignConfig,
  availableFragrances = [],
  onNavigateToShop
}) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address_line1: '',
    city: '',
    state: 'Uttar Pradesh',
    pincode: '',
    preferred_product_id: null,
    sample_quantity: 1,
    terms_accepted: true,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successResult, setSuccessResult] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Set default preferred fragrance once fragrances load
  useEffect(() => {
    if (availableFragrances.length > 0 && !formData.preferred_product_id) {
      setFormData((prev) => ({
        ...prev,
        preferred_product_id: availableFragrances[0].id,
      }));
    }
  }, [availableFragrances]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrorMsg('');
  };

  const handleSelectFragrance = (productId) => {
    setFormData((prev) => ({ ...prev, preferred_product_id: productId }));
  };

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Client-side validations
    if (!formData.full_name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMsg('Please provide a valid 10-digit Indian mobile number.');
      return;
    }
    if (!formData.address_line1.trim() || formData.address_line1.trim().length < 8) {
      setErrorMsg('Please provide your complete delivery address (House/Flat, Street, Landmark).');
      return;
    }
    if (!formData.city.trim()) {
      setErrorMsg('Please enter your city.');
      return;
    }
    const cleanPin = formData.pincode.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit PIN code.');
      return;
    }
    if (!formData.terms_accepted) {
      setErrorMsg('Please accept the sampling terms and privacy policy.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.claimFreeSample({
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: cleanPhone,
        address_line1: formData.address_line1.trim(),
        city: formData.city.trim(),
        state: formData.state,
        pincode: cleanPin,
        preferred_product_id: formData.preferred_product_id,
        sample_quantity: 1,
        terms_accepted: formData.terms_accepted,
      });

      setSuccessResult(res);
    } catch (err) {
      setErrorMsg(err.message || 'Unable to register sample request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedFragrance = availableFragrances.find(
    (f) => f.id === formData.preferred_product_id
  ) || availableFragrances[0];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 10, 8, 0.88)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div
        style={{
          position: 'relative',
          backgroundColor: '#0E1A16',
          border: '1px solid #B78B45',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.8), 0 0 35px rgba(183, 139, 69, 0.25)',
          color: '#FAF7F0',
          padding: '36px 32px',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#B6C4BC',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
          }}
          title="Close"
        >
          <X size={22} />
        </button>

        {/* VIEW 1: SUCCESS CONFIRMATION */}
        {successResult ? (
          <div style={{ textAlign: 'center', padding: '12px 8px' }}>
            {/* Crown Celebration */}
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(212,175,55,0.25) 0%, rgba(183,139,69,0.1) 100%)',
                border: '1px solid #D4AF37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 0 25px rgba(212,175,55,0.35)',
              }}
            >
              <CheckCircle2 size={38} color="#D4AF37" />
            </div>

            <div
              style={{
                fontSize: '0.78rem',
                letterSpacing: '0.14em',
                color: '#E8CA89',
                textTransform: 'uppercase',
                fontWeight: 700,
                marginBottom: '8px',
              }}
            >
              Imperial Reservation Confirmed
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-serif, Georgia, serif)',
                fontSize: '1.9rem',
                color: '#FAF7F0',
                margin: '0 0 12px',
              }}
            >
              Your Complimentary Flacon is Reserved!
            </h3>

            <p
              style={{
                fontSize: '0.92rem',
                color: '#B6C4BC',
                maxWidth: '520px',
                margin: '0 auto 24px',
                lineHeight: 1.6,
              }}
            >
              Honoured Patron, our Awadh Master Perfumers have received your bespoke discovery reservation.
              Your 2.5ml pure extrait flacon is queued for dispatch.
            </p>

            {/* Request ID Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid #B78B45',
                borderRadius: '10px',
                padding: '12px 24px',
                marginBottom: '28px',
              }}
            >
              <span style={{ fontSize: '0.84rem', color: '#B6C4BC' }}>Reservation Reference ID:</span>
              <span
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#FAF7F0',
                  letterSpacing: '0.08em',
                  fontFamily: 'monospace',
                }}
              >
                {successResult.request_id}
              </span>
            </div>

            {/* Conversion Incentive VIP Coupon Card */}
            {successResult.vip_reward && (
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(183,139,69,0.18) 0%, rgba(20,35,31,0.6) 100%)',
                  border: '1px dashed #D4AF37',
                  borderRadius: '14px',
                  padding: '24px',
                  maxWidth: '540px',
                  margin: '0 auto 28px',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Sparkles size={16} color="#D4AF37" />
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#E8CA89',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Exclusive Patron Welcome Voucher
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '1.15rem',
                    fontFamily: 'var(--font-serif, Georgia, serif)',
                    color: '#FAF7F0',
                    marginBottom: '8px',
                  }}
                >
                  Enjoy 15% OFF on Any Full-Sized Flacon Order
                </div>

                <p style={{ fontSize: '0.82rem', color: '#B6C4BC', margin: '0 0 16px', lineHeight: 1.5 }}>
                  Apply this VIP voucher at checkout when investing in a full 12ml, 50ml, or 100ml flacon.
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#091310',
                    border: '1px solid rgba(212,175,55,0.4)',
                    borderRadius: '8px',
                    padding: '10px 16px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#D4AF37',
                      letterSpacing: '0.12em',
                      fontFamily: 'monospace',
                    }}
                  >
                    {successResult.vip_reward.coupon_code}
                  </span>
                  <button
                    onClick={() => handleCopyCoupon(successResult.vip_reward.coupon_code)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'none',
                      border: 'none',
                      color: copiedCode ? '#10B981' : '#E8CA89',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Copy size={14} />
                    <span>{copiedCode ? 'COPIED!' : 'COPY CODE'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Social & Contact Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '14px',
                flexWrap: 'wrap',
                marginBottom: '24px',
              }}
            >
              {/* WhatsApp Enquiry Button */}
              <a
                href={`https://wa.me/919305988767?text=Hello%20RUMÉRA%20Team%2C%20I%20have%20reserved%20a%20free%20sample%20with%20Reservation%20ID%20${encodeURIComponent(
                  successResult.request_id
                )}.%20Please%20guide%20me%20on%20the%20dispatch%20timeline.`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '50px',
                  backgroundColor: '#25D366',
                  color: '#08130E',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <MessageCircle size={16} />
                <span>WhatsApp Atelier Support</span>
              </a>

              {/* Instagram Profile */}
              <a
                href="https://instagram.com/rumeraluxury"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '50px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FAF7F0',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <InstagramIcon size={16} color="#E1306C" />
                <span>Follow @rumeraluxury</span>
              </a>

              {/* Explore Shop CTA */}
              <button
                onClick={() => {
                  onClose();
                  if (onNavigateToShop) onNavigateToShop();
                }}
                className="btn-gold"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '50px',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #B78B45 100%)',
                  color: '#0D1714',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <span>Explore Full Collection</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        ) : (
          /* VIEW 2: REGISTRATION & SELECTION FORM */
          <div>
            {/* Modal Header */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 14px',
                  borderRadius: '50px',
                  backgroundColor: 'rgba(183, 139, 69, 0.15)',
                  border: '1px solid #B78B45',
                  color: '#E8CA89',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                <Gift size={13} color="#D4AF37" />
                <span>Complimentary Discovery Allocation</span>
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-serif, Georgia, serif)',
                  fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)',
                  color: '#FAF7F0',
                  margin: '0 0 8px',
                }}
              >
                Experience Maison RUMÉRA
              </h2>

              <p
                style={{
                  fontSize: '0.88rem',
                  color: '#B6C4BC',
                  maxWidth: '560px',
                  margin: '0 auto',
                  lineHeight: 1.5,
                }}
              >
                Select your coveted flacon. We will dispatch an authentic 2.5ml artisanal extrait sample directly to your doorstep.
              </p>
            </div>

            {errorMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid #EF4444',
                  borderRadius: '8px',
                  color: '#FCA5A5',
                  fontSize: '0.85rem',
                  marginBottom: '20px',
                }}
              >
                <AlertCircle size={18} color="#EF4444" style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* STEP 1: FRAGRANCE SELECTION */}
              <div style={{ marginBottom: '26px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#E8CA89',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    1. Select Preferred Fragrance
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#8E9B94' }}>
                    1 Complimentary Sample / Patron
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                    gap: '12px',
                    maxHeight: '220px',
                    overflowY: 'auto',
                    padding: '4px',
                  }}
                >
                  {availableFragrances.map((fragrance) => {
                    const isSelected = formData.preferred_product_id === fragrance.id;
                    return (
                      <div
                        key={fragrance.id}
                        onClick={() => handleSelectFragrance(fragrance.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          backgroundColor: isSelected ? 'rgba(183, 139, 69, 0.16)' : 'rgba(0, 0, 0, 0.3)',
                          border: isSelected ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.08)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <img
                          src={resolveImageUrl(fragrance.primary_image)}
                          alt={fragrance.name}
                          style={{
                            width: '46px',
                            height: '46px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            backgroundColor: '#070C0A',
                            flexShrink: 0,
                          }}
                          onError={(e) => {
                            e.currentTarget.src = '/images/rumera_white_oud_hero.jpg';
                          }}
                        />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div
                            style={{
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              color: isSelected ? '#FAF7F0' : '#D1DDD6',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {fragrance.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#B78B45' }}>
                            {fragrance.category_name || fragrance.fragrance_family || 'Royal Attar'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: CUSTOMER CONTACT & DELIVERY DETAILS */}
              <div style={{ marginBottom: '22px' }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#E8CA89',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '14px',
                  }}
                >
                  2. Delivery Address & Patron Details
                </span>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '14px',
                    marginBottom: '14px',
                  }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#B6C4BC', marginBottom: '5px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      required
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="e.g. Ruvi Ansari"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        backgroundColor: '#08120F',
                        border: '1px solid rgba(183, 139, 69, 0.4)',
                        borderRadius: '6px',
                        color: '#FAF7F0',
                        fontSize: '0.86rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#B6C4BC', marginBottom: '5px' }}>
                      Mobile Number (For Delivery Tracking) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      maxLength={12}
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        backgroundColor: '#08120F',
                        border: '1px solid rgba(183, 139, 69, 0.4)',
                        borderRadius: '6px',
                        color: '#FAF7F0',
                        fontSize: '0.86rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#B6C4BC', marginBottom: '5px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="patron@example.com"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        backgroundColor: '#08120F',
                        border: '1px solid rgba(183, 139, 69, 0.4)',
                        borderRadius: '6px',
                        color: '#FAF7F0',
                        fontSize: '0.86rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#B6C4BC', marginBottom: '5px' }}>
                      Sample Quantity
                    </label>
                    <input
                      type="text"
                      disabled
                      value="1 Complimentary Flacon (2.5ml)"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        color: '#E8CA89',
                        fontSize: '0.86rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* Delivery Street Address */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#B6C4BC', marginBottom: '5px' }}>
                    Complete Postal Address (House/Flat No, Landmark, Street) *
                  </label>
                  <textarea
                    name="address_line1"
                    required
                    rows={2}
                    value={formData.address_line1}
                    onChange={handleInputChange}
                    placeholder="Enter full physical address for courier delivery"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      backgroundColor: '#08120F',
                      border: '1px solid rgba(183, 139, 69, 0.4)',
                      borderRadius: '6px',
                      color: '#FAF7F0',
                      fontSize: '0.86rem',
                      boxSizing: 'border-box',
                      resize: 'none',
                    }}
                  />
                </div>

                {/* City, State, PIN Code */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '14px',
                  }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#B6C4BC', marginBottom: '5px' }}>
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Lucknow"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        backgroundColor: '#08120F',
                        border: '1px solid rgba(183, 139, 69, 0.4)',
                        borderRadius: '6px',
                        color: '#FAF7F0',
                        fontSize: '0.86rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#B6C4BC', marginBottom: '5px' }}>
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        backgroundColor: '#08120F',
                        border: '1px solid rgba(183, 139, 69, 0.4)',
                        borderRadius: '6px',
                        color: '#FAF7F0',
                        fontSize: '0.86rem',
                        boxSizing: 'border-box',
                      }}
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st} style={{ backgroundColor: '#0E1A16' }}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#B6C4BC', marginBottom: '5px' }}>
                      PIN Code (6-Digits) *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="e.g. 226001"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        backgroundColor: '#08120F',
                        border: '1px solid rgba(183, 139, 69, 0.4)',
                        borderRadius: '6px',
                        color: '#FAF7F0',
                        fontSize: '0.86rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontSize: '0.78rem',
                    color: '#B6C4BC',
                    cursor: 'pointer',
                    lineHeight: 1.5,
                  }}
                >
                  <input
                    type="checkbox"
                    name="terms_accepted"
                    checked={formData.terms_accepted}
                    onChange={handleInputChange}
                    style={{ marginTop: '2px', accentColor: '#D4AF37' }}
                  />
                  <span>
                    I accept RUMÉRA's Sampling Terms & Privacy Policy. I understand that complimentary discovery samples are limited to 1 vial per patron / address to ensure authentic fragrance lovers experience the art.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  style={{
                    padding: '12px 22px',
                    borderRadius: '50px',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#B6C4BC',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 34px',
                    borderRadius: '50px',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #C59B55 50%, #B78B45 100%)',
                    color: '#0D1714',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    border: 'none',
                    cursor: loading ? 'wait' : 'pointer',
                    boxShadow: '0 8px 24px rgba(183, 139, 69, 0.4)',
                    opacity: loading ? 0.75 : 1,
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Reserving Flacon...</span>
                    </>
                  ) : (
                    <>
                      <span>RESERVE MY FREE SAMPLE</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
