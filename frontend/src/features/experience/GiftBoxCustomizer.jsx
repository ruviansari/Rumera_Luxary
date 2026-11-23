import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, ShoppingBag, Gift, ArrowRight, ShieldCheck, Heart, Award, RefreshCw } from 'lucide-react';

const AVAILABLE_ATTARS = [
  { id: 'oud-assam', name: 'Royal Oud Al Assam', family: 'Pure Agarwood Extrait', price: 3899, img: '/images/showcase/royal_emerald_flacon.jpg' },
  { id: 'gulab-khas', name: 'Gulab-e-Khas Ruh Gulab', family: 'Kannauj Hydro-Distilled Rose', price: 2899, img: '/images/showcase/artisanal_gold_cage_front.jpg' },
  { id: 'ruh-khus', name: 'Ruh Khus Imperial', family: 'Copper Still Wild Vetiver', price: 2599, img: '/images/showcase/artisanal_gold_cage_angle.jpg' },
  { id: 'shamama', name: 'Kashmir Shamama Tul Amber', family: '42 Sacred Ayurvedic Herbs', price: 2999, img: '/images/showcase/royal_amber_flacon.jpg' },
  { id: 'white-oud', name: 'White Oud Royal Extrait', family: 'Crisp Silk Oud & Ambergris', price: 3499, img: '/images/rumera_white_oud_hero.jpg' }
];

const VELVET_COLORWAYS = [
  { id: 'obsidian', name: 'Obsidian Midnight', hex: '#0B120F', border: '#D4AF37' },
  { id: 'emerald', name: 'Imperial Awadh Emerald', hex: '#0A261E', border: '#10B981' },
  { id: 'ruby', name: 'Royal Burgundy Ruby', hex: '#2A0D14', border: '#F43F5E' }
];

