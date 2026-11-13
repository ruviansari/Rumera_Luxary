import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard, Package, Boxes, ShoppingCart, Users, Tag,
  FileText, Shield, ArrowLeft, Plus, RefreshCw, CheckCircle,
  AlertTriangle, Truck, Search, Edit2, LogOut, ArrowUpRight,
  Trash2, X, Upload, Menu, ShoppingBag, MessageSquare, Download,
  UserPlus, Key, Eye, EyeOff, Check, Ban, ExternalLink, Mail, Phone,
  ChevronDown, Star, Filter, ShieldCheck, Crown, Sparkles, Gift
} from 'lucide-react';
import { api, resolveImageUrl } from '../../services/api';
import AdminSampleCampaign from './AdminSampleCampaign';

export default function AdminDashboard({ currentUser, onNavigate, onLogout }) {
  // Determine Role & RBAC Permissions
  const userRole = currentUser?.role || (currentUser?.is_superuser ? 'SUPER_ADMIN' : 'STORE_MANAGER');
  const isSuperAdmin = userRole === 'SUPER_ADMIN' || !!currentUser?.is_superuser;
  const isStoreManager = isSuperAdmin || userRole === 'STORE_MANAGER';
  const isOrderFulfilment = isStoreManager || userRole === 'ORDER_FULFILMENT';
  const isContentManager = isStoreManager || userRole === 'CONTENT_MANAGER';

  // Navigation state
  const [activeTab, setActiveTab] = useState(isOrderFulfilment && !isStoreManager ? 'orders' : 'overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  // Core Data States
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [movements, setMovements] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [abandonedCarts, setAbandonedCarts] = useState({ total_abandoned_carts: 0, potential_lost_revenue: 0, results: [] });
  const [ownerProfile, setOwnerProfile] = useState({});
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Search & Filter States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [reviewFilter, setReviewFilter] = useState('ALL');

  // Modals
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockForm, setStockForm] = useState({ variant_id: '', quantity_change: '', reason: 'RESTOCK', notes: '' });

  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({ code: '', discount_type: 'PERCENTAGE', discount_value: '10', min_purchase_amount: '1000', valid_to: '2026-12-31T23:59' });

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: 'PROCESSING', carrier_name: 'Bluedart Express', tracking_number: '', cancelled_reason: '' });

  // Product Modal
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
  const [uploadingImage, setUploadingImage] = useState(false);

  // Category Modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState('create');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', description: '', image_url: '', is_active: true, sort_order: 0 });

  // User / Team RBAC Modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [userModalMode, setUserModalMode] = useState('create');
  const [editingUserId, setEditingUserId] = useState(null);
  const [userForm, setUserForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'STORE_MANAGER',
    password: '',
    is_active: true
  });

  const showSuccessNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 4500);
  };

  // Load All Admin Data
  const loadData = async () => {
    setLoading(true);
    try {
      const [anRes, prodRes, ordRes, cpnRes, movRes, audRes, ownRes, catRes, cartRes, usrRes, revRes] = await Promise.all([
        api.admin.getAnalytics().catch(() => null),
        api.admin.getProducts().catch(() => ({ results: [] })),
        api.admin.getOrders().catch(() => ({ results: [] })),
        api.admin.getCoupons().catch(() => ({ results: [] })),
        api.admin.getStockMovements().catch(() => ({ results: [] })),
        api.admin.getAuditLogs().catch(() => ({ results: [] })),
        api.admin.getOwnerProfile().catch(() => ({})),
        api.getCategories().catch(() => []),
        api.admin.getAbandonedCarts().catch(() => ({ total_abandoned_carts: 0, results: [] })),
        api.admin.getUsers().catch(() => ({ results: [] })),
        api.admin.getReviews().catch(() => ({ results: [] })),
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
      setUsers(usrRes?.results || usrRes || []);
      setReviews(revRes?.results || revRes || []);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 1. Stock Adjustment
  const handleStockSubmit = async (e) => {
    e.preventDefault();
    if (!stockForm.variant_id || !stockForm.quantity_change || !stockForm.notes.trim()) {
      alert("Please fill all fields. Notes/rationale are required by audit policy.");
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

  // 2. Coupon Handlers
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

  const handleCouponDelete = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete coupon "${code}"?`)) return;
    try {
      await api.admin.deleteCoupon(id);
      showSuccessNotice(`Coupon "${code}" deleted.`);
      loadData();
    } catch (err) {
      alert(err.message || "Failed to delete coupon.");
    }
  };

  // 3. Order Status & Shiprocket
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

  const handleShiprocketDispatch = async (orderId) => {
    try {
      const res = await api.admin.dispatchShiprocket(orderId);
      showSuccessNotice(`Assigned ${res.carrier_name} AWB: ${res.tracking_number}`);
      loadData();
    } catch (err) {
      alert(err.message || "Shiprocket dispatch failed.");
    }
  };

  // Export Orders to CSV
  const handleExportOrdersCSV = () => {
    if (!orders.length) {
      alert("No orders available to export.");
      return;
    }
    const headers = ['Order Ref', 'Date', 'Customer Name', 'Phone', 'Email', 'City', 'State', 'Postal Code', 'Items', 'Total Amount', 'Payment Method', 'Status', 'AWB / Tracking'];
    const rows = orders.map(o => [
      `"${o.order_number}"`,
      `"${new Date(o.created_at).toLocaleDateString('en-IN')}"`,
      `"${o.recipient_name || ''}"`,
      `"${o.phone || ''}"`,
      `"${o.email || ''}"`,
      `"${o.city || ''}"`,
      `"${o.state || ''}"`,
      `"${o.postal_code || ''}"`,
      `"${(o.items || []).map(i => `${i.product_name_snapshot} (${i.quantity})`).join('; ')}"`,
      `"${o.total_amount}"`,
      `"${o.payment_method}"`,
      `"${o.status}"`,
      `"${o.tracking_number || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rumera_orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSuccessNotice("Orders manifest exported successfully!");
  };

  // 4. Product Handlers
  const handleOpenCreateProduct = () => {
    setProductModalMode('create');
    setEditingProductId(null);
    setProductForm({
      ...defaultProductForm,
      category: categories[0]?.id || '1',
    });
    setShowProductModal(true);
  };

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

  // Upload Flacon Image from Computer
  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show temporary local preview immediately
    const tempUrl = URL.createObjectURL(file);
    setProductForm(prev => ({ ...prev, image_url: tempUrl }));

    setUploadingImage(true);
    try {
      const res = await api.admin.uploadImage(file);
      if (res && res.url) {
        setProductForm(prev => ({ ...prev, image_url: res.url }));
        showSuccessNotice("Flacon image uploaded to server successfully!");
      }
    } catch (err) {
      console.warn("Server upload failed, converting to local base64 fallback:", err);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm(prev => ({ ...prev, image_url: reader.result }));
      };
      reader.readAsDataURL(file);
      showSuccessNotice("Flacon image attached successfully!");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const name = productForm.name.trim();
      const finalDesc = (productForm.description || '').trim() ||
        (productForm.short_description || '').trim() ||
        `${name} is a regal artisanal fragrance formulation decanted at Maison Ruméra Atelier by Master Perfumer Er. Rumana Ansari.`;
      const finalShortDesc = (productForm.short_description || '').trim() ||
        finalDesc.slice(0, 260);

      const payload = {
        name: name,
        sku: productForm.sku.trim().toUpperCase(),
        category: parseInt(productForm.category) || categories[0]?.id || 1,
        product_type: productForm.product_type,
        status: productForm.status,
        short_description: finalShortDesc,
        description: finalDesc,
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
        showSuccessNotice(`Fragrance "${productForm.name}" created successfully.`);
      } else {
        await api.admin.updateProduct(editingProductId, payload);
        showSuccessNotice(`Fragrance "${productForm.name}" updated successfully.`);
      }

      setShowProductModal(false);
      loadData();
    } catch (err) {
      alert(err.message || "Failed to save product.");
    }
  };

  const handleProductDelete = async (id, name) => {
    if (!isSuperAdmin) {
      alert("Only Super Admin has permission to delete flacons from catalog.");
      return;
    }
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      await api.admin.deleteProduct(id);
      showSuccessNotice(`Product "${name}" deleted.`);
      loadData();
    } catch (err) {
      alert(err.message || "Failed to delete product.");
    }
  };

  // 5. Category Handlers
  const handleOpenCreateCategory = () => {
    setCategoryModalMode('create');
    setEditingCategoryId(null);
    setCategoryForm({ name: '', slug: '', description: '', image_url: '', is_active: true, sort_order: 0 });
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (cat) => {
    setCategoryModalMode('edit');
    setEditingCategoryId(cat.id);
    setCategoryForm({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      image_url: cat.image_url || '',
      is_active: cat.is_active !== undefined ? cat.is_active : true,
      sort_order: cat.sort_order || 0
    });
    setShowCategoryModal(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: categoryForm.name.trim(),
        slug: (categoryForm.slug || categoryForm.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: categoryForm.description,
        image_url: categoryForm.image_url,
        is_active: categoryForm.is_active,
        sort_order: parseInt(categoryForm.sort_order) || 0
      };

      if (categoryModalMode === 'create') {
        await api.admin.createCategory(payload);
        showSuccessNotice(`Category "${categoryForm.name}" created.`);
      } else {
        await api.admin.updateCategory(editingCategoryId, payload);
        showSuccessNotice(`Category "${categoryForm.name}" updated.`);
      }

      setShowCategoryModal(false);
      loadData();
    } catch (err) {
      alert(err.message || "Failed to save category.");
    }
  };

  const handleCategoryDelete = async (id, name) => {
    if (!isSuperAdmin) {
      alert("Only Super Admin has permission to delete categories.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      await api.admin.deleteCategory(id);
      showSuccessNotice(`Category "${name}" deleted.`);
      loadData();
    } catch (err) {
      alert(err.message || "Failed to delete category.");
    }
  };

  // 6. Review Moderation Handlers
  const handleToggleReviewApproval = async (review) => {
    try {
      await api.admin.updateReview(review.id, { is_approved: !review.is_approved });
      showSuccessNotice(`Review by ${review.name} marked as ${!review.is_approved ? 'Approved' : 'Unpublished'}.`);
      loadData();
    } catch (err) {
      alert(err.message || "Failed to update review.");
    }
  };

  const handleDeleteReview = async (id, name) => {
    if (!window.confirm(`Delete review by "${name}"?`)) return;
    try {
      await api.admin.deleteReview(id);
      showSuccessNotice("Review deleted.");
      loadData();
    } catch (err) {
      alert(err.message || "Failed to delete review.");
    }
  };

  // 7. Team & RBAC Role Management Handlers
  const handleOpenCreateUser = () => {
    setUserModalMode('create');
    setEditingUserId(null);
    setUserForm({
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      role: 'STORE_MANAGER',
      password: '',
      is_active: true
    });
    setShowUserModal(true);
  };

  const handleOpenEditUser = (u) => {
    setUserModalMode('edit');
    setEditingUserId(u.id);
    setUserForm({
      email: u.email || '',
      first_name: u.first_name || '',
      last_name: u.last_name || '',
      phone: u.phone || '',
      role: u.role || 'STORE_MANAGER',
      password: '',
      is_active: u.is_active !== undefined ? u.is_active : true
    });
    setShowUserModal(true);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      alert("Permission denied. Only Super Admin can manage team roles.");
      return;
    }
    try {
      const payload = { ...userForm };
      if (!payload.password && userModalMode === 'edit') {
        delete payload.password;
      }

      if (userModalMode === 'create') {
        await api.admin.createUser(payload);
        showSuccessNotice(`Team member ${userForm.email} added with role ${userForm.role}!`);
      } else {
        await api.admin.updateUser(editingUserId, payload);
        showSuccessNotice(`User ${userForm.email} updated successfully!`);
      }

      setShowUserModal(false);
      loadData();
    } catch (err) {
      alert(err.message || "Failed to save user account.");
    }
  };

  const handleToggleUserActive = async (u) => {
    if (u.id === currentUser?.id) {
      alert("You cannot suspend your own active account.");
      return;
    }
    try {
      await api.admin.updateUser(u.id, { is_active: !u.is_active });
      showSuccessNotice(`Account ${u.email} is now ${!u.is_active ? 'Active' : 'Suspended'}.`);
      loadData();
    } catch (err) {
      alert(err.message || "Failed to update user status.");
    }
  };

  const handleDeleteUser = async (u) => {
    if (u.id === currentUser?.id) {
      alert("Super Admin cannot delete their own session account.");
      return;
    }
    if (!window.confirm(`Are you sure you want to PERMANENTLY remove "${u.email}"?`)) return;
    try {
      await api.admin.deleteUser(u.id);
      showSuccessNotice(`User account "${u.email}" has been removed.`);
      loadData();
    } catch (err) {
      alert(err.message || "Failed to delete user.");
    }
  };

  // 8. Owner Profile CMS Save
  const handleOwnerProfileSave = async (e) => {
    e.preventDefault();
    try {
      await api.admin.updateOwnerProfile(ownerProfile);
      showSuccessNotice("Owner Profile & Royal Atelier Story updated on public site!");
    } catch (err) {
      alert(err.message || "Failed to update profile.");
    }
  };

  // Filtered Lists
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = !orderSearch.trim() ||
        (o.order_number?.toLowerCase().includes(orderSearch.toLowerCase())) ||
        (o.recipient_name?.toLowerCase().includes(orderSearch.toLowerCase())) ||
        (o.phone?.includes(orderSearch)) ||
        (o.email?.toLowerCase().includes(orderSearch.toLowerCase()));
      const matchesStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = !productSearch.trim() ||
        (p.name?.toLowerCase().includes(productSearch.toLowerCase())) ||
        (p.sku?.toLowerCase().includes(productSearch.toLowerCase()));
      const matchesCat = productCategoryFilter === 'ALL' || String(p.category?.id || p.category) === String(productCategoryFilter);
      return matchesSearch && matchesCat;
    });
  }, [products, productSearch, productCategoryFilter]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = !userSearch.trim() ||
        (u.email?.toLowerCase().includes(userSearch.toLowerCase())) ||
        (`${u.first_name} ${u.last_name}`.toLowerCase().includes(userSearch.toLowerCase())) ||
        (u.phone?.includes(userSearch));
      const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, userSearch, userRoleFilter]);

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      if (reviewFilter === 'PENDING') return !r.is_approved;
      if (reviewFilter === 'APPROVED') return r.is_approved;
      return true;
    });
  }, [reviews, reviewFilter]);

  // Define RBAC-aware Navigation Items
  const navItems = useMemo(() => {
    const allItems = [
      { id: 'overview', label: 'Dashboard & KPIs', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'STORE_MANAGER'] },
      { id: 'orders', label: 'Orders & Fulfilment', icon: ShoppingCart, count: orders.filter(o => o.status === 'PROCESSING' || o.status === 'PAID').length, roles: ['SUPER_ADMIN', 'STORE_MANAGER', 'ORDER_FULFILMENT'] },
      { id: 'inventory', label: 'Inventory & Stock Log', icon: Boxes, count: analytics?.kpis?.low_stock_count, roles: ['SUPER_ADMIN', 'STORE_MANAGER', 'ORDER_FULFILMENT'] },
      { id: 'products', label: 'Product Catalog', icon: Package, roles: ['SUPER_ADMIN', 'STORE_MANAGER'] },
      { id: 'categories', label: 'Categories & Vaults', icon: Tag, roles: ['SUPER_ADMIN', 'STORE_MANAGER'] },
      { id: 'coupons', label: 'Coupons & Promos', icon: Tag, roles: ['SUPER_ADMIN', 'STORE_MANAGER'] },
      { id: 'free-samples', label: 'Free Sample Campaign', icon: Gift, roles: ['SUPER_ADMIN', 'STORE_MANAGER', 'ORDER_FULFILMENT'] },
      { id: 'abandoned-carts', label: 'Abandoned Carts (Recovery)', icon: ShoppingBag, count: abandonedCarts?.total_abandoned_carts, roles: ['SUPER_ADMIN', 'STORE_MANAGER'] },
      { id: 'reviews', label: 'Customer Reviews (Appraisals)', icon: MessageSquare, count: reviews.filter(r => !r.is_approved).length, roles: ['SUPER_ADMIN', 'STORE_MANAGER'] },
      { id: 'team', label: 'Team & Role Access (RBAC)', icon: Users, roles: ['SUPER_ADMIN'] },
      { id: 'cms', label: 'Founder Story & CMS', icon: FileText, roles: ['SUPER_ADMIN', 'STORE_MANAGER', 'CONTENT_MANAGER'] },
      { id: 'audit', label: 'Security & Audit Trail', icon: Shield, roles: ['SUPER_ADMIN'] },
    ];

    if (isSuperAdmin) return allItems;
    return allItems.filter(item => item.roles.includes(userRole));
  }, [isSuperAdmin, userRole, orders, analytics, abandonedCarts, reviews]);

  const roleBadgeStyle = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return { bg: 'rgba(212, 175, 55, 0.15)', text: '#D4AF37', border: '1px solid #B78B45', label: '👑 Super Admin' };
      case 'STORE_MANAGER':
        return { bg: 'rgba(42, 104, 76, 0.18)', text: '#4EBA86', border: '1px solid #2A684C', label: '🛍️ Store Manager' };
      case 'ORDER_FULFILMENT':
        return { bg: 'rgba(56, 128, 170, 0.18)', text: '#68B6E8', border: '1px solid #3880AA', label: '📦 Order Fulfilment' };
      case 'CONTENT_MANAGER':
        return { bg: 'rgba(180, 110, 50, 0.18)', text: '#E8A068', border: '1px solid #B46E32', label: '✍️ Content Manager' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.08)', text: '#A2B0A8', border: '1px solid #4A5852', label: 'Patron (Customer)' };
    }
  };

  return (
    <div className="admin-root-container">
      {/* Mobile Top Header */}
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
            RUMERA SUPER ERP
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

      {/* Backdrop overlay for mobile drawer */}
      {mobileSidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* 1. Left Sidebar Navigation */}
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
          <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', color: '#B78B45', textTransform: 'uppercase', marginTop: '4px' }}>
            Production Suite • RBAC Protected
          </div>
        </div>

        {/* Current User Session & Role Card */}
        <div style={{ padding: '16px 20px', backgroundColor: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#1E362C',
              border: '1px solid #B78B45',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D4AF37',
              fontWeight: 700,
              fontSize: '0.9rem'
            }}>
              {currentUser?.first_name ? currentUser.first_name[0].toUpperCase() : 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#FAF7F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser?.first_name ? `${currentUser.first_name} ${currentUser.last_name || ''}` : 'Maison Master'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#8E9B94', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser?.email || 'admin@rumeraluxury.com'}
              </div>
            </div>
          </div>

          <div style={{
            display: 'inline-block',
            padding: '3px 8px',
            borderRadius: '12px',
            fontSize: '0.7rem',
            fontWeight: 600,
            backgroundColor: roleBadgeStyle(userRole).bg,
            color: roleBadgeStyle(userRole).text,
            border: roleBadgeStyle(userRole).border
          }}>
            {roleBadgeStyle(userRole).label}
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '3px', overflowY: 'auto' }}>
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
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  backgroundColor: isActive ? 'rgba(183, 139, 69, 0.15)' : 'transparent',
                  color: isActive ? '#D4AF37' : '#B6C4BC',
                  border: isActive ? '1px solid rgba(183, 139, 69, 0.4)' : '1px solid transparent',
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 600 : 400,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={17} color={isActive ? '#D4AF37' : '#8E9B94'} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span style={{
                    padding: '2px 7px',
                    borderRadius: '10px',
                    backgroundColor: item.id === 'inventory' ? '#963832' : '#B78B45',
                    color: '#FAF7F0',
                    fontSize: '0.68rem',
                    fontWeight: 700
                  }}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Return to Storefront & Logout */}
        <div style={{ padding: '16px 14px', borderTop: '1px solid rgba(183,139,69,0.2)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={() => onNavigate('home')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D4AF37', background: 'none', border: 'none', fontSize: '0.82rem', padding: '6px', cursor: 'pointer' }}
          >
            <ArrowLeft size={16} />
            <span>Return to Storefront</span>
          </button>
          <button
            onClick={onLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E57373', background: 'none', border: 'none', fontSize: '0.82rem', padding: '6px', cursor: 'pointer' }}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 3.2vw, 2.1rem)', color: '#14231F', margin: 0 }}>
                {navItems.find(n => n.id === activeTab)?.label || 'Administration'}
              </h1>
              {isSuperAdmin && (
                <span style={{
                  padding: '3px 8px',
                  backgroundColor: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid #B78B45',
                  color: '#916B27',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}>
                  FULL ROOT PERMISSION
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#5C6B63', marginTop: '3px' }}>
              Maison Ruméra Luxury Atra • Production Management System
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={loadData} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            {isSuperAdmin && activeTab === 'team' && (
              <button onClick={handleOpenCreateUser} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserPlus size={15} />
                <span>Add Team Member</span>
              </button>
            )}
            {isStoreManager && activeTab === 'products' && (
              <button onClick={handleOpenCreateProduct} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={15} />
                <span>Add Fragrance</span>
              </button>
            )}
            {isStoreManager && activeTab === 'categories' && (
              <button onClick={handleOpenCreateCategory} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={15} />
                <span>Add Category</span>
              </button>
            )}
            {isOrderFulfilment && activeTab === 'orders' && (
              <button onClick={handleExportOrdersCSV} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Toast Notice */}
        {notice && (
          <div style={{ padding: '12px 18px', backgroundColor: '#14231F', borderLeft: '4px solid #D4AF37', color: '#FAF7F0', borderRadius: '4px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <CheckCircle size={18} color="#25D366" />
            <span>{notice}</span>
          </div>
        )}

        {/* ========================================================
            TAB 1: OVERVIEW & KPIS
           ======================================================== */}
        {activeTab === 'overview' && (
          <div>
            {/* KPI Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '22px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '0.74rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8E9B94' }}>Orders Today</div>
                <div style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: '#14231F', marginTop: '4px' }}>
                  {analytics?.kpis?.orders_today || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#2A684C', marginTop: '4px' }}>Live real-time counter</div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '22px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '0.74rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8E9B94' }}>Gross Sales</div>
                <div style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: '#B78B45', marginTop: '4px' }}>
                  ₹{Number(analytics?.kpis?.gross_sales || 0).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#5C6B63', marginTop: '4px' }}>Total transaction volume</div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '22px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '0.74rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8E9B94' }}>Pending Fulfilment</div>
                <div style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: '#14231F', marginTop: '4px' }}>
                  {analytics?.kpis?.pending_orders || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#B78B45', marginTop: '4px' }}>Awaiting packaging / dispatch</div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '22px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '0.74rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8E9B94' }}>Low Stock Reserves</div>
                <div style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: (analytics?.kpis?.low_stock_count || 0) > 0 ? '#963832' : '#2A684C', marginTop: '4px' }}>
                  {analytics?.kpis?.low_stock_count || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#8E9B94', marginTop: '4px' }}>Threshold ≤ 5 units</div>
              </div>

              {isSuperAdmin && (
                <div style={{ backgroundColor: '#FFFFFF', padding: '22px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontSize: '0.74rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8E9B94' }}>Registered Accounts</div>
                  <div style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: '#14231F', marginTop: '4px' }}>
                    {users.length}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#2A684C', marginTop: '4px' }}>Team & Patrons</div>
                </div>
              )}
            </div>

            {/* Low Stock Warning Strip */}
            {analytics?.low_stock_variants?.length > 0 && (
              <div style={{ backgroundColor: 'rgba(150, 56, 50, 0.08)', border: '1px solid rgba(150, 56, 50, 0.25)', padding: '18px 22px', borderRadius: '8px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#963832', fontWeight: 600, marginBottom: '10px' }}>
                  <AlertTriangle size={18} />
                  <span>Reserve Threshold Alert: The following flacons are almost depleted</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {analytics.low_stock_variants.map((v) => (
                    <span key={v.id} style={{ backgroundColor: '#FFFFFF', padding: '6px 12px', borderRadius: '4px', border: '1px solid #E5DFC9', fontSize: '0.82rem', color: '#14231F' }}>
                      {v.product_name} ({v.volume_size}): <strong style={{ color: '#963832' }}>{v.stock_quantity} left</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Orders Overview */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '26px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#14231F', margin: 0 }}>
                  Recent Consignment Orders
                </h3>
                <button onClick={() => setActiveTab('orders')} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.75rem' }}>
                  View All Orders →
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E5DFC9', color: '#8E9B94', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                      <th style={{ padding: '10px' }}>Order Ref</th>
                      <th style={{ padding: '10px' }}>Customer</th>
                      <th style={{ padding: '10px' }}>Amount</th>
                      <th style={{ padding: '10px' }}>Payment</th>
                      <th style={{ padding: '10px' }}>Status</th>
                      <th style={{ padding: '10px' }}>Tracking</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(analytics?.recent_orders || orders.slice(0, 5)).map((ord) => (
                      <tr key={ord.id} style={{ borderBottom: '1px solid #EFEAE0' }}>
                        <td style={{ padding: '12px 10px', fontFamily: 'monospace', fontWeight: 700, color: '#14231F' }}>
                          {ord.order_number}
                        </td>
                        <td style={{ padding: '12px 10px' }}>{ord.recipient_name}</td>
                        <td style={{ padding: '12px 10px', fontWeight: 600 }}>₹{Number(ord.total_amount).toLocaleString('en-IN')}</td>
                        <td style={{ padding: '12px 10px' }}><span className="badge-forest">{ord.payment_method}</span></td>
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '10px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            backgroundColor: ord.status === 'DELIVERED' ? '#E8F5E9' : ord.status === 'SHIPPED' ? '#E3F2FD' : '#FFF8E1',
                            color: ord.status === 'DELIVERED' ? '#2E7D32' : ord.status === 'SHIPPED' ? '#1565C0' : '#F57F17'
                          }}>
                            {ord.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 10px', fontSize: '0.8rem', color: '#8E9B94' }}>
                          {ord.tracking_number ? `${ord.carrier_name || 'Courier'}: ${ord.tracking_number}` : 'Awaiting AWB'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: ORDERS & FULFILMENT
           ======================================================== */}
        {activeTab === 'orders' && (
          <div>
            {/* Filter Bar */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: '8px', border: '1px solid #E5DFC9', marginBottom: '22px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
                <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
                  <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8E9B94' }} />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by order #, patron name, phone, or email..."
                    style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: '4px', border: '1px solid #D8D0BC', fontSize: '0.84rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {['ALL', 'PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      style={{
                        padding: '6px 11px',
                        borderRadius: '4px',
                        border: orderStatusFilter === st ? '1px solid #B78B45' : '1px solid #E5DFC9',
                        backgroundColor: orderStatusFilter === st ? '#14231F' : '#FFFFFF',
                        color: orderStatusFilter === st ? '#D4AF37' : '#5C6B63',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleExportOrdersCSV} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Download size={15} />
                <span>Download Manifest (.CSV)</span>
              </button>
            </div>

            {/* Orders Table */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E5DFC9', color: '#8E9B94', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                    <th style={{ padding: '12px 10px' }}>Order Reference</th>
                    <th style={{ padding: '12px 10px' }}>Date</th>
                    <th style={{ padding: '12px 10px' }}>Customer & Destination</th>
                    <th style={{ padding: '12px 10px' }}>Items snapshot</th>
                    <th style={{ padding: '12px 10px' }}>Total Amount</th>
                    <th style={{ padding: '12px 10px' }}>Status</th>
                    <th style={{ padding: '12px 10px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '36px', textAlign: 'center', color: '#8E9B94' }}>
                        No orders match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => {
                      const cleanPhone = (ord.phone || '').replace(/\D/g, '');
                      const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
                      const waText = encodeURIComponent(`👑 *Maison Ruméra Atelier — Consignment Dispatch Update*\n\nGreetings ${ord.recipient_name},\nYour luxury fragrance order *${ord.order_number}* is ${ord.status}.\n${ord.tracking_number ? `Carrier: ${ord.carrier_name || 'Express Courier'}\nTracking AWB: *${ord.tracking_number}*` : 'Preparing for white-glove courier pickup.'}\n\nFor inquiries: +91 9305988767 | ruviansari144@gmail.com`);

                      return (
                        <tr key={ord.id} style={{ borderBottom: '1px solid #EFEAE0' }}>
                          <td style={{ padding: '12px 10px' }}>
                            <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#14231F' }}>
                              {ord.order_number}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#8E9B94' }}>
                              {ord.payment_method}
                            </div>
                          </td>
                          <td style={{ padding: '12px 10px', fontSize: '0.8rem', color: '#5C6B63' }}>
                            {new Date(ord.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            <div style={{ fontWeight: 600, color: '#14231F' }}>{ord.recipient_name}</div>
                            <div style={{ fontSize: '0.76rem', color: '#5C6B63' }}>{ord.city}, {ord.state} ({ord.postal_code})</div>
                            <div style={{ fontSize: '0.74rem', color: '#8E9B94' }}>{ord.phone}</div>
                          </td>
                          <td style={{ padding: '12px 10px', fontSize: '0.82rem' }}>
                            {(ord.items || []).map((item, i) => (
                              <div key={i} style={{ color: '#14231F' }}>
                                • {item.product_name_snapshot} ({item.variant_size_snapshot}) x{item.quantity}
                              </div>
                            ))}
                          </td>
                          <td style={{ padding: '12px 10px', fontWeight: 700, color: '#14231F' }}>
                            ₹{Number(ord.total_amount).toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              backgroundColor: ord.status === 'DELIVERED' ? '#E8F5E9' : ord.status === 'SHIPPED' ? '#E3F2FD' : ord.status === 'CANCELLED' ? '#FFEBEE' : '#FFF8E1',
                              color: ord.status === 'DELIVERED' ? '#2E7D32' : ord.status === 'SHIPPED' ? '#1565C0' : ord.status === 'CANCELLED' ? '#C62828' : '#F57F17'
                            }}>
                              {ord.status}
                            </span>
                            {ord.tracking_number && (
                              <div style={{ fontSize: '0.72rem', color: '#2A684C', marginTop: '3px' }}>
                                AWB: {ord.tracking_number}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                              <button
                                onClick={() => {
                                  setSelectedOrder(ord);
                                  setStatusForm({
                                    status: ord.status,
                                    carrier_name: ord.carrier_name || 'Bluedart Express',
                                    tracking_number: ord.tracking_number || '',
                                    cancelled_reason: ord.cancelled_reason || ''
                                  });
                                  setShowStatusModal(true);
                                }}
                                className="btn-secondary"
                                style={{ padding: '5px 10px', fontSize: '0.72rem' }}
                              >
                                Update Status
                              </button>

                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/${formattedPhone}?text=${waText}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '5px 9px',
                                    backgroundColor: '#0F291E',
                                    color: '#25D366',
                                    border: '1px solid #25D366',
                                    borderRadius: '4px',
                                    fontSize: '0.72rem',
                                    fontWeight: 600,
                                    textDecoration: 'none'
                                  }}
                                  title="Send live WhatsApp dispatch notification"
                                >
                                  WhatsApp
                                </a>
                              )}

                              {(!ord.tracking_number || ord.status === 'PROCESSING') && (
                                <button
                                  onClick={() => handleShiprocketDispatch(ord.id)}
                                  style={{
                                    padding: '5px 9px',
                                    fontSize: '0.72rem',
                                    backgroundColor: '#14231F',
                                    color: '#D4AF37',
                                    border: '1px solid #B78B45',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 700
                                  }}
                                  title="Automate courier consignment via Shiprocket"
                                >
                                  ⚡ Shiprocket
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: INVENTORY & AUDIT LOG
           ======================================================== */}
        {activeTab === 'inventory' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#14231F', margin: 0 }}>
                  Auditable Inventory & Stock Movements
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#5C6B63', marginTop: '2px' }}>
                  Every stock delta requires an auditable reason code and mandatory description.
                </p>
              </div>
              <button onClick={() => setShowStockModal(true)} className="btn-primary" style={{ padding: '9px 18px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={15} />
                <span>Adjust Stock Reserve</span>
              </button>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E5DFC9', color: '#8E9B94', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                    <th style={{ padding: '12px 10px' }}>Timestamp</th>
                    <th style={{ padding: '12px 10px' }}>Flacon & Size</th>
                    <th style={{ padding: '12px 10px' }}>Delta</th>
                    <th style={{ padding: '12px 10px' }}>Balance After</th>
                    <th style={{ padding: '12px 10px' }}>Reason</th>
                    <th style={{ padding: '12px 10px' }}>Audit Rationale / Notes</th>
                    <th style={{ padding: '12px 10px' }}>Actor</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((m) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #EFEAE0' }}>
                      <td style={{ padding: '12px 10px', fontSize: '0.78rem', color: '#8E9B94' }}>
                        {new Date(m.created_at).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 10px', fontWeight: 600 }}>{m.variant_name} ({m.variant_size})</td>
                      <td style={{ padding: '12px 10px', fontWeight: 700, color: m.quantity_change > 0 ? '#2A684C' : '#963832' }}>
                        {m.quantity_change > 0 ? `+${m.quantity_change}` : m.quantity_change}
                      </td>
                      <td style={{ padding: '12px 10px', fontWeight: 600 }}>{m.balance_after}</td>
                      <td style={{ padding: '12px 10px' }}><span className="badge-forest">{m.reason}</span></td>
                      <td style={{ padding: '12px 10px', fontSize: '0.82rem', color: '#5C6B63' }}>{m.notes}</td>
                      <td style={{ padding: '12px 10px', fontSize: '0.78rem', color: '#8E9B94' }}>{m.actor_email || 'System'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: PRODUCT CATALOG
           ======================================================== */}
        {activeTab === 'products' && (
          <div>
            {/* Filter Bar */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E5DFC9', marginBottom: '22px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
                <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
                  <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8E9B94' }} />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search fragrance by name or SKU..."
                    style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: '4px', border: '1px solid #D8D0BC', fontSize: '0.84rem' }}
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #D8D0BC', fontSize: '0.82rem' }}
                >
                  <option value="ALL">All Fragrance Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {isStoreManager && (
                <button onClick={handleOpenCreateProduct} className="btn-primary" style={{ padding: '9px 18px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={15} />
                  <span>Add New Fragrance</span>
                </button>
              )}
            </div>

            {/* Product Grid Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '22px' }}>
              {filteredProducts.map((p) => {
                const primaryVariant = p.variants?.[0] || {};
                const img = resolveImageUrl(p.primary_image || p.images?.[0]?.image_url || '/images/rumera_white_oud_hero.jpg');

                return (
                  <div key={p.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5DFC9', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'relative', height: '210px', backgroundColor: '#0D1714', overflow: 'hidden' }}>
                      <img
                        src={img}
                        alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }}
                      />
                      <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                        {p.is_featured && <span style={{ backgroundColor: '#B78B45', color: '#FAF7F0', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '3px', fontWeight: 700 }}>FEATURED</span>}
                        {p.is_bestseller && <span style={{ backgroundColor: '#2A684C', color: '#FAF7F0', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '3px', fontWeight: 700 }}>BESTSELLER</span>}
                      </div>
                      <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.65)', color: '#FAF7F0', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px' }}>
                        SKU: {p.sku}
                      </div>
                    </div>

                    <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontSize: '0.72rem', color: '#B78B45', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                        {p.category?.name || 'Artisanal Perfume'}
                      </div>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#14231F', margin: '4px 0 8px' }}>
                        {p.name}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: '#5C6B63', margin: '0 0 12px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {p.short_description || p.description}
                      </p>

                      <div style={{ borderTop: '1px solid #EFEAE0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '1.15rem', fontFamily: 'var(--font-serif)', fontWeight: 700, color: '#14231F' }}>
                            ₹{Number(primaryVariant.price || p.base_price || 0).toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: (primaryVariant.stock_quantity || 0) <= 5 ? '#963832' : '#2A684C' }}>
                            Stock: <strong>{primaryVariant.stock_quantity || 0} units</strong>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Edit2 size={13} />
                            <span>Edit</span>
                          </button>
                          {isSuperAdmin && (
                            <button
                              onClick={() => handleProductDelete(p.id, p.name)}
                              style={{ padding: '6px 8px', backgroundColor: 'rgba(150,56,50,0.1)', color: '#963832', border: '1px solid rgba(150,56,50,0.2)', borderRadius: '4px', cursor: 'pointer' }}
                              title="Delete Product"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: CATEGORIES & VAULTS
           ======================================================== */}
        {activeTab === 'categories' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#14231F', margin: 0 }}>
                  Fragrance Categories & Vault Collections
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#5C6B63', marginTop: '2px' }}>
                  Manage store taxonomy, showcase banners, and olfactory grouping.
                </p>
              </div>
              {isStoreManager && (
                <button onClick={handleOpenCreateCategory} className="btn-primary" style={{ padding: '9px 18px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={15} />
                  <span>Create Category</span>
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {categories.map((c) => (
                <div key={c.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5DFC9', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#14231F', margin: 0 }}>
                      {c.name}
                    </h4>
                    <span style={{
                      padding: '2px 7px',
                      borderRadius: '10px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      backgroundColor: c.is_active ? 'rgba(42, 104, 76, 0.1)' : 'rgba(150, 56, 50, 0.1)',
                      color: c.is_active ? '#2A684C' : '#963832'
                    }}>
                      {c.is_active ? 'ACTIVE' : 'DRAFT'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.74rem', color: '#8E9B94', fontFamily: 'monospace', marginBottom: '8px' }}>
                    Slug: /{c.slug}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#5C6B63', minHeight: '36px', marginBottom: '16px' }}>
                    {c.description || 'No description provided.'}
                  </p>

                  <div style={{ borderTop: '1px solid #EFEAE0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.76rem', color: '#14231F', fontWeight: 600 }}>
                      {c.product_count !== undefined ? `${c.product_count} active flacons` : 'Catalog linked'}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleOpenEditCategory(c)}
                        className="btn-secondary"
                        style={{ padding: '5px 10px', fontSize: '0.74rem' }}
                      >
                        Edit
                      </button>
                      {isSuperAdmin && (
                        <button
                          onClick={() => handleCategoryDelete(c.id, c.name)}
                          style={{ padding: '5px 8px', backgroundColor: 'rgba(150,56,50,0.1)', color: '#963832', border: '1px solid rgba(150,56,50,0.2)', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: COUPONS & PROMOTIONS
           ======================================================== */}
        {activeTab === 'coupons' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#14231F', margin: 0 }}>
                  Promotional Vouchers & Royal Privileges
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#5C6B63', marginTop: '2px' }}>
                  Manage server-validated checkout discounts and client referral privileges.
                </p>
              </div>
              <button onClick={() => setShowCouponModal(true)} className="btn-primary" style={{ padding: '9px 18px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={15} />
                <span>Create New Coupon</span>
              </button>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E5DFC9', color: '#8E9B94', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                    <th style={{ padding: '12px 10px' }}>Coupon Code</th>
                    <th style={{ padding: '12px 10px' }}>Discount Type</th>
                    <th style={{ padding: '12px 10px' }}>Benefit</th>
                    <th style={{ padding: '12px 10px' }}>Minimum Spend</th>
                    <th style={{ padding: '12px 10px' }}>Expiry</th>
                    <th style={{ padding: '12px 10px' }}>Status</th>
                    <th style={{ padding: '12px 10px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #EFEAE0' }}>
                      <td style={{ padding: '12px 10px' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#B78B45', backgroundColor: 'rgba(183,139,69,0.1)', padding: '3px 8px', borderRadius: '4px' }}>
                          {c.code}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px' }}>{c.discount_type}</td>
                      <td style={{ padding: '12px 10px', fontWeight: 700 }}>
                        {c.discount_type === 'PERCENTAGE' ? `${c.discount_value}% OFF` : `₹${c.discount_value} FLAT`}
                      </td>
                      <td style={{ padding: '12px 10px' }}>₹{Number(c.min_purchase_amount).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '12px 10px', fontSize: '0.8rem', color: '#8E9B94' }}>
                        {new Date(c.valid_to).toLocaleDateString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: c.is_active ? '#E8F5E9' : '#FFEBEE',
                          color: c.is_active ? '#2E7D32' : '#C62828'
                        }}>
                          {c.is_active ? 'ACTIVE' : 'EXPIRED'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                        {isSuperAdmin && (
                          <button
                            onClick={() => handleCouponDelete(c.id, c.code)}
                            style={{ padding: '5px 8px', backgroundColor: 'rgba(150,56,50,0.1)', color: '#963832', border: '1px solid rgba(150,56,50,0.2)', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 7: ABANDONED CARTS RECOVERY
           ======================================================== */}
        {activeTab === 'abandoned-carts' && (
          <div>
            <div style={{ backgroundColor: '#14231F', color: '#FAF7F0', padding: '24px 28px', borderRadius: '8px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#B78B45', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Lost Revenue Opportunity</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 700, color: '#D4AF37' }}>
                  ₹{Number(abandonedCarts?.potential_lost_revenue || 0).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#A2B0A8' }}>
                  {abandonedCarts?.total_abandoned_carts || 0} patrons have left items without completing checkout.
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge-gold">WhatsApp Recovery Enabled</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E5DFC9', color: '#8E9B94', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                    <th style={{ padding: '12px 10px' }}>Patron</th>
                    <th style={{ padding: '12px 10px' }}>Contact</th>
                    <th style={{ padding: '12px 10px' }}>Cart Contents</th>
                    <th style={{ padding: '12px 10px' }}>Potential Value</th>
                    <th style={{ padding: '12px 10px' }}>Last Updated</th>
                    <th style={{ padding: '12px 10px', textAlign: 'right' }}>Recovery Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(abandonedCarts?.results || []).length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '36px', textAlign: 'center', color: '#8E9B94' }}>
                        No abandoned carts currently recorded.
                      </td>
                    </tr>
                  ) : (
                    (abandonedCarts.results || []).map((cart, idx) => {
                      const cleanPhone = (cart.phone || '').replace(/\D/g, '');
                      const formattedPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
                      const recoveryMsg = encodeURIComponent(`👑 *Maison Ruméra Atelier — Exclusive Vault Courtesy*\n\nGreetings ${cart.user_name || 'Connoisseur'},\nWe noticed you left rare artisanal flacons in your private selection:\n${(cart.items || []).map(i => `• ${i.product_name} (${i.variant_size})`).join('\n')}\n\nTo complete your acquisition, please use exclusive royal coupon code *RUMERA10* for 10% appraisal privilege at http://127.0.0.1:5173\n\nMaison Ruméra Concierge (+91 9305988767)`);

                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid #EFEAE0' }}>
                          <td style={{ padding: '12px 10px', fontWeight: 600 }}>{cart.user_name || 'Guest Connoisseur'}</td>
                          <td style={{ padding: '12px 10px', fontSize: '0.8rem' }}>
                            <div>{cart.email || '—'}</div>
                            <div style={{ color: '#8E9B94' }}>{cart.phone || '—'}</div>
                          </td>
                          <td style={{ padding: '12px 10px', fontSize: '0.8rem' }}>
                            {(cart.items || []).map((item, i) => (
                              <div key={i}>• {item.product_name} ({item.variant_size}) x{item.quantity}</div>
                            ))}
                          </td>
                          <td style={{ padding: '12px 10px', fontWeight: 700, color: '#14231F' }}>
                            ₹{Number(cart.cart_total || 0).toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '12px 10px', fontSize: '0.78rem', color: '#8E9B94' }}>
                            {new Date(cart.updated_at).toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                            {cleanPhone ? (
                              <a
                                href={`https://wa.me/${formattedPhone}?text=${recoveryMsg}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '6px 12px',
                                  backgroundColor: '#0F291E',
                                  color: '#25D366',
                                  border: '1px solid #25D366',
                                  borderRadius: '20px',
                                  fontSize: '0.74rem',
                                  fontWeight: 600,
                                  textDecoration: 'none'
                                }}
                              >
                                Send WhatsApp Offer
                              </a>
                            ) : (
                              <span style={{ fontSize: '0.74rem', color: '#8E9B94' }}>No phone linked</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 8: CUSTOMER REVIEWS (OLFACTORY APPRAISALS)
           ======================================================== */}
        {activeTab === 'reviews' && (
          <div>
            <div style={{ backgroundColor: '#FFFFFF', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E5DFC9', marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#14231F', margin: 0 }}>
                  Customer Reviews & Olfactory Appraisals ({reviews.length})
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#5C6B63', marginTop: '2px' }}>
                  Moderate and approve authentic customer impressions before public catalog display.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                {['ALL', 'PENDING', 'APPROVED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setReviewFilter(st)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      border: reviewFilter === st ? '1px solid #B78B45' : '1px solid #E5DFC9',
                      backgroundColor: reviewFilter === st ? '#14231F' : '#FFFFFF',
                      color: reviewFilter === st ? '#D4AF37' : '#5C6B63',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {filteredReviews.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5DFC9', color: '#8E9B94' }}>
                  No customer reviews found matching filter.
                </div>
              ) : (
                filteredReviews.map((rev) => (
                  <div key={rev.id} style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontSize: '0.74rem', color: '#B78B45', fontWeight: 600 }}>
                          {rev.product_name || 'Artisanal Flacon'}
                        </div>
                        <div style={{ fontWeight: 700, color: '#14231F', fontSize: '0.95rem' }}>
                          {rev.name} <span style={{ fontSize: '0.74rem', color: '#8E9B94', fontWeight: 400 }}>({rev.city})</span>
                        </div>
                      </div>
                      <span style={{
                        padding: '2px 7px',
                        borderRadius: '10px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        backgroundColor: rev.is_approved ? 'rgba(42, 104, 76, 0.12)' : 'rgba(212, 175, 55, 0.15)',
                        color: rev.is_approved ? '#2A684C' : '#B78B45'
                      }}>
                        {rev.is_approved ? 'APPROVED' : 'PENDING'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#D4AF37', marginBottom: '8px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < rev.rating ? '#D4AF37' : 'none'} color="#D4AF37" />
                      ))}
                      <span style={{ fontSize: '0.76rem', color: '#8E9B94', marginLeft: '6px' }}>{rev.rating}/5</span>
                    </div>

                    {rev.headline && (
                      <div style={{ fontWeight: 600, color: '#14231F', fontSize: '0.86rem', marginBottom: '4px' }}>
                        "{rev.headline}"
                      </div>
                    )}

                    <p style={{ fontSize: '0.8rem', color: '#5C6B63', flex: 1, margin: '0 0 16px' }}>
                      {rev.comment}
                    </p>

                    <div style={{ borderTop: '1px solid #EFEAE0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', color: '#8E9B94' }}>
                        {new Date(rev.created_at).toLocaleDateString('en-IN')}
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => handleToggleReviewApproval(rev)}
                          className={rev.is_approved ? 'btn-secondary' : 'btn-primary'}
                          style={{ padding: '5px 10px', fontSize: '0.72rem' }}
                        >
                          {rev.is_approved ? 'Unpublish' : 'Approve Review'}
                        </button>
                        <button
                          onClick={() => handleDeleteReview(rev.id, rev.name)}
                          style={{ padding: '5px 8px', backgroundColor: 'rgba(150,56,50,0.1)', color: '#963832', border: '1px solid rgba(150,56,50,0.2)', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 9: TEAM & ROLE ACCESS CONTROL (RBAC) [SUPER ADMIN ONLY]
           ======================================================== */}
        {activeTab === 'team' && (
          <div>
            {!isSuperAdmin ? (
              <div style={{ padding: '40px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5DFC9', textAlign: 'center' }}>
                <Shield size={36} color="#963832" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ color: '#14231F' }}>Role Restricted</h3>
                <p style={{ color: '#5C6B63' }}>Only Super Admins can access and manage Team RBAC permissions.</p>
              </div>
            ) : (
              <div>
                {/* Summary Strip */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '22px' }}>
                  <div style={{ backgroundColor: '#FFFFFF', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E5DFC9' }}>
                    <div style={{ fontSize: '0.72rem', color: '#8E9B94', textTransform: 'uppercase' }}>Total Users</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#14231F' }}>{users.length}</div>
                  </div>
                  <div style={{ backgroundColor: '#FFFFFF', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E5DFC9' }}>
                    <div style={{ fontSize: '0.72rem', color: '#8E9B94', textTransform: 'uppercase' }}>Super Admins</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#B78B45' }}>
                      {users.filter(u => u.role === 'SUPER_ADMIN').length}
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#FFFFFF', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E5DFC9' }}>
                    <div style={{ fontSize: '0.72rem', color: '#8E9B94', textTransform: 'uppercase' }}>Store Managers</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#2A684C' }}>
                      {users.filter(u => u.role === 'STORE_MANAGER').length}
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#FFFFFF', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E5DFC9' }}>
                    <div style={{ fontSize: '0.72rem', color: '#8E9B94', textTransform: 'uppercase' }}>Fulfilment Staff</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#3880AA' }}>
                      {users.filter(u => u.role === 'ORDER_FULFILMENT').length}
                    </div>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px 20px', borderRadius: '8px', border: '1px solid #E5DFC9', marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
                    <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
                      <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8E9B94' }} />
                      <input
                        type="text"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder="Search by email, name, or phone..."
                        style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: '4px', border: '1px solid #D8D0BC', fontSize: '0.84rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {['ALL', 'SUPER_ADMIN', 'STORE_MANAGER', 'ORDER_FULFILMENT', 'CUSTOMER'].map((role) => (
                        <button
                          key={role}
                          onClick={() => setUserRoleFilter(role)}
                          style={{
                            padding: '6px 11px',
                            borderRadius: '4px',
                            border: userRoleFilter === role ? '1px solid #B78B45' : '1px solid #E5DFC9',
                            backgroundColor: userRoleFilter === role ? '#14231F' : '#FFFFFF',
                            color: userRoleFilter === role ? '#D4AF37' : '#5C6B63',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          {role.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={handleOpenCreateUser} className="btn-primary" style={{ padding: '9px 18px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UserPlus size={15} />
                    <span>Invite Team Member</span>
                  </button>
                </div>

                {/* Users RBAC Table */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #E5DFC9', color: '#8E9B94', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                        <th style={{ padding: '12px 10px' }}>Member / Patron</th>
                        <th style={{ padding: '12px 10px' }}>Contact Phone</th>
                        <th style={{ padding: '12px 10px' }}>Assigned RBAC Role</th>
                        <th style={{ padding: '12px 10px' }}>Account Status</th>
                        <th style={{ padding: '12px 10px' }}>Joined Date</th>
                        <th style={{ padding: '12px 10px', textAlign: 'right' }}>Role Management</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => {
                        const isSelf = u.id === currentUser?.id;
                        const badge = roleBadgeStyle(u.role);

                        return (
                          <tr key={u.id} style={{ borderBottom: '1px solid #EFEAE0' }}>
                            <td style={{ padding: '12px 10px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  backgroundColor: '#1E362C',
                                  color: '#D4AF37',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 700,
                                  fontSize: '0.82rem'
                                }}>
                                  {u.first_name ? u.first_name[0].toUpperCase() : 'U'}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 600, color: '#14231F' }}>
                                    {u.first_name ? `${u.first_name} ${u.last_name || ''}` : 'Maison Member'}
                                    {isSelf && <span style={{ marginLeft: '6px', fontSize: '0.7rem', color: '#B78B45', fontWeight: 700 }}>(You)</span>}
                                  </div>
                                  <div style={{ fontSize: '0.76rem', color: '#5C6B63' }}>{u.email}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '12px 10px', fontSize: '0.8rem' }}>{u.phone || '—'}</td>
                            <td style={{ padding: '12px 10px' }}>
                              <span style={{
                                padding: '3px 8px',
                                borderRadius: '12px',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                backgroundColor: badge.bg,
                                color: badge.text,
                                border: badge.border
                              }}>
                                {badge.label}
                              </span>
                            </td>
                            <td style={{ padding: '12px 10px' }}>
                              <span style={{
                                padding: '2px 7px',
                                borderRadius: '10px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                backgroundColor: u.is_active ? 'rgba(42, 104, 76, 0.12)' : 'rgba(150, 56, 50, 0.12)',
                                color: u.is_active ? '#2A684C' : '#963832'
                              }}>
                                {u.is_active ? 'ACTIVE' : 'SUSPENDED'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 10px', fontSize: '0.78rem', color: '#8E9B94' }}>
                              {new Date(u.created_at).toLocaleDateString('en-IN')}
                            </td>
                            <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                <button
                                  onClick={() => handleOpenEditUser(u)}
                                  className="btn-secondary"
                                  style={{ padding: '5px 10px', fontSize: '0.72rem' }}
                                >
                                  Edit Role
                                </button>
                                {!isSelf && (
                                  <>
                                    <button
                                      onClick={() => handleToggleUserActive(u)}
                                      style={{
                                        padding: '5px 8px',
                                        backgroundColor: u.is_active ? 'rgba(150, 56, 50, 0.08)' : 'rgba(42, 104, 76, 0.08)',
                                        color: u.is_active ? '#963832' : '#2A684C',
                                        border: '1px solid rgba(0,0,0,0.1)',
                                        borderRadius: '4px',
                                        fontSize: '0.72rem',
                                        cursor: 'pointer'
                                      }}
                                      title={u.is_active ? 'Suspend Account' : 'Reactivate Account'}
                                    >
                                      {u.is_active ? 'Suspend' : 'Activate'}
                                    </button>
                                    <button
                                      onClick={() => handleDeleteUser(u)}
                                      style={{ padding: '5px 8px', backgroundColor: 'rgba(150,56,50,0.1)', color: '#963832', border: '1px solid rgba(150,56,50,0.2)', borderRadius: '4px', cursor: 'pointer' }}
                                      title="Remove User Account"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 10: FOUNDER PROFILE & WEBSITE CMS
           ======================================================== */}
        {activeTab === 'cms' && (
          <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#14231F', marginBottom: '8px' }}>
              Royal Atelier CMS & Founder Story Editor
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#5C6B63', marginBottom: '24px' }}>
              Edit Master Perfumer Er. Rumana Ansari's bio, royal heritage statement, and public brand vision.
            </p>

            <form onSubmit={handleOwnerProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="admin-grid-2col">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>
                    Founder Display Name
                  </label>
                  <input
                    type="text"
                    value={ownerProfile.display_name || ''}
                    onChange={(e) => setOwnerProfile({ ...ownerProfile, display_name: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>
                    Official Atelier Title
                  </label>
                  <input
                    type="text"
                    value={ownerProfile.title || ''}
                    onChange={(e) => setOwnerProfile({ ...ownerProfile, title: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>
                  Portrait Image URL
                </label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={ownerProfile.portrait_url || ''}
                    onChange={(e) => setOwnerProfile({ ...ownerProfile, portrait_url: e.target.value })}
                    style={{ flex: 1, padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                  />
                  {ownerProfile.portrait_url && (
                    <img
                      src={ownerProfile.portrait_url}
                      alt="Preview"
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #B78B45' }}
                    />
                  )}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>
                  Homepage Teaser Bio
                </label>
                <textarea
                  rows="2"
                  value={ownerProfile.short_bio || ''}
                  onChange={(e) => setOwnerProfile({ ...ownerProfile, short_bio: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>
                  Full Heritage & Atelier Story
                </label>
                <textarea
                  rows="5"
                  value={ownerProfile.full_story || ''}
                  onChange={(e) => setOwnerProfile({ ...ownerProfile, full_story: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                />
              </div>

              <div className="admin-grid-2col">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>
                    Brand Vision Statement
                  </label>
                  <textarea
                    rows="3"
                    value={ownerProfile.brand_vision || ''}
                    onChange={(e) => setOwnerProfile({ ...ownerProfile, brand_vision: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>
                    Founder Olfactory Quote
                  </label>
                  <textarea
                    rows="3"
                    value={ownerProfile.quote || ''}
                    onChange={(e) => setOwnerProfile({ ...ownerProfile, quote: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div>
                <button type="submit" className="btn-primary" style={{ padding: '12px 28px', fontSize: '0.88rem' }}>
                  Publish Atelier Changes Live
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================
            TAB 11: SECURITY & AUDIT TRAIL [SUPER ADMIN ONLY]
           ======================================================== */}
        {activeTab === 'audit' && (
          <div>
            {!isSuperAdmin ? (
              <div style={{ padding: '40px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E5DFC9', textAlign: 'center' }}>
                <Shield size={36} color="#963832" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ color: '#14231F' }}>Role Restricted</h3>
                <p style={{ color: '#5C6B63' }}>Only Super Admins can inspect the immutable Security & Audit Log.</p>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#14231F', margin: 0 }}>
                    Immutable Security & Audit Trail
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#5C6B63', marginTop: '2px' }}>
                    Cryptographically sequenced event log of all administrative actions, stock mutations, and status changes.
                  </p>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-sm)', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #E5DFC9', color: '#8E9B94', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                        <th style={{ padding: '12px 10px' }}>Timestamp</th>
                        <th style={{ padding: '12px 10px' }}>Actor</th>
                        <th style={{ padding: '12px 10px' }}>Action Type</th>
                        <th style={{ padding: '12px 10px' }}>Target Resource</th>
                        <th style={{ padding: '12px 10px' }}>IP / Network</th>
                        <th style={{ padding: '12px 10px' }}>Details / Change Payload</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #EFEAE0' }}>
                          <td style={{ padding: '12px 10px', fontSize: '0.78rem', color: '#8E9B94' }}>
                            {new Date(log.created_at).toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '12px 10px', fontWeight: 600 }}>{log.actor_email || 'System'}</td>
                          <td style={{ padding: '12px 10px' }}><span className="badge-gold">{log.action}</span></td>
                          <td style={{ padding: '12px 10px', fontFamily: 'monospace', fontSize: '0.8rem' }}>{log.resource_type}:{log.resource_id}</td>
                          <td style={{ padding: '12px 10px', fontSize: '0.78rem', color: '#8E9B94' }}>{log.ip_address || '127.0.0.1'}</td>
                          <td style={{ padding: '12px 10px', fontSize: '0.8rem', color: '#5C6B63' }}>
                            {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 12: FREE SAMPLE MARKETING CAMPAIGN
           ======================================================== */}
        {activeTab === 'free-samples' && (
          <AdminSampleCampaign currentUser={currentUser} />
        )}
      </main>

      {/* ========================================================
          MODAL 1: STOCK ADJUSTMENT
         ======================================================== */}
      {showStockModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', maxWidth: '500px', width: '100%', padding: '28px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#14231F', margin: 0 }}>
                Perform Stock Reserve Adjustment
              </h3>
              <button onClick={() => setShowStockModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#8E9B94" />
              </button>
            </div>

            <form onSubmit={handleStockSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>
                  Flacon Variant
                </label>
                <select
                  required
                  value={stockForm.variant_id}
                  onChange={(e) => setStockForm({ ...stockForm, variant_id: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                >
                  <option value="">Select Flacon Variant...</option>
                  {products.flatMap(p => (p.variants || []).map(v => (
                    <option key={v.id} value={v.id}>
                      {p.name} — {v.volume_size} (Current: {v.stock_quantity})
                    </option>
                  )))}
                </select>
              </div>

              <div className="admin-grid-2col">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>
                    Units Delta (+ / -)
                  </label>
                  <input
                    type="number"
                    required
                    value={stockForm.quantity_change}
                    onChange={(e) => setStockForm({ ...stockForm, quantity_change: e.target.value })}
                    placeholder="e.g. 10 or -2"
                    style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>
                    Reason Code
                  </label>
                  <select
                    value={stockForm.reason}
                    onChange={(e) => setStockForm({ ...stockForm, reason: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                  >
                    <option value="RESTOCK">Restock / New Decanting</option>
                    <option value="AUDIT_CORRECTION">Audit Correction</option>
                    <option value="DAMAGE_LOSS">Damage / Spillage Loss</option>
                    <option value="RETURN">Customer Return / Exchange</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>
                  Mandatory Audit Rationale
                </label>
                <textarea
                  required
                  rows="2"
                  value={stockForm.notes}
                  onChange={(e) => setStockForm({ ...stockForm, notes: e.target.value })}
                  placeholder="Explain why this inventory adjustment is being recorded..."
                  style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowStockModal(false)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.82rem' }}>
                  Record in Audit Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: ORDER STATUS & AWB DISPATCH
         ======================================================== */}
      {showStatusModal && selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', maxWidth: '500px', width: '100%', padding: '28px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#14231F', margin: 0 }}>
                  Update Order Dispatch Status
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#8E9B94', marginTop: '2px' }}>
                  Order #{selectedOrder.order_number} ({selectedOrder.recipient_name})
                </div>
              </div>
              <button onClick={() => setShowStatusModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#8E9B94" />
              </button>
            </div>

            <form onSubmit={handleStatusSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>
                  Fulfillment Status
                </label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                >
                  <option value="PENDING_PAYMENT">Pending Payment</option>
                  <option value="PAID">Paid / Awaiting Decanting</option>
                  <option value="PROCESSING">Processing & Decanting in Atelier</option>
                  <option value="SHIPPED">Shipped with Express Courier</option>
                  <option value="DELIVERED">Delivered to Patron</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div className="admin-grid-2col">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>
                    Courier Carrier
                  </label>
                  <input
                    type="text"
                    value={statusForm.carrier_name}
                    onChange={(e) => setStatusForm({ ...statusForm, carrier_name: e.target.value })}
                    placeholder="e.g. Bluedart / Delhivery"
                    style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '4px' }}>
                    AWB Tracking Code
                  </label>
                  <input
                    type="text"
                    value={statusForm.tracking_number}
                    onChange={(e) => setStatusForm({ ...statusForm, tracking_number: e.target.value })}
                    placeholder="e.g. BLU12345678"
                    style={{ width: '100%', padding: '10px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowStatusModal(false)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.82rem' }}>
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: CREATE / EDIT PRODUCT
         ======================================================== */}
      {showProductModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', maxWidth: '780px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '28px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: '#14231F', margin: 0 }}>
                {productModalMode === 'create' ? 'Add New Fragrance Flacon' : `Edit Fragrance: ${productForm.name}`}
              </h3>
              <button onClick={() => setShowProductModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#8E9B94" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="admin-grid-2col">
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#14231F', marginBottom: '3px' }}>Fragrance Name</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Rooh Al Assam 12-Year"
                    style={{ width: '100%', padding: '9px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#14231F', marginBottom: '3px' }}>SKU Code</label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    placeholder="e.g. RUM-OUD-001"
                    style={{ width: '100%', padding: '9px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div className="admin-grid-3col">
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#14231F', marginBottom: '3px' }}>Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    style={{ width: '100%', padding: '9px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#14231F', marginBottom: '3px' }}>Product Type</label>
                  <select
                    value={productForm.product_type}
                    onChange={(e) => setProductForm({ ...productForm, product_type: e.target.value })}
                    style={{ width: '100%', padding: '9px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                  >
                    <option value="ATTAR">Attar (Pure Oil)</option>
                    <option value="OUD">Pure Dehn Al Oud</option>
                    <option value="EXTRAIT">Extrait de Parfum</option>
                    <option value="GIFT_SET">Luxury Gift Coffret</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#14231F', marginBottom: '3px' }}>Status</label>
                  <select
                    value={productForm.status}
                    onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
                    style={{ width: '100%', padding: '9px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                  >
                    <option value="ACTIVE">Active (Live in Catalog)</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              {/* Flacon Image Uploader */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#14231F', marginBottom: '6px' }}>
                  Flacon Bottle Image
                </label>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', padding: '14px', backgroundColor: '#FCFAF6', border: '1px dashed #B78B45', borderRadius: '6px' }}>
                  {productForm.image_url ? (
                    <div style={{ position: 'relative', width: '70px', height: '70px', backgroundColor: '#0D1714', borderRadius: '6px', overflow: 'hidden', border: '1px solid #B78B45', flexShrink: 0 }}>
                      <img
                        src={resolveImageUrl(productForm.image_url)}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }}
                      />
                    </div>
                  ) : (
                    <div style={{ width: '70px', height: '70px', backgroundColor: '#EFEAE0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8E9B94', fontSize: '0.7rem', textAlign: 'center', flexShrink: 0 }}>
                      No Image
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <label
                        htmlFor="flacon-file-upload-input"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          backgroundColor: '#14231F',
                          color: '#D4AF37',
                          border: '1px solid #B78B45',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <Upload size={14} />
                        <span>{uploadingImage ? 'Uploading Image...' : 'Upload Image from Computer'}</span>
                      </label>
                      <input
                        id="flacon-file-upload-input"
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        style={{ display: 'none' }}
                      />
                      {productForm.image_url && (
                        <button
                          type="button"
                          onClick={() => setProductForm({ ...productForm, image_url: '' })}
                          style={{ padding: '6px 10px', fontSize: '0.74rem', color: '#963832', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#8E9B94', marginTop: '6px' }}>
                      PNG, JPG, WEBP flacon photography supported. Live server auto-storage.
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    value={productForm.image_url}
                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                    placeholder="Or enter direct image URL / path (e.g. /images/rumera_white_oud_hero.jpg)"
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.78rem', color: '#5C6B63' }}
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#14231F', marginBottom: '3px' }}>
                  Short Teaser Description (Shown on cards & quick preview)
                </label>
                <input
                  type="text"
                  value={productForm.short_description}
                  onChange={(e) => setProductForm({ ...productForm, short_description: e.target.value })}
                  placeholder="e.g. 12-Year aged wild Assam agarwood infused with Mysore sandalwood."
                  style={{ width: '100%', padding: '9px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                />
              </div>

              {/* Full Olfactory Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#14231F', marginBottom: '3px' }}>
                  Full Olfactory Description & Distillation Story
                </label>
                <textarea
                  rows="3"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Describe the royal origin, olfactory evolution from top to base, traditional deg-bhapka distillation technique, and ceremonial wearing ritual..."
                  style={{ width: '100%', padding: '9px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                />
              </div>

              <div className="admin-grid-2col">
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#14231F', marginBottom: '3px' }}>Fragrance Family</label>
                  <input
                    type="text"
                    value={productForm.fragrance_family}
                    onChange={(e) => setProductForm({ ...productForm, fragrance_family: e.target.value })}
                    style={{ width: '100%', padding: '9px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#14231F', marginBottom: '3px' }}>Concentration</label>
                  <input
                    type="text"
                    value={productForm.concentration}
                    onChange={(e) => setProductForm({ ...productForm, concentration: e.target.value })}
                    style={{ width: '100%', padding: '9px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div className="admin-grid-3col">
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#5C6B63', marginBottom: '2px' }}>Top Notes</label>
                  <input
                    type="text"
                    value={productForm.top_notes}
                    onChange={(e) => setProductForm({ ...productForm, top_notes: e.target.value })}
                    placeholder="Saffron, Bergamot..."
                    style={{ width: '100%', padding: '8px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#5C6B63', marginBottom: '2px' }}>Heart Notes</label>
                  <input
                    type="text"
                    value={productForm.heart_notes}
                    onChange={(e) => setProductForm({ ...productForm, heart_notes: e.target.value })}
                    placeholder="Damascena Rose, Jasmine..."
                    style={{ width: '100%', padding: '8px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#5C6B63', marginBottom: '2px' }}>Base Notes</label>
                  <input
                    type="text"
                    value={productForm.base_notes}
                    onChange={(e) => setProductForm({ ...productForm, base_notes: e.target.value })}
                    placeholder="Aged Oud, Sandalwood..."
                    style={{ width: '100%', padding: '8px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div style={{ backgroundColor: '#FCFAF6', border: '1px dashed #B78B45', padding: '14px', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#14231F', marginBottom: '8px' }}>PRIMARY FLACON SPECIFICATIONS</div>
                <div className="admin-grid-4col">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#5C6B63', marginBottom: '2px' }}>Volume / Size</label>
                    <input
                      type="text"
                      required
                      value={productForm.volume_size}
                      onChange={(e) => setProductForm({ ...productForm, volume_size: e.target.value })}
                      placeholder="e.g. 3 ml"
                      style={{ width: '100%', padding: '8px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#5C6B63', marginBottom: '2px' }}>Selling Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      style={{ width: '100%', padding: '8px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#5C6B63', marginBottom: '2px' }}>Compare Price (₹)</label>
                    <input
                      type="number"
                      value={productForm.compare_at_price}
                      onChange={(e) => setProductForm({ ...productForm, compare_at_price: e.target.value })}
                      placeholder="Optional"
                      style={{ width: '100%', padding: '8px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#5C6B63', marginBottom: '2px' }}>Stock Units</label>
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
                  <span>Bestseller Crown Badge</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowProductModal(false)} className="btn-secondary" style={{ padding: '9px 18px', fontSize: '0.82rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '9px 22px', fontSize: '0.82rem' }}>
                  {productModalMode === 'create' ? 'Create Fragrance' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: CREATE / EDIT CATEGORY
         ======================================================== */}
      {showCategoryModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', maxWidth: '520px', width: '100%', padding: '28px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#14231F', margin: 0 }}>
                {categoryModalMode === 'create' ? 'Create Category Collection' : `Edit Category: ${categoryForm.name}`}
              </h3>
              <button onClick={() => setShowCategoryModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#8E9B94" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '3px' }}>Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Royal Dehn Al Oud"
                  style={{ width: '100%', padding: '9px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '3px' }}>URL Slug</label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  placeholder="e.g. dehn-al-oud (leave blank to auto-generate)"
                  style={{ width: '100%', padding: '9px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '3px' }}>Description</label>
                <textarea
                  rows="2"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Editorial olfactory notes for category landing..."
                  style={{ width: '100%', padding: '9px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                />
              </div>

              <div className="admin-grid-2col">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '3px' }}>Sort Order</label>
                  <input
                    type="number"
                    value={categoryForm.sort_order}
                    onChange={(e) => setCategoryForm({ ...categoryForm, sort_order: e.target.value })}
                    style={{ width: '100%', padding: '9px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginTop: '22px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#14231F', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={categoryForm.is_active}
                      onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.checked })}
                    />
                    <span>Active in Public Navigation</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowCategoryModal(false)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.82rem' }}>
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 5: TEAM & ROLE RBAC MODAL (SUPER ADMIN ONLY)
         ======================================================== */}
      {showUserModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', maxWidth: '520px', width: '100%', padding: '28px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={24} color="#D4AF37" />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#14231F', margin: 0 }}>
                  {userModalMode === 'create' ? 'Invite New Staff Member' : `Edit User Role & Permissions`}
                </h3>
              </div>
              <button onClick={() => setShowUserModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#8E9B94" />
              </button>
            </div>

            <form onSubmit={handleUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="admin-grid-2col">
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#14231F', marginBottom: '3px' }}>First Name</label>
                  <input
                    type="text"
                    required
                    value={userForm.first_name}
                    onChange={(e) => setUserForm({ ...userForm, first_name: e.target.value })}
                    style={{ width: '100%', padding: '9px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#14231F', marginBottom: '3px' }}>Last Name</label>
                  <input
                    type="text"
                    value={userForm.last_name}
                    onChange={(e) => setUserForm({ ...userForm, last_name: e.target.value })}
                    style={{ width: '100%', padding: '9px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#14231F', marginBottom: '3px' }}>Email Address (ID)</label>
                <input
                  type="email"
                  required
                  disabled={userModalMode === 'edit'}
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="e.g. manager@rumeraluxury.com"
                  style={{ width: '100%', padding: '9px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem', backgroundColor: userModalMode === 'edit' ? '#F4EFE6' : '#FFFFFF' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#14231F', marginBottom: '3px' }}>Phone Number</label>
                <input
                  type="text"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  placeholder="e.g. +91 9305988767"
                  style={{ width: '100%', padding: '9px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ backgroundColor: '#FCFAF6', border: '1px solid #E5DFC9', padding: '14px', borderRadius: '6px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#14231F', marginBottom: '6px' }}>
                  Assign Role-Based Access Control (RBAC)
                </label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #B78B45', borderRadius: '4px', fontSize: '0.86rem', fontWeight: 600, backgroundColor: '#FFFFFF' }}
                >
                  <option value="SUPER_ADMIN">👑 Super Admin (Full Root System Access)</option>
                  <option value="STORE_MANAGER">🛍️ Store Manager (Catalog, Inventory, Orders, CMS)</option>
                  <option value="ORDER_FULFILMENT">📦 Order Fulfilment (Orders, Dispatch, Tracking AWB)</option>
                  <option value="CONTENT_MANAGER">✍️ Content Manager (CMS, Story, Policies)</option>
                  <option value="CUSTOMER">Patron (Standard Customer Account)</option>
                </select>
                <div style={{ fontSize: '0.72rem', color: '#5C6B63', marginTop: '6px' }}>
                  Super Admins can manage all users and financial reports; Store Managers can update catalog & inventory; Fulfilment staff can update orders.
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#14231F', marginBottom: '3px' }}>
                  {userModalMode === 'create' ? 'Initial Password' : 'Reset Password (leave empty to retain)'}
                </label>
                <input
                  type="password"
                  required={userModalMode === 'create'}
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  placeholder={userModalMode === 'create' ? 'e.g. Rumera@2026' : '••••••••'}
                  style={{ width: '100%', padding: '9px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowUserModal(false)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.82rem' }}>
                  {userModalMode === 'create' ? 'Create Team Account' : 'Save User Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 6: CREATE COUPON
         ======================================================== */}
      {showCouponModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', maxWidth: '480px', width: '100%', padding: '28px', border: '1px solid #E5DFC9', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#14231F', margin: 0 }}>
                Issue New Promotional Privilege
              </h3>
              <button onClick={() => setShowCouponModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#8E9B94" />
              </button>
            </div>

            <form onSubmit={handleCouponSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '3px' }}>Promo Code (All Caps)</label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. ROYAL20"
                  style={{ width: '100%', padding: '9px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.86rem', fontFamily: 'monospace', fontWeight: 700 }}
                />
              </div>

              <div className="admin-grid-2col">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '3px' }}>Discount Type</label>
                  <select
                    value={couponForm.discount_type}
                    onChange={(e) => setCouponForm({ ...couponForm, discount_type: e.target.value })}
                    style={{ width: '100%', padding: '9px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '3px' }}>
                    Benefit Value ({couponForm.discount_type === 'PERCENTAGE' ? '%' : '₹'})
                  </label>
                  <input
                    type="number"
                    required
                    value={couponForm.discount_value}
                    onChange={(e) => setCouponForm({ ...couponForm, discount_value: e.target.value })}
                    style={{ width: '100%', padding: '9px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div className="admin-grid-2col">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '3px' }}>Min Purchase (₹)</label>
                  <input
                    type="number"
                    required
                    value={couponForm.min_purchase_amount}
                    onChange={(e) => setCouponForm({ ...couponForm, min_purchase_amount: e.target.value })}
                    style={{ width: '100%', padding: '9px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#14231F', marginBottom: '3px' }}>Expiration Date</label>
                  <input
                    type="datetime-local"
                    required
                    value={couponForm.valid_to}
                    onChange={(e) => setCouponForm({ ...couponForm, valid_to: e.target.value })}
                    style={{ width: '100%', padding: '9px', border: '1px solid #D8D0BC', borderRadius: '4px', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowCouponModal(false)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.82rem' }}>
                  Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Embedded Production CSS Styles */}
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
          width: 270px;
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
            width: 290px;
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
