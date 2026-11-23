import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  User as UserIcon,
  Search,
  Shield,
  Menu,
  X,
  ArrowRight,
  Phone,
  Mail,
  Heart,
  Sparkles,
  ArrowUpRight,
  ChevronDown,
  LogOut,
  Package,
  Layers,
  Crown
} from 'lucide-react';
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
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveResults, setLiveResults] = useState([]);
  const [liveSearching, setLiveSearching] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const profileDropdownRef = useRef(null);

  // Scroll detection for compact header transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Live product search debouncing
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
    <header className="sticky top-0 z-[1000] w-full select-none font-sans text-white">
      {/* =========================================================================
          TIER 1: TOP ANNOUNCEMENT BAR (Slim, h-9, #050806)
          ========================================================================= */}
      <div className="bg-[#050806] border-b border-[#D4AF37]/15 text-[10.5px] tracking-[0.18em] uppercase text-[#E8CA89] h-9 flex items-center px-4 sm:px-6 lg:px-10 relative overflow-hidden">
        {/* Subtle Gold Hairline at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent pointer-events-none" />

        <div className="max-w-[1440px] w-full mx-auto flex items-center justify-between">
          {/* Left: Royal Maison Title */}
          <div className="flex items-center gap-2.5 font-medium">
            <span className="flex items-center gap-1.5 text-[#E8CA89] font-bold tracking-[0.22em]">
              <Crown size={12} className="text-[#D4AF37] fill-[#D4AF37]/25" />
              <span>MAISON RUMÉRA</span>
            </span>
            <span style={{ color: 'rgba(212, 175, 55, 0.45)' }}>•</span>
            <span
              className="hidden sm:inline font-medium tracking-[0.2em]"
              style={{ color: '#FAF7F0' }}
            >
              THE FRAGRANCE OF ROYALTY
            </span>
          </div>

          {/* Right: Founder & Contact Details with subtle dividers */}
          <div className="flex items-center gap-3 sm:gap-5 text-[10.5px] font-medium text-white/80">
            <span className="hidden md:inline tracking-[0.16em] text-[#FAF7F0]">
              FOUNDER: <strong className="text-[#E8CA89] font-semibold">ER. RUMANA ANSARI</strong>
            </span>
            <span className="hidden md:inline text-[#D4AF37]/30">|</span>
            <a
              href="tel:+919305988767"
              className="inline-flex items-center gap-1.5 text-[#D4AF37] hover:text-[#FFF5DC] tracking-[0.14em] transition-all"
              title="Call Master Perfumer Concierge"
            >
              <Phone size={10} className="text-[#D4AF37]" />
              <span className="font-semibold">+91 9305988767</span>
            </a>
            <span className="hidden lg:inline text-[#D4AF37]/30">|</span>
            <a
              href="mailto:ruviansari144@gmail.com"
              className="hidden lg:inline-flex items-center gap-1.5 text-white/70 hover:text-[#FAF7F0] tracking-[0.12em] transition-all"
              title="Concierge Email"
            >
              <Mail size={10} className="text-[#D4AF37]" />
              <span>ruviansari144@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TIER 2: MAIN GLASSMORPHIC NAVIGATION BAR
          ========================================================================= */}
      <div
        className={`w-full transition-all duration-300 relative border-b border-[#D4AF37]/20 ${
          scrolled
            ? 'h-16 bg-[#040806]/98 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85)]'
            : 'h-20 bg-[#070D0A]/92 backdrop-blur-xl shadow-[0_6px_30px_rgba(0,0,0,0.5)]'
        }`}
      >
        {/* Micro gold gradient accent line at bottom of navbar */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/45 to-transparent pointer-events-none" />

        {/* Ambient gold glow highlight at center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-full bg-gradient-to-b from-[#D4AF37]/[0.035] to-transparent pointer-events-none blur-xl" />

        <div className="max-w-[1440px] h-full mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4 relative z-10">
          {/* -------------------------------------------------------------------
              LEFT: BRAND IDENTITY (Logo & Wordmark) + MOBILE TOGGLE
              ------------------------------------------------------------------- */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Mobile Hamburger Toggle for < xl screens */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="xl:hidden p-2 -ml-2 text-white/80 hover:text-[#D4AF37] hover:bg-white/[0.04] rounded-lg transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} />
            </button>

            {/* Regal Monogram Emblem & Brand Wordmark */}
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 sm:gap-3.5 cursor-pointer select-none group shrink-0"
              title="Maison Ruméra — Haute Parfumerie"
            >
              {/* Luxury Glass Medallion Housing the Monogram Crest */}
              <div className={`rumera-emblem-medallion ${scrolled ? 'p-1.5' : 'p-2'}`}>
                <img
                  src="/images/rumera_crest_emblem.png"
                  alt="Ruméra Royal Insignia"
                  className={`w-auto object-contain transition-all duration-300 filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.65)] brightness-110 contrast-115 group-hover:scale-105 ${
                    scrolled ? 'h-7 sm:h-8' : 'h-8 sm:h-10'
                  }`}
                />
              </div>

              {/* 24K Gold Foil Typography Wordmark */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className={`rumera-wordmark-gold transition-all duration-300 ${
                    scrolled ? 'text-lg sm:text-2xl' : 'text-xl sm:text-[25px]'
                  }`}>
                    RUMÉRA
                  </span>
                  <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-[#D4AF37]/50" />
                  <span className="hidden sm:inline-block text-[8.5px] tracking-[0.24em] uppercase text-[#D4AF37]/80 font-serif italic">
                    Awadh Atelier
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[6px] text-[#D4AF37]/60">◆</span>
                  <span className="text-[7.5px] sm:text-[8.5px] tracking-[0.32em] uppercase text-[#D4AF37] font-semibold">
                    The Fragrance of Royalty
                  </span>
                  <span className="text-[6px] text-[#D4AF37]/60">◆</span>
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              CENTER: CLEANLY SPACED NAVIGATION LINKS (With Animated Underline)
              ------------------------------------------------------------------- */}
          <nav className="hidden xl:flex items-center gap-8 2xl:gap-9">
            {[
              { label: 'THE HOUSE', route: 'home' },
              { label: 'COLLECTION', route: 'shop' },
              { label: 'DEHN AL OUD', route: 'shop', params: { category: 'dehn-al-oud' } },
              { label: 'FOUNDER PROFILE', route: 'owner' },
              { label: 'HERITAGE', route: 'about' }
            ].map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.label}
                  onClick={() => onNavigate(item.route, item.params || {})}
                  className="relative py-2.5 text-[11px] tracking-[0.22em] font-semibold uppercase transition-all duration-300 whitespace-nowrap group cursor-pointer"
                  style={{ color: isActive ? '#FAF7F0' : '#D1CBC0' }}
                >
                  <span className="group-hover:text-white transition-colors">{item.label}</span>
                  {/* Smooth Animated Gold Underline */}
                  <span
                    className={`absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent transition-all duration-300 ${
                      isActive
                        ? 'w-full shadow-[0_0_8px_rgba(212,175,55,0.8)]'
                        : 'w-0 group-hover:w-full group-hover:shadow-[0_0_6px_rgba(212,175,55,0.4)]'
                    }`}
                  />
                  {/* Luminous Jewel Dot when Active */}
                  {isActive && <span className="rumera-nav-jewel" />}
                </button>
              );
            })}
          </nav>

          {/* -------------------------------------------------------------------
              RIGHT: ACTION GROUP (Non-Overlapping Pills & Utility Icons)
              ------------------------------------------------------------------- */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* FREE SAMPLE 24K Champagne Gold Jewel Pill */}
            <button
              onClick={() => onNavigate('free-sample')}
              className="rumera-btn-free-sample"
              title="Claim Complimentary Haute Parfumerie Flacon"
            >
              <Sparkles size={12} className="text-[#060B08] animate-pulse" />
              <span>Free Sample</span>
            </button>

            {/* Vertical Gold Hairline Divider */}
            <div className="hidden sm:block h-6 w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/35 to-transparent mx-0.5" />

            {/* Utility Icons Group: Search, Profile Dropdown, Wishlist, Cart */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Search Toggle Icon */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-[#D4AF37] hover:bg-white/[0.06] border border-transparent hover:border-[#D4AF37]/30 transition-all cursor-pointer"
                title="Search Fragrance Catalog"
                aria-label="Search"
              >
                <Search size={17} />
              </button>

              {/* Profile Dropdown (Tucking ADMIN ERP neatly inside!) */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="h-9 px-2.5 rounded-full flex items-center gap-1.5 text-white/80 hover:text-[#FAF7F0] hover:bg-white/[0.06] border border-transparent hover:border-[#D4AF37]/30 transition-all cursor-pointer"
                  title={currentUser ? currentUser.first_name || currentUser.email : 'Account'}
                  aria-label="User Account Menu"
                >
                  <UserIcon size={16} className="text-[#D4AF37]" />
                  {currentUser && (
                    <span className="hidden md:inline text-[11px] font-semibold text-[#FAF7F0] max-w-[80px] truncate">
                      {currentUser.first_name || currentUser.email.split('@')[0]}
                    </span>
                  )}
                  {isStaff && (
                    <span
                      className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]"
                      title="Super Admin Access Available"
                    />
                  )}
                  <ChevronDown size={12} className={`text-white/60 transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Luxury Glassmorphic Profile Dropdown Menu */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0B120F]/95 backdrop-blur-xl border border-[#D4AF37]/35 shadow-[0_15px_40px_rgba(0,0,0,0.85)] p-2 z-[1100] text-sm animate-in fade-in zoom-in-95 duration-150">
                    {currentUser ? (
                      <div>
                        {/* Patron Info Header */}
                        <div className="px-3 py-2.5 border-b border-[#D4AF37]/20 mb-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] tracking-[0.16em] uppercase font-bold text-[#D4AF37]">
                              {currentUser.role ? currentUser.role.replace('_', ' ') : 'Patron'}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          </div>
                          <div className="text-xs font-semibold text-[#FAF7F0] truncate mt-0.5">
                            {currentUser.first_name ? `${currentUser.first_name} ${currentUser.last_name || ''}` : currentUser.email}
                          </div>
                          <div className="text-[11px] text-white/50 truncate">
                            {currentUser.email}
                          </div>
                        </div>

                        {/* Super Admin ERP Quick Switcher (Tucked Neatly Inside!) */}
                        {isStaff && (
                          <div className="p-1 mb-1.5">
                            <button
                              onClick={() => {
                                onNavigate('admin');
                                setProfileMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37]/20 to-[#B78B45]/15 hover:from-[#D4AF37]/30 hover:to-[#B78B45]/25 border border-[#D4AF37]/45 text-[#FAF7F0] font-semibold text-xs tracking-wider uppercase transition-all shadow-[0_0_12px_rgba(212,175,55,0.2)] cursor-pointer text-left"
                            >
                              <Shield size={14} className="text-[#D4AF37] shrink-0" />
                              <div className="flex flex-col">
                                <span className="font-bold text-[#E8CA89]">Access Admin ERP</span>
                                <span className="text-[9px] text-white/60 lowercase tracking-normal">Full catalog & order controls</span>
                              </div>
                            </button>
                          </div>
                        )}

                        {/* Customer Navigation Links */}
                        <div className="space-y-0.5">
                          <button
                            onClick={() => {
                              onNavigate('account');
                              setProfileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/[0.06] text-xs transition-colors cursor-pointer text-left"
                          >
                            <UserIcon size={14} className="text-[#D4AF37]" />
                            <span>My Patron Account</span>
                          </button>
                          <button
                            onClick={() => {
                              onNavigate('order-tracking');
                              setProfileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/[0.06] text-xs transition-colors cursor-pointer text-left"
                          >
                            <Package size={14} className="text-[#D4AF37]" />
                            <span>Track Consignment</span>
                          </button>
                          <button
                            onClick={() => {
                              onNavigate('wishlist');
                              setProfileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/[0.06] text-xs transition-colors cursor-pointer text-left"
                          >
                            <Heart size={14} className="text-[#D4AF37]" />
                            <span>Royal Wishlist ({wishlistCount})</span>
                          </button>
                        </div>

                        {/* Sign Out */}
                        <div className="pt-1.5 mt-1.5 border-t border-white/10">
                          <button
                            onClick={() => {
                              onLogout();
                              setProfileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-300 hover:text-rose-200 hover:bg-rose-950/30 text-xs transition-colors cursor-pointer text-left"
                          >
                            <LogOut size={14} />
                            <span>Sign Out of Maison</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Guest View */
                      <div className="p-2 space-y-2">
                        <div className="px-2 py-1 text-center">
                          <div className="font-serif text-sm text-[#FAF7F0]">Maison Ruméra Patron</div>
                          <div className="text-[11px] text-white/60">Sign in to track orders & claim reserves</div>
                        </div>
                        <button
                          onClick={() => {
                            onNavigate('login');
                            setProfileMenuOpen(false);
                          }}
                          className="w-full py-2 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-black font-bold text-xs uppercase tracking-wider text-center transition-colors cursor-pointer"
                        >
                          Sign In / Register
                        </button>
                        <button
                          onClick={() => {
                            onNavigate('order-tracking');
                            setProfileMenuOpen(false);
                          }}
                          className="w-full py-2 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/90 text-xs text-center transition-colors cursor-pointer"
                        >
                          Track Your Order
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist Heart Icon with Gold Badge */}
              <button
                onClick={() => onNavigate('wishlist')}
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-[#D4AF37] hover:bg-white/[0.06] border border-transparent hover:border-[#D4AF37]/30 transition-all cursor-pointer"
                title="Royal Wishlist"
                aria-label="Wishlist"
              >
                <Heart size={17} className="text-[#D4AF37]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-gradient-to-r from-[#F8E7BE] to-[#D4AF37] text-[#060B08] text-[9.5px] font-black flex items-center justify-center shadow-[0_0_8px_rgba(212,175,55,0.7)]">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Haute Parfumerie Shopping Bag Pill */}
              <button
                onClick={onOpenCart}
                className="rumera-cart-pill"
                title="View Shopping Cart"
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={16} className="text-[#D4AF37]" />
                <span className="rumera-cart-badge">{cartCount}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROYAL SEARCH BAR EXPANDABLE MODAL / DROPDOWN
          ========================================================================= */}
      {searchOpen && (
        <div className="bg-[#0B1613] border-b border-[#D4AF37]/35 py-6 px-4 shadow-[0_15px_40px_rgba(0,0,0,0.7)] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-[720px] mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex gap-3">
              <div className="relative flex-1 flex items-center">
                <Search size={17} className="absolute left-4 text-[#D4AF37] pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by note (Assam Oud, Rose, Amber, Musk) or product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 bg-[#12221D] border border-[#D4AF37]/50 focus:border-[#D4AF37] text-[#FAF7F0] placeholder:text-white/40 rounded-full outline-none text-sm shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-all"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setLiveResults([]);
                    }}
                    className="absolute right-3.5 text-white/50 hover:text-white p-1"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-[#E5C158] text-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
              >
                Search
              </button>
            </form>

            {/* Trending Quick Search Chips */}
            <div className="flex items-center gap-2 mt-3.5 flex-wrap">
              <span className="text-[11px] text-[#8E9E96] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={11} className="text-[#D4AF37]" />
                <span>Trending:</span>
              </span>
              {['Assam Oud', 'Rooh Gulab', 'White Musk', 'Shamama', 'Gift Coffret'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickTagClick(tag)}
                  className="text-[11px] text-[#FAF7F0] bg-white/[0.05] hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 hover:border-[#D4AF37] px-3 py-1 rounded-full transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Live Search Instant Preview Dropdown */}
            {searchQuery.trim().length >= 2 && (
              <div className="mt-3.5 bg-[#12221D] rounded-2xl border border-[#D4AF37]/40 p-3 shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
                <div className="text-[10px] tracking-[0.14em] uppercase text-[#D4AF37] font-bold px-2 pb-2 border-b border-[#D4AF37]/20">
                  {liveSearching ? 'Searching Royal Vault...' : liveResults.length > 0 ? `Matching Creations (${liveResults.length})` : 'No direct matches found'}
                </div>

                {liveResults.length > 0 ? (
                  <div className="flex flex-col gap-1.5 mt-2">
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
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={itemImg}
                              alt={item.name}
                              className="w-10 h-11 object-contain bg-[#091210] rounded-md border border-[#D4AF37]/30 p-1"
                            />
                            <div>
                              <div className="text-sm font-semibold text-[#FAF7F0] font-serif">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-white/50">
                                {item.category?.name || 'Haute Concentré'} • {item.concentration}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#E8CA89] font-serif">
                              ₹{Number(price).toLocaleString('en-IN')}
                            </span>
                            <ArrowUpRight size={14} className="text-[#D4AF37]" />
                          </div>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="mt-1 p-2 text-center text-xs text-[#D4AF37] hover:underline cursor-pointer"
                    >
                      View all results for "{searchQuery}" in Collection →
                    </button>
                  </div>
                ) : !liveSearching && (
                  <div className="p-4 text-center text-xs text-white/60">
                    Press <strong>Search</strong> to explore the full collection for "{searchQuery}".
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SLIDE-OUT LUXURY MOBILE / TABLET DRAWER MENU (< xl)
          ========================================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[1200] xl:hidden">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="fixed top-0 left-0 bottom-0 w-[300px] sm:w-[340px] bg-[#0A100E] border-r border-[#D4AF37]/25 p-6 flex flex-col justify-between overflow-y-auto z-[1210] shadow-[10px_0_40px_rgba(0,0,0,0.85)] animate-in slide-in-from-left duration-250">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-5 border-b border-[#D4AF37]/20">
                <div className="flex items-center gap-3">
                  <div className="rumera-emblem-medallion p-1.5">
                    <img
                      src="/images/rumera_crest_emblem.png"
                      alt="Ruméra"
                      className="h-7 w-auto object-contain filter drop-shadow-[0_2px_6px_rgba(212,175,55,0.6)] brightness-110"
                    />
                  </div>
                  <div>
                    <span className="rumera-wordmark-gold text-lg block leading-none">
                      RUMÉRA
                    </span>
                    <span className="text-[7.5px] tracking-[0.26em] uppercase text-[#D4AF37] font-semibold mt-1 block">
                      The Fragrance of Royalty
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors"
                  aria-label="Close Menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links inside drawer */}
              <div className="py-6 space-y-4">
                {[
                  { label: 'The House', route: 'home' },
                  { label: 'The Collection', route: 'shop' },
                  { label: 'Vintage Dehn Al Oud', route: 'shop', params: { category: 'dehn-al-oud' } },
                  { label: 'Founder Profile & Story', route: 'owner' },
                  { label: 'Kannauj & Assam Heritage', route: 'about' }
                ].map((link) => (
                  <button
                    key={link.label}
                    onClick={() => {
                      onNavigate(link.route, link.params || {});
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left font-serif text-lg text-[#FAF7F0] hover:text-[#D4AF37] transition-colors py-1 block"
                  >
                    {link.label}
                  </button>
                ))}

                {/* Free Sample Drawer Pill */}
                <button
                  onClick={() => {
                    onNavigate('free-sample');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#D4AF37] text-black font-bold text-xs tracking-wider uppercase shadow-[0_0_15px_rgba(212,175,55,0.3)] mt-4"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={14} className="text-black" />
                    <span>Claim Free Perfume Sample</span>
                  </span>
                  <ArrowRight size={14} className="text-black" />
                </button>

                {/* Track Order */}
                <button
                  onClick={() => {
                    onNavigate('order-tracking');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-xs tracking-widest uppercase text-white/70 hover:text-white py-2 block"
                >
                  Track Your Order
                </button>

                {/* Super Admin Switcher if staff */}
                {isStaff && (
                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs font-bold uppercase tracking-wider text-left mt-2"
                  >
                    <Shield size={14} className="text-emerald-400" />
                    <span>Access ERP Admin Dashboard</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Concierge Contact */}
            <div className="pt-4 border-t border-[#D4AF37]/20 space-y-2.5">
              <div className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                Royal Concierge Helpline
              </div>
              <a
                href="tel:+919305988767"
                className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.04] text-xs text-[#FAF7F0] hover:text-[#D4AF37] transition-colors"
              >
                <Phone size={13} className="text-[#D4AF37]" />
                <span>+91 9305988767</span>
              </a>
              <a
                href="mailto:ruviansari144@gmail.com"
                className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.04] text-xs text-white/70 hover:text-white transition-colors"
              >
                <Mail size={13} className="text-[#D4AF37]" />
                <span>ruviansari144@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
