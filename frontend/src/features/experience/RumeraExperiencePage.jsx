import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingBag, Sparkles, Compass, Gift, Layers, ShieldCheck } from 'lucide-react';
import HeroScrollStage from './HeroScrollStage';
import CollectionGrid from './CollectionGrid';
import TopShelfList from './TopShelfList';
import GiftBoxCustomizer from './GiftBoxCustomizer';
import HeritageBanner from './HeritageBanner';
import VIPCircleFooter from './VIPCircleFooter';

export default function RumeraExperiencePage({
  onNavigate = () => {},
  onAddToCart = () => {},
  onOpenCart = () => {},
  cartCount = 0
}) {
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolledPastHero(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAF7F0] selection:bg-[#D4AF37]/30 selection:text-[#FAF7F0] font-sans antialiased overflow-x-hidden">
      {/* FLOATING LUXURY IMMERSIVE HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolledPastHero
            ? 'bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#D4AF37]/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Left: Return to Storefront */}
          <button
            onClick={() => onNavigate('home')}
            className="group flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-[#D4AF37]/15 border border-[#D4AF37]/25 hover:border-[#D4AF37] text-xs font-semibold tracking-wider text-[#FAF7F0] transition-all duration-300"
            title="Return to Main Storefront"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37] transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="hidden sm:inline uppercase text-[11px] font-bold">Return to Storefront</span>
            <span className="sm:hidden text-[11px] font-bold uppercase">Store</span>
          </button>

          {/* Center: Maison Brand Crest & Title */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer select-none group"
            title="Maison Ruméra 3D Interactive Atelier"
          >
            <img
              src="/images/rumera_crest_emblem.png"
              alt="Ruméra Insignia"
              className="h-7 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(212,175,55,0.5)] transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col text-center">
              <span className="font-serif text-lg tracking-[0.22em] text-[#FAF7F0] font-normal leading-none">
                RUMÉRA
              </span>
              <span className="text-[9px] tracking-[0.3em] uppercase text-[#D4AF37] font-semibold mt-0.5">
                Interactive Atelier
              </span>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('bespoke-customizer-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#E8CA89] text-[11px] font-bold tracking-wider uppercase transition-all duration-200"
            >
              <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Coffret Customizer</span>
            </button>

            {onOpenCart && (
              <button
                onClick={onOpenCart}
                className="relative p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-[#D4AF37]/30 text-[#FAF7F0] transition-colors duration-200"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-black text-[10px] font-black flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 1. CORE SCROLL-LINKED SEQUENCE (3-STAGE CONTINUOUS ANIMATION) */}
      {/* Stage 1 (Hero) -> Stage 2 (Fragrance Pyramid) -> Stage 3 (Settles in Gift Box) */}
      <main>
        <HeroScrollStage onAddToCart={onAddToCart} />

        {/* 2. SECTION: CURATED COLLECTION SHOWCASE ("Find the One That Feels Like You") */}
        <div id="curated-collection-section">
          <CollectionGrid onQuickAdd={onAddToCart} onNavigate={onNavigate} />
        </div>

        {/* 3. SECTION: INTERACTIVE TOP SHELF LIST (Split-View Dynamic Showcase) */}
        <div id="top-shelf-section">
          <TopShelfList onQuickAdd={onAddToCart} onNavigate={onNavigate} />
        </div>

        {/* 4. SECTION: BESPOKE GIFT BOX BUILDER (Interactive 3-slot coffret) */}
        <div id="bespoke-customizer-section">
          <GiftBoxCustomizer onAddToCart={onAddToCart} />
        </div>

        {/* 5. SECTION: HERITAGE & CRAFT BANNER (Kannauj Deg-Bhapka hydro-distillation) */}
        <HeritageBanner />

        {/* 6. SECTION: FOOTER & VIP INNER CIRCLE */}
        <VIPCircleFooter onNavigate={onNavigate} />
      </main>
    </div>
  );
}
