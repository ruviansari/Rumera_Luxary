import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingBag, Star, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import LuxuryFlaconRender from './LuxuryFlaconRender';

const TOP_SHELF_ITEMS = [
  {
    id: 'ts-1',
    num: '01',
    name: 'Velvet Royale',
    family: 'Woody & Rose',
    concentration: 'Royal Extrait',
    volume: '50 ml',
    price: 8900,
    rating: 4.98,
    image: '/images/showcase/royal_emerald_flacon.jpg',
    leadNotes: 'Aged Wild Assam Oud • Morning Rose • Mysore Teak',
    story: 'The house signature: aged Aquilaria resins married to freshly distilled Kannauj rose petals in antique copper cauldrons.',
    longevity: '24+ Hours Solid Sillage',
    halfLife: '14 Days on Silk'
  },
  {
    id: 'ts-2',
    num: '02',
    name: 'White Gulab',
    family: 'Pure Rose Extract',
    concentration: 'Kannauj Rooh',
    volume: '12 ml',
    price: 6500,
    rating: 4.96,
    image: '/images/showcase/artisanal_gold_cage_front.jpg',
    leadNotes: 'Kannauj Rooh Motia • Indian Jasmine • White Sandalwood',
    story: 'Extracted from 40,000 hand-picked morning Damascena roses distilled at dawn along the sacred riverbanks.',
    longevity: '20+ Hours Sillage',
    halfLife: '10 Days on Silk'
  },
  {
    id: 'ts-3',
    num: '03',
    name: 'Kannauj Noir',
    family: 'Nocturnal Ambergris',
    concentration: 'Ceremonial Extrait',
    volume: '50 ml',
    price: 7400,
    rating: 4.94,
    image: '/images/showcase/artisanal_gold_cage_angle.jpg',
    leadNotes: 'Wild Vetiver (Ruh Khus) • Roasted Shamama • Smoked Amber',
    story: 'Distilled with roots harvested along Rajasthan riverbanks, tempered with 30-year aged Awadhi golden ambergris.',
    longevity: '24+ Hours Solid Sillage',
    halfLife: '18 Days on Silk'
  },
  {
    id: 'ts-4',
    num: '04',
    name: 'Kashmiri Saffron',
    family: 'Solar Spice Accord',
    concentration: 'Solar Extrait',
    volume: '50 ml',
    price: 7800,
    rating: 4.97,
    image: '/images/showcase/royal_sapphire_flacon.jpg',
    leadNotes: 'Grade-A Pampore Saffron • Sweet Cardamom • Cashmere Musk',
    story: 'Pure crimson stigma extracted under direct solar heat and decanted in unglazed terracotta jars for 100 days.',
    longevity: '22+ Hours Sillage',
    halfLife: '12 Days on Silk'
  },
  {
    id: 'ts-5',
    num: '05',
    name: 'Amber Raj',
    family: 'Royal Extrait',
    concentration: '24% Pure Extrait',
    volume: '50 ml',
    price: 8500,
    rating: 4.99,
    image: '/images/showcase/royal_amber_flacon.jpg',
    leadNotes: 'Kashmiri Saffron • Rose de Mai • Wild Assam Oud',
    story: 'Formulated personally by Master Perfumer Er. Rumana Ansari. Opens bright, blossoms into velvet, and dries down warm.',
    longevity: '24+ Hours Solid Sillage',
    halfLife: '14 Days on Silk'
  }
];

export default function TopShelfList({ onQuickAdd = () => {}, onNavigate = () => {} }) {
  const [activeItem, setActiveItem] = useState(TOP_SHELF_ITEMS[4]); // Amber Raj default matching video

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F8F5EE] border-t border-[#EAE4D9] select-none">
      <div className="max-w-6xl mx-auto">
        {/* Header matching frame_04 */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/12 text-[#9A7B38] text-[11px] font-bold tracking-[0.22em] uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            Most Loved This Season
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1B1A] font-normal tracking-tight mb-2">
            The top shelf
          </h2>
          <p className="text-xs sm:text-sm text-[#635F59]">
            Hover or select any creation to inspect olfactory architecture, sillage half-life, and reserves.
          </p>
        </div>

        {/* Split Screen Layout matching frame_04 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Numbered List */}
          <div className="lg:col-span-5 space-y-3">
            {TOP_SHELF_ITEMS.map((item) => {
              const isSelected = activeItem.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  onMouseEnter={() => setActiveItem(item)}
                  className={`p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 flex items-center justify-between ${
                    isSelected
                      ? 'bg-white border border-[#EAE4D9] shadow-[0_12px_30px_rgba(40,30,15,0.08)] translate-x-1'
                      : 'bg-transparent hover:bg-white/60 border border-transparent hover:border-[#EAE4D9]/60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`font-serif text-sm font-semibold tracking-wider ${
                      isSelected ? 'text-[#C5A059]' : 'text-[#A89E90]'
                    }`}>
                      {item.num}
                    </span>
                    <div>
                      <div className={`font-serif text-base sm:text-lg font-semibold ${
                        isSelected ? 'text-[#1C1B1A]' : 'text-[#4A4640]'
                      }`}>
                        {item.name}
                      </div>
                      <div className="text-[11px] text-[#8C8477] font-sans">
                        {item.family}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-serif text-sm sm:text-base font-bold text-[#1C1B1A]">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Spotlight Card matching frame_04 */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#EAE4D9] shadow-[0_20px_50px_rgba(40,30,15,0.08)] relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6"
                >
                  {/* Bottle Showcase */}
                  <div className="relative w-full h-[260px] flex items-center justify-center bg-[#FAF8F4] rounded-2xl border border-[#F2ECE1]">
                    <div className="w-[180px] h-[240px]">
                      <LuxuryFlaconRender
                        imageUrl={activeItem.image}
                        scentName={activeItem.name}
                        className="w-full h-full"
                      />
                    </div>
                  </div>

                  {/* Scent Info */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C5A059] bg-[#C5A059]/12 px-3 py-0.5 rounded-full">
                        {activeItem.concentration} • {activeItem.volume}
                      </span>
                      <div className="flex items-center gap-1 text-[#C5A059] text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-[#C5A059]" />
                        <span>{activeItem.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl text-[#1C1B1A] font-semibold mb-2">
                      {activeItem.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#635F59] leading-relaxed mb-4 italic font-serif">
                      "{activeItem.story}"
                    </p>

                    <div className="text-xs text-[#8C8477] font-medium mb-4">
                      <strong>Dominant Notes:</strong> {activeItem.leadNotes}
                    </div>

                    {/* Sillage & Longevity Arc */}
                    <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#F8F5EE] border border-[#EAE4D9] text-[11px] text-[#635F59] mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#C5A059]" />
                        <span>{activeItem.longevity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#C5A059]" />
                        <span>{activeItem.halfLife}</span>
                      </div>
                    </div>

                    {/* Add to Bag Button matching frame_04 */}
                    <button
                      onClick={() => onQuickAdd(activeItem.id)}
                      className="w-full py-3.5 px-6 rounded-full bg-[#1C1B1A] hover:bg-black text-white text-xs font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(0,0,0,0.15)] cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
                      <span>Add to Bag — ₹{activeItem.price.toLocaleString('en-IN')}</span>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
