import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Sparkles, Droplets, Award, ArrowRight } from 'lucide-react';

const SIGNATURE_COLLECTION = [
  {
    id: 'mitti-kannauj',
    name: 'Mitti-e-Kannauj',
    subTitle: 'The Sacred Baked Earth of Monsoon',
    family: 'Petrichor & Pure Sandalwood',
    concentration: '100% Pure Non-Alcoholic Attar',
    price: 2499,
    comparePrice: 3199,
    image: '/images/showcase/artisanal_gold_cage_front.jpg',
    badge: 'Heritage Masterpiece',
    notes: 'Baked Alluvial Clay • Hydro-Distilled Mysore Santalum • Monsoon Ozone Accord',
    description: 'Hydro-distilled in unglazed terracotta degs along the Ganges riverbank. The ancient scent of rain hitting parched summer earth.'
  },
  {
    id: 'royal-oud-assam',
    name: 'Royal Oud Al Assam',
    subTitle: '12-Year Vintage Wild Agarwood',
    family: 'Pure Dehn Al Oud & Smoke',
    concentration: 'Ceremonial Pure Extrait',
    price: 4899,
    comparePrice: 5999,
    image: '/images/showcase/royal_emerald_flacon.jpg',
    badge: 'Founder Reserve',
    notes: 'Aged Wild Assam Agarwood • White Ambergris • Smoked Cedar • Mysore Teak',
    description: 'Extracted from century-old infected Aquilaria trees in Upper Assam. Decanted and solar-matured over 12 full seasons.'
  },
  {
    id: 'ruh-khus-rajasthan',
    name: 'Ruh Khus Rajasthan',
    subTitle: 'Copper-Still Distilled Wild Vetiver',
    family: 'Earthy Emerald Roots',
    concentration: 'Wild Forest Concentré',
    price: 2699,
    comparePrice: 3499,
    image: '/images/showcase/artisanal_gold_cage_angle.jpg',
    badge: 'Cooling Elixir',
    notes: 'Wild Vetiver Grass Roots • River Clay • Green Moss • Indian Bergamot',
    description: 'Harvested by nomadic tribes along dried riverbeds. Naturally vivid emerald green, carrying natural cooling energy.'
  },
  {
    id: 'gulab-khas',
    name: 'Gulab-e-Khas',
    subTitle: 'Kannauj Damascena Hydro-Distillate',
    family: 'Pure Floral Rooh',
    concentration: '10,000 Petals / Drop',
    price: 2999,
    comparePrice: 3899,
    image: '/images/showcase/royal_trio_collection.jpg',
    badge: 'Imperial Floral',
    notes: 'Kannauj Rosa Damascena • Saffron Pistils • Mysore Sandalwood Base',
    description: '40 quintals of hand-picked dawn roses yield barely a single tola of this pure rooh. Zero chemical fixatives or synthetic alcohols.'
  },
  {
    id: 'amber-night',
    name: 'Amber Shahi Night',
    subTitle: 'Golden Ambergris & Royal Balsams',
    family: 'Oriental Ambergris',
    concentration: 'Nocturnal Extrait',
    price: 3599,
    comparePrice: 4499,
    image: '/images/showcase/royal_amber_flacon.jpg',
    badge: 'Nocturnal Sillage',
    notes: 'Aged Grey Ambergris • Labdanum Tears • Roasted Tonka • Wild Honey Accord',
    description: 'An intoxicating evening formulation evoking the moonlit courtyards of 18th-century Awadhi palaces.'
  }
];

export default function CollectionGrid({ onSelectProduct = null, onQuickAdd = null }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <section id="curated-collection" className="py-24 bg-[#0A0F0D] text-[#FAF7F0] relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#E8CA89] bg-[#D4AF37]/15 border border-[#D4AF37]/35 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Signature Olfactory Gallery
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#FAF7F0] font-normal tracking-tight mb-4">
            Find the One That Feels Like You
          </h2>
          <p className="text-[#8E9B94] text-sm sm:text-base leading-relaxed">
            Every attar in our royal vaults is distilled without compromise using antique copper deg-bhapka techniques,
            yielding oils of unprecedented purity and soul.
          </p>
        </div>

        {/* 5 Signature Attars Arched Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-7">
          {SIGNATURE_COLLECTION.map((item, idx) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col justify-between rounded-t-[100px] rounded-b-2xl bg-[#0F1815]/75 border border-[#D4AF37]/30 hover:border-[#D4AF37] p-5 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_45px_rgba(212,175,55,0.2)] transition-all duration-300"
            >
              {/* Arched Architectural Frame Inner Border */}
              <div className="absolute inset-2 rounded-t-[92px] rounded-b-xl border border-[#D4AF37]/15 pointer-events-none group-hover:border-[#D4AF37]/40 transition-colors" />

              <div>
                {/* Badge */}
                <div className="text-center pt-3 pb-2">
                  <span className="inline-block text-[9px] font-bold tracking-widest uppercase text-[#D4AF37] bg-[#080D0B] px-3 py-0.5 rounded-full border border-[#D4AF37]/30">
                    {item.badge}
                  </span>
                </div>

                {/* Arched Image Container */}
                <div className="relative w-full h-52 my-3 flex items-center justify-center overflow-hidden rounded-t-[75px] rounded-b-lg bg-[#070B09]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = '/images/rumera_white_oud_hero.jpg'; }}
                  />
                  {/* Subtle Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1815] via-transparent to-transparent opacity-60" />
                </div>

                {/* Titles & Olfactory Profile */}
                <div className="text-center mt-2">
                  <h3 className="font-serif text-lg font-bold text-[#FAF7F0] group-hover:text-[#FFF2D1] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-[#B78B45] font-serif italic mb-2">
                    {item.subTitle}
                  </p>
                  <p className="text-[11px] text-[#8E9B94] line-clamp-2 px-1 mb-3">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Bottom Actions & Price */}
              <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="font-mono font-bold text-base text-[#D4AF37]">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  <span className="font-mono text-xs text-[#8E9B94] line-through">
                    ₹{item.comparePrice.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Quick Add Pill Button */}
                <button
                  onClick={() => onQuickAdd ? onQuickAdd(1) : setSelectedProduct(item)}
                  className="w-full py-2 px-4 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#15231F] text-[#FAF7F0] border border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-[#0D1714] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Acquire Flacon</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
