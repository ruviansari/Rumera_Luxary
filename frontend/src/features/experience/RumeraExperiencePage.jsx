import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, Sparkles, Gift, Search, Menu, X, ArrowUpRight } from 'lucide-react';
import HeroScrollStage from './HeroScrollStage';
import OlfactoryTimeline from './OlfactoryTimeline';
import CollectionGrid from './CollectionGrid';
import TopShelfList from './TopShelfList';
import GiftBoxCustomizer from './GiftBoxCustomizer';
import PatronReviews from './PatronReviews';
import VIPCircleFooter from './VIPCircleFooter';

export default function RumeraExperiencePage({
  onNavigate = () => {},
  onAddToCart = () => {},
  onOpenCart = () => {},
  cartCount = 0
}) {
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [bottomBarDismissed, setBottomBarDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolledPastHero(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1C1B1A] font-sans antialiased overflow-x-hidden selection:bg-[#C5A059]/30 selection:text-black">
      {/* =========================================================================
          TOP ANNOUNCEMENT RIBBON & LUXURY TRANSLUCENT NAVBAR (Matching KAJU Video)
         ========================================================================= */}
      {/* 1. Slim Top Bar */}
      <div className="bg-[#1C1B1A] text-[11px] tracking-[0.16em] uppercase text-[#E8CA89] h-8 flex items-center px-4 sm:px-8 border-b border-white/10 select-none">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span>👑 MAISON RUMÉRA</span>
            <span className="text-white/20">•</span>
            <span className="hidden sm:inline text-white/80">THE FRAGRANCE OF ROYALTY</span>
          </div>
          <div className="flex items-center gap-4 text-white/70">
            <span className="hidden md:inline">FOUNDER: ER. RUMANA ANSARI</span>
            <span className="hidden md:inline text-white/20">|</span>
            <span className="text-[#E8CA89] font-semibold">+91 9305988767</span>
          </div>
        </div>
      </div>

      {/* 2. Glassmorphic Sticky Header matching video */}
      <header
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 border-b select-none ${
          scrolledPastHero
            ? 'bg-[#FAF8F4]/95 backdrop-blur-md border-[#EAE4D9] py-3.5 shadow-[0_4px_25px_rgba(40,30,15,0.06)]'
            : 'bg-[#FAF8F4]/80 backdrop-blur-sm border-[#EAE4D9]/60 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-xs font-semibold text-[#1C1B1A] transition-all"
              title="Return to Main Storefront"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#9A7B38] transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline uppercase text-[10px] tracking-wider font-bold">Storefront</span>
            </button>

            <div
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <img
                src="/images/rumera_crest_emblem.png"
                alt="Ruméra Insignia"
                className="h-8 w-auto object-contain filter drop-shadow-xs"
              />
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl tracking-[0.2em] text-[#1C1B1A] font-bold leading-none">
                  RUMÉRA
                </span>
                <span className="text-[8px] tracking-[0.25em] uppercase text-[#9A7B38] font-bold mt-0.5">
                  Haute Parfumerie
                </span>
              </div>
            </div>
          </div>

          {/* Center Links matching video */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-[0.18em] text-[#4A4640]">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-[#1C1B1A] cursor-pointer">
              The Flacon
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('the-archives');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#1C1B1A] cursor-pointer"
            >
              The Archives
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('top-shelf');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#1C1B1A] cursor-pointer"
            >
              Top Shelf
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('gift-atelier');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-[#1C1B1A] cursor-pointer"
            >
              Gift Atelier
            </button>
          </nav>

          {/* Right Action Icons matching video */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('free-sample')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] tracking-[0.14em] font-bold uppercase whitespace-nowrap bg-[#D4AF37] text-black hover:bg-[#E5C158] transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-black" />
              <span>Free Sample</span>
            </button>

            {onOpenCart && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EAE4D9] text-[#1C1B1A] hover:border-[#C5A059] transition-colors cursor-pointer shadow-xs"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-4 h-4 text-[#9A7B38]" />
                <span className="text-xs font-bold">{cartCount}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN LANDING PAGE SECTIONS (EXACT ORDER FROM KAJU VIDEO DEMO)
         ========================================================================= */}
      <main>
        {/* SECTION 1 & 2: Hero Stage (Travertine Pedestal + Center 3-Note Cards) */}
        <HeroScrollStage onAddToCart={() => onAddToCart('amber-raj')} />

        {/* SECTION 3: Olfactory Evolution & Longevity Timeline matching frame_02 */}
        <OlfactoryTimeline />

        {/* SECTION 4: The Archives (5 Arched Alcoves matching frame_03) */}
        <div id="the-archives">
          <CollectionGrid onQuickAdd={(id) => onAddToCart(id)} onNavigate={onNavigate} />
        </div>

        {/* SECTION 5: The Top Shelf Interactive Split-View matching frame_04 */}
        <div id="top-shelf">
          <TopShelfList onQuickAdd={(id) => onAddToCart(id)} onNavigate={onNavigate} />
        </div>

        {/* SECTION 6: The Gift Atelier Bespoke Box Customizer matching frame_05 */}
        <div id="gift-atelier">
          <GiftBoxCustomizer onAddToCart={(id) => onAddToCart(id)} />
        </div>

        {/* SECTION 7: Patron Reviews Stack matching frame_15 */}
        <PatronReviews />

        {/* SECTION 8: VIP Circle & House Registry Minimalist Ivory Footer */}
        <VIPCircleFooter onNavigate={onNavigate} />
      </main>

      {/* =========================================================================
          FLOATING STICKY BOTTOM BAR (Present Across All Frames in Video!)
         ========================================================================= */}
      {!bottomBarDismissed && (
        <aside
          aria-label="Quick Add to Bag"
          className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-[640px] px-4 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#181816]/95 backdrop-blur-md text-white border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.35)] flex items-center justify-between gap-3 sm:gap-6 animate-in slide-in-from-bottom-5 duration-300"
        >
          {/* Left: Product Thumbnail & Name */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#2A2A28] border border-white/15 flex items-center justify-center p-0.5">
              <img
                src="/images/showcase/royal_amber_flacon.jpg"
                alt="Amber Raj"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <div className="font-serif text-xs sm:text-sm font-bold text-white leading-tight">
                Amber Raj
              </div>
              <div className="text-[10px] text-white/50 leading-none mt-0.5">
                50 ml Royal Extrait
              </div>
            </div>
          </div>

          {/* Center: Free Delivery / Sample tag (Hidden on small mobile) */}
          <div className="hidden sm:flex flex-col text-center">
            <span className="text-[10px] text-[#E8CA89] font-semibold uppercase tracking-wider">
              Free Express Courier
            </span>
            <span className="text-[9px] text-white/40">
              2 Free Discovery Samples Included
            </span>
          </div>

          {/* Right: Quick Add CTA Button matching video */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onAddToCart('amber-raj')}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A] font-extrabold text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-black" />
              <span>Add • ₹8,500</span>
            </button>

            <button
              onClick={() => setBottomBarDismissed(true)}
              className="text-white/40 hover:text-white p-1"
              aria-label="Dismiss quick bar"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
