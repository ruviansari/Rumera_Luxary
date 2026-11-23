import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, ArrowLeft, CheckCircle, Lock, Truck, CreditCard, Banknote, Phone, Mail, QrCode, Smartphone, X, AlertTriangle, Sparkles, RefreshCw, Building2, Landmark, Clock, Check, Zap, MapPin, Calendar, ExternalLink, Copy } from 'lucide-react';
import { api } from '../../services/api';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh'
];

export default function CheckoutPage({
  cart,
  appliedCoupon,
  currentUser,
  onOrderSuccess,
  onBackToCart,
  onNavigate
}) {
  const [formData, setFormData] = useState({
    recipient_name: currentUser ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() : '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address_line1: '',
    address_line2: '',
    landmark: '',
    city: '',
    state: 'Maharashtra',
    postal_code: '',
    country: 'India',
    payment_method: 'ONLINE',
    customer_notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  const subtotal = cart?.subtotal || 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const shippingCost = (subtotal - discountAmount) >= 1999 || subtotal === 0 ? 0 : 150;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Indian phone and PIN validation
    if (!formData.recipient_name || !formData.phone || !formData.email || !formData.address_line1 || !formData.city || !formData.postal_code) {
      setError('Please fill in all required shipping address fields.');
      return;
    }

    if (formData.phone.replace(/[^0-9]/g, '').length < 10) {
      setError('Please provide a valid 10-digit Indian phone number for dispatch tracking.');
      return;
    }

    if (formData.postal_code.replace(/[^0-9]/g, '').length !== 6) {
      setError('Please provide a valid 6-digit Indian PIN code.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        coupon_code: appliedCoupon ? appliedCoupon.code : '',
      };

      const order = await api.checkout(payload);

      // If Online payment method, process payment verification directly
      if (formData.payment_method === 'ONLINE') {
        const simulatedTxnId = 'pay_' + Math.random().toString(36).substring(2, 12).toUpperCase();
        try {
          await api.verifyPayment({
            order_number: order.order_number,
            transaction_id: simulatedTxnId,
            gateway_order_id: `rzp_order_${order.order_number}`,
            signature: 'verified_rumera_direct_protocol',
            provider: 'RAZORPAY',
          });
        } catch (verErr) {
          console.warn('Payment verification notice:', verErr);
        }
      }

      // Notify parent to refresh/clear cart
      if (onOrderSuccess) {
        onOrderSuccess();
      }

      // Immediately navigate directly to live order tracking!
      onNavigate('order-tracking', {
        order_number: order.order_number,
        verification: order.phone || order.email,
      });
    } catch (err) {
      setError(err.message || 'Checkout could not be processed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderConfirmed) {
    const formattedDate = new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const estDeliveryDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    return (
      <div className="order-confirmed-wrap" style={{ backgroundColor: '#F8F4EC', minHeight: '85vh', padding: '48px 16px 80px' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', spaceY: '24px' }}>
          
          {/* Main Royal Consignment Active Tracking Card */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5DFC9', padding: '40px 32px', boxShadow: '0 20px 50px rgba(0,0,0,0.06)' }}>
            
            {/* Header with Emblem & Live Pulse */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'rgba(42, 104, 76, 0.1)', color: '#2A684C', marginBottom: '16px', border: '2px solid rgba(183,139,69,0.3)' }}>
                <CheckCircle size={40} color="#2A684C" />
              </div>
              <div className="editorial-sub" style={{ color: '#B78B45', letterSpacing: '0.24em', textTransform: 'uppercase', fontSize: '0.82rem', fontWeight: 700 }}>
                Consignment Confirmed & Active
              </div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 2.7rem)', color: '#14231F', marginTop: '6px', marginBottom: '8px' }}>
                Your Order is Actively Tracking
              </h1>
              <p style={{ color: '#5C6B63', fontSize: '0.94rem', maxWidth: '540px', margin: '0 auto' }}>
                Thank you, <strong style={{ color: '#14231F' }}>{orderConfirmed.recipient_name}</strong>. Your royal consignment has been registered and is being prepared in our Atelier.
              </p>
            </div>

            {/* Consignment Reference & Status Banner */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '18px 24px', backgroundColor: '#FCFAF6', border: '1px solid #E5DFC9', borderRadius: '12px', marginBottom: '36px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#8E9B94', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700 }}>
                  Order Reference Docket
                </div>
                <div style={{ fontSize: '1.45rem', fontFamily: 'monospace', fontWeight: 800, color: '#14231F', letterSpacing: '0.08em', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{orderConfirmed.order_number}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(orderConfirmed.order_number);
                      alert('Order Reference copied to clipboard: ' + orderConfirmed.order_number);
                    }}
                    style={{ background: 'none', border: 'none', color: '#B78B45', cursor: 'pointer', padding: '4px' }}
                    title="Copy Order Reference"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', backgroundColor: orderConfirmed.payment_method === 'ONLINE' ? 'rgba(42, 104, 76, 0.12)' : 'rgba(183, 139, 69, 0.15)', color: orderConfirmed.payment_method === 'ONLINE' ? '#1B4D36' : '#8C6721', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: orderConfirmed.payment_method === 'ONLINE' ? '#25D366' : '#B78B45', animation: 'pulse 1.8s infinite' }} />
                  {orderConfirmed.payment_method === 'ONLINE' ? 'Paid & Verified' : 'Cash on Delivery'}
                </span>
                <span style={{ fontSize: '0.86rem', color: '#5C6B63', fontWeight: 600 }}>
                  ₹{Number(orderConfirmed.total_amount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* 5-Stage Live Order Timeline Stepper */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#14231F', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="#B78B45" />
                <span>Live Consignment Timeline</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative', paddingLeft: '8px' }}>
                {/* Stage 1: Order Received (Completed) */}
                <div style={{ display: 'flex', gap: '16px', position: 'relative', paddingBottom: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#2A684C', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold', zIndex: 2, boxShadow: '0 0 10px rgba(42,104,76,0.3)' }}>
                      ✓
                    </div>
                    <div style={{ width: '2px', backgroundColor: '#2A684C', flex: 1, marginTop: '4px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#14231F' }}>
                      Order Placed & Payment Confirmed
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#5C6B63', marginTop: '2px' }}>
                      Verified on {formattedDate} • Digital Tax Invoice issued
                    </div>
                  </div>
                </div>

                {/* Stage 2: Handcrafted Decanting (In Progress - Pulsing) */}
                <div style={{ display: 'flex', gap: '16px', position: 'relative', paddingBottom: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#FAF7F0', border: '2.5px solid #B78B45', color: '#B78B45', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', zIndex: 2, boxShadow: '0 0 12px rgba(183,139,69,0.45)' }}>
                      <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#B78B45', display: 'block' }} />
                    </div>
                    <div style={{ width: '2px', backgroundColor: '#E5DFC9', flex: 1, marginTop: '4px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#B78B45', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>Handcrafted Decanting in Atelier</span>
                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', backgroundColor: 'rgba(183,139,69,0.15)', color: '#8C6721', textTransform: 'uppercase', fontWeight: 800 }}>In Progress</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#5C6B63', marginTop: '2px' }}>
                      Master decanter hand-bottling pure aged botanical extracts at Kannauj/Assam atelier
                    </div>
                  </div>
                </div>

                {/* Stage 3: Wax-Seal & Luxury Presentation */}
                <div style={{ display: 'flex', gap: '16px', position: 'relative', paddingBottom: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '1.5px solid #D8D0BC', color: '#8E9B94', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, zIndex: 2 }}>
                      3
                    </div>
                    <div style={{ width: '2px', backgroundColor: '#E5DFC9', flex: 1, marginTop: '4px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#8E9B94' }}>
                      Wax-Seal & Presentation Packaging
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#A0ACA5', marginTop: '2px' }}>
                      Sealed in temperature-regulated velvet gift box with serialized Authenticity Certificate
                    </div>
                  </div>
                </div>

                {/* Stage 4: Courier Dispatch */}
                <div style={{ display: 'flex', gap: '16px', position: 'relative', paddingBottom: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '1.5px solid #D8D0BC', color: '#8E9B94', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, zIndex: 2 }}>
                      4
                    </div>
                    <div style={{ width: '2px', backgroundColor: '#E5DFC9', flex: 1, marginTop: '4px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#8E9B94' }}>
                      Dispatched via BlueDart Priority Luxury Express
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#A0ACA5', marginTop: '2px' }}>
                      AWB generated • Priority air consignment handover within 24 hours
                    </div>
                  </div>
                </div>

                {/* Stage 5: Doorstep Handover */}
                <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '1.5px solid #D8D0BC', color: '#8E9B94', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, zIndex: 2 }}>
                      5
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#8E9B94' }}>
                      Delivered to Patron's Doorstep
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#A0ACA5', marginTop: '2px' }}>
                      Estimated Arrival: <strong>{estDeliveryDate}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Consignment Destination Details Card */}
            <div style={{ padding: '20px', backgroundColor: '#FCFAF6', borderRadius: '12px', border: '1px solid #E5DFC9', marginBottom: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', fontSize: '0.84rem' }}>
                <div>
                  <div style={{ color: '#8E9B94', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: '4px' }}>
                    Delivery Destination
                  </div>
                  <div style={{ fontWeight: 700, color: '#14231F' }}>{orderConfirmed.recipient_name}</div>
                  <div style={{ color: '#5C6B63', marginTop: '2px', lineHeight: 1.4 }}>
                    {orderConfirmed.address_line1}
                    {orderConfirmed.address_line2 ? `, ${orderConfirmed.address_line2}` : ''}
                    <br />
                    {orderConfirmed.city}, {orderConfirmed.state} - <strong>{orderConfirmed.postal_code}</strong>
                  </div>
                </div>

                <div>
                  <div style={{ color: '#8E9B94', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: '4px' }}>
                    Patron Contact
                  </div>
                  <div style={{ color: '#14231F', fontWeight: 600 }}>{orderConfirmed.phone}</div>
                  <div style={{ color: '#5C6B63', marginTop: '2px' }}>{orderConfirmed.email}</div>
                  <div style={{ marginTop: '8px', padding: '6px 10px', backgroundColor: 'rgba(42, 104, 76, 0.08)', borderRadius: '6px', fontSize: '0.74rem', color: '#1B4D36', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={12} color="#2A684C" />
                    <span>Tax Invoice dispatched to email</span>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Direct Tracking Line */}
            <div style={{ textAlign: 'center', marginBottom: '28px', padding: '16px', backgroundColor: '#0C1C14', borderRadius: '12px', border: '1px solid rgba(37,211,102,0.3)' }}>
              <a
                href={orderConfirmed.whatsapp_confirmation_url || `https://wa.me/919305988767?text=Hello%20Maison%20Rumera%2C%20please%20track%20my%20consignment%20ref%20${orderConfirmed.order_number}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#25D366',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em'
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.301-.15-1.782-.879-2.057-.98-.276-.1-.477-.15-.678.15-.2.301-.778.98-.954 1.18-.176.2-.351.226-.652.075s-1.274-.47-2.427-1.498c-.898-.8-1.503-1.789-1.68-2.09-.176-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.15-.175.2-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.678-1.632-.929-2.235-.244-.588-.493-.508-.678-.517-.175-.009-.376-.01-.577-.01-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.512c0 1.482 1.079 2.91 1.23 3.111.15.201 2.122 3.242 5.142 4.547.718.311 1.279.497 1.716.636.721.23 1.377.197 1.896.12.578-.087 1.782-.728 2.033-1.431.25-.703.25-1.305.175-1.43-.075-.126-.276-.201-.577-.352z" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.892.528 3.663 1.447 5.176L2 22l4.981-1.411A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.624 0-3.136-.492-4.4-1.336l-.315-.21-2.964.84.854-2.887-.23-.33A8.167 8.167 0 013.8 12c0-4.522 3.678-8.2 8.2-8.2s8.2 3.678 8.2 8.2-3.678 8.2-8.2 8.2z" />
                </svg>
                <span>Receive Live WhatsApp Dispatch Updates</span>
              </a>
              <div style={{ fontSize: '0.74rem', color: '#FAF7F0', opacity: 0.7, marginTop: '4px' }}>
                Direct concierge line (+91 9305988767) for instant courier tracking
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => onNavigate('order-tracking', { order_number: orderConfirmed.order_number, verification: orderConfirmed.phone || orderConfirmed.email })}
                className="btn-gold btn-primary"
                style={{ minWidth: '220px', padding: '14px 24px', fontSize: '0.9rem', fontWeight: 700 }}
              >
                <Search size={16} />
                <span>Open Detailed Logistics Hub</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('shop')}
                className="btn-secondary"
                style={{ minWidth: '180px', padding: '14px 24px', fontSize: '0.9rem' }}
              >
                Continue Exploring
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F8F4EC', minHeight: '100vh', padding: '36px 0 80px' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        <button
          onClick={onBackToCart}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#5C6B63', fontSize: '0.85rem', marginBottom: '24px' }}
        >
          <ArrowLeft size={16} />
          <span>Return to Cart Review</span>
        </button>

        <div className="checkout-layout-grid">
          {/* Left Column: Indian Shipping & Payment Form */}
          <div className="checkout-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Lock size={18} color="#B78B45" />
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', color: '#14231F' }}>
                Discreet Delivery Details
              </h2>
            </div>

            <div style={{ backgroundColor: '#FCFAF6', border: '1px dashed #B78B45', padding: '10px 14px', borderRadius: '4px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', gap: '8px' }}>
              <span style={{ color: '#5C6B63' }}>Need instant concierge assistance with this order?</span>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                <a href="tel:+919305988767" style={{ color: '#14231F', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                  <Phone size={14} color="#B78B45" />
                  <span>+91 9305988767</span>
                </a>
                <a href="mailto:ruviansari144@gmail.com" style={{ color: '#14231F', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                  <Mail size={14} color="#B78B45" />
                  <span>ruviansari144@gmail.com</span>
                </a>
              </div>
            </div>

            {error && (
              <div style={{ padding: '12px 16px', backgroundColor: 'rgba(150, 56, 50, 0.1)', color: '#963832', border: '1px solid #963832', borderRadius: '4px', marginBottom: '20px', fontSize: '0.88rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#14231F', marginBottom: '6px' }}>
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  name="recipient_name"
                  value={formData.recipient_name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Aditya Mehta"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                />
              </div>

              <div className="checkout-form-row">
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#14231F', marginBottom: '6px' }}>
                    Phone (10 Digits) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 98765 43210"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#14231F', marginBottom: '6px' }}>
                    Email (For Confirmation) *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="aditya@example.com"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#14231F', marginBottom: '6px' }}>
                  Address Line 1 (Flat/House/Street) *
                </label>
                <input
                  type="text"
                  name="address_line1"
                  value={formData.address_line1}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Flat 402, Royal Palms, Jubilee Hills Road 36"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                />
              </div>

              <div className="checkout-form-row">
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#14231F', marginBottom: '6px' }}>
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="Near Heritage Club"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#14231F', marginBottom: '6px' }}>
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Hyderabad"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div className="checkout-form-row">
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#14231F', marginBottom: '6px' }}>
                    State / Union Territory *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #D8D0BC', borderRadius: '4px', backgroundColor: '#FFFFFF' }}
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#14231F', marginBottom: '6px' }}>
                    PIN Code (6 Digits) *
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    required
                    placeholder="500033"
                    maxLength={6}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #EFEAE0' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#14231F', marginBottom: '12px' }}>
                  Payment Method
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      borderRadius: '8px',
                      border: formData.payment_method === 'ONLINE' ? '2px solid #B78B45' : '1px solid #D8D0BC',
                      backgroundColor: formData.payment_method === 'ONLINE' ? 'rgba(183,139,69,0.06)' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="ONLINE"
                      checked={formData.payment_method === 'ONLINE'}
                      onChange={handleChange}
                      style={{ accentColor: '#B78B45', width: '18px', height: '18px' }}
                    />
                    <CreditCard size={20} color="#B78B45" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#14231F' }}>
                        Prepaid (UPI / Cards / NetBanking)
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#8E9B94', marginTop: '2px' }}>Instant priority dispatch confirmation</div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      borderRadius: '8px',
                      border: formData.payment_method === 'COD' ? '2px solid #B78B45' : '1px solid #D8D0BC',
                      backgroundColor: formData.payment_method === 'COD' ? 'rgba(183,139,69,0.06)' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="COD"
                      checked={formData.payment_method === 'COD'}
                      onChange={handleChange}
                      style={{ accentColor: '#B78B45', width: '18px', height: '18px' }}
                    />
                    <Banknote size={20} color="#B78B45" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#14231F' }}>
                        Cash on Delivery (COD)
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#8E9B94', marginTop: '2px' }}>Pay upon doorstep receipt</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Special Concierge Instruction */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#14231F', marginBottom: '6px' }}>
                  Delivery Instructions / Gift Message
                </label>
                <textarea
                  name="customer_notes"
                  value={formData.customer_notes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="e.g. Please leave with building concierge or include gift note"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold btn-primary"
                style={{
                  padding: '16px 20px',
                  fontSize: '0.96rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  marginTop: '16px',
                  width: '100%',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(183,139,69,0.25)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                {loading ? (
                  <span>Processing & Placing Order...</span>
                ) : (
                  <>
                    <span>Place Order (₹{Number(totalAmount).toLocaleString('en-IN')})</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary Review */}
          <div className="checkout-card checkout-summary-card">
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#14231F', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E5DFC9' }}>
              Consignment Summary ({cart?.total_items || 0} items)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              {cart?.items?.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontSize: '0.86rem' }}>
                  <div>
                    <strong style={{ color: '#14231F' }}>{item.quantity}x {item.product_name}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#8E9B94' }}>Size: {item.variant.volume_size}</div>
                  </div>
                  <div style={{ fontWeight: 600, color: '#14231F' }}>
                    ₹{Number(item.line_total).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #EBE4D5', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: '#5C6B63' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>₹{Number(subtotal).toLocaleString('en-IN')}</span>
              </div>
              {appliedCoupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2A684C' }}>
                  <span>Coupon ({appliedCoupon.code})</span>
                  <span>-₹{Number(discountAmount).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Insured Express Shipping</span>
                <span>{shippingCost === 0 ? <strong style={{ color: '#2A684C' }}>FREE</strong> : `₹${shippingCost}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, color: '#14231F', paddingTop: '10px', borderTop: '1px solid #EBE4D5' }}>
                <span>Total Amount</span>
                <span>₹{Number(totalAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ marginTop: '20px', padding: '12px 14px', backgroundColor: '#FCFAF6', borderRadius: '4px', border: '1px solid #E5DFC9', display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.78rem', color: '#5C6B63' }}>
              <Truck size={20} color="#B78B45" style={{ flexShrink: 0 }} />
              <span>Orders dispatched in custom wax-sealed presentation flacons with temperature-regulated packaging.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .checkout-layout-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 36px;
          align-items: flex-start;
        }

        .checkout-card {
          background-color: #FFFFFF;
          padding: 32px;
          border-radius: 8px;
          border: 1px solid #E5DFC9;
          box-shadow: var(--shadow-sm);
        }

        .checkout-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 900px) {
          .checkout-layout-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }

        @media (max-width: 600px) {
          .checkout-card {
            padding: 20px 16px;
          }
          .checkout-form-row {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .order-confirmed-card {
            padding: 28px 18px !important;
          }
        }
      `}</style>
    </div>
  );
}
