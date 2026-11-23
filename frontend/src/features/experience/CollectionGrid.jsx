import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Sparkles, ArrowRight } from 'lucide-react';
import LuxuryFlaconRender from './LuxuryFlaconRender';

const ARCHED_ALCOVES = [
  {
    id: 'amber-raj',
    name: 'Amber Raj',
    subtitle: 'Royal Extrait',
    family: 'Saffron • Rose • Agarwood',
    price: 8500,
    comparePrice: 10500,
    badge: 'Signature',
    image: '/images/showcase/royal_amber_flacon.jpg'
  },
  {
    id: 'velvet-royale',
    name: 'Velvet Royale',
    subtitle: 'Pure Attar',
    family: 'Wild Assam Oud • Smoked Cedar',
    price: 8900,
    comparePrice: 11000,
    badge: 'Reserve',
    image: '/images/showcase/royal_emerald_flacon.jpg'
  },
  {
    id: 'white-gulab',
    name: 'White Gulab',
    subtitle: 'Kannauj Rooh',
    family: 'Morning Rose • Sandalwood',
    price: 6500,
    comparePrice: 7900,
    badge: 'Heritage',
    image: '/images/showcase/artisanal_gold_cage_front.jpg'
  },
  {
    id: 'kannauj-noir',
    name: 'Kannauj Noir',
    subtitle: 'Ceremonial Extrait',
    family: 'Wild Vetiver • Petrichor',
    price: 7400,
    comparePrice: 9200,
    badge: 'Artisanal',
    image: '/images/showcase/artisanal_gold_cage_angle.jpg'
  },
  {
    id: 'kashmiri-saffron',
    name: 'Kashmiri Saffron',
    subtitle: 'Solar Concentrate',
    family: 'Pure Saffron • Ambergris',
    price: 7800,
    comparePrice: 9500,
    badge: 'Harvest 2026',
    image: '/images/showcase/royal_sapphire_flacon.jpg'
  }
];

export default function CollectionGrid({ onQuickAdd = () => {}, onNavigate = () => {} }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F8F5EE] border-t border-[#EAE4D9] select-none">
      <div className="max-w-7xl mx-auto">
        {/* Section Header matching frame_03 */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/12 text-[#9A7B38] text-[11px] font-bold tracking-[0.22em] uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            The Archives
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1C1B1A] font-normal tracking-tight mb-3">
            Find the one that <span className="italic font-light text-[#9A7B38]">feels like you</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#635F59] leading-relaxed">
            Five rare flacons formulated in small serialized batches. No alcohol, pure botanical oil extracts hydro-distilled in traditional copper degs.
          </p>
        </div>

        {/* 5 ARCHED ALCOVES ROW matching frame_03 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {ARCHED_ALCOVES.map((item, index) => {
            const isHovered = hoveredId === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative flex flex-col items-center justify-between p-5 pt-8 rounded-t-[140px] rounded-b-2xl bg-white border border-[#EAE4D9] shadow-[0_10px_30px_rgba(40,30,15,0.04)] hover:shadow-[0_20px_45px_rgba(40,30,15,0.1)] hover:border-[#C5A059]/60 transition-all duration-300"
              >
                {/* Arch Header Badge */}
                <span className="text-[10px] uppercase font-bold tracking-[0.18em] text-[#9A7B38] bg-[#F8F5EE] px-3 py-0.5 rounded-full mb-4">
                  {item.badge}
                </span>

                {/* Arched Inner Glow & Bottle Showcase */}
                <div className="relative w-full h-[220px] flex items-center justify-center my-2">
                  <div className="absolute inset-0 bg-radial from-[#F5EEDD]/50 to-transparent rounded-t-[120px] pointer-events-none" />
                  <div className="w-[140px] h-[200px] transition-transform duration-300 group-hover:scale-105">
                    <LuxuryFlaconRender
                      imageUrl={item.image}
                      scentName={item.name}
                      className="w-full h-full"
                    />
                  </div>
                </div>

                {/* Scent Information */}
                <div className="w-full text-center mt-3 pt-3 border-t border-[#F2ECE1]">
                  <h3 className="font-serif text-lg text-[#1C1B1A] font-semibold">
                    {item.name}
                  </h3>
                  <div className="text-[11px] text-[#8C8477] font-sans truncate mb-2">
                    {item.family}
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="font-serif text-base font-bold text-[#1C1B1A]">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#A89E90] line-through font-serif">
                      ₹{item.comparePrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Add / Explore Button */}
                  <button
                    onClick={() => onQuickAdd(item.id)}
                    className="w-full py-2.5 px-4 rounded-full bg-[#1C1B1A] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm group-hover:shadow-md cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
