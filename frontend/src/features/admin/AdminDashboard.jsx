import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, Boxes, ShoppingCart, Users, Tag,
  FileText, Shield, ArrowLeft, Plus, RefreshCw, CheckCircle,
  AlertTriangle, Truck, Search, Edit2, LogOut, ArrowUpRight,
  Trash2, X, Upload, Menu, ShoppingBag, MessageSquare
} from 'lucide-react';
import { api } from '../../services/api';

export default function AdminDashboard({ currentUser, onNavigate, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [movements, setMovements] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [abandonedCarts, setAbandonedCarts] = useState({ total_abandoned_carts: 0, potential_lost_revenue: 0, results: [] });
  const [ownerProfile, setOwnerProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modals & form states
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockForm, setStockForm] = useState({ variant_id: '', quantity_change: '', reason: 'RESTOCK', notes: '' });
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({ code: '', discount_type: 'PERCENTAGE', discount_value: '10', min_purchase_amount: '1000', valid_to: '2026-12-31T23:59' });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: 'PROCESSING', carrier_name: 'Bluedart Express', tracking_number: '', cancelled_reason: '' });

  // Product CRUD states
  const [showProductModal, setShowProductModal] = useState(false);
  const [productModalMode, setProductModalMode] = useState('create');
  const [editingProductId, setEditingProductId] = useState(null);
  const defaultProductForm = {
    name: '',
    sku: '',
    category: '',
    product_type: 'ATTAR',
    status: 'ACTIVE',
    short_description: '',
    description: '',
    fragrance_family: 'Pure Oud & Royal Woods',
    concentration: '100% Pure Non-Alcoholic Oil',
    top_notes: '',
    heart_notes: '',
    base_notes: '',
    is_featured: false,
    is_bestseller: false,
    image_url: '/images/rumera_white_oud_hero.jpg',
    volume_size: '6 ml',
    price: '2499',
    compare_at_price: '3499',
    stock_quantity: '20'
  };
  const [productForm, setProductForm] = useState(defaultProductForm);

  const loadData = async () => {
    setLoading(true);
    try {
      const [anRes, prodRes, ordRes, cpnRes, movRes, audRes, ownRes, catRes, cartRes] = await Promise.all([
        api.admin.getAnalytics().catch(() => null),
        api.admin.getProducts().catch(() => ({ results: [] })),
        api.admin.getOrders().catch(() => ({ results: [] })),
        api.admin.getCoupons().catch(() => ({ results: [] })),
        api.admin.getStockMovements().catch(() => ({ results: [] })),
        api.admin.getAuditLogs().catch(() => ({ results: [] })),
        api.admin.getOwnerProfile().catch(() => ({})),
        api.getCategories().catch(() => []),
        api.admin.getAbandonedCarts().catch(() => ({ total_abandoned_carts: 0, results: [] })),
      ]);

      setAnalytics(anRes);
      setProducts(prodRes?.results || prodRes || []);
      setOrders(ordRes?.results || ordRes || []);
      setCoupons(cpnRes?.results || cpnRes || []);
      setMovements(movRes?.results || movRes || []);
      setAuditLogs(audRes?.results || audRes || []);
      setOwnerProfile(ownRes || {});
      setCategories(catRes || []);
      setAbandonedCarts(cartRes || { total_abandoned_carts: 0, results: [] });
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShiprocketDispatch = async (orderId) => {
    try {
      const res = await api.admin.dispatchShiprocket(orderId);
      showSuccessNotice(`Assigned ${res.carrier_name} AWB: ${res.tracking_number}`);
      loadData();
    } catch (err) {
      alert(err.message || "Shiprocket dispatch failed.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showSuccessNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 4000);
  };

  // Stock Adjustment Submit
  const handleStockSubmit = async (e) => {
    e.preventDefault();
    if (!stockForm.variant_id || !stockForm.quantity_change || !stockForm.notes.trim()) {
      alert("Please fill all fields. Notes/reason description is required by audit policy.");
      return;
    }
    try {
      await api.admin.adjustStock({
        variant_id: parseInt(stockForm.variant_id),
        quantity_change: parseInt(stockForm.quantity_change),
        reason: stockForm.reason,
        notes: stockForm.notes,
      });
      setShowStockModal(false);
      setStockForm({ variant_id: '', quantity_change: '', reason: 'RESTOCK', notes: '' });
      showSuccessNotice("Stock adjustment recorded in audit ledger successfully.");
      loadData();
    } catch (err) {
      alert(err.message || "Failed to adjust stock.");
    }
  };

  // Coupon Creation Submit
  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.admin.createCoupon({
        ...couponForm,
        discount_value: parseFloat(couponForm.discount_value),
        min_purchase_amount: parseFloat(couponForm.min_purchase_amount),
        valid_from: new Date().toISOString(),
        valid_to: new Date(couponForm.valid_to).toISOString(),
        is_active: true,
      });
      setShowCouponModal(false);
      showSuccessNotice(`Coupon ${couponForm.code.toUpperCase()} created successfully.`);
      loadData();
    } catch (err) {
      alert(err.message || "Failed to create coupon.");
    }
  };

  // Order Status Update Submit
  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      await api.admin.updateOrderStatus(selectedOrder.order_number, statusForm);
      setShowStatusModal(false);
      showSuccessNotice(`Order ${selectedOrder.order_number} status updated to ${statusForm.status}.`);
      loadData();
    } catch (err) {
      alert(err.message || "Failed to update order status.");
    }
  };

  // Owner Profile Update
  const handleOwnerProfileSave = async (e) => {
    e.preventDefault();
    try {
      await api.admin.updateOwnerProfile(ownerProfile);
      showSuccessNotice("Owner Profile & Atelier Story updated on public website!");
    } catch (err) {
      alert(err.message || "Failed to update profile.");
    }
  };

  // Open Create Product Modal
  const handleOpenCreateProduct = () => {
    setProductModalMode('create');
    setEditingProductId(null);
    setProductForm({
      ...defaultProductForm,
      category: categories[0]?.id || '1',
    });
    setShowProductModal(true);
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (p) => {
    setProductModalMode('edit');
    setEditingProductId(p.id);
    const primaryVariant = p.variants?.[0] || {};
    setProductForm({
      name: p.name || '',
      sku: p.sku || '',
      category: p.category?.id || p.category || (categories[0]?.id || '1'),
      product_type: p.product_type || 'ATTAR',
      status: p.status || 'ACTIVE',
      short_description: p.short_description || '',
      description: p.description || '',
      fragrance_family: p.fragrance_family || 'Pure Oud & Royal Woods',
      concentration: p.concentration || '100% Pure Non-Alcoholic Oil',
      top_notes: p.top_notes || '',
      heart_notes: p.heart_notes || '',
      base_notes: p.base_notes || '',
      is_featured: !!p.is_featured,
      is_bestseller: !!p.is_bestseller,
      image_url: p.primary_image || (p.images?.[0]?.image_url || '/images/rumera_white_oud_hero.jpg'),
      volume_size: primaryVariant.volume_size || '6 ml',
      price: primaryVariant.price ? String(primaryVariant.price) : '2499',
      compare_at_price: primaryVariant.compare_at_price ? String(primaryVariant.compare_at_price) : '',
      stock_quantity: primaryVariant.stock_quantity !== undefined ? String(primaryVariant.stock_quantity) : '20',
    });
    setShowProductModal(true);
  };

  // Submit Create or Edit Product
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: productForm.name.trim(),
        sku: productForm.sku.trim().toUpperCase(),
        category: parseInt(productForm.category) || categories[0]?.id || 1,
        product_type: productForm.product_type,
        status: productForm.status,
        short_description: productForm.short_description,
        description: productForm.description,
        fragrance_family: productForm.fragrance_family,
        concentration: productForm.concentration,
        top_notes: productForm.top_notes,
        heart_notes: productForm.heart_notes,
        base_notes: productForm.base_notes,
        is_featured: productForm.is_featured,
        is_bestseller: productForm.is_bestseller,
        variants: [
          {
            volume_size: productForm.volume_size,
            sku: `${productForm.sku.trim().toUpperCase()}-${productForm.volume_size.replace(/[^a-zA-Z0-9]/g, '')}`,
            price: parseFloat(productForm.price),
            compare_at_price: productForm.compare_at_price ? parseFloat(productForm.compare_at_price) : null,
            stock_quantity: parseInt(productForm.stock_quantity) || 0,
          }
        ],
        images: [
          {
            image_url: productForm.image_url || '/images/rumera_white_oud_hero.jpg',
            is_primary: true
          }
        ]
      };

      if (productModalMode === 'create') {
        await api.admin.createProduct(payload);
        showSuccessNotice(`Product "${productForm.name}" created successfully.`);
      } else {
        await api.admin.updateProduct(editingProductId, payload);
        showSuccessNotice(`Product "${productForm.name}" updated successfully.`);
      }

      setShowProductModal(false);
      loadData();
    } catch (err) {
      alert(err.message || "Failed to save product.");
    }
  };

  // Delete Product
  const handleProductDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.admin.deleteProduct(id);
      showSuccessNotice(`Product "${name}" deleted.`);
      loadData();
    } catch (err) {
      alert(err.message || "Failed to delete product.");
    }
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard & KPIs', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders & Fulfilment', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory & Audit Log', icon: Boxes },
    { id: 'products', label: 'Product Catalog', icon: Package },
    { id: 'coupons', label: 'Coupons & Promos', icon: Tag },
    { id: 'abandoned-carts', label: 'Abandoned Carts (Recovery)', icon: ShoppingBag },
    { id: 'cms', label: 'Owner Profile & CMS', icon: FileText },
    { id: 'audit', label: 'Security & Audit Trail', icon: Shield },
  ];

  return (
    <div className="admin-root-container">
      {/* Mobile Top Header (<= 960px) */}
      <div className="admin-mobile-bar">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="admin-menu-toggle"
          aria-label="Toggle Navigation Drawer"
        >
          <Menu size={22} color="#D4AF37" />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="/images/rumera_crest_emblem.png"
            alt="Rumera Crest"
            style={{ height: '22px', width: 'auto', objectFit: 'contain' }}
          />
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', letterSpacing: '0.12em', color: '#FAF7F0', fontWeight: 600 }}>
            RUMERA ERP
          </span>
        </div>
        <button
          onClick={() => onNavigate('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#D4AF37', background: 'none', border: 'none', fontSize: '0.78rem', cursor: 'pointer', padding: '6px' }}
          title="Return to Storefront"
        >
          <ArrowLeft size={16} />
          <span className="admin-store-text">Store</span>
        </button>
      </div>

      {/* Backdrop overlay when mobile sidebar drawer is open */}
      {mobileSidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* 1. Left ERP Sidebar */}
      <aside className={`admin-erp-sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="admin-sidebar-header" style={{ padding: '24px 20px', borderBottom: '1px solid rgba(183,139,69,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src="/images/rumera_crest_emblem.png"
                alt="Rumera Crest"
                style={{ height: '26px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.6))' }}
              />
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', letterSpacing: '0.14em', color: '#FFFFFF', fontWeight: 600 }}>
                RUMERA ERP
              </span>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="admin-mobile-close-btn"
              aria-label="Close Sidebar"
            >
              <X size={20} color="#FAF7F0" />
            </button>
          </div>
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', color: '#B78B45', textTransform: 'uppercase', marginTop: '2px' }}>
            Internal Management Suite
          </div>
        </div>

        {/* Current User Role Pill */}
        <div style={{ padding: '16px 20px', backgroundColor: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '0.7rem', color: '#8E9B94', textTransform: 'uppercase' }}>Authenticated Role</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#E8CA89', marginTop: '2px' }}>
            {currentUser?.role?.replace('_', ' ') || 'Super Admin'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#B6C4BC', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentUser?.email}
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '4px',
                  backgroundColor: isActive ? '#14231F' : 'transparent',
                  color: isActive ? '#B78B45' : '#C6D2CC',
                  border: isActive ? '1px solid #B78B45' : '1px solid transparent',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 400,
                  textAlign: 'left',
                }}
              >
                <Icon size={18} color={isActive ? '#B78B45' : '#8E9B94'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Return to Storefront & Logout */}
        <div style={{ padding: '16px 14px', borderTop: '1px solid rgba(183,139,69,0.2)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => onNavigate('home')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B78B45', fontSize: '0.82rem', padding: '8px' }}
          >
            <ArrowLeft size={16} />
            <span>Return to Storefront</span>
          </button>
          <button
            onClick={onLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#963832', fontSize: '0.82rem', padding: '8px' }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main ERP Content Area */}
      <main className="admin-erp-main">
        {/* Top Header */}
        <div className="admin-main-header">
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', color: '#14231F' }}>
              {navItems.find(n => n.id === activeTab)?.label}
            </h1>
            <div style={{ fontSize: '0.82rem', color: '#5C6B63' }}>
              Live production data connected to Python Django REST Framework
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={loadData} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={14} />
              <span>Refresh Metrics</span>
            </button>
            <button onClick={() => setShowStockModal(true)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.78rem' }}>
              <Plus size={15} />
              <span>Adjust Inventory</span>
            </button>
          </div>
        </div>

        {/* Notice Banner */}
        {notice && (
          <div style={{ padding: '12px 18px', backgroundColor: '#2A684C', color: '#FFFFFF', borderRadius: '4px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
            <CheckCircle size={18} />
            <span>{notice}</span>
          </div>
        )}

        {/* TAB 1: OVERVIEW & KPIS */}
        {activeTab === 'overview' && (
          <div>
            {/* KPI Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8E9B94' }}>Orders Today</div>
                <div style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: '#14231F', marginTop: '4px' }}>
                  {analytics?.kpis?.orders_today || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#2A684C', marginTop: '4px' }}>Live real-time count</div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8E9B94' }}>Gross Sales</div>
                <div style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: '#B78B45', marginTop: '4px' }}>
                  ₹{Number(analytics?.kpis?.gross_sales || 0).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#5C6B63', marginTop: '4px' }}>Calculated from API</div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8E9B94' }}>Pending Fulfilment</div>
                <div style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: '#14231F', marginTop: '4px' }}>
                  {analytics?.kpis?.pending_orders || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#B78B45', marginTop: '4px' }}>Action required</div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8E9B94' }}>Low Stock Reserves</div>
                <div style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: analytics?.kpis?.low_stock_count > 0 ? '#963832' : '#2A684C', marginTop: '4px' }}>
                  {analytics?.kpis?.low_stock_count || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#8E9B94', marginTop: '4px' }}>Threshold ≤ 5 units</div>
              </div>
            </div>

            {/* Low Stock Alerts Strip */}
            {analytics?.low_stock_variants?.length > 0 && (
              <div style={{ backgroundColor: 'rgba(150, 56, 50, 0.08)', border: '1px solid rgba(150, 56, 50, 0.25)', padding: '20px', borderRadius: '8px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#963832', fontWeight: 600, marginBottom: '8px' }}>
                  <AlertTriangle size={18} />
                  <span>Low Stock Reserve Warning</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {analytics.low_stock_variants.map((v) => (
                    <span key={v.id} style={{ backgroundColor: '#FFFFFF', padding: '6px 12px', borderRadius: '4px', border: '1px solid #E5DFC9', fontSize: '0.82rem', color: '#14231F' }}>
                      {v.product_name} ({v.volume_size}): <strong style={{ color: '#963832' }}>{v.stock_quantity} left</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Orders Table */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '28px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#14231F' }}>
                  Recent Orders
                </h3>
                <button onClick={() => setActiveTab('orders')} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.75rem' }}>
                  View All Orders
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E5DFC9', color: '#8E9B94', textTransform: 'uppercase', fontSize: '0.74rem', letterSpacing: '0.06em' }}>
                      <th style={{ padding: '12px 14px' }}>Order #</th>
                      <th style={{ padding: '12px 14px' }}>Recipient</th>
                      <th style={{ padding: '12px 14px' }}>Payment</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 14px' }}>Amount</th>
                      <th style={{ padding: '12px 14px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 6).map((ord) => (
                      <tr key={ord.id} style={{ borderBottom: '1px solid #EFEAE0' }}>
                        <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 600 }}>{ord.order_number}</td>
                        <td style={{ padding: '12px 14px' }}>{ord.recipient_name}</td>
                        <td style={{ padding: '12px 14px' }}>{ord.payment_method_display || ord.payment_method}</td>
                        <td style={{ padding: '12px 14px' }}><span className="badge-forest">{ord.status_display || ord.status}</span></td>
                        <td style={{ padding: '12px 14px', fontWeight: 600, color: '#B78B45' }}>₹{Number(ord.total_amount).toLocaleString('en-IN')}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <button
                            onClick={() => { setSelectedOrder(ord); setStatusForm({ ...statusForm, status: ord.status }); setShowStatusModal(true); }}
                            style={{ color: '#14231F', textDecoration: 'underline', fontSize: '0.78rem', fontWeight: 600 }}
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div style={{ backgroundColor: '#FFFFFF', padding: '28px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#14231F', marginBottom: '20px' }}>
              Consignment Dispatch & State Machine ({orders.length} orders)
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E5DFC9', color: '#8E9B94', textTransform: 'uppercase', fontSize: '0.74rem' }}>
                    <th style={{ padding: '12px' }}>Order #</th>
                    <th style={{ padding: '12px' }}>Customer Details</th>
                    <th style={{ padding: '12px' }}>Destination</th>
                    <th style={{ padding: '12px' }}>Total Amount</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Courier / Tracking</th>
                    <th style={{ padding: '12px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord.id} style={{ borderBottom: '1px solid #EFEAE0' }}>
                      <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 600 }}>{ord.order_number}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 600 }}>{ord.recipient_name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#8E9B94' }}>{ord.phone}</div>
                      </td>
                      <td style={{ padding: '12px', fontSize: '0.8rem' }}>{ord.city}, {ord.state} ({ord.postal_code})</td>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#B78B45' }}>₹{Number(ord.total_amount).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '12px' }}><span className="badge-forest">{ord.status_display}</span></td>
                      <td style={{ padding: '12px', fontSize: '0.8rem' }}>
                        {ord.tracking_number ? (
                          <span>{ord.carrier_name}: <strong>{ord.tracking_number}</strong></span>
                        ) : (
                          <span style={{ color: '#8E9B94' }}>Unassigned</span>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button
                            onClick={() => { setSelectedOrder(ord); setStatusForm({ status: ord.status, carrier_name: ord.carrier_name || 'Bluedart Express', tracking_number: ord.tracking_number || '', cancelled_reason: '' }); setShowStatusModal(true); }}
                            className="btn-secondary"
                            style={{ padding: '6px 10px', fontSize: '0.74rem' }}
                          >
                            Dispatch / Status
                          </button>
                          {(!ord.tracking_number || ord.status === 'PROCESSING') && (
                            <button
                              onClick={() => handleShiprocketDispatch(ord.id)}
                              style={{
                                padding: '6px 10px',
                                fontSize: '0.72rem',
                                backgroundColor: '#14231F',
                                color: '#D4AF37',
                                border: '1px solid #B78B45',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 700,
                                whiteSpace: 'nowrap'
                              }}
                              title="1-Click Dispatch via Shiprocket"
                            >
                              ⚡ Shiprocket
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: INVENTORY & STOCK MOVEMENTS AUDIT */}
        {activeTab === 'inventory' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#14231F' }}>
                  Auditable Stock Ledger
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#5C6B63' }}>Every inventory delta requires a mandatory audit rationale.</p>
              </div>
              <button onClick={() => setShowStockModal(true)} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.82rem' }}>
                <Plus size={16} />
                <span>Perform Stock Adjustment</span>
              </button>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E5DFC9', color: '#8E9B94', textTransform: 'uppercase', fontSize: '0.74rem' }}>
                    <th style={{ padding: '12px' }}>Timestamp</th>
                    <th style={{ padding: '12px' }}>Creation / Size</th>
                    <th style={{ padding: '12px' }}>Adjustment</th>
                    <th style={{ padding: '12px' }}>Balance After</th>
                    <th style={{ padding: '12px' }}>Reason</th>
                    <th style={{ padding: '12px' }}>Explanation / Notes</th>
                    <th style={{ padding: '12px' }}>Audited Actor</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((m) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #EFEAE0' }}>
                      <td style={{ padding: '12px', fontSize: '0.8rem', color: '#8E9B94' }}>{new Date(m.created_at).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{m.variant_name} ({m.variant_size})</td>
                      <td style={{ padding: '12px', fontWeight: 700, color: m.quantity_change > 0 ? '#2A684C' : '#963832' }}>
                        {m.quantity_change > 0 ? `+${m.quantity_change}` : m.quantity_change}
                      </td>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{m.balance_after}</td>
                      <td style={{ padding: '12px' }}><span className="badge-forest">{m.reason}</span></td>
                      <td style={{ padding: '12px', fontSize: '0.82rem', color: '#5C6B63' }}>{m.notes}</td>
                      <td style={{ padding: '12px', fontSize: '0.78rem' }}>{m.actor_email || 'System'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PRODUCT CATALOG */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#14231F' }}>
                  Catalog Master List ({products.length} products)
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#5C6B63' }}>Manage artisanal attar formulations, prices, and olfactory profiles.</p>
              </div>
              <button onClick={handleOpenCreateProduct} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={16} />
                <span>Add New Fragrance</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '20px' }}>
              {products.map((p) => (
                <div key={p.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5DFC9', borderRadius: '8px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#8E9B94', fontWeight: 600 }}>SKU: {p.sku}</span>
                      <span className="badge-forest" style={{ fontSize: '0.68rem' }}>{p.status || 'ACTIVE'}</span>
                    </div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#14231F', margin: '6px 0 2px' }}>{p.name}</h4>
                    <div style={{ fontSize: '0.78rem', color: '#B78B45', fontWeight: 600 }}>{p.fragrance_family}</div>
                    {p.short_description && (
                      <p style={{ fontSize: '0.8rem', color: '#5C6B63', marginTop: '6px', lineHeight: 1.4, display: '-webkit-box', WebKitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {p.short_description}
                      </p>
                    )}
                  </div>

                  <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #EFEAE0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.78rem', color: '#5C6B63' }}>{p.variants?.length || 1} Size Variants</span>
                      <span style={{ fontWeight: 700, color: '#14231F', fontSize: '0.95rem' }}>From ₹{Number(p.base_price).toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenEditProduct(p)}
                        className="btn-secondary"
                        style={{ flex: 1, padding: '7px 10px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleProductDelete(p.id, p.name)}
                        className="btn-secondary"
                        title="Delete product"
                        style={{ padding: '7px 10px', color: '#963832', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: COUPONS & PROMOTIONS */}
        {activeTab === 'coupons' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#14231F' }}>
                  Promotional Coupons Engine
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#5C6B63' }}>Server-enforced discount codes and thresholds.</p>
              </div>
              <button onClick={() => setShowCouponModal(true)} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.82rem' }}>
                <Plus size={16} />
                <span>Create New Coupon</span>
              </button>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E5DFC9', color: '#8E9B94', textTransform: 'uppercase', fontSize: '0.74rem' }}>
                    <th style={{ padding: '12px' }}>Coupon Code</th>
                    <th style={{ padding: '12px' }}>Type</th>
                    <th style={{ padding: '12px' }}>Discount</th>
                    <th style={{ padding: '12px' }}>Min Cart Spend</th>
                    <th style={{ padding: '12px' }}>Usage Status</th>
                    <th style={{ padding: '12px' }}>Active</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #EFEAE0' }}>
                      <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 700, color: '#14231F' }}>{c.code}</td>
                      <td style={{ padding: '12px' }}>{c.discount_type}</td>
                      <td style={{ padding: '12px', fontWeight: 600, color: '#B78B45' }}>
                        {c.discount_type === 'PERCENTAGE' ? `${c.discount_value}%` : `₹${c.discount_value}`}
                      </td>
                      <td style={{ padding: '12px' }}>₹{Number(c.min_purchase_amount).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '12px' }}>{c.times_used} / {c.usage_limit} used</td>
                      <td style={{ padding: '12px' }}><span className="badge-forest">{c.is_active ? 'Active' : 'Disabled'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: ABANDONED CARTS RECOVERY ENGINE */}
        {activeTab === 'abandoned-carts' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#14231F' }}>
                  Abandoned Cart Recovery Engine
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#5C6B63' }}>
                  Track abandoned flacons and send automated 1-click WhatsApp recovery discount vouchers
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ backgroundColor: '#14231F', color: '#FAF7F0', padding: '10px 18px', borderRadius: '8px', border: '1px solid #B78B45', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D4AF37' }}>Potential Lost Revenue</div>
                  <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                    ₹{Number(abandonedCarts.potential_lost_revenue || 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', padding: '10px 18px', borderRadius: '8px', border: '1px solid #E5DFC9', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7E9187' }}>Pending Carts</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#14231F' }}>
                    {abandonedCarts.total_abandoned_carts || abandonedCarts.results?.length || 0}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5DFC9', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead style={{ backgroundColor: '#F8F4EC', borderBottom: '1px solid #E5DFC9', fontSize: '0.74rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5C6B63' }}>
                  <tr>
                    <th style={{ padding: '14px 16px' }}>Connoisseur</th>
                    <th style={{ padding: '14px 16px' }}>Abandoned Flacons</th>
                    <th style={{ padding: '14px 16px' }}>Cart Value</th>
                    <th style={{ padding: '14px 16px' }}>Time Elapsed</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Recovery Action</th>
                  </tr>
                </thead>
                <tbody>
                  {abandonedCarts.results && abandonedCarts.results.length > 0 ? (
                    abandonedCarts.results.map((c) => (
                      <tr key={c.cart_id} style={{ borderBottom: '1px solid #EFEAE0' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600, color: '#14231F' }}>{c.user_name}</div>
                          <div style={{ fontSize: '0.76rem', color: '#7E9187' }}>
                            {c.user_phone || c.user_email || 'Session Guest'}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: '#3A4842', maxWidth: '280px' }}>
                          <div style={{ fontWeight: 600 }}>{c.items_count} Flacons</div>
                          <div style={{ fontSize: '0.76rem', color: '#7E9187', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {c.items_summary}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: '#B78B45', fontSize: '0.94rem' }}>
                          ₹{Number(c.cart_total).toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '0.78rem', color: '#7E9187' }}>
                          {new Date(c.last_updated).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <a
                            href={c.whatsapp_recovery_url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 14px',
                              backgroundColor: '#14231F',
                              color: '#FAF7F0',
                              border: '1px solid #B78B45',
                              borderRadius: '20px',
                              fontSize: '0.76rem',
                              fontWeight: 600,
                              textDecoration: 'none',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#25D366' }}></span>
                            <span>Send WhatsApp Voucher</span>
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ padding: '36px', textAlign: 'center', color: '#7E9187' }}>
                        No abandoned carts currently. All active client checkouts are finalized!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: FOUNDER PROFILE & CMS */}
        {activeTab === 'cms' && (
          <div style={{ backgroundColor: '#FFFFFF', padding: '36px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)', maxWidth: '880px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#14231F', marginBottom: '8px' }}>
              Edit Owner & Founder Profile
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#5C6B63', marginBottom: '24px' }}>
              All modifications publish immediately to the homepage atelier strip and `/owner` profile page.
            </p>

            <form onSubmit={handleOwnerProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Display Name</label>
                  <input
                    type="text"
                    value={ownerProfile.display_name || ''}
                    onChange={(e) => setOwnerProfile({ ...ownerProfile, display_name: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Title</label>
                  <input
                    type="text"
                    value={ownerProfile.title || ''}
                    onChange={(e) => setOwnerProfile({ ...ownerProfile, title: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '8px' }}>
                  Founder Portrait Photo / Image
                </label>
                
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', backgroundColor: '#FAF7F0', padding: '16px', borderRadius: '8px', border: '1px solid #E5DFC9', marginBottom: '8px' }}>
                  {/* Image Preview Box */}
                  <div style={{ width: '90px', height: '110px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #B78B45', backgroundColor: '#FFFFFF', flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}>
                    {ownerProfile.portrait_url ? (
                      <img
                        src={ownerProfile.portrait_url}
                        alt="Founder Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8E9B94', fontSize: '0.72rem', textAlign: 'center', padding: '4px' }}>
                        No Photo
                      </div>
                    )}
                  </div>

                  {/* Upload & URL Controls */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#14231F', color: '#FFFFFF', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                        <Upload size={14} color="#B78B45" />
                        <span>Upload Photo from Computer</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (loadEvent) => {
                                setOwnerProfile({ ...ownerProfile, portrait_url: loadEvent.target.result });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <span style={{ fontSize: '0.75rem', color: '#5C6B63', marginLeft: '12px' }}>
                        PNG, JPG, WEBP supported
                      </span>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#8E9B94', display: 'block', marginBottom: '4px' }}>
                        Or enter direct image URL / file path:
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. /images/rumana_ansari.png or https://..."
                        value={ownerProfile.portrait_url || ''}
                        onChange={(e) => setOwnerProfile({ ...ownerProfile, portrait_url: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.82rem' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Inspirational Quote</label>
                <input
                  type="text"
                  value={ownerProfile.quote || ''}
                  onChange={(e) => setOwnerProfile({ ...ownerProfile, quote: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Short Bio (Homepage Preview)</label>
                <textarea
                  rows={2}
                  value={ownerProfile.short_bio || ''}
                  onChange={(e) => setOwnerProfile({ ...ownerProfile, short_bio: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Full Story (/owner page)</label>
                <textarea
                  rows={4}
                  value={ownerProfile.full_story || ''}
                  onChange={(e) => setOwnerProfile({ ...ownerProfile, full_story: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                />
              </div>

              <button type="submit" className="btn-gold btn-primary" style={{ padding: '14px 24px', fontSize: '0.9rem', alignSelf: 'flex-start' }}>
                Publish Changes to Public Site
              </button>
            </form>
          </div>
        )}

        {/* TAB 7: AUDIT LOG */}
        {activeTab === 'audit' && (
          <div style={{ backgroundColor: '#FFFFFF', padding: '28px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#14231F', marginBottom: '8px' }}>
              Security & Action Audit Trail
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#5C6B63', marginBottom: '20px' }}>
              Immutable record of administrative interventions, price changes, and cancellations.
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E5DFC9', color: '#8E9B94', textTransform: 'uppercase', fontSize: '0.74rem' }}>
                  <th style={{ padding: '12px' }}>Timestamp</th>
                  <th style={{ padding: '12px' }}>Actor</th>
                  <th style={{ padding: '12px' }}>Action</th>
                  <th style={{ padding: '12px' }}>Target Entity</th>
                  <th style={{ padding: '12px' }}>Reason / Notes</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#8E9B94' }}>
                      No manual overrides logged yet. System operating within normal boundaries.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #EFEAE0' }}>
                      <td style={{ padding: '12px', fontSize: '0.8rem', color: '#8E9B94' }}>{new Date(log.created_at).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{log.actor_email}</td>
                      <td style={{ padding: '12px' }}><span className="badge-forest">{log.action}</span></td>
                      <td style={{ padding: '12px' }}>{log.entity_name} ({log.entity_id})</td>
                      <td style={{ padding: '12px', color: '#5C6B63' }}>{log.reason}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* MODAL 1: STOCK ADJUSTMENT WITH MANDATORY REASON */}
      {showStockModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }}>
          <div style={{ width: '100%', maxWidth: '480px', backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#14231F', marginBottom: '8px' }}>
              Perform Audited Stock Adjustment
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#5C6B63', marginBottom: '20px' }}>
              All inventory updates are tracked with your administrator ID in the auditable movement ledger.
            </p>

            <form onSubmit={handleStockSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Product Variant *</label>
                <select
                  value={stockForm.variant_id}
                  onChange={(e) => setStockForm({ ...stockForm, variant_id: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                >
                  <option value="">-- Choose Variant --</option>
                  {products.flatMap(p => (p.variants || []).map(v => (
                    <option key={v.id} value={v.id}>{p.name} - {v.volume_size} (Current: {v.stock_quantity})</option>
                  )))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>
                  Quantity Delta (+ to add, - to deduct) *
                </label>
                <input
                  type="number"
                  placeholder="e.g. +20 or -2"
                  value={stockForm.quantity_change}
                  onChange={(e) => setStockForm({ ...stockForm, quantity_change: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Adjustment Reason *</label>
                <select
                  value={stockForm.reason}
                  onChange={(e) => setStockForm({ ...stockForm, reason: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                >
                  <option value="RESTOCK">Restock / New Distillation Batch</option>
                  <option value="AUDIT_ADJUSTMENT">Physical Audit Stock Reconciliation</option>
                  <option value="DAMAGE">Damaged / Flacon Spillage Write-off</option>
                  <option value="MANUAL">Manual Executive Adjustment</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Audit Reason Notes *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Mandatory description for ledger (e.g. Received shipment batch #ASSAM-82)"
                  value={stockForm.notes}
                  onChange={(e) => setStockForm({ ...stockForm, notes: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowStockModal(false)} className="btn-secondary" style={{ padding: '10px 18px', fontSize: '0.82rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.82rem' }}>
                  Commit Delta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ORDER STATUS & DISPATCH */}
      {showStatusModal && selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }}>
          <div style={{ width: '100%', maxWidth: '500px', backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#14231F', marginBottom: '4px' }}>
              Fulfill Order {selectedOrder.order_number}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#5C6B63', marginBottom: '20px' }}>
              Recipient: {selectedOrder.recipient_name} (₹{Number(selectedOrder.total_amount).toLocaleString('en-IN')})
            </p>

            <form onSubmit={handleStatusSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Fulfillment State *</label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                >
                  <option value="PAID">Paid / Confirmed</option>
                  <option value="PROCESSING">Processing (Decanting & Hand Packing)</option>
                  <option value="SHIPPED">Shipped (In Transit)</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled (Restocks Inventory)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Carrier Partner</label>
                <input
                  type="text"
                  value={statusForm.carrier_name}
                  onChange={(e) => setStatusForm({ ...statusForm, carrier_name: e.target.value })}
                  placeholder="e.g. Bluedart Luxury Express"
                  style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Tracking / AWB Number</label>
                <input
                  type="text"
                  value={statusForm.tracking_number}
                  onChange={(e) => setStatusForm({ ...statusForm, tracking_number: e.target.value })}
                  placeholder="e.g. BLU-82749102"
                  style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                />
              </div>

              {statusForm.status === 'CANCELLED' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#963832', marginBottom: '4px' }}>Cancellation Reason *</label>
                  <input
                    type="text"
                    required
                    value={statusForm.cancelled_reason}
                    onChange={(e) => setStatusForm({ ...statusForm, cancelled_reason: e.target.value })}
                    placeholder="Customer requested / Address unserviceable"
                    style={{ width: '100%', padding: '10px', border: '1px solid #963832', borderRadius: '4px' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowStatusModal(false)} className="btn-secondary" style={{ padding: '10px 18px', fontSize: '0.82rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.82rem' }}>
                  Commit Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE COUPON */}
      {showCouponModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)' }}>
          <div style={{ width: '100%', maxWidth: '480px', backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#14231F', marginBottom: '16px' }}>
              Create Promotional Coupon
            </h3>

            <form onSubmit={handleCouponSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE15"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px', textTransform: 'uppercase' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Discount Type</label>
                  <select
                    value={couponForm.discount_type}
                    onChange={(e) => setCouponForm({ ...couponForm, discount_type: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={couponForm.discount_value}
                    onChange={(e) => setCouponForm({ ...couponForm, discount_value: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Min Cart Spend (₹)</label>
                <input
                  type="number"
                  value={couponForm.min_purchase_amount}
                  onChange={(e) => setCouponForm({ ...couponForm, min_purchase_amount: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowCouponModal(false)} className="btn-secondary" style={{ padding: '10px 18px', fontSize: '0.82rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.82rem' }}>
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CREATE / EDIT PRODUCT */}
      {showProductModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#14231F', margin: 0 }}>
                {productModalMode === 'create' ? 'Create New Fragrance Profile' : 'Edit Product Details'}
              </h3>
              <button onClick={() => setShowProductModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5C6B63' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Row 1: Name & SKU */}
              <div className="admin-grid-2col">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Product / Attar Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dehn Al Oud Royal 1978"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>SKU Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RUM-OUD-007"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value.toUpperCase() })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #D8D0BC', borderRadius: '4px', textTransform: 'uppercase' }}
                  />
                </div>
              </div>

              {/* Row 2: Category, Type, Status */}
              <div className="admin-grid-3col">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Formulation Type</label>
                  <select
                    value={productForm.product_type}
                    onChange={(e) => setProductForm({ ...productForm, product_type: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                  >
                    <option value="ATTAR">Attar / Itra</option>
                    <option value="PERFUME">Perfume Spray</option>
                    <option value="GIFT_SET">Luxury Gift Set</option>
                    <option value="ACCESSORY">Crystal Accessory</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Status</label>
                  <select
                    value={productForm.status}
                    onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                  >
                    <option value="ACTIVE">Active (Live)</option>
                    <option value="DRAFT">Draft (Hidden)</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Fragrance Family & Concentration */}
              <div className="admin-grid-2col">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Fragrance Family</label>
                  <input
                    type="text"
                    placeholder="e.g. Pure Oud, Royal Floral, Amber Oriental"
                    value={productForm.fragrance_family}
                    onChange={(e) => setProductForm({ ...productForm, fragrance_family: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Concentration</label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Pure Non-Alcoholic Oil"
                    value={productForm.concentration}
                    onChange={(e) => setProductForm({ ...productForm, concentration: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                  />
                </div>
              </div>

              {/* Row 4: Olfactory Notes Pyramid */}
              <div className="admin-grid-3col">
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#5C6B63', marginBottom: '4px' }}>Top Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Saffron, Cardamom"
                    value={productForm.top_notes}
                    onChange={(e) => setProductForm({ ...productForm, top_notes: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#5C6B63', marginBottom: '4px' }}>Heart Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Damask Rose, Frankincense"
                    value={productForm.heart_notes}
                    onChange={(e) => setProductForm({ ...productForm, heart_notes: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#5C6B63', marginBottom: '4px' }}>Base Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Assam Agarwood, Sandalwood"
                    value={productForm.base_notes}
                    onChange={(e) => setProductForm({ ...productForm, base_notes: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              {/* Row 5: Descriptions */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Short Description</label>
                <input
                  type="text"
                  placeholder="One sentence luxury summary for collection grid"
                  value={productForm.short_description}
                  onChange={(e) => setProductForm({ ...productForm, short_description: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Full Atelier Story / Description</label>
                <textarea
                  rows="3"
                  placeholder="Detailed distillation craft, provenance, and olfactory characteristics"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                />
              </div>

              {/* Row 6: Image URL */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>Flacon Image Path / URL</label>
                <input
                  type="text"
                  placeholder="/images/rumera_white_oud_hero.jpg"
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                />
              </div>

              {/* Row 7: Primary Variant (Size, Price, Stock) */}
              <div style={{ backgroundColor: '#FAF7F0', padding: '14px', borderRadius: '6px', border: '1px solid #E5DFC9' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#14231F', marginBottom: '10px' }}>
                  Flacon Size & Inventory Pricing
                </div>
                <div className="admin-grid-4col">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#5C6B63', marginBottom: '3px' }}>Volume Size</label>
                    <select
                      value={productForm.volume_size}
                      onChange={(e) => setProductForm({ ...productForm, volume_size: e.target.value })}
                      style={{ width: '100%', padding: '8px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.82rem' }}
                    >
                      <option value="3 ml">3 ml (Pocket Flacon)</option>
                      <option value="6 ml">6 ml (Artisanal Flacon)</option>
                      <option value="12 ml">12 ml (Grand Flacon)</option>
                      <option value="50 ml">50 ml (Extrait Spray)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#5C6B63', marginBottom: '3px' }}>Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      style={{ width: '100%', padding: '8px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#5C6B63', marginBottom: '3px' }}>Compare Price (₹)</label>
                    <input
                      type="number"
                      value={productForm.compare_at_price}
                      onChange={(e) => setProductForm({ ...productForm, compare_at_price: e.target.value })}
                      placeholder="Optional"
                      style={{ width: '100%', padding: '8px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#5C6B63', marginBottom: '3px' }}>Initial Stock Units</label>
                    <input
                      type="number"
                      required
                      value={productForm.stock_quantity}
                      onChange={(e) => setProductForm({ ...productForm, stock_quantity: e.target.value })}
                      style={{ width: '100%', padding: '8px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Row 8: Flags */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#14231F', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={productForm.is_featured}
                    onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                  />
                  <span>Show as Featured Flacon on Homepage</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#14231F', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={productForm.is_bestseller}
                    onChange={(e) => setProductForm({ ...productForm, is_bestseller: e.target.checked })}
                  />
                  <span>Bestseller Badge</span>
                </label>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => setShowProductModal(false)} className="btn-secondary" style={{ padding: '10px 18px', fontSize: '0.82rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.82rem' }}>
                  {productModalMode === 'create' ? 'Create Fragrance' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-root-container {
          display: flex;
          min-height: 100vh;
          background-color: #F4EFE6;
        }
        .admin-mobile-bar {
          display: none;
        }
        .admin-erp-sidebar {
          width: 260px;
          background-color: #0D1714;
          color: #F8F4EC;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          border-right: 1px solid rgba(183,139,69,0.3);
        }
        .admin-mobile-close-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .admin-erp-main {
          flex: 1;
          overflow-y: auto;
          padding: 36px 40px;
        }
        .admin-main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .admin-grid-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .admin-grid-3col {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
        }
        .admin-grid-4col {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 10px;
        }

        @media (max-width: 960px) {
          .admin-root-container {
            flex-direction: column;
          }
          .admin-mobile-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 18px;
            background-color: #0D1714;
            border-bottom: 1px solid rgba(183, 139, 69, 0.3);
            position: sticky;
            top: 0;
            z-index: 100;
          }
          .admin-menu-toggle {
            background: none;
            border: none;
            padding: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .admin-sidebar-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.65);
            z-index: 998;
            backdrop-filter: blur(2px);
          }
          .admin-erp-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 280px;
            max-width: 85vw;
            z-index: 999;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 0 30px rgba(0,0,0,0.8);
            overflow-y: auto;
          }
          .admin-erp-sidebar.open {
            transform: translateX(0);
          }
          .admin-mobile-close-btn {
            display: block;
          }
          .admin-erp-main {
            padding: 20px 16px;
          }
        }

        @media (max-width: 680px) {
          .admin-grid-2col,
          .admin-grid-3col {
            grid-template-columns: 1fr;
          }
          .admin-grid-4col {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}
