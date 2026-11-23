import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, ArrowLeft, CheckCircle, Lock, Truck, CreditCard, Banknote, Phone, Mail, QrCode, Smartphone, X, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';
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

  // Interactive Razorpay Test Gateway Simulation State
  const [testGatewayModal, setTestGatewayModal] = useState(null);
  const [testProcessing, setTestProcessing] = useState(false);
  const [testPaymentTab, setTestPaymentTab] = useState('UPI'); // 'UPI' | 'CARD'
  const [testUpiId, setTestUpiId] = useState('patron@okhdfcbank');

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

      // Online payment via Razorpay / Verified Gateway
      if (formData.payment_method === 'ONLINE') {
        const rzpData = await api.createRazorpayOrder(order.order_number);

        // Check if a registered real key is present
        const isRealKey = rzpData.key_id && !rzpData.key_id.includes('test_rumera_luxury');

        if (window.Razorpay && isRealKey) {
          const options = {
            key: rzpData.key_id,
            amount: rzpData.amount,
            currency: rzpData.currency || 'INR',
            name: rzpData.name,
            description: rzpData.description,
            image: rzpData.image || '/images/rumera_crest_emblem.png',
            order_id: rzpData.gateway_order_id,
            handler: async function (response) {
              try {
                await api.verifyPayment({
                  order_number: order.order_number,
                  transaction_id: response.razorpay_payment_id || `rzp_${Date.now()}`,
                  gateway_order_id: response.razorpay_order_id || rzpData.gateway_order_id,
                  signature: response.razorpay_signature || '',
                  provider: 'RAZORPAY',
                });
                setOrderConfirmed(order);
                onOrderSuccess();
              } catch (verErr) {
                setError(verErr.message || 'Payment verification failed.');
              }
            },
            modal: {
              ondismiss: function () {
                setLoading(false);
                setError('Payment window was closed. You can retry whenever ready.');
              }
            },
            prefill: rzpData.prefill,
            theme: {
              color: '#D4AF37',
              backdrop_color: 'rgba(7, 13, 10, 0.85)'
            },
          };
          const rzpInstance = new window.Razorpay(options);
          rzpInstance.open();
          setLoading(false);
          return;
        }

        // Open interactive Razorpay Test Simulator Modal
        setTestGatewayModal({
          order,
          rzpData
        });
        setLoading(false);
        return;
      }

      setOrderConfirmed(order);
      onOrderSuccess();
    } catch (err) {
      setError(err.message || 'Checkout could not be processed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTestPayment = async (simulatedSuccess = true) => {
    if (!testGatewayModal) return;
    setTestProcessing(true);
    const { order, rzpData } = testGatewayModal;

    // Simulate realistic 1s bank network authorization
    await new Promise((r) => setTimeout(r, 1000));

    if (!simulatedSuccess) {
      setTestProcessing(false);
      setTestGatewayModal(null);
      setError('Payment was simulated as CANCELLED or DECLINED. Order remains in pending state.');
      return;
    }

    try {
      const simulatedTxnId = 'pay_' + Math.random().toString(36).substring(2, 12).toUpperCase();
      await api.verifyPayment({
        order_number: order.order_number,
        transaction_id: simulatedTxnId,
        gateway_order_id: rzpData?.gateway_order_id || `rzp_order_${order.order_number}`,
        signature: 'simulated_rzp_sig_verified_2026',
        provider: 'RAZORPAY',
      });
      setTestGatewayModal(null);
      setOrderConfirmed(order);
      onOrderSuccess();
    } catch (err) {
      setError(err.message || 'Payment verification failed.');
    } finally {
      setTestProcessing(false);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="order-confirmed-wrap" style={{ backgroundColor: '#F8F4EC', minHeight: '80vh', padding: '60px 16px' }}>
        <div className="order-confirmed-card" style={{ maxWidth: '640px', margin: '0 auto', backgroundColor: '#FFFFFF', padding: '48px 36px', borderRadius: '8px', border: '1px solid #E5DFC9', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(42, 104, 76, 0.12)', color: '#2A684C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={36} />
          </div>

          <div className="editorial-sub" style={{ color: '#B78B45' }}>Consignment Confirmed</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: '#14231F', marginBottom: '8px' }}>
            Your Order Has Been Placed
          </h2>
          <p style={{ color: '#5C6B63', fontSize: '0.92rem', marginBottom: '24px' }}>
            Thank you for choosing Rumera Luxury Atra. Our master decanter is hand-preparing your consignment with white-glove care.
          </p>

          <div style={{ padding: '16px', backgroundColor: '#FCFAF6', borderRadius: '6px', border: '1px dashed #B78B45', marginBottom: '24px' }}>
            <div style={{ fontSize: '0.78rem', color: '#8E9B94', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Order Reference Number
            </div>
            <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: '#14231F', marginTop: '4px' }}>
              {orderConfirmed.order_number}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#5C6B63', marginTop: '4px' }}>
              Total: <strong>₹{Number(orderConfirmed.total_amount).toLocaleString('en-IN')}</strong> ({orderConfirmed.payment_method})
            </div>
            <div style={{ marginTop: '12px', padding: '8px 12px', backgroundColor: 'rgba(42, 104, 76, 0.08)', borderRadius: '4px', fontSize: '0.78rem', color: '#1B4D36', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Mail size={13} color="#2A684C" />
              <span>Tax Invoice dispatched to <strong>{orderConfirmed.email}</strong> & Atelier</span>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <a
              href={orderConfirmed.whatsapp_confirmation_url || `https://wa.me/919305988767?text=Hello%20Maison%20Rumera%2C%20my%20order%20ref%20is%20${orderConfirmed.order_number}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 24px',
                backgroundColor: '#0F291E',
                border: '1px solid #25D366',
                color: '#FAF7F0',
                borderRadius: '30px',
                textDecoration: 'none',
                fontSize: '0.86rem',
                fontWeight: 600,
                boxShadow: '0 4px 15px rgba(37, 211, 102, 0.18)',
                cursor: 'pointer'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.301-.15-1.782-.879-2.057-.98-.276-.1-.477-.15-.678.15-.2.301-.778.98-.954 1.18-.176.2-.351.226-.652.075s-1.274-.47-2.427-1.498c-.898-.8-1.503-1.789-1.68-2.09-.176-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.15-.175.2-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.678-1.632-.929-2.235-.244-.588-.493-.508-.678-.517-.175-.009-.376-.01-.577-.01-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.512c0 1.482 1.079 2.91 1.23 3.111.15.201 2.122 3.242 5.142 4.547.718.311 1.279.497 1.716.636.721.23 1.377.197 1.896.12.578-.087 1.782-.728 2.033-1.431.25-.703.25-1.305.175-1.43-.075-.126-.276-.201-.577-.352z" />
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.892.528 3.663 1.447 5.176L2 22l4.981-1.411A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.624 0-3.136-.492-4.4-1.336l-.315-.21-2.964.84.854-2.887-.23-.33A8.167 8.167 0 013.8 12c0-4.522 3.678-8.2 8.2-8.2s8.2 3.678 8.2 8.2-3.678 8.2-8.2 8.2z" />
              </svg>
              <span>Receive WhatsApp Tracking Updates</span>
            </a>
            <p style={{ fontSize: '0.74rem', color: '#8E9B94', marginTop: '8px' }}>
              Direct line to Maison Ruméra Atelier (+91 9305988767) for live courier dispatch notifications
            </p>
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('order-tracking', { order_number: orderConfirmed.order_number })}
              className="btn-primary"
              style={{ minWidth: '160px' }}
            >
              Track Consignment
            </button>
            <button
              onClick={() => onNavigate('shop')}
              className="btn-secondary"
              style={{ minWidth: '160px' }}
            >
              Continue Exploring
            </button>
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

              {/* Payment Method Option */}
              <div style={{ marginTop: '12px', paddingTop: '16px', borderTop: '1px solid #EFEAE0' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#14231F', marginBottom: '12px' }}>
                  Payment Method
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '4px',
                      border: formData.payment_method === 'ONLINE' ? '2px solid #B78B45' : '1px solid #D8D0BC',
                      backgroundColor: formData.payment_method === 'ONLINE' ? 'rgba(183,139,69,0.08)' : '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="ONLINE"
                      checked={formData.payment_method === 'ONLINE'}
                      onChange={handleChange}
                    />
                    <CreditCard size={18} color="#B78B45" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#14231F' }}>
                        Prepaid (UPI / Cards / NetBanking)
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#8E9B94' }}>Instant priority dispatch confirmation</div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '4px',
                      border: formData.payment_method === 'COD' ? '2px solid #B78B45' : '1px solid #D8D0BC',
                      backgroundColor: formData.payment_method === 'COD' ? 'rgba(183,139,69,0.08)' : '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="COD"
                      checked={formData.payment_method === 'COD'}
                      onChange={handleChange}
                    />
                    <Banknote size={18} color="#B78B45" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#14231F' }}>
                        Cash on Delivery (COD)
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#8E9B94' }}>Pay upon doorstep receipt</div>
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
                style={{ padding: '15px 20px', fontSize: '0.92rem', marginTop: '10px', width: '100%', justifyContent: 'center' }}
              >
                <span>{loading ? 'Confirming Consignment...' : `Place Order (₹${Number(totalAmount).toLocaleString('en-IN')})`}</span>
                <ArrowRight size={18} />
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

      {/* =========================================================================
          INTERACTIVE RAZORPAY TEST PAYMENT GATEWAY MODAL (Visual Simulation)
          ========================================================================= */}
      {testGatewayModal && (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="max-w-[440px] w-full bg-[#0B1511] border border-[#D4AF37]/50 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(212,175,55,0.25)] overflow-hidden text-white animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#060C09] px-5 py-4 border-b border-[#D4AF37]/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="/images/rumera_crest_emblem.png"
                  alt="Rumera"
                  className="h-7 w-auto object-contain filter drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]"
                />
                <div>
                  <div className="font-serif text-sm font-bold tracking-wider text-[#FAF7F0] leading-none">
                    MAISON RUMÉRA
                  </div>
                  <div className="text-[9px] tracking-widest uppercase text-[#D4AF37] font-semibold mt-0.5">
                    Razorpay Gateway Simulator
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-black text-[9px] font-extrabold uppercase tracking-wider">
                  Test Mode
                </span>
                <button
                  onClick={() => {
                    if (!testProcessing) {
                      setTestGatewayModal(null);
                      setError('Payment window closed. Order is still pending.');
                    }
                  }}
                  disabled={testProcessing}
                  className="text-white/60 hover:text-white p-1 rounded-md transition-colors"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Amount Banner */}
            <div className="px-6 py-5 bg-gradient-to-b from-[#0F1E19] to-[#0A130F] border-b border-white/5 text-center">
              <div className="text-xs uppercase tracking-widest text-[#D4AF37]/80 font-medium">
                Amount Payable for Order #{testGatewayModal.order.order_number}
              </div>
              <div className="font-serif text-3xl font-bold text-[#FAF7F0] mt-1 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5DE98] to-[#D4AF37]">
                ₹{Number(testGatewayModal.order.total_amount).toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-white/50 mt-1">
                Recipient: <strong className="text-white/80">{testGatewayModal.order.recipient_name}</strong> • {testGatewayModal.order.phone}
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="p-5">
              <div className="grid grid-cols-2 gap-2 p-1 bg-white/[0.04] rounded-xl border border-white/10 mb-4">
                <button
                  type="button"
                  onClick={() => setTestPaymentTab('UPI')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    testPaymentTab === 'UPI'
                      ? 'bg-[#D4AF37] text-black shadow-md font-bold'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Smartphone size={14} />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTestPaymentTab('CARD')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    testPaymentTab === 'CARD'
                      ? 'bg-[#D4AF37] text-black shadow-md font-bold'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <CreditCard size={14} />
                  <span>Cards</span>
                </button>
              </div>

              {/* Tab 1: UPI Simulator */}
              {testPaymentTab === 'UPI' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                    {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setTestUpiId(`patron@${app.toLowerCase()}`)}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-white/[0.05] hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/60 text-[11px] font-semibold text-center transition-all cursor-pointer"
                      >
                        {app}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-white/60 block mb-1">
                      Simulated Virtual Payment Address (VPA)
                    </label>
                    <div className="flex items-center px-3 py-2 bg-black/50 border border-[#D4AF37]/40 rounded-xl text-sm font-mono text-[#D4AF37]">
                      <span className="flex-1 truncate">{testUpiId}</span>
                      <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                        ✓ Verified
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Card Simulator */}
              {testPaymentTab === 'CARD' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#1C2C24] to-[#0A1410] border border-[#D4AF37]/35 text-xs font-mono space-y-2">
                    <div className="flex justify-between items-center text-white/60">
                      <span>Maison Imperial Card</span>
                      <span className="text-[#D4AF37] font-bold">TEST MODE</span>
                    </div>
                    <div className="text-base tracking-widest text-[#FAF7F0] font-bold">
                      4111 •••• •••• 4242
                    </div>
                    <div className="flex justify-between text-[11px] text-white/70">
                      <span>EXP: 12/28</span>
                      <span>CVV: 786</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-5 space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleCompleteTestPayment(true)}
                  disabled={testProcessing}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#ECC880] via-[#D4AF37] to-[#AA8238] hover:brightness-110 text-black font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-[0_4px_16px_rgba(212,175,55,0.4)] cursor-pointer disabled:opacity-50"
                >
                  {testProcessing ? (
                    <>
                      <RefreshCw size={15} className="animate-spin text-black" />
                      <span>Authorizing with Bank Gateway...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>Authorize & Pay ₹{Number(testGatewayModal.order.total_amount).toLocaleString('en-IN')} (Success)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleCompleteTestPayment(false)}
                  disabled={testProcessing}
                  className="w-full py-2 px-3 rounded-xl bg-red-950/40 hover:bg-red-950/60 border border-red-500/30 text-red-300 text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Simulate Payment Decline / Failure
                </button>
              </div>

              {/* Security Badge */}
              <div className="mt-4 pt-3 border-t border-white/10 text-center text-[10px] text-white/40 flex items-center justify-center gap-1.5">
                <Lock size={11} className="text-[#D4AF37]" />
                <span>256-Bit SSL Encrypted Razorpay Sandbox Simulation</span>
              </div>
            </div>
          </div>
        </div>
      )}

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
