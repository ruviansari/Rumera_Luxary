import React, { useState, useEffect } from 'react';
import { ShoppingBag, User as UserIcon, Search, Shield, Menu, X, ArrowRight, Phone, Mail, Heart, Sparkles, ArrowUpRight } from 'lucide-react';
import { api } from '../../services/api';

const BESPOKE_SEARCH_IMAGES = {
  'royal-quadrumvirate-gift-coffret': '/images/showcase/royal_trio_collection.jpg',
  'gulab-e-khas-ruh-gulab': '/images/showcase/artisanal_gold_cage_front.jpg',
  'rooh-al-assam-vintage': '/images/showcase/royal_emerald_flacon.jpg',
  'rumera-white-oud-extrait': '/images/rumera_white_oud_hero.jpg',
  'kashmir-shamama-tul-amber': '/images/showcase/royal_amber_flacon.jpg',
  'musk-al-sultani-white-musk': '/images/showcase/artisanal_gold_cage_angle.jpg',
  'oud-imperial-extrait-de-parfum': '/images/showcase/royal_amber_flacon.jpg',
};

export default function Header({
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
  currentUser,
  currentRoute,
  onNavigate,
  onLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveResults, setLiveResults] = useState([]);
  const [liveSearching, setLiveSearching] = useState(false);

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setLiveResults([]);
      setLiveSearching(false);
      return;
    }
    setLiveSearching(true);
    const timer = setTimeout(() => {
      api.getProducts({ search: q })
        .then((res) => {
          const list = res.results || res || [];
          setLiveResults(list.slice(0, 4));
        })
        .catch(() => setLiveResults([]))
        .finally(() => setLiveSearching(false));
    }, 220);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('shop', { search: searchQuery.trim() });
      setSearchOpen(false);
      setLiveResults([]);
    }
  };

  const handleQuickTagClick = (tag) => {
    setSearchQuery(tag);
    onNavigate('shop', { search: tag });
    setSearchOpen(false);
    setLiveResults([]);
  };

  const isStaff = currentUser && ['SUPER_ADMIN', 'STORE_MANAGER', 'ORDER_FULFILMENT', 'CONTENT_MANAGER'].includes(currentUser.role);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: 'rgba(20, 35, 31, 0.98)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(183, 139, 69, 0.35)', color: '#FFFFFF', boxShadow: '0 4px 25px rgba(0, 0, 0, 0.35)' }}>
      {/* 1. Royal House Announcement Ribbon — Sabse Top Bar */}
      <div
        className="header-top-ribbon"
        style={{
          backgroundColor: '#0C1714',
          borderBottom: '1px solid rgba(183, 139, 69, 0.35)',
          padding: '6px 16px',
          textAlign: 'center',
          fontSize: '0.72rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: '#E8CA89',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}
      >
        <span>👑 MAISON RUMÉRA</span>
        <span style={{ color: 'rgba(183, 139, 69, 0.45)' }}>•</span>
        <span>THE FRAGRANCE OF ROYALTY</span>
        <span style={{ color: 'rgba(183, 139, 69, 0.45)' }}>•</span>
        <span style={{ color: '#FAF7F0' }}>FOUNDER: ER. RUMANA ANSARI</span>
        <span style={{ color: 'rgba(183, 139, 69, 0.45)' }}>•</span>
        <a href="tel:+919305988767" style={{ color: '#D4AF37', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Phone size={11} color="#D4AF37" />
          <span>+91 9305988767</span>
        </a>
        <span style={{ color: 'rgba(183, 139, 69, 0.45)' }}>•</span>
        <a href="mailto:ruviansari144@gmail.com" style={{ color: '#FAF7F0', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Mail size={11} color="#D4AF37" />
          <span>ruviansari144@gmail.com</span>
        </a>
      </div>

      {/* Main Navigation Bar */}
      <div className="container header-nav-container">
        {/* Left: Mobile Menu Toggle + Brand Logo (Left of The House) + Navigation */}
        <div className="header-left-wrap">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', color: '#FFFFFF' }}
            className="mobile-toggle"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Brand Identity Logo — positioned immediately to the left of The House */}
          <div
            className="header-brand-logo"
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none', flexShrink: 0 }}
            onClick={() => onNavigate('home')}
            title="Rumera Luxury Atra — The Fragrance of Royalty"
          >
            <img
              src="/images/rumera_crest_emblem.png"
              alt="Rumera Logo"
              style={{
                height: '46px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 10px rgba(183, 139, 69, 0.45))',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="brand-logo-mark"
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                className="brand-text-name"
                style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', letterSpacing: '0.18em', color: '#FAF7F0', fontWeight: 600, lineHeight: 1, transition: 'all 0.35s ease' }}
              >
                RUMÉRA
              </span>
              <span style={{ fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 700, marginTop: '3px' }}>
                The Fragrance of Royalty
              </span>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '16px', alignItems: 'center' }} className="desktop-nav">
            <button
              onClick={() => onNavigate('home')}
              className={`header-nav-link ${currentRoute === 'home' ? 'active' : ''}`}
            >
              The House
            </button>
            <button
              onClick={() => onNavigate('shop')}
              className={`header-nav-link ${currentRoute === 'shop' ? 'active' : ''}`}
            >
              Collection
            </button>
            <button
              onClick={() => onNavigate('shop', { category: 'dehn-al-oud' })}
              className="header-nav-link"
            >
              Dehn Al Oud
            </button>
            <button
              onClick={() => onNavigate('owner')}
              className={`header-nav-link ${currentRoute === 'owner' ? 'active' : ''}`}
            >
              Founder Profile
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`header-nav-link ${currentRoute === 'about' ? 'active' : ''}`}
            >
              Heritage
            </button>
          </nav>
        </div>

        {/* Right: Actions (Search, Admin ERP, Account, Cart) */}
        <div className="header-right-actions">
          <a
            href="tel:+919305988767"
            className="header-phone-btn"
            style={{
              color: '#D4AF37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(183, 139, 69, 0.1)',
              border: '1px solid rgba(183, 139, 69, 0.35)',
              textDecoration: 'none'
            }}
            title="Call Concierge: +91 9305988767"
          >
            <Phone size={16} color="#D4AF37" />
          </a>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="header-search-btn"
            style={{ color: '#DCD7CE', display: 'flex', alignItems: 'center', padding: '6px', cursor: 'pointer', background: 'transparent', border: 'none' }}
            title="Search Catalog"
          >
            <Search size={19} />
          </button>

          {/* Admin ERP Direct Switcher if staff logged in */}
          {isStaff && (
            <button
              onClick={() => onNavigate('admin')}
              className="header-erp-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                backgroundColor: 'rgba(183, 139, 69, 0.18)',
                border: '1px solid #B78B45',
                color: '#E8CA89',
                borderRadius: '4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
            >
              <Shield size={14} />
              <span>Admin ERP</span>
            </button>
          )}

          {/* Account Button */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => onNavigate('account')}
                className="header-account-btn"
                style={{ color: '#DCD7CE', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', background: 'transparent', border: 'none' }}
                title="Customer Account"
              >
                <UserIcon size={19} />
                <span className="user-email-text" style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.first_name || currentUser.email.split('@')[0]}
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="header-account-btn"
              style={{ color: '#DCD7CE', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', background: 'transparent', border: 'none' }}
            >
              <UserIcon size={18} />
              <span>Login</span>
            </button>
          )}

          {/* Royal Wishlist Trigger */}
          <button
            onClick={() => onNavigate('wishlist')}
            className="header-wishlist-btn"
            style={{
              position: 'relative',
              backgroundColor: 'rgba(183, 139, 69, 0.12)',
              border: '1px solid rgba(183, 139, 69, 0.35)',
              color: '#F0D495',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Royal Wishlist"
            aria-label="Open Wishlist"
          >
            <Heart size={17} color="#D4AF37" />
            {wishlistCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  backgroundColor: '#B78B45',
                  color: '#14231F',
                  borderRadius: '50%',
                  width: '17px',
                  height: '17px',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="header-cart-btn"
            style={{
              position: 'relative',
              backgroundColor: '#1D332D',
              border: '1px solid rgba(183, 139, 69, 0.4)',
              color: '#F8F4EC',
              padding: '8px 15px',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
            aria-label="Open Cart"
          >
            <ShoppingBag size={18} color="#B78B45" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{cartCount}</span>
          </button>
        </div>
      </div>

      {/* 2. Royal Search Bar Dropdown with Instant Live Suggestions */}
      {searchOpen && (
        <div style={{ backgroundColor: '#0B1613', borderTop: '1px solid rgba(183, 139, 69, 0.35)', borderBottom: '1px solid rgba(183, 139, 69, 0.25)', padding: '20px 0', boxShadow: '0 12px 36px rgba(0,0,0,0.5)' }}>
          <div className="container" style={{ maxWidth: '720px', margin: '0 auto', padding: '0 20px' }}>
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative', display: 'flex', gap: '10px' }}>
              <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                <Search size={17} color="#D4AF37" style={{ position: 'absolute', left: '16px', pointerEvents: 'none' }} />
                <input
                  type="text"
                  placeholder="Search by note (Assam Oud, Rose, Amber, Musk) or product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 46px',
                    backgroundColor: '#12221D',
                    border: '1.5px solid #B78B45',
                    color: '#FAF7F0',
                    borderRadius: '30px',
                    outline: 'none',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                    boxSizing: 'border-box'
                  }}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setLiveResults([]); }}
                    style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', color: '#B6C4BC', cursor: 'pointer', padding: '4px' }}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="btn-gold btn-primary"
                style={{ padding: '0 24px', fontSize: '0.82rem', borderRadius: '30px', letterSpacing: '0.08em', fontWeight: 700 }}
              >
                Search
              </button>
            </form>

            {/* Trending Quick Search Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.7rem', color: '#8E9E96', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={11} color="#D4AF37" />
                <span>Trending Notes:</span>
              </span>
              {['Assam Oud', 'Rooh Gulab', 'White Musk', 'Shamama', 'Gift Coffret'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickTagClick(tag)}
                  style={{
                    fontSize: '0.7rem',
                    color: '#FAF7F0',
                    backgroundColor: 'rgba(183, 139, 69, 0.14)',
                    border: '1px solid rgba(183, 139, 69, 0.35)',
                    padding: '3px 10px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(183, 139, 69, 0.35)'; e.currentTarget.style.borderColor = '#D4AF37'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(183, 139, 69, 0.14)'; e.currentTarget.style.borderColor = 'rgba(183, 139, 69, 0.35)'; }}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Live Search Instant Preview Dropdown */}
            {searchQuery.trim().length >= 2 && (
              <div
                style={{
                  marginTop: '14px',
                  backgroundColor: '#12221D',
                  borderRadius: '12px',
                  border: '1px solid rgba(183, 139, 69, 0.4)',
                  padding: '12px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.5)'
                }}
              >
                <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 700, padding: '4px 8px 8px', borderBottom: '1px solid rgba(183, 139, 69, 0.15)' }}>
                  {liveSearching ? 'Searching Royal Vault...' : liveResults.length > 0 ? `Matching Creations (${liveResults.length})` : 'No direct formulation matches'}
                </div>

                {liveResults.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                    {liveResults.map((item) => {
                      const itemImg = BESPOKE_SEARCH_IMAGES[item.slug] || item.primary_image || '/images/showcase/royal_emerald_flacon.jpg';
                      const price = item.variants?.[0]?.price || '0';
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            onNavigate('product', { slug: item.slug });
                            setSearchOpen(false);
                            setLiveResults([]);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            backgroundColor: 'rgba(255,255,255,0.02)',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(183, 139, 69, 0.16)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img
                              src={itemImg}
                              alt={item.name}
                              style={{ width: '38px', height: '44px', objectFit: 'contain', backgroundColor: '#091210', borderRadius: '4px', border: '1px solid rgba(183, 139, 69, 0.25)', padding: '2px' }}
                            />
                            <div>
                              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FAF7F0', fontFamily: 'var(--font-serif)' }}>
                                {item.name}
                              </div>
                              <div style={{ fontSize: '0.68rem', color: '#A0B2A9' }}>
                                {item.category?.name || 'Haute Concentré'} • {item.concentration}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.9rem', color: '#E8CA89', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
                              ₹{Number(price).toLocaleString('en-IN')}
                            </span>
                            <ArrowUpRight size={14} color="#D4AF37" />
                          </div>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      style={{
                        marginTop: '4px',
                        padding: '8px',
                        textAlign: 'center',
                        fontSize: '0.74rem',
                        color: '#D4AF37',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      View all results for "{searchQuery}" in Collection →
                    </button>
                  </div>
                ) : !liveSearching && (
                  <div style={{ padding: '14px 8px', textAlign: 'center', fontSize: '0.8rem', color: '#8E9E96' }}>
                    Press <strong>Search</strong> to explore the full collection for "{searchQuery}".
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div style={{ backgroundColor: '#14231F', borderTop: '1px solid rgba(183, 139, 69, 0.25)', padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <button
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              style={{ textAlign: 'left', color: '#F8F4EC', fontSize: '1.1rem', fontFamily: 'var(--font-serif)' }}
            >
              The House (Home)
            </button>
            <button
              onClick={() => { onNavigate('shop'); setMobileMenuOpen(false); }}
              style={{ textAlign: 'left', color: '#F8F4EC', fontSize: '1.1rem', fontFamily: 'var(--font-serif)' }}
            >
              The Complete Collection
            </button>
            <button
              onClick={() => { onNavigate('shop', { category: 'dehn-al-oud' }); setMobileMenuOpen(false); }}
              style={{ textAlign: 'left', color: '#B78B45', fontSize: '1.1rem', fontFamily: 'var(--font-serif)' }}
            >
              Vintage Dehn Al Oud
            </button>
            <button
              onClick={() => { onNavigate('owner'); setMobileMenuOpen(false); }}
              style={{ textAlign: 'left', color: '#F8F4EC', fontSize: '1.1rem', fontFamily: 'var(--font-serif)' }}
            >
              Founder Profile & Story
            </button>
            <button
              onClick={() => { onNavigate('about'); setMobileMenuOpen(false); }}
              style={{ textAlign: 'left', color: '#F8F4EC', fontSize: '1.1rem', fontFamily: 'var(--font-serif)' }}
            >
              Kannauj & Assam Heritage
            </button>
            <button
              onClick={() => { onNavigate('order-tracking'); setMobileMenuOpen(false); }}
              style={{ textAlign: 'left', color: '#DCD7CE', fontSize: '0.95rem' }}
            >
              Track Your Order
            </button>
            {isStaff && (
              <button
                onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                style={{ textAlign: 'left', color: '#E8CA89', fontWeight: 'bold', fontSize: '1rem', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}
              >
                Access ERP Admin Dashboard →
              </button>
            )}

            {/* Mobile Direct Concierge Helpline */}
            <div style={{ paddingTop: '14px', borderTop: '1px solid rgba(183,139,69,0.25)', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a
                href="tel:+919305988767"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  backgroundColor: 'rgba(183, 139, 69, 0.15)',
                  border: '1px solid #B78B45',
                  borderRadius: '4px',
                  color: '#FAF7F0',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em'
                }}
              >
                <Phone size={16} color="#D4AF37" />
                <span>Call: +91 9305988767</span>
              </a>
              <a
                href="mailto:ruviansari144@gmail.com"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(183, 139, 69, 0.5)',
                  borderRadius: '4px',
                  color: '#E8CA89',
                  textDecoration: 'none',
                  fontSize: '0.84rem',
                  fontWeight: 600
                }}
              >
                <Mail size={15} color="#D4AF37" />
                <span>ruviansari144@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* 1. Brand Logo Hover */
        .header-brand-logo {
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .header-brand-logo:hover {
          transform: translateY(-2px);
        }
        .header-brand-logo:hover .brand-logo-mark {
          filter: drop-shadow(0 0 16px rgba(212, 175, 55, 0.95)) !important;
          transform: scale(1.08) rotate(-2deg);
        }
        .header-brand-logo:hover .brand-text-name {
          color: #FFFFFF !important;
          text-shadow: 0 0 16px rgba(212, 175, 55, 0.65);
          letter-spacing: 0.22em !important;
        }

        /* 2. Navigation Links Hover & Animated Underline */
        .header-nav-link {
          position: relative;
          color: #DCD7CE;
          font-size: 0.82rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 600;
          padding: 8px 4px 6px;
          white-space: nowrap;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .header-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #B78B45 20%, #F5DEB3 50%, #B78B45 80%, transparent);
          transform: translateX(-50%);
          transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
          border-radius: 2px;
        }
        .header-nav-link:hover {
          color: #FAF7F0 !important;
          transform: translateY(-2px);
          text-shadow: 0 0 12px rgba(232, 202, 137, 0.5);
        }
        .header-nav-link:hover::after {
          width: 100%;
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.8);
        }
        .header-nav-link.active {
          color: #B78B45 !important;
        }
        .header-nav-link.active::after {
          width: 100%;
          background: #B78B45;
          box-shadow: 0 0 8px rgba(183, 139, 69, 0.5);
        }

        /* 3. Phone Concierge Button Hover */
        .header-phone-btn {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .header-phone-btn:hover {
          transform: scale(1.15) translateY(-2px);
          background-color: rgba(212, 175, 55, 0.28) !important;
          border-color: #D4AF37 !important;
          box-shadow: 0 0 16px rgba(212, 175, 55, 0.65);
        }
        .header-phone-btn:hover svg {
          animation: phoneRinging 0.4s ease infinite alternate;
        }
        @keyframes phoneRinging {
          0% { transform: rotate(-12deg); }
          100% { transform: rotate(12deg); }
        }

        /* 4. Search Button Hover */
        .header-search-btn {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .header-search-btn:hover {
          color: #E8CA89 !important;
          transform: scale(1.2);
          filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.75));
        }

        /* 5. Admin ERP Button Hover */
        .header-erp-btn {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .header-erp-btn:hover {
          background-color: rgba(183, 139, 69, 0.35) !important;
          border-color: #E8CA89 !important;
          color: #FFFFFF !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(183, 139, 69, 0.45);
        }
        .header-erp-btn:hover svg {
          transform: rotate(15deg);
          transition: transform 0.3s ease;
        }

        /* 6. Account Button Hover */
        .header-account-btn {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 6px 10px;
          border-radius: 20px;
        }
        .header-account-btn:hover {
          color: #FAF7F0 !important;
          background-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }
        .header-account-btn:hover svg {
          color: #D4AF37 !important;
          transform: scale(1.1);
          transition: transform 0.3s ease;
        }

        /* 7. Cart Button Hover */
        .header-cart-btn {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .header-cart-btn:hover {
          background-color: #26463D !important;
          border-color: #D4AF37 !important;
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 0 20px rgba(183, 139, 69, 0.55);
        }
        .header-cart-btn:hover svg {
          transform: rotate(-10deg) scale(1.1);
          transition: transform 0.3s ease;
        }

        .header-nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
          gap: 20px;
        }

        .header-left-wrap {
          display: flex;
          align-items: center;
          gap: 28px;
          min-width: 0;
        }

        .header-right-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
        }

        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
          .user-email-text { display: none !important; }
          .header-nav-container { height: 70px !important; }
        }

        @media (max-width: 900px) {
          /* Hide phone button from the tight top bar on tablet/mobile so it NEVER collides with RUMERA logo */
          .header-phone-btn { display: none !important; }
          .header-left-wrap { gap: 12px !important; }
          .header-right-actions { gap: 8px !important; }
        }

        @media (max-width: 640px) {
          .header-nav-container { height: 62px !important; gap: 8px !important; }
          .header-left-wrap { gap: 8px !important; }
          .header-brand-logo { gap: 6px !important; }
          .brand-logo-mark { height: 32px !important; }
          .brand-text-name { font-size: 1.25rem !important; letter-spacing: 0.1em !important; }
          .header-right-actions { gap: 6px !important; }
          .header-erp-btn span { display: none !important; }
          .header-erp-btn { padding: 5px 8px !important; }
          .header-account-btn span { display: none !important; }
          .header-account-btn { padding: 5px 6px !important; }
          .header-cart-btn { padding: 5px 10px !important; gap: 4px !important; }
          .mobile-toggle { padding: 4px !important; }
          .header-search-btn { padding: 4px !important; }
        }

        @media (max-width: 380px) {
          .brand-text-name { font-size: 1.1rem !important; letter-spacing: 0.08em !important; }
          .brand-logo-mark { height: 28px !important; }
          .header-left-wrap { gap: 6px !important; }
          .header-right-actions { gap: 4px !important; }
        }
      `}</style>
    </header>
  );
}
