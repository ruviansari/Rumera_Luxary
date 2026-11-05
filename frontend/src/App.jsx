import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import HomePage from './features/home/HomePage';
import ShopPage from './features/catalog/ShopPage';
import ProductDetailPage from './features/catalog/ProductDetailPage';
import OwnerPage from './features/owner/OwnerPage';
import CheckoutPage from './features/checkout/CheckoutPage';
import OrderTrackingPage from './features/orders/OrderTrackingPage';
import LoginPage from './features/account/LoginPage';
import AccountPage from './features/account/AccountPage';
import PolicyPage from './features/content/PolicyPage';
import AdminDashboard from './features/admin/AdminDashboard';
import WishlistPage from './features/catalog/WishlistPage';
import { api, getStoredUser, clearAuth } from './services/api';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [routeParams, setRouteParams] = useState({});
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [cart, setCart] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [notification, setNotification] = useState('');

  // Fetch initial global data
  const refreshCart = async () => {
    try {
      const data = await api.getCart();
      setCart(data);
    } catch (e) {
      console.warn("Could not load cart:", e);
    }
  };

  const refreshWishlist = async () => {
    try {
      const data = await api.getWishlist();
      setWishlist(Array.isArray(data) ? data : (data.results || []));
    } catch (e) {
      console.warn("Could not load wishlist:", e);
    }
  };

  useEffect(() => {
    refreshCart();
    refreshWishlist();

    // Load Categories & Featured Products & Owner Profile
    api.getCategories().then(setCategories).catch(console.error);
    api.getProducts({ featured: 'true' }).then((res) => {
      setFeaturedProducts(res.results || res || []);
    }).catch(console.error);
    api.getOwnerProfile().then(setOwnerProfile).catch(console.error);

    // Refresh profile if token exists
    if (getStoredUser()) {
      api.getProfile().then(setCurrentUser).catch(() => {
        clearAuth();
        setCurrentUser(null);
      });
    }

    const handleAuthLogout = () => {
      setCurrentUser(null);
      setCurrentRoute('login');
    };
    window.addEventListener('rumera_auth_logout', handleAuthLogout);
    return () => window.removeEventListener('rumera_auth_logout', handleAuthLogout);
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const navigate = (route, params = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = async (variantId, quantity = 1) => {
    try {
      const updatedCart = await api.addToCart(variantId, quantity);
      setCart(updatedCart);
      setCartOpen(true);
      showNotification("Flacon added to your Olfactory Cart.");
    } catch (err) {
      alert(err.message || "Failed to add item to cart.");
    }
  };

  const handleUpdateCartQuantity = async (itemId, quantity) => {
    try {
      const updatedCart = await api.updateCartItem(itemId, quantity);
      setCart(updatedCart);
    } catch (err) {
      alert(err.message || "Failed to update quantity.");
    }
  };

  const handleToggleWishlist = async (productId) => {
    try {
      const res = await api.toggleWishlist(productId);
      showNotification(res.message || "Wishlist updated.");
      await refreshWishlist();
    } catch (err) {
      showNotification(err.message || "Please sign in to update your wishlist.");
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    showNotification(`Welcome back, ${user.first_name || user.email}!`);
    if (['SUPER_ADMIN', 'STORE_MANAGER', 'ORDER_FULFILMENT', 'CONTENT_MANAGER'].includes(user.role)) {
      navigate('admin');
    } else {
      navigate('account');
    }
  };

  const handleLogout = () => {
    clearAuth();
    setCurrentUser(null);
    showNotification("You have been signed out.");
    navigate('home');
  };

  const handleOrderSuccess = () => {
    setCart(null);
    setAppliedCoupon(null);
    refreshCart();
  };

  // If in Admin ERP view, render dedicated layout
  if (currentRoute === 'admin') {
    return (
      <AdminDashboard
        currentUser={currentUser}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {notification && (
        <div style={{ position: 'fixed', bottom: '84px', right: '24px', zIndex: 2000, backgroundColor: '#14231F', color: '#B78B45', border: '1px solid #B78B45', padding: '14px 22px', borderRadius: '8px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', fontSize: '0.88rem', fontWeight: 600 }}>
          {notification}
        </div>
      )}

      {/* Shared Luxury Header */}
      <Header
        cartCount={cart?.total_items || 0}
        wishlistCount={wishlist.length}
        onOpenCart={() => setCartOpen(true)}
        currentUser={currentUser}
        currentRoute={currentRoute}
        onNavigate={navigate}
        onLogout={handleLogout}
      />

      {/* Interactive Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onCheckout={() => navigate('checkout')}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={(cpn) => setAppliedCoupon(cpn)}
        onRemoveCoupon={() => setAppliedCoupon(null)}
      />

      {/* Page Routing Switch */}
      <div style={{ flex: 1 }}>
        {currentRoute === 'home' && (
          <HomePage
            categories={categories}
            featuredProducts={featuredProducts}
            ownerProfile={ownerProfile}
            onNavigate={navigate}
            onQuickAdd={(varId) => handleAddToCart(varId, 1)}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {currentRoute === 'shop' && (
          <ShopPage
            initialParams={routeParams}
            onSelectProduct={(slug) => navigate('product', { slug })}
            onQuickAdd={(varId) => handleAddToCart(varId, 1)}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {currentRoute === 'product' && (
          <ProductDetailPage
            slug={routeParams.slug}
            onBack={() => navigate('shop')}
            onAddToCart={handleAddToCart}
            onNavigate={navigate}
          />
        )}

        {currentRoute === 'wishlist' && (
          <WishlistPage
            wishlist={wishlist}
            onNavigate={navigate}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {currentRoute === 'owner' && (
          <OwnerPage onNavigate={navigate} />
        )}

        {currentRoute === 'checkout' && (
          <CheckoutPage
            cart={cart}
            appliedCoupon={appliedCoupon}
            currentUser={currentUser}
            onOrderSuccess={handleOrderSuccess}
            onBackToCart={() => setCartOpen(true)}
            onNavigate={navigate}
          />
        )}

        {currentRoute === 'order-tracking' && (
          <OrderTrackingPage
            initialOrderNumber={routeParams.order_number || ''}
            onNavigate={navigate}
          />
        )}

        {currentRoute === 'login' && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigate={navigate}
          />
        )}

        {currentRoute === 'account' && (
          <AccountPage
            currentUser={currentUser}
            onLogout={handleLogout}
            onNavigate={navigate}
          />
        )}

        {(currentRoute === 'policy' || currentRoute === 'about' || currentRoute === 'contact') && (
          <PolicyPage
            slug={routeParams.slug || currentRoute}
            onNavigate={navigate}
          />
        )}
      </div>

      {/* Floating Royal Atelier WhatsApp Concierge */}
      <a
        href="https://wa.me/919305988767?text=Hello%20Maison%20Rumera%2C%20I%20would%20like%20to%20consult%20with%20the%20Master%20Perfumer%20regarding%20the%20Founder%20Edition%20flacon."
        target="_blank"
        rel="noreferrer"
        className="royal-whatsapp-concierge"
        title="Chat with Royal Atelier Concierge"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 99,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#14231F',
          color: '#FAF7F0',
          padding: '11px 18px',
          borderRadius: '50px',
          border: '1px solid #B78B45',
          boxShadow: '0 8px 25px rgba(0,0,0,0.4), 0 0 16px rgba(183,139,69,0.25)',
          textDecoration: 'none',
          fontSize: '0.82rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          cursor: 'pointer'
        }}
      >
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#25D366', boxShadow: '0 0 8px #25D366' }}></span>
        <span>Atelier Concierge</span>
      </a>

      {/* Shared Luxury Footer */}
      <Footer onNavigate={navigate} />
    </div>
  );
}
