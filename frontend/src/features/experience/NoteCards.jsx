import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wind, Droplets, Sun, Flame, Moon, Compass, ShieldCheck } from 'lucide-react';

const FRAGRANCE_PYRAMID_DATA = {
  top: {
    tier: 'Top Notes (Head)',
    timing: 'First 15–45 Minutes',
    subtitle: 'The Radiant Solar Opening',
    icon: Sun,
    notes: [
      { name: 'Kashmir Saffron', desc: 'Hand-picked royal stigmas offering golden spiced warmth', origin: 'Pampore, Kashmir' },
      { name: 'Kannauj Damascena Rose', desc: 'Hydro-distilled petals capturing dewy dawn sweetness', origin: 'Kannauj, Awadh' },
      { name: 'Calabrian Bergamot', desc: 'Cold-pressed sunlit zest providing sparkling citrus clarity', origin: 'Reggio Calabria' }
    ],
    silage: 'Radiant & Ephemeral',
    volatility: 'High Evaporation Arc'
  },
  heart: {
    tier: 'Heart Notes (Core)',
    timing: '2 to 8 Hours',
    subtitle: 'The Imperial Noble Resonance',
    icon: Flame,
    notes: [
      { name: '12-Year Wild Assam Oud', desc: 'Aged Aquilaria agallocha with deep balsamic woodiness', origin: 'Upper Assam Forest' },
      { name: 'Baltic Golden Amber', desc: 'Warm fossilized resin accord enriched with sweet labdanum', origin: 'Historic Silk Route' },
      { name: 'Hydro-Distilled Ruh Khus', desc: 'Earth-cooled wild vetiver roots with deep emerald forest tones', origin: 'Bharatpur, Rajasthan' }
    ],
    silage: 'Monumental Projection',
    volatility: 'Medium Core Arc'
  },
  base: {
    tier: 'Base Notes (Soul)',
    timing: '12 to 24+ Hours',
    subtitle: 'The Eternal Skin Foundation',
    icon: Moon,
    notes: [
      { name: 'Mysore White Sandalwood', desc: 'Traditional steam-distilled Santalum album heartwood', origin: 'Mysore Reserve' },
      { name: 'Pure White Silk Musk', desc: 'Non-animalic velvety aura that merges with body chemistry', origin: 'Maison Atelier' },
      { name: 'Aged Patchouli & Shamama', desc: '42 sacred Indian herbs matured in copper deg-bhapka still', origin: 'Imperial Kannauj' }
    ],
    silage: 'Intimate Sillage & Memory',
    volatility: 'Ultra-Persistent Base'
  }
};

