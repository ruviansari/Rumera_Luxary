import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Sparkles, ArrowDown, Gift, ShoppingBag, ShieldCheck, Sun, Flame, Moon, Compass, ChevronDown, Check } from 'lucide-react';
import LuxuryFlaconRender from './LuxuryFlaconRender';
import NoteCards from './NoteCards';

export default function HeroScrollStage({ onAddToCart = null, customBottleImg = null }) {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Continuous Scroll-Linked Animation across 3 Stages
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Smooth out scroll progression with spring physics for 60fps cinematic feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001
  });

  // Bottle Coordinate Transforms
  // Stage 1 (0 to 0.28): Right-aligned hero pedestal
  // Stage 2 (0.30 to 0.62): Centered inside fragrance note cards
  // Stage 3 (0.65 to 1.0): Descends into the open velvet gift box on the left
  const bottleX = useTransform(
    smoothProgress,
    [0, 0.28, 0.45, 0.62, 0.75, 1],
    isMobile
      ? ['0vw', '0vw', '0vw', '0vw', '0vw', '0vw']
      : ['18vw', '18vw', '0vw', '0vw', '-12vw', '-12vw']
  );

  const bottleY = useTransform(
    smoothProgress,
    [0, 0.28, 0.45, 0.62, 0.75, 1],
    isMobile
      ? ['-8vh', '-8vh', '0vh', '0vh', '15vh', '15vh']
      : ['-4vh', '-4vh', '0vh', '0vh', '14vh', '14vh']
  );

  const bottleScale = useTransform(
    smoothProgress,
    [0, 0.28, 0.45, 0.62, 0.75, 1],
    isMobile
      ? [0.75, 0.75, 0.88, 0.88, 0.62, 0.62]
      : [1.0, 1.0, 1.16, 1.16, 0.74, 0.74]
  );

  const bottleRotate = useTransform(
    smoothProgress,
    [0, 0.28, 0.45, 0.62, 0.75, 1],
    ['-4deg', '-4deg', '0deg', '0deg', '0deg', '0deg']
  );

  // Stage 1 (Hero) Content Opacity & Y
  const heroOpacity = useTransform(smoothProgress, [0, 0.22, 0.30], [1, 0.8, 0]);
  const heroY = useTransform(smoothProgress, [0, 0.25], ['0px', '-40px']);

  // Stage 2 (Fragrance Pyramid) Opacity & Y
  const pyramidOpacity = useTransform(smoothProgress, [0.26, 0.36, 0.58, 0.66], [0, 1, 1, 0]);
  const pyramidY = useTransform(smoothProgress, [0.26, 0.36, 0.58, 0.66], ['40px', '0px', '0px', '-40px']);

  // Stage 3 (Gift Box) Opacity & Y
  const boxOpacity = useTransform(smoothProgress, [0.65, 0.76, 1], [0, 1, 1]);
  const boxY = useTransform(smoothProgress, [0.65, 0.76], ['40px', '0px']);

  // Stage 3 Velvet Box Selection State
  const [selectedBoxSize, setSelectedBoxSize] = useState('12ml');
  const [boxName, setBoxName] = useState('For Ruvi Ansari');
  const [boxAdded, setBoxAdded] = useState(false);

  const scrollToPyramid = () => {
    if (containerRef.current) {
      const targetScroll = containerRef.current.offsetTop + window.innerHeight * 1.35;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  const scrollToCustomizer = () => {
    if (containerRef.current) {
      const targetScroll = containerRef.current.offsetTop + window.innerHeight * 2.75;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-[360vh] bg-[#0A0A0A] text-[#FAF7F0]">
      {/* STICKY VIEWPORT CONTAINER */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between select-none">
        {/* Background Atmospheric Layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080D0B] via-[#0E1513] to-[#080D0B] pointer-events-none" />

        {/* Ambient Gold Nebula Glows */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#D4AF37]/15 to-transparent rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#1B352C]/30 to-transparent rounded-full blur-[120px] pointer-events-none" />

        {/* Golden Dust Particles Floating in Canvas / CSS */}
        <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px]" />

        {/* ========================================================
            THE CORE HERO BOTTLE (DESCENDING THROUGH THE 3 SECTIONS)
           ======================================================== */}
        <motion.div
          style={{
            x: bottleX,
            y: bottleY,
            scale: bottleScale,
            rotate: bottleRotate,
            willChange: 'transform'
          }}
          className="absolute inset-0 m-auto w-[280px] sm:w-[320px] h-[440px] sm:h-[480px] pointer-events-none z-30 flex items-center justify-center"
        >
          <LuxuryFlaconRender imageUrl={customBottleImg} />
        </motion.div>

        {/* ========================================================
            STAGE 1: HERO OVERLAY (Progress 0.0 -> 0.28)
           ======================================================== */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="absolute inset-0 flex items-center z-20 pointer-events-auto"
        >
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Column: Editorial Headline & Actions */}
            <div className="md:col-span-7 xl:col-span-6 space-y-6">
              {/* Royal House Insignia Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#14231F]/90 border border-[#D4AF37]/45 shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                <img src="/images/rumera_crest_emblem.png" alt="Rumera Crest" className="w-5 h-5 object-contain" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8CA89]">
                  Maison Ruméra • Haute Parfumerie
                </span>
              </div>

              {/* Massive Luxury Serif Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal text-[#FAF7F0] tracking-tight leading-[1.08]">
                The Sacred Symphony <br />
                <span className="italic font-light text-[#D4AF37]">
                  of Indian Perfumery.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-sm sm:text-base text-[#D1DDD6] max-w-lg leading-relaxed font-sans">
                Experience pure non-alcoholic artisanal attar distilled in antique copper cauldrons.
                A single drop matured over a decade, designed to linger across skin and silk for twenty-four hours.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={scrollToPyramid}
                  className="px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest bg-gradient-to-r from-[#D4AF37] via-[#E8CA89] to-[#B78B45] text-[#0A0E0C] shadow-[0_6px_25px_rgba(212,175,55,0.35)] hover:shadow-[0_10px_35px_rgba(212,175,55,0.55)] transition-all flex items-center gap-2"
                >
                  <span>Explore Fragrance Pyramid</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={scrollToCustomizer}
                  className="px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest bg-transparent border border-[#D4AF37]/50 text-[#FAF7F0] hover:bg-[#D4AF37]/15 hover:border-[#D4AF37] transition-all flex items-center gap-2"
                >
                  <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Customize Gift Box</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-4 text-xs text-[#8E9B94]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>100% Pure Attar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Kannauj Hydro-Distilled</span>
                </div>
              </div>
            </div>

            {/* Right Column: Dark Obsidian Marble Pedestal (Under the Stage 1 Bottle) */}
            <div className="hidden md:flex md:col-span-5 xl:col-span-6 justify-center relative">
              <div className="relative w-72 h-72 flex items-center justify-center">
                {/* Obsidian Pedestal Base Circle */}
                <div className="absolute bottom-4 w-64 h-16 rounded-[100%] bg-gradient-to-b from-[#182621] to-[#080D0B] border border-[#D4AF37]/50 shadow-[0_20px_45px_rgba(0,0,0,0.95)] shadow-[#D4AF37]/15" />
                <div className="absolute bottom-6 w-52 h-10 rounded-[100%] bg-[#0A100E] border border-[#D4AF37]/30" />
                {/* Pedestal Top Mirror Glow */}
                <div className="absolute bottom-8 w-44 h-6 rounded-[100%] bg-gradient-to-r from-transparent via-[#D4AF37]/25 to-transparent blur-sm" />
              </div>
            </div>
          </div>

          {/* Scroll Down Teaser Pill */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-[#8E9B94] text-xs flex flex-col items-center gap-1 animate-bounce">
            <span className="text-[10px] uppercase tracking-widest text-[#D4AF37]">Scroll To Descend</span>
            <ChevronDown className="w-4 h-4 text-[#D4AF37]" />
          </div>
        </motion.div>

        {/* ========================================================
            STAGE 2: FRAGRANCE PYRAMID OVERLAY (Progress 0.28 -> 0.65)
           ======================================================== */}
        <motion.div
          style={{ opacity: pyramidOpacity, y: pyramidY }}
          className="absolute inset-0 flex flex-col justify-between py-12 px-4 z-20 pointer-events-auto"
        >
          {/* Stage 2 Section Header */}
          <div className="text-center max-w-xl mx-auto pt-4">
            <span className="inline-block text-[10px] uppercase tracking-[0.25em] font-mono text-[#D4AF37] px-3 py-1 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/30 mb-2">
              Stage II • Olfactory Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF7F0] font-normal tracking-tight">
              The Three-Tier Formulation
            </h2>
            <p className="text-xs sm:text-sm text-[#8E9B94] mt-1">
              The flacon hovers at the epicenter. Observe how the olfactory tiers unfold across hours of wear.
            </p>
          </div>

          {/* NoteCards Component Surrounding the Centered Bottle */}
          <div className="my-auto py-2">
            <NoteCards />
          </div>

          {/* Bottom Stage Status */}
          <div className="text-center pb-2">
            <span className="text-[11px] text-[#A0A0A0] font-mono">
              Continue scrolling to settle this flacon into your bespoke gift box ↓
            </span>
          </div>
        </motion.div>

        {/* ========================================================
            STAGE 3: CUSTOM GIFT BOX LANDING (Progress 0.65 -> 1.0)
           ======================================================== */}
        <motion.div
          style={{ opacity: boxOpacity, y: boxY }}
          className="absolute inset-0 flex items-center z-20 pointer-events-auto"
        >
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Open Velvet Gift Box where the bottle lands */}
            <div className="lg:col-span-7 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-md sm:max-w-lg h-[400px] sm:h-[450px] rounded-3xl bg-gradient-to-b from-[#111C18] to-[#080D0B] border-2 border-[#D4AF37]/50 p-6 sm:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.9)] flex flex-col justify-between">
                {/* Velvet Interior Cavity */}
                <div className="relative w-full h-full rounded-2xl bg-[#070C0A] border border-[#D4AF37]/30 overflow-hidden p-6 flex flex-col justify-between">
                  {/* Recessed Flacon Bed (The landing target) */}
                  <div className="absolute inset-4 rounded-xl border border-[#D4AF37]/20 bg-gradient-to-b from-[#060908] to-[#0A120E] shadow-inner flex items-center justify-center">
                    {/* Golden Cushion Glow where bottle sits */}
                    <div className="w-48 h-72 rounded-full bg-[#D4AF37]/15 blur-2xl" />
                  </div>

                  {/* Top Brass Nameplate */}
                  <div className="relative z-10 text-center">
                    <span className="inline-block px-4 py-1 rounded bg-[#090E0C] border border-[#D4AF37] text-[10px] uppercase font-mono tracking-widest text-[#D4AF37]">
                      {boxName || 'Maison Ruméra VIP Set'}
                    </span>
                  </div>

                  {/* Box Bottom Ribbon Label */}
                  <div className="relative z-10 flex items-center justify-between text-[11px] text-[#E8CA89] font-serif italic pt-3 border-t border-[#D4AF37]/20">
                    <span>Hand-poured in Royal Awadh</span>
                    <span>24K Gold Filigree Edition</span>
                  </div>
                </div>

                {/* Satin Ribbon Accent */}
                <div className="absolute -top-3 left-10 px-3 py-1 bg-gradient-to-r from-[#D4AF37] to-[#B78B45] text-[#0A0E0C] text-[10px] font-bold uppercase rounded-md shadow-md tracking-wider">
                  Bespoke Velvet Coffret
                </div>
              </div>
            </div>

            {/* Right Column: "Make It Yours" Customizer Form */}
            <div className="lg:col-span-5 bg-[#0D1512]/90 border border-[#D4AF37]/35 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] font-mono block mb-1">
                  Stage III • Make It Yours
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF7F0] font-normal">
                  Your Bespoke Gift Coffret
                </h3>
                <p className="text-xs text-[#8E9B94] mt-1">
                  The bottle has settled into its custom velvet bed. Personalize your keepsake box before claiming.
                </p>
              </div>

              {/* Volume / Size Picker */}
              <div>
                <label className="block text-xs font-semibold text-[#D1DDD6] uppercase tracking-wider mb-2">
                  Select Flacon Concentration
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { size: '6ml', label: '6 ml Attar', price: '₹2,499' },
                    { size: '12ml', label: '12 ml Extrait', price: '₹3,899' },
                    { size: '50ml', label: '50 ml Coffret', price: '₹8,900' }
                  ].map((s) => (
                    <button
                      key={s.size}
                      onClick={() => setSelectedBoxSize(s.size)}
                      className={`p-2.5 rounded-lg border text-center transition-all ${
                        selectedBoxSize === s.size
                          ? 'border-[#D4AF37] bg-[#16241F] text-[#FAF7F0] shadow-sm'
                          : 'border-[#D4AF37]/20 bg-[#080D0B] text-[#8E9B94] hover:text-[#FAF7F0]'
                      }`}
                    >
                      <span className="block font-semibold text-xs">{s.label}</span>
                      <span className="block text-[10px] text-[#D4AF37] font-mono mt-0.5">{s.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Inscription Nameplate */}
              <div>
                <label className="block text-xs font-semibold text-[#D1DDD6] uppercase tracking-wider mb-1.5">
                  Gold Plaque Name Inscription
                </label>
                <input
                  type="text"
                  maxLength={35}
                  value={boxName}
                  onChange={(e) => setBoxName(e.target.value)}
                  placeholder="e.g. For Ruvi Ansari"
                  className="w-full px-3.5 py-2.5 bg-[#080D0B] border border-[#D4AF37]/35 rounded-lg text-sm text-[#FAF7F0] focus:outline-none focus:border-[#D4AF37] font-serif"
                />
              </div>

              {/* Inclusions Checkbox List */}
              <div className="space-y-1.5 text-xs text-[#B6C4BC] pt-1">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Complimentary velvet presentation gift box</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Personalized gold calligraphy gift letter</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Pan-India expedited insured dispatch</span>
                </div>
              </div>

              {/* CTA Action */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (onAddToCart) onAddToCart(1);
                    setBoxAdded(true);
                    setTimeout(() => setBoxAdded(false), 3000);
                  }}
                  className="w-full py-3.5 px-6 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] via-[#E8CA89] to-[#B78B45] text-[#0A0E0C] hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)] transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-[#0A0E0C]" />
                  <span>{boxAdded ? 'Custom Coffret Added to Cart!' : 'Acquire This Custom Coffret'}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
