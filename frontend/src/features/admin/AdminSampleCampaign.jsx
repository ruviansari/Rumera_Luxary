import React, { useState, useEffect } from 'react';
import {
  Gift,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  Truck,
  PackageCheck,
  Clock,
  Settings,
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Sparkles,
  Shield,
  FileSpreadsheet
} from 'lucide-react';
import { api, resolveImageUrl } from '../../services/api';

export default function AdminSampleCampaign({ currentUser }) {
  const [requests, setRequests] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [exporting, setExporting] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [notification, setNotification] = useState('');

  // Modals state
  const [dispatchModalItem, setDispatchModalItem] = useState(null);
  const [courierPartner, setCourierPartner] = useState('Blue Dart');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const [rejectModalItem, setRejectModalItem] = useState(null);
  const [rejectionNotes, setRejectionNotes] = useState('');

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.is_superuser;
  const isStoreManager = isSuperAdmin || currentUser?.role === 'STORE_MANAGER';

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [reqList, cfg] = await Promise.all([
        api.admin.getSampleRequests({
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          search: searchQuery || undefined
        }),
        api.admin.getSampleCampaignSettings()
      ]);
      setRequests(Array.isArray(reqList) ? reqList : (reqList.results || []));
      setSettings(cfg);
    } catch (err) {
      console.error("Failed to load sample campaign data:", err);
      showToast(err.message || "Failed to load sample requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleUpdateStatus = async (id, status, extraData = {}) => {
    try {
      await api.admin.updateSampleRequest(id, { status, ...extraData });
      showToast(`Sample request marked as ${status}.`);
      loadData();
    } catch (err) {
      alert(err.message || `Failed to update status to ${status}.`);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!settings) return;
    setSavingSettings(true);
    try {
      const updated = await api.admin.updateSampleCampaignSettings({
        is_active: settings.is_active,
        heading: settings.heading,
        subheading: settings.subheading,
        max_total_samples: parseInt(settings.max_total_samples, 10),
        daily_limit: parseInt(settings.daily_limit, 10),
        bounce_back_coupon_code: settings.bounce_back_coupon_code,
        bounce_back_discount_percent: parseInt(settings.bounce_back_discount_percent, 10),
        terms_text: settings.terms_text
      });
      setSettings(updated);
      showToast("Campaign parameters saved successfully.");
    } catch (err) {
      alert(err.message || "Failed to save settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      await api.admin.downloadSamplesCSV(statusFilter);
      showToast("CSV file generated and downloaded.");
    } catch (err) {
      alert(err.message || "Failed to download CSV export.");
    } finally {
      setExporting(false);
    }
  };

  const handleConfirmDispatch = async (e) => {
    e.preventDefault();
    if (!dispatchModalItem) return;
    if (!trackingNumber.trim()) {
      alert("Please enter a tracking / consignment number.");
      return;
    }
    await handleUpdateStatus(dispatchModalItem.id, 'DISPATCHED', {
      courier_partner: courierPartner,
      tracking_number: trackingNumber.trim(),
      admin_notes: adminNotes.trim()
    });
    setDispatchModalItem(null);
    setTrackingNumber('');
    setAdminNotes('');
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectModalItem) return;
    await handleUpdateStatus(rejectModalItem.id, 'REJECTED', {
      admin_notes: rejectionNotes.trim() || 'Duplicate registration or invalid address verification.'
    });
    setRejectModalItem(null);
    setRejectionNotes('');
  };

  // Stats calculation
  const totalCount = requests.length;
  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const approvedCount = requests.filter(r => r.status === 'APPROVED').length;
  const dispatchedCount = requests.filter(r => r.status === 'DISPATCHED').length;
  const deliveredCount = requests.filter(r => r.status === 'DELIVERED').length;
  const rejectedCount = requests.filter(r => r.status === 'REJECTED').length;

  return (
    <div>
      {/* Toast */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 3000,
          backgroundColor: '#14231F',
          color: '#FAF7F0',
          border: '1px solid #B78B45',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          fontSize: '0.85rem'
        }}>
          {notification}
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '26px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Gift size={20} color="#B78B45" />
            <h2 style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: '1.6rem', color: '#14231F', margin: 0 }}>
              Free Sample Marketing Campaign
            </h2>
          </div>
          <p style={{ fontSize: '0.86rem', color: '#666', margin: 0 }}>
            Manage complimentary flacon reservations, courier dispatches, and campaign conversion controls.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={loadData}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} />
            <span>{exporting ? 'Exporting...' : 'Export to CSV'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.74rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Total Allocations
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#14231F', margin: '4px 0' }}>
            {settings?.max_total_samples ?? 150}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#B78B45' }}>
            Remaining in quota: <strong>{settings?.remaining_count ?? 0} flacons</strong>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.74rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Pending Review
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#D97706', margin: '4px 0' }}>
            {pendingCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#666' }}>
            Awaiting fulfillment approval
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.74rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Dispatched Vials
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#2563EB', margin: '4px 0' }}>
            {dispatchedCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#666' }}>
            In transit via courier partner
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.74rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Delivered to Patrons
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#059669', margin: '4px 0' }}>
            {deliveredCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
            VIP 15% voucher issued
          </div>
        </div>
      </div>

      {/* Campaign Settings Collapsible Panel */}
      {isStoreManager && settings && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid #E5DFC9',
          padding: '24px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={18} color="#B78B45" />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#14231F', margin: 0 }}>
                Campaign Parameters & Inventory Controls
              </h3>
            </div>
            <div style={{
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.74rem',
              fontWeight: 700,
              backgroundColor: settings.is_active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: settings.is_active ? '#065F46' : '#991B1B',
              border: `1px solid ${settings.is_active ? '#10B981' : '#EF4444'}`
            }}>
              {settings.is_active ? 'CAMPAIGN LIVE' : 'CAMPAIGN PAUSED'}
            </div>
          </div>

          <form onSubmit={handleSaveSettings}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '18px' }}>
              {/* Campaign Active Switch */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="campaign-active-check"
                  checked={settings.is_active}
                  onChange={(e) => setSettings({ ...settings, is_active: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#B78B45', cursor: 'pointer' }}
                />
                <label htmlFor="campaign-active-check" style={{ fontSize: '0.86rem', fontWeight: 600, color: '#14231F', cursor: 'pointer' }}>
                  Enable Campaign on Storefront
                </label>
              </div>

              {/* Max Allocation */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#666', marginBottom: '4px' }}>
                  Maximum Total Samples Cap
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={settings.max_total_samples}
                  onChange={(e) => setSettings({ ...settings, max_total_samples: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D5CEBD', fontSize: '0.86rem' }}
                />
              </div>

              {/* Daily Allocation */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#666', marginBottom: '4px' }}>
                  Daily Allocation Limit
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={settings.daily_limit}
                  onChange={(e) => setSettings({ ...settings, daily_limit: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D5CEBD', fontSize: '0.86rem' }}
                />
              </div>

              {/* Bounce-Back Coupon */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#666', marginBottom: '4px' }}>
                  VIP Bounce-Back Coupon Code
                </label>
                <input
                  type="text"
                  value={settings.bounce_back_coupon_code}
                  onChange={(e) => setSettings({ ...settings, bounce_back_coupon_code: e.target.value.toUpperCase() })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D5CEBD', fontSize: '0.86rem', fontFamily: 'monospace', fontWeight: 700 }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#666', marginBottom: '4px' }}>
                  Homepage Banner Heading
                </label>
                <input
                  type="text"
                  value={settings.heading}
                  onChange={(e) => setSettings({ ...settings, heading: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D5CEBD', fontSize: '0.86rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#666', marginBottom: '4px' }}>
                  Banner Subheading
                </label>
                <input
                  type="text"
                  value={settings.subheading}
                  onChange={(e) => setSettings({ ...settings, subheading: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #D5CEBD', fontSize: '0.86rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={savingSettings}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.82rem' }}
              >
                {savingSettings ? 'Saving...' : 'Save Campaign Settings'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '16px 20px',
        borderRadius: '8px',
        border: '1px solid #E5DFC9',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Requests' },
            { id: 'PENDING', label: 'Pending' },
            { id: 'APPROVED', label: 'Approved' },
            { id: 'DISPATCHED', label: 'Dispatched' },
            { id: 'DELIVERED', label: 'Delivered' },
            { id: 'REJECTED', label: 'Rejected' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: statusFilter === tab.id ? 700 : 500,
                backgroundColor: statusFilter === tab.id ? '#14231F' : '#F8F4EC',
                color: statusFilter === tab.id ? '#FAF7F0' : '#444',
                border: '1px solid',
                borderColor: statusFilter === tab.id ? '#14231F' : '#E5DFC9',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by name, phone, PIN, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '7px 12px 7px 32px',
                borderRadius: '6px',
                border: '1px solid #D5CEBD',
                fontSize: '0.82rem',
                minWidth: '240px'
              }}
            />
            <Search size={14} color="#888" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          </div>
          <button type="submit" className="btn-secondary" style={{ padding: '7px 14px', fontSize: '0.8rem' }}>
            Search
          </button>
        </form>
      </div>

      {/* Sample Requests Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        border: '1px solid #E5DFC9',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {requests.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#888' }}>
            <Gift size={36} color="#B78B45" style={{ margin: '0 auto 12px', opacity: 0.6 }} />
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>
              No Sample Requests Found
            </div>
            <div style={{ fontSize: '0.84rem' }}>
              Customer sample requests matching your criteria will appear here.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8F4EC', borderBottom: '1px solid #E5DFC9', color: '#14231F', fontWeight: 700, fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <th style={{ padding: '14px 16px' }}>Request ID</th>
                  <th style={{ padding: '14px 16px' }}>Patron</th>
                  <th style={{ padding: '14px 16px' }}>Selected Fragrance</th>
                  <th style={{ padding: '14px 16px' }}>Delivery Address</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                  <th style={{ padding: '14px 16px' }}>Courier / Tracking</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => {
                  let badgeBg = '#FEF3C7';
                  let badgeText = '#92400E';
                  if (req.status === 'APPROVED') { badgeBg = '#DBEAFE'; badgeText = '#1E40AF'; }
                  if (req.status === 'DISPATCHED') { badgeBg = '#EDE9FE'; badgeText = '#5B21B6'; }
                  if (req.status === 'DELIVERED') { badgeBg = '#D1FAE5'; badgeText = '#065F46'; }
                  if (req.status === 'REJECTED') { badgeBg = '#FEE2E2'; badgeText = '#991B1B'; }

                  return (
                    <tr key={req.id} style={{ borderBottom: '1px solid #F0ECE1', verticalAlign: 'top' }}>
                      {/* ID & Date */}
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 700, color: '#14231F', fontFamily: 'monospace' }}>
                          {req.request_id}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#888' }}>
                          {new Date(req.created_at).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#14231F' }}>{req.full_name}</div>
                        <div style={{ fontSize: '0.76rem', color: '#555' }}>📞 {req.phone}</div>
                        <div style={{ fontSize: '0.74rem', color: '#777' }}>✉ {req.email}</div>
                      </td>

                      {/* Preferred Fragrance */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#14231F' }}>
                          {req.preferred_product_name || 'Artisanal Blend'}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#B78B45' }}>
                          Qty: {req.sample_quantity} × 2.5ml Discovery Vial
                        </div>
                      </td>

                      {/* Address */}
                      <td style={{ padding: '14px 16px', maxWidth: '240px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#333', lineHeight: 1.4 }}>
                          {req.address_line1}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#666', fontWeight: 600 }}>
                          {req.city}, {req.state} - {req.pincode}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 9px',
                          borderRadius: '12px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: badgeBg,
                          color: badgeText,
                          letterSpacing: '0.04em'
                        }}>
                          {req.status}
                        </span>
                      </td>

                      {/* Courier & Tracking */}
                      <td style={{ padding: '14px 16px' }}>
                        {req.tracking_number ? (
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.78rem', color: '#14231F' }}>
                              {req.courier_partner || 'Courier'}
                            </div>
                            <div style={{ fontSize: '0.74rem', fontFamily: 'monospace', color: '#2563EB' }}>
                              #{req.tracking_number}
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.76rem', color: '#999' }}>Not Dispatched</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          {req.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(req.id, 'APPROVED')}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '4px',
                                  fontSize: '0.74rem',
                                  fontWeight: 600,
                                  backgroundColor: '#10B981',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  cursor: 'pointer'
                                }}
                              >
                                Approve
                              </button>

                              <button
                                onClick={() => setRejectModalItem(req)}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '4px',
                                  fontSize: '0.74rem',
                                  fontWeight: 600,
                                  backgroundColor: '#EF4444',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  cursor: 'pointer'
                                }}
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {req.status === 'APPROVED' && (
                            <button
                              onClick={() => {
                                setDispatchModalItem(req);
                                setCourierPartner('Blue Dart');
                                setTrackingNumber('');
                              }}
                              style={{
                                padding: '5px 12px',
                                borderRadius: '4px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                backgroundColor: '#2563EB',
                                color: '#FFFFFF',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Truck size={13} />
                              <span>Dispatch</span>
                            </button>
                          )}

                          {req.status === 'DISPATCHED' && (
                            <button
                              onClick={() => handleUpdateStatus(req.id, 'DELIVERED')}
                              style={{
                                padding: '5px 12px',
                                borderRadius: '4px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                backgroundColor: '#059669',
                                color: '#FFFFFF',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <PackageCheck size={13} />
                              <span>Delivered</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: DISPATCH FLACON */}
      {dispatchModalItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            maxWidth: '460px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#14231F', margin: '0 0 8px' }}>
              Dispatch Complimentary Flacon
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#666', margin: '0 0 16px' }}>
              Recording dispatch for <strong>{dispatchModalItem.full_name}</strong> ({dispatchModalItem.request_id}).
            </p>

            <form onSubmit={handleConfirmDispatch}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#555', marginBottom: '4px', fontWeight: 600 }}>
                  Courier Partner *
                </label>
                <select
                  value={courierPartner}
                  onChange={(e) => setCourierPartner(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D5CEBD', fontSize: '0.86rem' }}
                >
                  <option value="Blue Dart">Blue Dart Express</option>
                  <option value="Delhivery">Delhivery Surface/Air</option>
                  <option value="DTDC">DTDC Courier</option>
                  <option value="India Post">India Post Speed Post</option>
                  <option value="Shiprocket">Shiprocket Royal Air</option>
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#555', marginBottom: '4px', fontWeight: 600 }}>
                  Airway Bill / Tracking Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BD849201940IN"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D5CEBD', fontSize: '0.86rem' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#555', marginBottom: '4px', fontWeight: 600 }}>
                  Fulfillment Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hand-packed in velvet pouch"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D5CEBD', fontSize: '0.86rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setDispatchModalItem(null)}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #CCC', background: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '6px', backgroundColor: '#2563EB', color: '#FFF', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REJECT REQUEST */}
      {rejectModalItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            maxWidth: '440px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#DC2626', margin: '0 0 8px' }}>
              Reject Sample Request
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#666', margin: '0 0 16px' }}>
              Reject request from <strong>{rejectModalItem.full_name}</strong> ({rejectModalItem.request_id}).
            </p>

            <form onSubmit={handleConfirmReject}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#555', marginBottom: '4px', fontWeight: 600 }}>
                  Reason for Rejection
                </label>
                <textarea
                  rows={3}
                  value={rejectionNotes}
                  onChange={(e) => setRejectionNotes(e.target.value)}
                  placeholder="e.g. Incomplete address or suspicious spam entry"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D5CEBD', fontSize: '0.86rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setRejectModalItem(null)}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #CCC', background: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '6px', backgroundColor: '#DC2626', color: '#FFF', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                >
                  Confirm Reject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