export default function GiftBoxCustomizer({ onAddToCart = null }) {
  // 3 Selected Attars in the Coffret Slots
  const [selectedSlots, setSelectedSlots] = useState([
    AVAILABLE_ATTARS[0],
    AVAILABLE_ATTARS[1],
    AVAILABLE_ATTARS[2]
  ]);
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);
  const [engravedName, setEngravedName] = useState('For Ruvi Ansari — Royal Edition');
  const [velvetColor, setVelvetColor] = useState(VELVET_COLORWAYS[0]);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Compute live price (Base box ₹1,500 + sum of chosen attars with 10% coffret discount)
  const attarSubtotal = selectedSlots.reduce((acc, curr) => acc + (curr ? curr.price : 0), 0);
  const discountRate = 0.10;
  const coffretDiscount = Math.round(attarSubtotal * discountRate);
  const finalPrice = Math.max(0, attarSubtotal - coffretDiscount + 1200); // 1200 for handcrafted velvet box

  const handleSelectAttarForActiveSlot = (attar) => {
    const updated = [...selectedSlots];
    updated[activeSlotIndex] = attar;
    setSelectedSlots(updated);
  };

  const handleAddCoffretToCart = () => {
    if (onAddToCart) {
      // Create a virtual cart item bundle
      onAddToCart(selectedSlots[0]?.id || 1, 1);
    }
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3500);
  };

  return (
    <section id="bespoke-coffret-builder" className="relative py-24 bg-[#090E0C] text-[#FAF7F0] overflow-hidden border-t border-[#D4AF37]/25">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full bg-[#14231F]/40 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#E8CA89] bg-[#D4AF37]/15 border border-[#D4AF37]/30 mb-3">
            <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
            Bespoke Haute Coffret Experience
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#FAF7F0] font-normal tracking-tight mb-4">
            Curate Your Imperial Trinity Box
          </h2>
          <p className="text-[#8E9B94] text-sm sm:text-base leading-relaxed">
            Select three legendary hand-distilled attars, nestle them in handcrafted velvet,
            and immortalize your message in 24-karat gold-foil script.
          </p>
        </div>

        {/* 2-Column Split: Left = Box Visual & Slots; Right = Interactive Customizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* LEFT: LUXURY VELVET GIFT BOX RENDER */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* The Presentation Box Container */}
            <div
              className="relative w-full max-w-xl rounded-3xl p-6 sm:p-9 border border-[#D4AF37]/45 shadow-[0_30px_70px_rgba(0,0,0,0.85)] shadow-[#D4AF37]/10 transition-colors duration-500"
              style={{ backgroundColor: velvetColor.hex }}
            >
              {/* Outer Golden Trim Frame */}
              <div className="absolute inset-2 sm:inset-3 rounded-2xl border border-[#D4AF37]/35 pointer-events-none" />

              {/* Gold Ribbon Cross Overlays */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-6 bg-gradient-to-b from-[#FFF2D1] via-[#D4AF37] to-[#8C6721] rounded-b-md shadow-md z-30" />

              {/* Box Lid Header / Engraved Brass Nameplate */}
              <div className="relative z-20 text-center mb-6 pt-2">
                <div className="inline-block relative px-6 py-2.5 bg-[#070B09] border border-[#D4AF37] rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                  <span className="block text-[9px] uppercase tracking-[0.25em] text-[#D4AF37]/75 font-mono mb-0.5">
                    Maison Ruméra • Serialized Vault
                  </span>
                  <span className="font-serif italic text-sm sm:text-base text-[#FFF2D1] tracking-wide">
                    "{engravedName || 'Bespoke Patron Coffret'}"
                  </span>
                </div>
              </div>

              {/* 3 Flacon Recessed Velvet Slots */}
              <div className="grid grid-cols-3 gap-3 sm:gap-5 my-6 relative z-20">
                {selectedSlots.map((item, index) => {
                  const isActive = activeSlotIndex === index;
                  return (
                    <div
                      key={index}
                      onClick={() => setActiveSlotIndex(index)}
                      className={`relative flex flex-col items-center p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                        isActive
                          ? 'bg-[#0E1714] border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-[1.03]'
                          : 'bg-[#080D0B]/85 border border-[#D4AF37]/25 hover:border-[#D4AF37]/60'
                      }`}
                    >
                      {/* Active Slot Indicator Pin */}
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#D4AF37] text-[#0A0A0A] text-[9px] font-bold rounded-full uppercase tracking-wider">
                        Slot {index + 1}
                      </div>

                      {/* Flacon Visual */}
                      <div className="w-16 h-28 sm:w-20 sm:h-36 flex items-center justify-center my-1">
                        <img
                          src={item?.img || '/images/showcase/royal_emerald_flacon.jpg'}
                          alt={item?.name || 'Rumera Attar'}
                          className="w-full h-full object-contain filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.9)] transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => { e.currentTarget.src = '/images/rumera_white_oud_hero.jpg'; }}
                        />
                      </div>

                      {/* Attar Label in Slot */}
                      <div className="text-center w-full mt-1">
                        <p className="text-[11px] sm:text-xs font-serif font-bold text-[#FAF7F0] truncate w-full">
                          {item?.name}
                        </p>
                        <p className="text-[9px] text-[#D4AF37] tracking-wider truncate">
                          {item?.family}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Box Footer Seal */}
              <div className="flex items-center justify-between pt-3 border-t border-[#D4AF37]/20 text-[10px] text-[#A0A0A0]">
                <span>Awadh Royal Warrant • Kannauj Hydro-Distilled</span>
                <span className="text-[#D4AF37] font-semibold">3 × 12ml Concentré</span>
              </div>
            </div>

            {/* Click to switch helper pill */}
            <p className="text-xs text-[#8E9B94] mt-3 flex items-center gap-1.5 font-sans">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Tap any slot above to swap its fragrance from the selector
            </p>
          </div>

          {/* RIGHT: CONTROLS & SELECTION PANEL */}
          <div className="lg:col-span-5 flex flex-col space-y-6 bg-[#0E1513]/85 p-6 sm:p-8 rounded-2xl border border-[#D4AF37]/30 backdrop-blur-md">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-mono block mb-1">
                Customizing Slot {activeSlotIndex + 1} of 3
              </span>
              <h3 className="font-serif text-2xl text-[#FAF7F0] font-normal">
                Choose Fragrance for Slot {activeSlotIndex + 1}
              </h3>
            </div>

            {/* Available Attar Options List */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
              {AVAILABLE_ATTARS.map((attar) => {
                const isSelectedForActiveSlot = selectedSlots[activeSlotIndex]?.id === attar.id;
                return (
                  <div
                    key={attar.id}
                    onClick={() => handleSelectAttarForActiveSlot(attar)}
                    className={`flex items-center justify-between p-2.5 sm:p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelectedForActiveSlot
                        ? 'bg-[#15231E] border-[#D4AF37] shadow-sm'
                        : 'bg-[#090F0C] border-[#D4AF37]/15 hover:border-[#D4AF37]/45'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={attar.img}
                        alt={attar.name}
                        className="w-10 h-10 object-contain rounded bg-[#060A08] border border-[#D4AF37]/20 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-[#FAF7F0] truncate">
                          {attar.name}
                        </div>
                        <div className="text-[10px] text-[#8E9B94] truncate">
                          {attar.family}
                        </div>
                      </div>
                    </div>
                    <div className="text-right pl-2 flex-shrink-0">
                      <span className="text-xs font-mono font-bold text-[#E8CA89]">
                        ₹{attar.price.toLocaleString('en-IN')}
                      </span>
                      {isSelectedForActiveSlot && (
                        <div className="flex items-center gap-1 text-[9px] text-[#10B981] font-bold uppercase justify-end">
                          <Check className="w-2.5 h-2.5" /> Selected
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Velvet Lining Colorway Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#D1DDD6] uppercase tracking-wider mb-2">
                Velvet Interior Lining
              </label>
              <div className="flex gap-2.5">
                {VELVET_COLORWAYS.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVelvetColor(v)}
                    className={`flex-1 py-2 px-3 rounded-md text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                      velvetColor.id === v.id
                        ? 'border-[#D4AF37] text-[#FAF7F0] bg-[#172520] shadow-sm'
                        : 'border-[#D4AF37]/20 text-[#8E9B94] bg-[#080D0B] hover:text-[#FAF7F0]'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: v.border }} />
                    <span className="truncate">{v.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gold-Foil Nameplate Engraving Input */}
            <div>
              <label className="block text-xs font-semibold text-[#D1DDD6] uppercase tracking-wider mb-1.5">
                Gold-Foil Cartouche Inscription (Complimentary)
              </label>
              <input
                type="text"
                maxLength={45}
                value={engravedName}
                onChange={(e) => setEngravedName(e.target.value)}
                placeholder="e.g. For Ruvi Ansari — Royal Edition"
                className="w-full px-3.5 py-2.5 bg-[#080D0B] border border-[#D4AF37]/35 rounded-lg text-sm text-[#FAF7F0] focus:outline-none focus:border-[#D4AF37] font-serif tracking-wide"
              />
              <span className="text-[10px] text-[#8E9B94] mt-1 block">
                Up to 45 characters will be pressed in 24K gold leaf onto the box plaque.
              </span>
            </div>

            {/* Price Breakdown & CTA Button */}
            <div className="pt-4 border-t border-[#D4AF37]/20">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs text-[#8E9B94]">Three Flacons + Velvet Vault:</span>
                <span className="text-xs text-[#8E9B94] line-through">
                  ₹{(attarSubtotal + 1200).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-sm font-semibold text-[#FAF7F0]">Bespoke Coffret Total:</span>
                  <span className="block text-[10px] text-[#10B981] font-semibold">Includes 10% Bundle Privilege & Luxury Box</span>
                </div>
                <span className="font-serif text-2xl lg:text-3xl font-bold text-[#D4AF37]">
                  ₹{finalPrice.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAddCoffretToCart}
                className="w-full py-3.5 px-6 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] via-[#E8CA89] to-[#B78B45] text-[#0A0E0C] hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)] transition-all transform active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-[#0A0E0C]" />
                <span>{addedSuccess ? 'Bespoke Coffret Added To Bag!' : 'Reserve This Bespoke Coffret'}</span>
                <ArrowRight className="w-4 h-4 text-[#0A0E0C]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