export default function NoteCards({ activeNoteTier = 'all', onSelectTier = null }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="w-full relative z-20 pointer-events-auto">
      {/* 3 Glassmorphic Note Cards in Desktop Grid / Mobile Stack */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto px-4 sm:px-6">
        {/* CARD 1: TOP NOTES */}
        <motion.div
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setHoveredCard('top')}
          onMouseLeave={() => setHoveredCard(null)}
          className={`relative rounded-2xl p-6 lg:p-7 backdrop-blur-xl transition-all duration-300 ${
            hoveredCard === 'top'
              ? 'bg-[#121B17]/85 border-[#D4AF37] shadow-[0_15px_40px_rgba(212,175,55,0.15)]'
              : 'bg-[#0E1513]/60 border-[#D4AF37]/25 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
          } border`}
          style={{ willChange: 'transform' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#E8CA89] bg-[#D4AF37]/10 border border-[#D4AF37]/30">
              <Sun className="w-3 h-3 text-[#D4AF37]" />
              {FRAGRANCE_PYRAMID_DATA.top.tier}
            </span>
            <span className="text-[11px] text-[#A0A0A0] font-mono">
              {FRAGRANCE_PYRAMID_DATA.top.timing}
            </span>
          </div>

          <h4 className="font-serif text-xl lg:text-2xl text-[#FAF7F0] font-normal mb-1">
            {FRAGRANCE_PYRAMID_DATA.top.subtitle}
          </h4>
          <p className="text-xs text-[#8E9B94] mb-5">
            The initial volatile whisper that greets the senses upon application to pulse points.
          </p>

          {/* Notes List */}
          <div className="space-y-3.5 mb-5 border-t border-[#D4AF37]/15 pt-4">
            {FRAGRANCE_PYRAMID_DATA.top.notes.map((item, idx) => (
              <div key={idx} className="group/item">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-[#FAF7F0] group-hover/item:text-[#D4AF37] transition-colors">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-[#D4AF37]/80 tracking-wider font-mono">
                    {item.origin}
                  </span>
                </div>
                <p className="text-xs text-[#B6C4BC] mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Sillage & Longevity Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#D4AF37]/15 text-[11px]">
            <span className="text-[#8E9B94]">Sillage Arc:</span>
            <span className="text-[#E8CA89] font-medium font-serif italic">
              {FRAGRANCE_PYRAMID_DATA.top.silage}
            </span>
          </div>
        </motion.div>

        {/* CARD 2: HEART NOTES */}
        <motion.div
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setHoveredCard('heart')}
          onMouseLeave={() => setHoveredCard(null)}
          className={`relative rounded-2xl p-6 lg:p-7 backdrop-blur-xl transition-all duration-300 ${
            hoveredCard === 'heart'
              ? 'bg-[#151D18]/90 border-[#D4AF37] shadow-[0_15px_40px_rgba(212,175,55,0.2)]'
              : 'bg-[#0E1513]/70 border-[#D4AF37]/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
          } border`}
          style={{ willChange: 'transform' }}
        >
          {/* Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#E8CA89] bg-[#D4AF37]/15 border border-[#D4AF37]/40">
              <Flame className="w-3 h-3 text-[#D4AF37]" />
              {FRAGRANCE_PYRAMID_DATA.heart.tier}
            </span>
            <span className="text-[11px] text-[#A0A0A0] font-mono">
              {FRAGRANCE_PYRAMID_DATA.heart.timing}
            </span>
          </div>

          <h4 className="font-serif text-xl lg:text-2xl text-[#FAF7F0] font-normal mb-1">
            {FRAGRANCE_PYRAMID_DATA.heart.subtitle}
          </h4>
          <p className="text-xs text-[#8E9B94] mb-5">
            The dignified signature body of the attar, balancing resinous smoke and golden florals.
          </p>

          {/* Notes List */}
          <div className="space-y-3.5 mb-5 border-t border-[#D4AF37]/15 pt-4">
            {FRAGRANCE_PYRAMID_DATA.heart.notes.map((item, idx) => (
              <div key={idx} className="group/item">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-[#FAF7F0] group-hover/item:text-[#D4AF37] transition-colors">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-[#D4AF37]/80 tracking-wider font-mono">
                    {item.origin}
                  </span>
                </div>
                <p className="text-xs text-[#B6C4BC] mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Sillage & Longevity Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#D4AF37]/15 text-[11px]">
            <span className="text-[#8E9B94]">Sillage Arc:</span>
            <span className="text-[#E8CA89] font-medium font-serif italic">
              {FRAGRANCE_PYRAMID_DATA.heart.silage}
            </span>
          </div>
        </motion.div>

        {/* CARD 3: BASE NOTES */}
        <motion.div
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setHoveredCard('base')}
          onMouseLeave={() => setHoveredCard(null)}
          className={`relative rounded-2xl p-6 lg:p-7 backdrop-blur-xl transition-all duration-300 ${
            hoveredCard === 'base'
              ? 'bg-[#121B17]/85 border-[#D4AF37] shadow-[0_15px_40px_rgba(212,175,55,0.15)]'
              : 'bg-[#0E1513]/60 border-[#D4AF37]/25 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
          } border`}
          style={{ willChange: 'transform' }}
        >
          {/* Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#E8CA89] bg-[#D4AF37]/10 border border-[#D4AF37]/30">
              <Moon className="w-3 h-3 text-[#D4AF37]" />
              {FRAGRANCE_PYRAMID_DATA.base.tier}
            </span>
            <span className="text-[11px] text-[#A0A0A0] font-mono">
              {FRAGRANCE_PYRAMID_DATA.base.timing}
            </span>
          </div>

          <h4 className="font-serif text-xl lg:text-2xl text-[#FAF7F0] font-normal mb-1">
            {FRAGRANCE_PYRAMID_DATA.base.subtitle}
          </h4>
          <p className="text-xs text-[#8E9B94] mb-5">
            The foundation that anchors the perfume to the wearer’s aura for a full circadian cycle.
          </p>

          {/* Notes List */}
          <div className="space-y-3.5 mb-5 border-t border-[#D4AF37]/15 pt-4">
            {FRAGRANCE_PYRAMID_DATA.base.notes.map((item, idx) => (
              <div key={idx} className="group/item">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-[#FAF7F0] group-hover/item:text-[#D4AF37] transition-colors">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-[#D4AF37]/80 tracking-wider font-mono">
                    {item.origin}
                  </span>
                </div>
                <p className="text-xs text-[#B6C4BC] mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Sillage & Longevity Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#D4AF37]/15 text-[11px]">
            <span className="text-[#8E9B94]">Sillage Arc:</span>
            <span className="text-[#E8CA89] font-medium font-serif italic">
              {FRAGRANCE_PYRAMID_DATA.base.silage}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
