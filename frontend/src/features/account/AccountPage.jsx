import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, LogOut, ArrowRight, Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import { api, clearAuth } from '../../services/api';

export default function AccountPage({ currentUser, onLogout, onNavigate }) {
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    Promise.all([
      api.getMyOrders().catch(() => []),
      api.getAddresses().catch(() => [])
    ]).then(([orderRes, addrRes]) => {
      setOrders(orderRes.results || orderRes || []);
      setAddresses(addrRes.results || addrRes || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleLogoutClick = () => {
    clearAuth();
    onLogout();
  };

  const isStaff = currentUser && ['SUPER_ADMIN', 'STORE_MANAGER', 'ORDER_FULFILMENT', 'CONTENT_MANAGER'].includes(currentUser.role);

  return (
    <div style={{ backgroundColor: '#F8F4EC', minHeight: '100vh', padding: '56px 0 96px' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        {/* Account Header */}
        <div className="account-card" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', gap: '16px', backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#14231F', color: '#B78B45', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontFamily: 'var(--font-serif)', border: '1px solid #B78B45' }}>
              {(currentUser?.first_name?.[0] || currentUser?.email?.[0] || 'R').toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B78B45', fontWeight: 600 }}>
                {currentUser?.role?.replace('_', ' ') || 'Customer'} • Atelier Dashboard
              </div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#14231F' }}>
                {currentUser?.first_name ? `${currentUser.first_name} ${currentUser.last_name || ''}` : currentUser?.email}
              </h1>
              <div style={{ fontSize: '0.82rem', color: '#8E9B94' }}>{currentUser?.email}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {isStaff && (
              <button
                onClick={() => onNavigate('admin')}
                className="btn-gold btn-primary"
                style={{ padding: '10px 18px', fontSize: '0.78rem' }}
              >
                Access ERP Portal
              </button>
            )}
            <button
              onClick={handleLogoutClick}
              className="btn-secondary"
              style={{ padding: '10px 18px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Orders History Section */}
        <div className="account-card" style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)', marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #E5DFC9' }}>
            <Package size={20} color="#B78B45" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#14231F' }}>
              Your Consignment History
            </h3>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '36px 0' }}>
              <RefreshCw size={24} color="#B78B45" style={{ animation: 'spin 1.5s linear infinite' }} />
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p style={{ color: '#5C6B63', fontSize: '0.9rem', marginBottom: '16px' }}>You have no orders yet.</p>
              <button onClick={() => onNavigate('shop')} className="btn-primary">
                Explore The Collection
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    padding: '20px',
                    borderRadius: '6px',
                    border: '1px solid #EBE4D5',
                    backgroundColor: '#FCFAF6',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <strong style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#14231F' }}>
                        {ord.order_number}
                      </strong>
                      <span className="badge-forest">{ord.status_display}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#8E9B94', marginTop: '4px' }}>
                      Placed: {new Date(ord.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {ord.items?.length || 1} items
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#B78B45' }}>
                        ₹{Number(ord.total_amount).toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#8E9B94' }}>{ord.payment_method_display}</div>
                    </div>

                    <button
                      onClick={() => onNavigate('order-tracking', { order_number: ord.order_number })}
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '0.75rem' }}
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Addresses Section */}
        <div className="account-card" style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #E5DFC9' }}>
            <MapPin size={20} color="#B78B45" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#14231F' }}>
              Saved Delivery Addresses
            </h3>
          </div>

          {addresses.length === 0 ? (
            <p style={{ color: '#5C6B63', fontSize: '0.88rem' }}>
              Your default delivery address will be saved here during your first checkout.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {addresses.map((addr) => (
                <div key={addr.id} style={{ padding: '16px', border: '1px solid #EBE4D5', borderRadius: '6px', backgroundColor: '#FCFAF6' }}>
                  <div style={{ fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>{addr.recipient_name}</div>
                  <div style={{ fontSize: '0.84rem', color: '#5C6B63', lineHeight: 1.5 }}>
                    {addr.address_line1}, {addr.city}, {addr.state} - {addr.postal_code}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#8E9B94', marginTop: '6px' }}>Ph: {addr.phone}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .account-card {
            padding: 20px 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
