import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Check, ShoppingBag, Sparkles, Heart } from 'lucide-react';
import LuxuryFlaconRender from './LuxuryFlaconRender';

const AVAILABLE_ATTARS = [
  { id: 'amber-raj', name: 'Amber Raj', family: 'Saffron & Rose Extrait', price: 1600, img: '/images/showcase/royal_amber_flacon.jpg' },
  { id: 'velvet-royale', name: 'Velvet Royale', family: 'Wild Assam Oud', price: 1700, img: '/images/showcase/royal_emerald_flacon.jpg' },
  { id: 'white-gulab', name: 'White Gulab', family: 'Kannauj Morning Rose', price: 1500, img: '/images/showcase/artisanal_gold_cage_front.jpg' },
  { id: 'kannauj-noir', name: 'Kannauj Noir', family: 'Ruh Khus & Shamama', price: 1600, img: '/images/showcase/artisanal_gold_cage_angle.jpg' },
  { id: 'kashmiri-saffron', name: 'Kashmiri Saffron', family: 'Solar Spice Concentrate', price: 1700, img: '/images/showcase/royal_sapphire_flacon.jpg' }
];

export default function GiftBoxCustomizer({ onAddToCart = () => {} }) {
  const [selectedSlots, setSelectedSlots] = useState([
    AVAILABLE_ATTARS[0],
    AVAILABLE_ATTARS[1],
    AVAILABLE_ATTARS[2]
  ]);
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);
  const [calligraphyCard, setCalligraphyCard] = useState('For my beloved — with eternal love and royal memories.');
  const [added, setAdded] = useState(false);

  const handleSelectAttar = (attar) => {
    const updated = [...selectedSlots];
    updated[activeSlotIndex] = attar;
    setSelectedSlots(updated);
  };

  const totalPrice = 4800; // Curated trio coffret price matching video

  const handleAddCoffret = () => {
    setAdded(true);
    if (onAddToCart) {
      onAddToCart('gift-coffret-trio');
    }
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F8F5EE] border-t border-[#EAE4D9] select-none">
      <div className="max-w-6xl mx-auto">
        {/* Header matching frame_05 */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/12 text-[#9A7B38] text-[11px] font-bold tracking-[0.22em] uppercase mb-3">
            <Gift className="w-3.5 h-3.5 text-[#C5A059]" />
            The Gift Atelier
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1B1A] font-normal tracking-tight mb-2">
            Build a box they <span className="italic font-light text-[#9A7B38]">will remember</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#635F59]">
            Choose three 12ml travel flacons. Enclosed in a gold-embossed coffret, tied by hand with satin ribbon, and personalized with custom calligraphy.
          </p>
        </div>

        {/* Customizer Grid matching frame_05 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Visual Gift Box with 3 bottles & gold ribbon */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative w-full max-w-[440px] aspect-[4/3] rounded-3xl bg-white border border-[#EAE4D9] p-8 shadow-[0_20px_50px_rgba(40,30,15,0.08)] flex items-center justify-center">
              {/* Golden Ribbon Bow Over Box */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#C5A059] text-white text-[10px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5 z-20">
                <Sparkles className="w-3 h-3 text-[#FFF2D1]" />
                <span>Hand-Tied Gold Satin Ribbon</span>
              </div>

              {/* 3 Bottles Displayed Inside Box */}
              <div className="grid grid-cols-3 gap-4 w-full h-[200px] items-end justify-items-center">
                {selectedSlots.map((item, idx) => (
                  <motion.div
                    key={`${item.id}-${idx}`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="w-[85px] h-[120px]">
                      <LuxuryFlaconRender
                        imageUrl={item.img}
                        scentName={item.name}
                        className="w-full h-full"
                      />
                    </div>
                    <span className="font-serif text-xs font-semibold text-[#1C1B1A] mt-2 truncate max-w-[90px]">
                      {item.name}
                    </span>
                    <span className="text-[9px] text-[#8C8477] uppercase tracking-wider">
                      12 ml Flacon
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Selectors & Calligraphy Card matching frame_05 */}
          <div className="lg:col-span-6 space-y-6">
            {/* Slot Selector Tabs */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest font-bold text-[#8C8477] mb-2.5">
                Select Flacon Slot to Customize:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[0, 1, 2].map((slotIdx) => (
                  <button
                    key={slotIdx}
                    onClick={() => setActiveSlotIndex(slotIdx)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      activeSlotIndex === slotIdx
                        ? 'bg-white border-[#C5A059] shadow-md ring-1 ring-[#C5A059]'
                        : 'bg-white/60 border-[#EAE4D9] hover:bg-white'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-bold text-[#9A7B38]">
                      Slot 0{slotIdx + 1}
                    </div>
                    <div className="font-serif text-sm font-semibold text-[#1C1B1A] truncate">
                      {selectedSlots[slotIdx]?.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fragrance Options */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest font-bold text-[#8C8477] mb-2.5">
                Available Artisanal Attars:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AVAILABLE_ATTARS.map((attar) => {
                  const isChosen = selectedSlots[activeSlotIndex]?.id === attar.id;
                  return (
                    <button
                      key={attar.id}
                      onClick={() => handleSelectAttar(attar)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isChosen
                          ? 'bg-white border-[#C5A059] shadow-sm ring-1 ring-[#C5A059]'
                          : 'bg-white/60 border-[#EAE4D9] hover:bg-white'
                      }`}
                    >
                      <div>
                        <div className="font-serif text-xs sm:text-sm font-semibold text-[#1C1B1A]">
                          {attar.name}
                        </div>
                        <div className="text-[10px] text-[#8C8477]">
                          {attar.family}
                        </div>
                      </div>
                      {isChosen && <Check className="w-4 h-4 text-[#C5A059]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Complimentary Calligraphy Card Input matching frame_05 */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest font-bold text-[#8C8477] mb-2">
                Complimentary Calligraphy Inscription:
              </label>
              <textarea
                value={calligraphyCard}
                onChange={(e) => setCalligraphyCard(e.target.value)}
                placeholder="Enter your personal gift message to be written with gold calligraphy ink..."
                rows={2}
                className="w-full p-3.5 bg-white border border-[#EAE4D9] focus:border-[#C5A059] rounded-xl text-xs sm:text-sm text-[#1C1B1A] font-serif italic outline-none shadow-sm transition-all resize-none"
              />
            </div>

            {/* Add to Bag Action Button matching frame_05 */}
            <button
              onClick={handleAddCoffret}
              className="w-full py-4 px-6 rounded-full bg-[#1C1B1A] hover:bg-black text-white text-xs font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(0,0,0,0.15)] cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
              <span>
                {added ? 'Coffret Added to Bag!' : `Add Bespoke Box to Bag — ₹${totalPrice.toLocaleString('en-IN')}`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
