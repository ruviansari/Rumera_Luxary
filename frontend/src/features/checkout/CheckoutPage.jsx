import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, ArrowLeft, CheckCircle, Lock, Truck, CreditCard, Banknote, Phone, Mail, QrCode, Smartphone, X, AlertTriangle, Sparkles, RefreshCw, Building2, Landmark, Clock, Check, Zap } from 'lucide-react';
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
  const [testPaymentTab, setTestPaymentTab] = useState('CARD'); // 'CARD' | 'UPI' | 'NETBANKING'
  const [testUpiId, setTestUpiId] = useState('patron@okhdfcbank');
  const [testUpiMode, setTestUpiMode] = useState('APPS'); // 'APPS' | 'QR'
  const [testCardNumber, setTestCardNumber] = useState('4111 2222 3333 4242');
  const [testCardExpiry, setTestCardExpiry] = useState('12/28');
  const [testCardCvv, setTestCardCvv] = useState('786');
  const [testCardName, setTestCardName] = useState('');
  const [testCardBrand, setTestCardBrand] = useState('VISA');
  const [testSelectedBank, setTestSelectedBank] = useState('HDFC');
  const [testSaveCard, setTestSaveCard] = useState(true);

  const detectCardBrand = (num) => {
    const clean = (num || '').replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'VISA';
    if (clean.startsWith('5')) return 'MASTERCARD';
    if (clean.startsWith('6') || clean.startsWith('35')) return 'RUPAY';
    return 'VISA';
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setTestCardNumber(formatted);
    setTestCardBrand(detectCardBrand(formatted));
  };

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
        setTestCardName(order.recipient_name || 'HAYA KHAN');
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
          INTERACTIVE RAZORPAY TEST PAYMENT GATEWAY MODAL (Real-World Easy-to-Use Edition)
          ========================================================================= */}
      {testGatewayModal && (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-lg animate-in fade-in duration-200 overflow-y-auto">
          <div className="max-w-[490px] w-full bg-gradient-to-b from-[#13241C] via-[#0A1410] to-[#040806] border border-[#D4AF37]/50 rounded-[30px] shadow-[0_30px_90px_rgba(0,0,0,0.98),0_0_50px_rgba(212,175,55,0.28)] overflow-hidden text-white animate-in zoom-in-95 duration-200 my-auto">
            {/* Modal Header with High-Contrast Provenance */}
            <div className="bg-[#050A08] px-6 py-4 sm:px-7 sm:py-4.5 border-b border-[#D4AF37]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rumera-emblem-medallion p-1.5 sm:p-2 rounded-2xl shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                  <img
                    src="/images/rumera_crest_emblem.png"
                    alt="Rumera"
                    className="h-6 sm:h-7 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(212,175,55,0.7)] brightness-110"
                  />
                </div>
                <div>
                  <div className="rumera-wordmark-gold text-sm sm:text-base block leading-none">
                    MAISON RUMÉRA
                  </div>
                  <div className="text-[8.5px] sm:text-[9px] tracking-[0.24em] uppercase text-[#D4AF37] font-semibold mt-1">
                    Razorpay Gateway Simulator
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-[#F8E7BE] via-[#D4AF37] to-[#B78B35] text-[#060B08] text-[9px] font-black uppercase tracking-[0.16em] shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                  Test Sandbox
                </span>
                <button
                  onClick={() => {
                    if (!testProcessing) {
                      setTestGatewayModal(null);
                      setError('Payment window closed. Order is still pending.');
                    }
                  }}
                  disabled={testProcessing}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.15] border border-white/10 hover:border-[#D4AF37] text-white/70 hover:text-[#D4AF37] transition-all duration-300 hover:rotate-90 hover:scale-105 cursor-pointer disabled:opacity-50"
                  aria-label="Close Payment Modal"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Amount Banner Section */}
            <div className="px-6 py-5 bg-gradient-to-b from-[#162A21]/80 to-[#0B1612]/95 border-b border-[#D4AF37]/25 text-center relative overflow-hidden">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/[0.05] border border-[#D4AF37]/35 text-[10.5px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold mb-1.5">
                <span>Imperial Consignment #{testGatewayModal.order.order_number}</span>
              </div>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF9E6] via-[#F4DE98] to-[#D4AF37] tracking-tight filter drop-shadow-[0_3px_12px_rgba(212,175,55,0.4)]">
                ₹{Number(testGatewayModal.order.total_amount).toLocaleString('en-IN')}
              </div>
              <div className="text-[11.5px] text-white/60 mt-1 flex items-center justify-center gap-2">
                <span className="text-[#D4AF37]/80">Patron:</span>
                <strong className="text-[#FAF7F0] font-semibold tracking-wide">{testGatewayModal.order.recipient_name}</strong>
                <span className="text-[#D4AF37]/50">•</span>
                <span>{testGatewayModal.order.phone}</span>
              </div>
            </div>

            {/* Payment Method Selector Tabs: Card | UPI / QR | NetBanking */}
            <div className="p-5 sm:p-6 space-y-5">
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-black/60 rounded-full border border-[#D4AF37]/35 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
                <button
                  type="button"
                  onClick={() => setTestPaymentTab('CARD')}
                  className={`py-2 px-2.5 rounded-full text-[11px] sm:text-xs tracking-wider uppercase font-extrabold flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer ${
                    testPaymentTab === 'CARD'
                      ? 'bg-gradient-to-r from-[#F8E7BE] via-[#D4AF37] to-[#B78B35] text-[#060B08] shadow-[0_2px_15px_rgba(212,175,55,0.55)] scale-[1.02]'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <CreditCard size={14} />
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTestPaymentTab('UPI')}
                  className={`py-2 px-2.5 rounded-full text-[11px] sm:text-xs tracking-wider uppercase font-extrabold flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer ${
                    testPaymentTab === 'UPI'
                      ? 'bg-gradient-to-r from-[#F8E7BE] via-[#D4AF37] to-[#B78B35] text-[#060B08] shadow-[0_2px_15px_rgba(212,175,55,0.55)] scale-[1.02]'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Smartphone size={14} />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTestPaymentTab('NETBANKING')}
                  className={`py-2 px-2.5 rounded-full text-[11px] sm:text-xs tracking-wider uppercase font-extrabold flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer ${
                    testPaymentTab === 'NETBANKING'
                      ? 'bg-gradient-to-r from-[#F8E7BE] via-[#D4AF37] to-[#B78B35] text-[#060B08] shadow-[0_2px_15px_rgba(212,175,55,0.55)] scale-[1.02]'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Building2 size={14} />
                  <span>NetBank</span>
                </button>
              </div>

              {/* =========================================================
                  TAB 1: REAL-WORLD CARD PAYMENT EXPERIENCE
                  ========================================================= */}
              {testPaymentTab === 'CARD' && (
                <div className="space-y-4">
                  {/* Interactive Visual Luxury Card Preview */}
                  <div className="relative w-full rounded-2xl p-4 sm:p-5 bg-gradient-to-tr from-[#0F2219] via-[#162D22] to-[#0A1711] border border-[#D4AF37]/50 shadow-[0_12px_35px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.2)] flex flex-col justify-between space-y-4 overflow-hidden">
                    <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-[#D4AF37]/15 blur-2xl pointer-events-none" />

                    {/* Top Row: EMV Chip + Contactless Wave + Brand Logo */}
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-3">
                        {/* Golden EMV Chip */}
                        <div className="w-9 h-6.5 rounded bg-gradient-to-br from-[#FFE79A] via-[#D4AF37] to-[#8C6D23] border border-[#FFF8DE]/70 p-1 flex flex-col justify-between shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
                          <div className="h-0.5 bg-black/35 rounded" />
                          <div className="h-0.5 bg-black/35 rounded" />
                          <div className="h-0.5 bg-black/35 rounded" />
                        </div>
                        {/* Contactless waves icon */}
                        <svg className="w-4.5 h-4.5 text-[#D4AF37]/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M8.5 16.5a5 5 0 0 1 0-9" />
                          <path d="M12 19a8.5 8.5 0 0 0 0-14" />
                          <path d="M15.5 21.5a12 12 0 0 0 0-19" />
                        </svg>
                      </div>

                      {/* Dynamic Brand Logo */}
                      <span className="px-3 py-0.5 rounded-full bg-black/50 border border-[#D4AF37]/45 text-[#FAF7F0] font-black tracking-widest text-[11px] uppercase shadow-[0_0_8px_rgba(212,175,55,0.25)]">
                        {testCardBrand}
                      </span>
                    </div>

                    {/* Card Number formatted with Gold Gradient */}
                    <div className="z-10 tracking-[0.22em] font-mono text-base sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8DE] via-[#F4DE98] to-[#D4AF37] font-bold filter drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                      {testCardNumber || '•••• •••• •••• ••••'}
                    </div>

                    {/* Bottom Row: Cardholder Name + Valid Thru */}
                    <div className="flex items-end justify-between z-10 text-white/80 pt-1">
                      <div>
                        <div className="text-[8px] uppercase tracking-[0.2em] text-[#D4AF37]/75 font-semibold">Cardholder</div>
                        <div className="text-xs sm:text-[13px] font-semibold tracking-wider text-[#FAF7F0] uppercase truncate max-w-[200px]">
                          {testCardName || testGatewayModal.order.recipient_name || 'MAISON PATRON'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[8px] uppercase tracking-[0.2em] text-[#D4AF37]/75 font-semibold">Valid Thru</div>
                        <div className="text-xs sm:text-[13px] font-mono font-bold tracking-widest text-[#FAF7F0]">
                          {testCardExpiry || 'MM/YY'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Test Cards Bar */}
                  <div className="flex items-center justify-between text-[11px] px-1">
                    <span className="text-white/50 text-[10.5px] uppercase tracking-wider flex items-center gap-1">
                      <Zap size={12} className="text-[#D4AF37]" />
                      <span>1-Click Test Presets:</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setTestCardNumber('4111 2222 3333 4242');
                          setTestCardExpiry('12/28');
                          setTestCardCvv('786');
                          setTestCardBrand('VISA');
                        }}
                        className="px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-[#D4AF37]/25 border border-white/10 hover:border-[#D4AF37] text-[10px] font-bold tracking-wider text-white hover:text-[#D4AF37] transition-all cursor-pointer"
                      >
                        Visa
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTestCardNumber('5123 4567 8901 2345');
                          setTestCardExpiry('08/29');
                          setTestCardCvv('452');
                          setTestCardBrand('MASTERCARD');
                        }}
                        className="px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-[#D4AF37]/25 border border-white/10 hover:border-[#D4AF37] text-[10px] font-bold tracking-wider text-white hover:text-[#D4AF37] transition-all cursor-pointer"
                      >
                        Mastercard
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTestCardNumber('6071 8293 0192 8374');
                          setTestCardExpiry('11/27');
                          setTestCardCvv('910');
                          setTestCardBrand('RUPAY');
                        }}
                        className="px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-[#D4AF37]/25 border border-white/10 hover:border-[#D4AF37] text-[10px] font-bold tracking-wider text-white hover:text-[#D4AF37] transition-all cursor-pointer"
                      >
                        RuPay
                      </button>
                    </div>
                  </div>

                  {/* Real-World Input Form */}
                  <div className="space-y-3">
                    {/* Card Number Input */}
                    <div>
                      <label className="text-[10.5px] uppercase tracking-[0.16em] text-white/50 block mb-1 px-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={testCardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4111 2222 3333 4242"
                          maxLength={19}
                          className="w-full px-4 py-2.5 pr-14 bg-black/60 border border-[#D4AF37]/40 focus:border-[#D4AF37] rounded-xl text-sm font-mono text-[#FAF7F0] tracking-wider outline-none shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)] transition-all"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-black/70 border border-white/15 text-[9.5px] font-bold tracking-wider text-[#D4AF37]">
                          {testCardBrand}
                        </div>
                      </div>
                    </div>

                    {/* Expiry & CVV Input */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10.5px] uppercase tracking-[0.16em] text-white/50 block mb-1 px-1">
                          Valid Thru (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={testCardExpiry}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                            if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2);
                            setTestCardExpiry(val);
                          }}
                          placeholder="MM / YY"
                          maxLength={5}
                          className="w-full px-4 py-2.5 bg-black/60 border border-[#D4AF37]/40 focus:border-[#D4AF37] rounded-xl text-sm font-mono text-[#FAF7F0] tracking-wider outline-none shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)] transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10.5px] uppercase tracking-[0.16em] text-white/50 block mb-1 px-1">
                          CVV
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            value={testCardCvv}
                            onChange={(e) => setTestCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            placeholder="•••"
                            maxLength={4}
                            className="w-full px-4 py-2.5 pr-8 bg-black/60 border border-[#D4AF37]/40 focus:border-[#D4AF37] rounded-xl text-sm font-mono text-[#FAF7F0] tracking-wider outline-none shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)] transition-all"
                          />
                          <Lock size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40" />
                        </div>
                      </div>
                    </div>

                    {/* Cardholder Name Input */}
                    <div>
                      <label className="text-[10.5px] uppercase tracking-[0.16em] text-white/50 block mb-1 px-1">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        value={testCardName}
                        onChange={(e) => setTestCardName(e.target.value)}
                        placeholder="Cardholder Name"
                        className="w-full px-4 py-2.5 bg-black/60 border border-[#D4AF37]/40 focus:border-[#D4AF37] rounded-xl text-sm text-[#FAF7F0] tracking-wide outline-none shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)] transition-all uppercase"
                      />
                    </div>

                    {/* RBI Tokenization Checkbox */}
                    <label className="flex items-center gap-2 px-1 pt-1 cursor-pointer select-none text-[11px] text-white/60 hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        checked={testSaveCard}
                        onChange={(e) => setTestSaveCard(e.target.checked)}
                        className="accent-[#D4AF37] w-3.5 h-3.5 rounded"
                      />
                      <span>Securely save card as per RBI tokenization guidelines</span>
                    </label>
                  </div>
                </div>
              )}

              {/* =========================================================
                  TAB 2: REAL-WORLD UPI & QR CODE EXPERIENCE
                  ========================================================= */}
              {testPaymentTab === 'UPI' && (
                <div className="space-y-4">
                  {/* UPI Sub-Mode Switch: Quick Apps vs Scan QR */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-black/50 rounded-xl border border-white/10 text-xs">
                    <button
                      type="button"
                      onClick={() => setTestUpiMode('APPS')}
                      className={`py-2 px-3 rounded-lg font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        testUpiMode === 'APPS'
                          ? 'bg-[#D4AF37]/25 border border-[#D4AF37] text-white shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <Smartphone size={14} />
                      <span>UPI Apps / ID</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestUpiMode('QR')}
                      className={`py-2 px-3 rounded-lg font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        testUpiMode === 'QR'
                          ? 'bg-[#D4AF37]/25 border border-[#D4AF37] text-white shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <QrCode size={14} />
                      <span>Scan QR Code</span>
                    </button>
                  </div>

                  {testUpiMode === 'APPS' ? (
                    <div className="space-y-3.5">
                      {/* Quick UPI App Selector Pills */}
                      <div className="grid grid-cols-4 gap-2">
                        {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => {
                          const isSelected = testUpiId.toLowerCase().includes(app.toLowerCase());
                          return (
                            <button
                              key={app}
                              type="button"
                              onClick={() => setTestUpiId(`patron@${app.toLowerCase()}`)}
                              className={`rumera-app-pill ${isSelected ? 'active' : ''}`}
                              title={`Select ${app}`}
                            >
                              <span>{app}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Editable VPA input */}
                      <div>
                        <label className="text-[10.5px] uppercase tracking-[0.16em] text-white/50 block mb-1.5 px-1">
                          Virtual Payment Address (UPI ID)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={testUpiId}
                            onChange={(e) => setTestUpiId(e.target.value)}
                            className="w-full px-4 py-2.5 pr-28 bg-black/60 border border-[#D4AF37]/40 focus:border-[#D4AF37] rounded-xl text-sm font-mono text-[#D4AF37] tracking-wide outline-none shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]"
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold flex items-center gap-1 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                            <Check size={11} /> Verified
                          </div>
                        </div>
                      </div>

                      {/* Real-world step instructions card */}
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-[11.5px] text-white/70 space-y-1.5">
                        <div className="text-[#D4AF37] font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                          <Clock size={13} /> Real-World Flow Simulation
                        </div>
                        <div className="flex items-center gap-2 text-white/80">
                          <span className="w-4 h-4 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold flex items-center justify-center">1</span>
                          <span>Click Authorize & Pay to transmit collect request.</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80">
                          <span className="w-4 h-4 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold flex items-center justify-center">2</span>
                          <span>Open {testUpiId.split('@')[1] ? testUpiId.split('@')[1].toUpperCase() : 'UPI'} app and approve payment.</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Scan QR Code Mode */
                    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/60 border border-[#D4AF37]/35 space-y-3">
                      <div className="relative p-3 bg-white rounded-xl shadow-[0_0_25px_rgba(212,175,55,0.35)]">
                        <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
                          <rect width="100" height="100" fill="#0A1410" rx="4" />
                          {/* Corner Finders */}
                          <rect x="8" y="8" width="26" height="26" fill="#D4AF37" rx="3" />
                          <rect x="12" y="12" width="18" height="18" fill="#0A1410" rx="2" />
                          <rect x="16" y="16" width="10" height="10" fill="#D4AF37" rx="1.5" />

                          <rect x="66" y="8" width="26" height="26" fill="#D4AF37" rx="3" />
                          <rect x="70" y="12" width="18" height="18" fill="#0A1410" rx="2" />
                          <rect x="74" y="16" width="10" height="10" fill="#D4AF37" rx="1.5" />

                          <rect x="8" y="66" width="26" height="26" fill="#D4AF37" rx="3" />
                          <rect x="12" y="70" width="18" height="18" fill="#0A1410" rx="2" />
                          <rect x="16" y="74" width="10" height="10" fill="#D4AF37" rx="1.5" />

                          {/* Data dots */}
                          <rect x="38" y="10" width="6" height="6" fill="#F4DE98" />
                          <rect x="48" y="10" width="6" height="6" fill="#D4AF37" />
                          <rect x="40" y="20" width="8" height="6" fill="#D4AF37" />
                          <rect x="52" y="22" width="6" height="6" fill="#F4DE98" />
                          <rect x="10" y="38" width="6" height="6" fill="#F4DE98" />
                          <rect x="20" y="42" width="6" height="8" fill="#D4AF37" />
                          <rect x="68" y="38" width="8" height="6" fill="#D4AF37" />
                          <rect x="80" y="42" width="6" height="8" fill="#F4DE98" />
                          <rect x="38" y="70" width="8" height="8" fill="#D4AF37" />
                          <rect x="50" y="74" width="6" height="6" fill="#F4DE98" />
                          <rect x="70" y="68" width="6" height="6" fill="#F4DE98" />
                          <rect x="80" y="72" width="8" height="8" fill="#D4AF37" />

                          {/* Center Ruméra Gold Emblem */}
                          <circle cx="50" cy="50" r="13" fill="#050A08" stroke="#D4AF37" strokeWidth="1.5" />
                          <circle cx="50" cy="50" r="10" fill="#D4AF37" />
                          <text x="50" y="54" textAnchor="middle" fill="#060B08" fontSize="10" fontWeight="900" fontFamily="serif">R</text>
                        </svg>
                      </div>

                      <div className="text-center">
                        <div className="text-xs font-semibold text-white/90">
                          Scan with Any UPI App (GPay, PhonePe, Paytm, CRED)
                        </div>
                        <div className="text-[11px] text-[#D4AF37] font-mono mt-0.5 flex items-center justify-center gap-1.5">
                          <Clock size={12} /> QR Valid for 09:45 mins
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* =========================================================
                  TAB 3: REAL-WORLD NETBANKING EXPERIENCE
                  ========================================================= */}
              {testPaymentTab === 'NETBANKING' && (
                <div className="space-y-3.5">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-white/50 px-1">
                    Select Popular Indian Bank
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'HDFC', name: 'HDFC Bank', code: '01' },
                      { id: 'SBI', name: 'State Bank of India', code: '02' },
                      { id: 'ICICI', name: 'ICICI Bank', code: '03' },
                      { id: 'AXIS', name: 'Axis Bank', code: '04' },
                    ].map((bank) => {
                      const isSelected = testSelectedBank === bank.id;
                      return (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => setTestSelectedBank(bank.id)}
                          className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#D4AF37]/20 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.35)]'
                              : 'bg-white/[0.04] border-white/10 hover:border-white/30 text-white/70 hover:text-white'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold text-white">{bank.name}</div>
                            <div className="text-[10px] text-white/40 tracking-wider">Fast Authorization</div>
                          </div>
                          {isSelected && <Check size={14} className="text-[#D4AF37]" />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] text-white/60 flex items-center gap-2">
                    <Landmark size={14} className="text-[#D4AF37] shrink-0" />
                    <span>Secure redirect to your bank's authenticated gateway upon authorization.</span>
                  </div>
                </div>
              )}

              {/* Action Buttons with Proper Premium Typography & Hover */}
              <div className="space-y-3 pt-1">
                {/* Primary Button: Fully Rounded 24K Gold Pill with Dynamic Hover */}
                <button
                  type="button"
                  onClick={() => handleCompleteTestPayment(true)}
                  disabled={testProcessing}
                  className="rumera-pay-btn-luxury group"
                >
                  {testProcessing ? (
                    <div className="flex items-center justify-center gap-3 py-3.5">
                      <RefreshCw size={18} className="animate-spin text-[#060B08]" />
                      <span className="text-xs sm:text-[13px] tracking-[0.24em] font-black uppercase text-[#060B08]">
                        Authorizing with Bank Gateway...
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-3.5 px-6">
                      <div className="flex items-center gap-2 text-[#060B08]">
                        <ShieldCheck size={18} className="text-[#060B08] group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-xs sm:text-[13.5px] tracking-[0.24em] font-black uppercase">
                          Authorize & Pay ₹{Number(testGatewayModal.order.total_amount).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-[9.5px] tracking-[0.22em] uppercase font-bold text-[#060B08]/75 mt-0.5">
                        ✦ Instant Verified Sandbox Settlement ✦
                      </span>
                    </div>
                  )}
                </button>

                {/* Secondary Button: Fully Rounded Translucent Pill with Hover */}
                <button
                  type="button"
                  onClick={() => handleCompleteTestPayment(false)}
                  disabled={testProcessing}
                  className="w-full py-2.5 px-4 rounded-full bg-rose-950/20 hover:bg-rose-950/45 border border-rose-500/30 hover:border-rose-400/70 text-rose-300 hover:text-white text-[11px] font-bold tracking-[0.18em] uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(244,63,94,0.35)] hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 group"
                >
                  <X size={14} className="text-rose-400 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Simulate Payment Decline / Cancel</span>
                </button>
              </div>

              {/* Security Badge */}
              <div className="text-center text-[10.5px] text-white/40 flex items-center justify-center gap-2">
                <Lock size={12} className="text-[#D4AF37]" />
                <span className="tracking-wide">256-Bit SSL Encrypted Razorpay Sandbox Protocol</span>
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
