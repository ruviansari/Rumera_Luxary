import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShoppingBag, ShieldCheck, Star, Droplets, Award } from 'lucide-react';

const TOP_SHELF_ITEMS = [
  {
    id: 'ts-1',
    num: '01',
    name: 'Ruméra White Oud Extrait',
    category: 'Master Perfumer Serialized Reserve',
    volume: '50 ml Royal Extrait',
    price: 8900,
    rating: 4.98,
    image: '/images/rumera_white_oud_hero.jpg',
    leadNotes: 'Aged Wild Assam Oud • White Ambergris • Mysore Teak',
    story: 'The crowning masterpiece formulated personally by Master Perfumer Er. Rumana Ansari. Hand-blended in antique sandalwood vats and certified on pulse points.',
    longevity: '24+ Hours Solid Sillage',
    craft: '24K Gold Multifaceted Crystal Flacon'
  },
  {
    id: 'ts-2',
    num: '02',
    name: 'Shamama Shahi 1984',
    category: 'Awadhi Golden Vault Edition',
    volume: '10 ml Concentré',
    price: 3600,
    rating: 4.95,
    image: '/images/showcase/royal_amber_flacon.jpg',
    leadNotes: '30-Year Ambergris • Wild Civet Accord • Roasted Botanicals',
    story: 'Distilled in antique copper cauldrons with pure golden ambergris and ceremonial spices according to the 19th-century royal court recipe.',
    longevity: '18–20 Hours Warm Radiance',
    craft: 'Octagonal Beveled Crystal with Crown Cap'
  },
  {
    id: 'ts-3',
    num: '03',
    name: 'Emerald Imperial Extrait',
    category: '24K Crown Emerald Reserve',
    volume: '12 ml Pure Extrait',
    price: 3899,
    rating: 5.0,
    image: '/images/showcase/royal_emerald_flacon.jpg',
    leadNotes: 'Wild Assam Dehn Al Oud • Mysore Sandalwood • Taif Rose',
    story: 'Handcrafted green emerald crystal encased in solid gold filigree, housing concentrated non-alcoholic Dehn Al Oud matured over a full decade.',
    longevity: '24 Hours Intimate Scent Aura',
    craft: 'Solid Gold Filigree & Emerald Dome Finial'
  },
  {
    id: 'ts-4',
    num: '04',
    name: 'Sultani Gold Cage Flacon',
    category: 'Artisanal Filigree Atelier',
    volume: '6 ml Pure Attar',
    price: 2499,
    rating: 4.92,
    image: '/images/showcase/artisanal_gold_cage_front.jpg',
    leadNotes: 'Kannauj Rooh Motia • Indian Jasmine Sambac • Vintage Vetiver',
    story: 'A hand-wrought golden cage reminiscent of royal palace jali screens. Holds 100% pure steam-distilled floral rooh hydro-distilled in Kannauj.',
    longevity: '14–16 Hours Delicate Bloom',
    craft: 'Gilded Mughal Jali Lattice Cage'
  }
];

export default function TopShelfList({ onQuickAdd = null }) {
  const [activeItem, setActiveItem] = useState(TOP_SHELF_ITEMS[0]);

  return (
    <section className="py-24 bg-[#080D0B] text-[#FAF7F0] relative overflow-hidden border-t border-[#D4AF37]/20">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#D4AF37]/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#E8CA89] bg-[#D4AF37]/15 border border-[#D4AF37]/35 mb-2.5">
            <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
            Imperial Top Shelf
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#FAF7F0] font-normal tracking-tight">
            The Connoisseur’s Private Reserve
          </h2>
          <p className="text-[#8E9B94] text-sm sm:text-base mt-2 max-w-xl">
            Hover or tap to inspect the olfactory distillation notes, aging period, and bespoke crystal packaging.
          </p>
        </div>

        {/* Split View: Left List, Right Spotlight Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT: INTERACTIVE VERTICAL SCENT LIST */}
          <div className="lg:col-span-6 space-y-3.5">
            {TOP_SHELF_ITEMS.map((item) => {
              const isSelected = activeItem.id === item.id;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveItem(item)}
                  onClick={() => setActiveItem(item)}
                  className={`group relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#121E19]/90 border-[#D4AF37] shadow-[0_10px_30px_rgba(212,175,55,0.2)] translate-x-1 sm:translate-x-2'
                      : 'bg-[#0B1310]/70 border-[#D4AF37]/15 hover:border-[#D4AF37]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Numbered Index */}
                      <span className={`font-mono text-sm font-bold ${isSelected ? 'text-[#D4AF37]' : 'text-[#8E9B94]'}`}>
                        {item.num}
                      </span>
                      <div>
                        <h3 className={`font-serif text-lg sm:text-xl font-bold transition-colors ${
                          isSelected ? 'text-[#FAF7F0]' : 'text-[#B6C4BC] group-hover:text-[#FAF7F0]'
                        }`}>
                          {item.name}
                        </h3>
                        <p className="text-xs text-[#8E9B94] mt-0.5 font-sans">
                          {item.leadNotes}
                        </p>
                      </div>
                    </div>

                    <div className="text-right pl-3 flex-shrink-0">
                      <span className="font-mono text-sm sm:text-base font-bold text-[#D4AF37] block">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-[#A0A0A0]">
                        {item.volume}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: DYNAMIC SPOTLIGHT CARD */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-3xl bg-[#0E1714] border border-[#D4AF37]/40 p-6 sm:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden"
              >
                {/* Background Ambient Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

                {/* Top Badge & Rating */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] uppercase tracking-widest font-mono text-[#D4AF37] px-3 py-1 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/30">
                    {activeItem.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[#E8CA89] font-semibold">
                    <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                    <span>{activeItem.rating} Appraisal</span>
                  </div>
                </div>

                {/* Bottle Render Showcase */}
                <div className="relative w-full h-64 sm:h-72 my-4 flex items-center justify-center bg-[#070B09] rounded-2xl overflow-hidden border border-[#D4AF37]/20">
                  <img
                    src={activeItem.image}
                    alt={activeItem.name}
                    className="w-full h-full object-cover filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
                    onError={(e) => { e.currentTarget.src = '/images/rumera_white_oud_hero.jpg'; }}
                  />
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-[#090E0C]/90 border border-[#D4AF37]/30 text-[10px] text-[#FAF7F0] font-mono">
                    {activeItem.craft}
                  </div>
                </div>

                {/* Information Details */}
                <div className="mt-5">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF7F0]">
                      {activeItem.name}
                    </h3>
                    <span className="font-serif text-2xl font-bold text-[#D4AF37]">
                      ₹{activeItem.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#B6C4BC] leading-relaxed mb-4">
                    {activeItem.story}
                  </p>

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#D4AF37]/20 text-xs text-[#8E9B94] mb-5">
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-[#A0A0A0]">Longevity Arc</span>
                      <strong className="text-[#FAF7F0] font-medium">{activeItem.longevity}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-[#A0A0A0]">Olfactory Sillage</span>
                      <strong className="text-[#D4AF37] font-medium">100% Non-Alcoholic Oil</strong>
                    </div>
                  </div>

                  {/* Add to Bag CTA */}
                  <button
                    onClick={() => onQuickAdd ? onQuickAdd(1) : null}
                    className="w-full py-3.5 px-6 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B78B45] text-[#0A0E0C] hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)] transition-all"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#0A0E0C]" />
                    <span>Acquire {activeItem.name}</span>
                    <ArrowRight className="w-4 h-4 text-[#0A0E0C]" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
