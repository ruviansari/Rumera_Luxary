import React, { useState, useEffect } from 'react';
import { Search, Package, CheckCircle, Clock, Truck, ShieldAlert, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

export default function OrderTrackingPage({ initialOrderNumber = '', onNavigate }) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [verification, setVerification] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);

  const handleTrack = async (e) => {
    if (e) e.preventDefault();
    if (!orderNumber.trim() || !verification.trim()) {
      setError('Please provide both your Order Number (e.g. RUM-XXXX) and your registered Phone or Email.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await api.trackOrder(orderNumber.trim(), verification.trim());
      setOrder(data);
    } catch (err) {
      setError(err.message || 'Consignment could not be verified with the provided details.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'PENDING_PAYMENT', label: 'Order Received' },
    { key: 'PAID', label: 'Payment Confirmed' },
    { key: 'PROCESSING', label: 'Decanting & Packing' },
    { key: 'SHIPPED', label: 'In Transit with Courier' },
    { key: 'DELIVERED', label: 'Delivered' }
  ];

  const getStatusIndex = (currentStatus) => {
    const idx = steps.findIndex(s => s.key === currentStatus);
    return idx === -1 ? 1 : idx;
  };

  return (
    <div style={{ backgroundColor: '#F8F4EC', minHeight: '100vh', padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="editorial-sub">Consignment Verification</div>
          <h1 className="editorial-title" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)' }}>
            Track Your Royal Order
          </h1>
          <p style={{ color: '#5C6B63', fontSize: '0.92rem', marginTop: '8px' }}>
            Enter your order reference and phone/email to inspect live fulfillment progress.
          </p>
        </div>

        {/* Lookup Card */}
        <div className="tracking-card" style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)', marginBottom: '32px' }}>
          <form onSubmit={handleTrack} className="tracking-form-grid">
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '6px' }}>
                Order Number *
              </label>
              <input
                type="text"
                placeholder="RUM-XXXXXX"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #D8D0BC', borderRadius: '4px', textTransform: 'uppercase' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '6px' }}>
                Verification Phone or Email *
              </label>
              <input
                type="text"
                placeholder="Phone or email on order"
                value={verification}
                onChange={(e) => setVerification(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ padding: '12px 24px', height: '44px', width: '100%', justifyContent: 'center' }}
            >
              <Search size={16} />
              <span>{loading ? 'Verifying...' : 'Track'}</span>
            </button>
          </form>

          {error && (
            <div style={{ marginTop: '16px', padding: '12px 16px', backgroundColor: 'rgba(150, 56, 50, 0.08)', color: '#963832', borderRadius: '4px', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}
        </div>

        {/* Order Details Result */}
        {order && (
          <div className="tracking-card tracking-result-card" style={{ backgroundColor: '#FFFFFF', padding: '36px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E5DFC9', paddingBottom: '20px', marginBottom: '28px', gap: '16px' }}>
              <div>
                <span className="badge-gold">Verified Consignment</span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 3.5vw, 1.8rem)', color: '#14231F', marginTop: '6px' }}>
                  {order.order_number}
                </h2>
                <div style={{ fontSize: '0.82rem', color: '#8E9B94' }}>
                  Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.78rem', color: '#8E9B94', textTransform: 'uppercase' }}>Consignment Total</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#B78B45' }}>
                  ₹{Number(order.total_amount).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#2A684C', fontWeight: 600 }}>
                  {order.status_display} ({order.payment_method_display})
                </div>
              </div>
            </div>

            {/* Carrier & Tracking details if assigned */}
            {order.tracking_number && (
              <div style={{ backgroundColor: '#FCFAF6', border: '1px dashed #B78B45', padding: '14px 18px', borderRadius: '6px', marginBottom: '28px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Truck size={22} color="#B78B45" />
                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#8E9B94' }}>Carrier Partner</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#14231F' }}>
                      {order.carrier_name || 'Bluedart Luxury Express'}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#8E9B94' }}>AWB Tracking #</div>
                  <div style={{ fontSize: '0.95rem', fontFamily: 'monospace', fontWeight: 700, color: '#14231F' }}>
                    {order.tracking_number}
                  </div>
                </div>
              </div>
            )}

            {/* Status Stepper */}
            <div style={{ marginBottom: '36px' }}>
              <div className="tracking-stepper-inner">
                {steps.map((st, i) => {
                  const currentIdx = getStatusIndex(order.status);
                  const isDone = i <= currentIdx;
                  return (
                    <div key={st.key} className="tracking-step-item">
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: isDone ? '#14231F' : '#E5DFC9',
                          color: isDone ? '#B78B45' : '#8E9B94',
                          border: isDone ? '2px solid #B78B45' : '2px solid #E5DFC9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          flexShrink: 0
                        }}
                      >
                        {isDone ? '✓' : (i + 1)}
                      </div>
                      <span className="tracking-step-label" style={{ fontSize: '0.74rem', color: isDone ? '#14231F' : '#8E9B94', fontWeight: isDone ? 600 : 400 }}>
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Consignment Items Snapshot */}
            <div style={{ borderTop: '1px solid #EBE4D5', paddingTop: '20px' }}>
              <h4 style={{ fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#14231F', marginBottom: '14px' }}>
                Consignment Items
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {order.items?.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                    <div>
                      <strong style={{ color: '#14231F' }}>{item.quantity}x {item.product_name_snapshot}</strong>
                      <span style={{ color: '#8E9B94', marginLeft: '6px' }}>({item.variant_size_snapshot})</span>
                    </div>
                    <div style={{ fontWeight: 600, color: '#14231F' }}>
                      ₹{Number(item.line_total).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recipient Address */}
            <div style={{ borderTop: '1px solid #EBE4D5', paddingTop: '18px', marginTop: '18px', fontSize: '0.84rem', color: '#5C6B63', lineHeight: 1.6 }}>
              <strong style={{ color: '#14231F' }}>Delivery Address:</strong> {order.recipient_name}, {order.address_line1}, {order.city}, {order.state} - {order.postal_code}, India.
            </div>
          </div>
        )}
      </div>

      <style>{`
        .tracking-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 130px;
          gap: 16px;
          align-items: flex-end;
        }

        .tracking-stepper-inner {
          display: flex;
          justify-content: space-between;
          position: relative;
          margin-top: 16px;
        }

        .tracking-step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          text-align: center;
          gap: 8px;
        }

        .tracking-step-label {
          max-width: 100px;
          line-height: 1.3;
        }

        @media (max-width: 640px) {
          .tracking-card {
            padding: 20px 16px !important;
          }
          .tracking-form-grid {
            grid-template-columns: 1fr;
          }
          .tracking-stepper-inner {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            padding-left: 8px;
            border-left: 2px dashed #D8D0BC;
            margin-left: 12px;
          }
          .tracking-step-item {
            flex-direction: row;
            align-items: center;
            text-align: left;
            gap: 12px;
            margin-left: -17px;
          }
          .tracking-step-label {
            max-width: none;
            font-size: 0.85rem !important;
          }
        }
      `}</style>
    </div>
  );
}
