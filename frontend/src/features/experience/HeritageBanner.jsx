import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Droplets, ShieldCheck, Compass, Sparkles, Award } from 'lucide-react';

const CRAFT_VALUES = [
  {
    icon: Flame,
    title: 'Wood-Fired Copper Degs',
    subtitle: 'Ceremonial Hydro-Distillation',
    desc: 'Botanicals and aged agarwood roots simmer in antique beaten copper cauldrons, sealed airtight with wet river clay and calotropis ropes as practiced since the Mughal courts.'
  },
  {
    icon: Droplets,
    title: 'Submerged Bhapka Condensers',
    subtitle: 'Cool Water Basin Extraction',
    desc: 'Vapors travel through bamboo chonga pipes into long-necked copper receivers submerged in cold water baths, patiently absorbing the fragrant vapors into pure sandalwood oil.'
  },
  {
    icon: ShieldCheck,
    title: 'Kuppi Solar Maturation',
    subtitle: 'Camel-Hide Dehydration',
    desc: 'The distilled attar is decanted into traditional porous camel-hide leather flasks (kuppis) and solar-matured on temple terraces, naturally releasing moisture to concentrate pure sillage.'
  }
];

export default function HeritageBanner() {
  return (
    <section className="py-24 bg-[#070C0A] text-[#FAF7F0] relative overflow-hidden border-t border-[#D4AF37]/20">
      {/* Background Volumetric Gradients */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Editorial Eyebrow & Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#E8CA89] bg-[#D4AF37]/15 border border-[#D4AF37]/30 mb-3">
            <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
            Imperial Awadh Atelier
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#FAF7F0] font-normal tracking-tight mb-4">
            The Living Art of Deg-Bhapka
          </h2>
          <p className="text-[#8E9B94] text-sm sm:text-base leading-relaxed">
            While contemporary perfume relies on petrochemical solvents and denatured alcohols,
            Maison Ruméra remains faithful to the 400-year-old alchemical traditions of Kannauj.
          </p>
        </div>

        {/* 3 Glassmorphic Heritage Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {CRAFT_VALUES.map((craft, idx) => {
            const Icon = craft.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-2xl p-7 lg:p-8 bg-[#0D1512]/80 border border-[#D4AF37]/25 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.6)] flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/35 flex items-center justify-center text-[#D4AF37] mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block mb-1">
                    {craft.subtitle}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FAF7F0] mb-3">
                    {craft.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8E9B94] leading-relaxed">
                    {craft.desc}
                  </p>
                </div>

                <div className="pt-5 mt-6 border-t border-[#D4AF37]/15 flex items-center justify-between text-[11px] text-[#E8CA89]">
                  <span className="font-serif italic">100% Authentic Indian Craft</span>
                  <span className="font-mono">Purity Guaranteed</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
