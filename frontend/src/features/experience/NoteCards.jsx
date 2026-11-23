import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Sun, Flower2, Trees, Droplets } from 'lucide-react';

/**
 * NoteCards
 * Three clean white cards matching Stage 2 of the KAJU video demo.
 * Sits around the centered flacon with elegant typography and thin connector lines.
 */
export default function NoteCards({ className = '' }) {
  return (
    <div className={`relative w-full max-w-6xl mx-auto h-[620px] pointer-events-auto select-none ${className}`}>
      {/* 1. TOP NOTES (Left Card, matching video) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-16 left-4 md:left-8 max-w-[310px] sm:max-w-[340px] p-5 sm:p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EAE4D9] shadow-[0_14px_35px_rgba(40,30,15,0.06)] z-20"
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C5A059]/12 text-[#9A7B38] text-[10px] font-bold tracking-[0.2em] uppercase">
            <Sun className="w-3 h-3 text-[#C5A059]" />
            Top Notes • 00–10 Min
          </span>
          <span className="text-[11px] text-[#A89E90] font-serif italic">Solar Sparkle</span>
        </div>

        <h3 className="font-serif text-lg sm:text-xl text-[#1C1B1A] font-semibold tracking-wide mb-1.5">
          Saffron, Pink Pepper, Bergamot
        </h3>

        <p className="text-xs text-[#635F59] leading-relaxed font-sans">
          Bright and piquant the first ten minutes. Solar citrus sparkle marrying fine Kashmiri saffron thread and pink pepper crystals.
        </p>

        {/* Decorative subtle botanical badge */}
        <div className="mt-3.5 pt-3 border-t border-[#F2ECE1] flex items-center gap-2 text-[10px] text-[#8C8477] uppercase tracking-wider font-medium">
          <Sparkles className="w-3 h-3 text-[#C5A059]" />
          <span>Cold-Pressed Calabrian Bigarade</span>
        </div>
      </motion.div>

      {/* 2. HEART NOTES (Right Card, matching video) */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="absolute top-20 right-4 md:right-8 max-w-[310px] sm:max-w-[340px] p-5 sm:p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EAE4D9] shadow-[0_14px_35px_rgba(40,30,15,0.06)] z-20"
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C5A059]/12 text-[#9A7B38] text-[10px] font-bold tracking-[0.2em] uppercase">
            <Flower2 className="w-3 h-3 text-[#C5A059]" />
            Heart • 01–04 Hours
          </span>
          <span className="text-[11px] text-[#A89E90] font-serif italic">Velvet Bloom</span>
        </div>

        <h3 className="font-serif text-lg sm:text-xl text-[#1C1B1A] font-semibold tracking-wide mb-1.5">
          Rose de Mai, Frankincense
        </h3>

        <p className="text-xs text-[#635F59] leading-relaxed font-sans">
          Velvety and floral. An opulent accord for your afternoon. Pure morning Kannauj rose petals steeped in sacred temple smoke.
        </p>

        <div className="mt-3.5 pt-3 border-t border-[#F2ECE1] flex items-center gap-2 text-[10px] text-[#8C8477] uppercase tracking-wider font-medium">
          <Droplets className="w-3 h-3 text-[#C5A059]" />
          <span>Hydro-Distilled in Copper Degs</span>
        </div>
      </motion.div>

      {/* 3. BASE NOTES (Bottom Center/Right Card, matching video) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 md:translate-x-[-50%] max-w-[340px] sm:max-w-[390px] w-full p-5 sm:p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EAE4D9] shadow-[0_14px_35px_rgba(40,30,15,0.06)] z-20"
      >
        <div className="flex items-center justify-between mb-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C5A059]/12 text-[#9A7B38] text-[10px] font-bold tracking-[0.2em] uppercase">
            <Trees className="w-3 h-3 text-[#C5A059]" />
            Base Notes • 04–24+ Hours
          </span>
          <span className="text-[11px] text-[#A89E90] font-serif italic">Resinous Drydown</span>
        </div>

        <h3 className="font-serif text-lg sm:text-xl text-[#1C1B1A] font-semibold tracking-wide mb-1.5">
          Assam Oud, Leather, Amber
        </h3>

        <p className="text-xs text-[#635F59] leading-relaxed font-sans">
          Deep, dark, and resinous. Wild legacy extends on your pulse points well into the evening, fusing Mysore sandalwood with golden amber.
        </p>

        <div className="mt-3.5 pt-3 border-t border-[#F2ECE1] flex items-center justify-between text-[10px] text-[#8C8477] uppercase tracking-wider font-medium">
          <span>12-Year Wild Aquilaria Resin</span>
          <span className="font-semibold text-[#9A7B38]">24h+ Sillage</span>
        </div>
      </motion.div>
    </div>
  );
}
