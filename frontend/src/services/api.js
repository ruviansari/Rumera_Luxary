let detectedBase = null;

// Session Key for Guest Cart
export const getSessionKey = () => {
  let key = localStorage.getItem('rumera_session_key');
  if (!key) {
    key = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('rumera_session_key', key);
  }
  return key;
};

// Auth Token Helpers
export const getAuthToken = () => localStorage.getItem('rumera_access_token');
export const setAuthTokens = (access, refresh, user) => {
  if (access) localStorage.setItem('rumera_access_token', access);
  if (refresh) localStorage.setItem('rumera_refresh_token', refresh);
  if (user) localStorage.setItem('rumera_user', JSON.stringify(user));
};
export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('rumera_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
export const clearAuth = () => {
  localStorage.removeItem('rumera_access_token');
  localStorage.removeItem('rumera_refresh_token');
  localStorage.removeItem('rumera_user');
};

export const resolveImageUrl = (url) => {
  if (!url) return '/images/rumera_white_oud_hero.jpg';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('/media/')) {
    return `http://127.0.0.1:8001${url}`;
  }
  return url;
};

// Core Request Wrapper (Dynamically supports Port 8000 or 8001)
export async function apiRequest(endpoint, { method = 'GET', body = null, isAuth = false } = {}) {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const headers = {
    'X-Session-Key': getSessionKey(),
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const envBase = import.meta.env?.VITE_API_URL;
  let base = envBase || detectedBase || 'http://127.0.0.1:8001/api/v1';
  let response;
  try {
    response = await fetch(`${base}${endpoint}`, config);
    detectedBase = base;
  } catch (err) {
    if (envBase) {
      throw err;
    }
    const fallbackBase = base.includes(':8001') ? 'http://127.0.0.1:8000/api/v1' : 'http://127.0.0.1:8001/api/v1';
    try {
      response = await fetch(`${fallbackBase}${endpoint}`, config);
      detectedBase = fallbackBase;
    } catch {
      throw err;
    }
  }

  if (response.status === 401 && token) {
    // Token may have expired
    clearAuth();
    window.dispatchEvent(new Event('rumera_auth_logout'));
  }

  let data = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    let errorMsg = data?.error || data?.detail || data?.message;
    if (!errorMsg && data && typeof data === 'object') {
      const firstKey = Object.keys(data)[0];
      const val = data[firstKey];
      const msg = Array.isArray(val) ? val.join(' ') : String(val);
      errorMsg = firstKey === 'non_field_errors' ? msg : `${firstKey.replace('_', ' ')}: ${msg}`;
    }
    if (!errorMsg) {
      errorMsg = `Request failed with status ${response.status}`;
    }
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // Auth
  login: (email, password) => apiRequest('/auth/login/', { method: 'POST', body: { email, password } }),
  register: (payload) => apiRequest('/auth/register/', { method: 'POST', body: payload }),
  sendOTP: (phone) => apiRequest('/auth/otp/send/', { method: 'POST', body: { phone } }),
  verifyOTP: (phone, otp_code) => apiRequest('/auth/otp/verify/', { method: 'POST', body: { phone, otp_code } }),
  getProfile: () => apiRequest('/auth/me/'),
  getAddresses: () => apiRequest('/auth/addresses/'),
  createAddress: (payload) => apiRequest('/auth/addresses/', { method: 'POST', body: payload }),

  // Catalog
  getCategories: () => apiRequest('/categories/'),
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/products/${query ? `?${query}` : ''}`);
  },
  getProductDetail: (slug) => apiRequest(`/products/${slug}/`),

  // Cart
  getCart: () => apiRequest('/cart/'),
  addToCart: (variant_id, quantity = 1) => apiRequest('/cart/items/', { method: 'POST', body: { variant_id, quantity } }),
  updateCartItem: (itemId, quantity) => apiRequest(`/cart/items/${itemId}/`, { method: 'PATCH', body: { quantity } }),
  clearCart: () => apiRequest('/cart/clear/', { method: 'POST' }),

  // Promotions, Payments & Checkout
  validateCoupon: (code, subtotal) => apiRequest('/coupons/validate/', { method: 'POST', body: { code, subtotal } }),
  checkout: (payload) => apiRequest('/checkout/', { method: 'POST', body: payload }),
  createRazorpayOrder: (order_number) => apiRequest('/payments/razorpay/create/', { method: 'POST', body: { order_number } }),
  verifyPayment: (data) => apiRequest('/payments/verify/', { method: 'POST', body: data }),

  // Reviews & Wishlist
  getProductReviews: (slug) => apiRequest(`/products/${slug}/reviews/`),
  submitProductReview: (slug, data) => apiRequest(`/products/${slug}/reviews/`, { method: 'POST', body: data }),
  getWishlist: () => apiRequest('/wishlist/'),
  toggleWishlist: (product_id) => apiRequest('/wishlist/', { method: 'POST', body: { product_id } }),

  // Orders
  getMyOrders: () => apiRequest('/orders/me/'),
  trackOrder: (order_number, verification) => apiRequest('/orders/track/', { method: 'POST', body: { order_number, verification } }),

  // Content CMS
  getOwnerProfile: () => apiRequest('/content/owner/'),
  getContentPage: (slug) => apiRequest(`/content/pages/${slug}/`),
  getContentPages: () => apiRequest('/content/pages/'),

  // Free Sample Marketing Campaign
  getSampleCampaignConfig: () => apiRequest('/samples/config/'),
  claimFreeSample: (data) => apiRequest('/samples/claim/', { method: 'POST', body: data }),

  // Admin ERP APIs
  admin: {
    getAnalytics: () => apiRequest('/admin/analytics/dashboard/'),
    getSampleRequests: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return apiRequest(`/admin/samples/${q ? `?${q}` : ''}`);
    },
    updateSampleRequest: (id, data) => apiRequest(`/admin/samples/${id}/`, { method: 'PATCH', body: data }),
    getSampleCampaignSettings: () => apiRequest('/admin/samples/campaign-settings/'),
    updateSampleCampaignSettings: (data) => apiRequest('/admin/samples/campaign-settings/', { method: 'PATCH', body: data }),
    downloadSamplesCSV: async (statusFilter = 'ALL') => {
      const token = getAuthToken();
      const base = detectedBase || 'http://127.0.0.1:8001/api/v1';
      const url = `${base}/admin/samples/export/?status=${encodeURIComponent(statusFilter)}`;
      const res = await fetch(url, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) throw new Error("Failed to download CSV export");
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `rumera_sample_requests_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    },
    getUsers: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return apiRequest(`/auth/admin/users/${q ? `?${q}` : ''}`);
    },
    createUser: (data) => apiRequest('/auth/admin/users/', { method: 'POST', body: data }),
    updateUser: (id, data) => apiRequest(`/auth/admin/users/${id}/`, { method: 'PATCH', body: data }),
    deleteUser: (id) => apiRequest(`/auth/admin/users/${id}/`, { method: 'DELETE' }),
    getProducts: () => apiRequest('/admin/products/'),
    createProduct: (data) => apiRequest('/admin/products/', { method: 'POST', body: data }),
    updateProduct: (id, data) => apiRequest(`/admin/products/${id}/`, { method: 'PATCH', body: data }),
    deleteProduct: (id) => apiRequest(`/admin/products/${id}/`, { method: 'DELETE' }),
    getCategories: () => apiRequest('/admin/categories/'),
    createCategory: (data) => apiRequest('/admin/categories/', { method: 'POST', body: data }),
    updateCategory: (id, data) => apiRequest(`/admin/categories/${id}/`, { method: 'PATCH', body: data }),
    deleteCategory: (id) => apiRequest(`/admin/categories/${id}/`, { method: 'DELETE' }),
    getReviews: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return apiRequest(`/admin/reviews/${q ? `?${q}` : ''}`);
    },
    updateReview: (id, data) => apiRequest(`/admin/reviews/${id}/`, { method: 'PATCH', body: data }),
    deleteReview: (id) => apiRequest(`/admin/reviews/${id}/`, { method: 'DELETE' }),
    getStockMovements: (variantId) => apiRequest(`/admin/inventory/movements/${variantId ? `?variant=${variantId}` : ''}`),
    adjustStock: (data) => apiRequest('/admin/inventory/adjust/', { method: 'POST', body: data }),
    getOrders: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return apiRequest(`/admin/orders/${q ? `?${q}` : ''}`);
    },
    updateOrderStatus: (orderNumber, data) => apiRequest(`/admin/orders/${orderNumber}/status/`, { method: 'PATCH', body: data }),
    getCoupons: () => apiRequest('/admin/coupons/'),
    createCoupon: (data) => apiRequest('/admin/coupons/', { method: 'POST', body: data }),
    deleteCoupon: (id) => apiRequest(`/admin/coupons/${id}/`, { method: 'DELETE' }),
    getAbandonedCarts: () => apiRequest('/admin/abandoned-carts/'),
    uploadImage: (file) => {
      const formData = new FormData();
      formData.append('image', file);
      return apiRequest('/admin/upload/', { method: 'POST', body: formData });
    },
    dispatchShiprocket: (orderId) => apiRequest(`/admin/orders/${orderId}/shiprocket-dispatch/`, { method: 'POST' }),
    getOwnerProfile: () => apiRequest('/admin/content/owner/'),
    updateOwnerProfile: (data) => apiRequest('/admin/content/owner/', { method: 'PATCH', body: data }),
    updateContentPage: (slug, data) => apiRequest(`/admin/content/pages/${slug}/`, { method: 'PATCH', body: data }),
    getAuditLogs: () => apiRequest('/admin/audit-logs/'),
  }
};
