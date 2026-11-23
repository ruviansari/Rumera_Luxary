import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ShieldCheck, Droplets, Sparkles, Compass } from 'lucide-react';

export default function OlfactoryTimeline() {
  const PHASES = [
    {
      num: '01',
      time: '00 – 30 MIN',
      title: 'Sovereign Opening',
      notes: 'Saffron • Pink Pepper • Calabrian Bergamot',
      desc: 'Solar citrus effervescence settles rapidly on pulse points. Kashmiri saffron thread blooms immediately upon skin contact.'
    },
    {
      num: '02',
      time: '01 – 04 HOURS',
      title: 'Imperial Bloom',
      notes: 'Rose de Mai • Frankincense Smoke',
      desc: 'Kannauj morning rose petals release a velvety, honeyed aura, intertwined with antique Awadhi incense.'
    },
    {
      num: '03',
      time: '04 – 12 HOURS',
      title: 'Royal Sillage',
      notes: '12-Yr Assam Oud • Golden Ambergris',
      desc: 'Deep resinous agarwood smoke forms an unmistakable sillage halo that announces your presence without shouting.'
    },
    {
      num: '04',
      time: '12 – 24+ HOURS',
      title: 'Skin Scent Immortelle',
      notes: 'Mysore Sandalwood • White Civet Musk',
      desc: 'Intimate, warm, and ceremonial. Fuses with your skin chemistry to leave an enduring, magnetic signature.'
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F8F5EE] border-t border-[#EAE4D9] select-none">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/12 text-[#9A7B38] text-[11px] font-bold tracking-[0.22em] uppercase mb-3">
            <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
            Time-Release Architecture
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1B1A] font-normal tracking-tight mb-3">
            Olfactory Evolution & Longevity
          </h2>
          <p className="text-xs sm:text-sm text-[#635F59] leading-relaxed">
            A high-concentration artisanal extrait formulated as a living composition. It opens bright, blossoms into velvet, and dries down warm.
          </p>
        </div>

        {/* 4 Phase Evolution Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {PHASES.map((phase, idx) => (
            <motion.div
              key={phase.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white border border-[#EAE4D9] shadow-[0_10px_30px_rgba(40,30,15,0.04)] hover:shadow-[0_16px_40px_rgba(40,30,15,0.08)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F2ECE1]">
                  <span className="text-[11px] font-bold text-[#C5A059] tracking-widest">{phase.num}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C8477] bg-[#F7F4EE] px-2.5 py-0.5 rounded-full">
                    {phase.time}
                  </span>
                </div>

                <h3 className="font-serif text-lg text-[#1C1B1A] font-semibold mb-1">
                  {phase.title}
                </h3>

                <div className="text-[11px] font-medium text-[#9A7B38] mb-2.5">
                  {phase.notes}
                </div>

                <p className="text-xs text-[#635F59] leading-relaxed">
                  {phase.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3 Metric Trust Cards matching frame_02 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-8 border-t border-[#EAE4D9]">
          <div className="p-5 rounded-2xl bg-white/70 border border-[#EAE4D9] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#C5A059]/15 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[#8C8477] font-semibold">Longevity Benchmark</div>
              <div className="text-sm font-serif font-bold text-[#1C1B1A]">24+ Hours Solid Sillage</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 border border-[#EAE4D9] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#C5A059]/15 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[#8C8477] font-semibold">Heritage Provenance</div>
              <div className="text-sm font-serif font-bold text-[#1C1B1A]">Royal Sovereign Vault</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 border border-[#EAE4D9] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#C5A059]/15 flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[#8C8477] font-semibold">Distillation Method</div>
              <div className="text-sm font-serif font-bold text-[#1C1B1A]">Deg & Bhapka Copper Stills</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
