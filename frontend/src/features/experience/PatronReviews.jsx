import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    author: 'Ayesha Khan',
    location: 'Mumbai • Verified Patron',
    flacon: 'Amber Raj (50ml Extrait)',
    quote: 'Amber Raj lasted all day on me. People kept asking what I was wearing in our royal palace gala. The saffron opening is simply transcendent.',
    rating: 5
  },
  {
    id: 2,
    author: 'Vikramaditya S.',
    location: 'Jaipur • Serialized Collector',
    flacon: 'Velvet Royale Extrait',
    quote: 'Beautiful heavy flacon and a warm, aristocratic drydown. Will definitely invest in the travel trio next.',
    rating: 5
  },
  {
    id: 3,
    author: 'Dr. Zoya Farooqui',
    location: 'New Delhi • Master Fragrance Reviewer',
    flacon: 'White Gulab Pure Rooh',
    quote: 'True Kannauj morning hydro-distillation. The rose smells like fresh morning dewdrops on Damascena petals, without a single synthetic harshness.',
    rating: 5
  }
];

export default function PatronReviews() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F8F5EE] border-t border-[#EAE4D9] select-none">
      <div className="max-w-5xl mx-auto">
        {/* Header matching frame_15 */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/12 text-[#9A7B38] text-[11px] font-bold tracking-[0.22em] uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            Voices of the Inner Circle
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1B1A] font-normal tracking-tight mb-2">
            What our patrons say
          </h2>
          <p className="text-xs sm:text-sm text-[#635F59]">
            Authenticated testimonials from verified collectors and patrons across India.
          </p>
        </div>

        {/* 3 Review Cards matching frame_15 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white border border-[#EAE4D9] shadow-[0_12px_35px_rgba(40,30,15,0.04)] flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 mb-4 text-[#C5A059]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C5A059]" />
                  ))}
                </div>

                <p className="font-serif text-sm sm:text-base text-[#1C1B1A] italic leading-relaxed mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#F2ECE1]">
                <div className="font-semibold text-xs text-[#1C1B1A]">
                  {t.author}
                </div>
                <div className="text-[11px] text-[#8C8477]">
                  {t.location}
                </div>
                <div className="text-[10px] text-[#9A7B38] font-medium mt-1">
                  {t.flacon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
