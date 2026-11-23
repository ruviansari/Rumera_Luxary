import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Sparkles, ArrowDown, ShoppingBag, ShieldCheck, Sun, Flower2, Droplets } from 'lucide-react';
import LuxuryFlaconRender from './LuxuryFlaconRender';
import NoteCards from './NoteCards';

export default function HeroScrollStage({ onAddToCart = () => {}, customBottleImg = null }) {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Continuous Scroll-Linked Animation across 2 Key Stages (Hero -> Centered Pyramid)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001
  });

  // Bottle Coordinate Transforms matching KAJU video:
  // Stage 1 (0 to 0.35): Poised on pedestal on the right
  // Stage 2 (0.45 to 1.0): Centered cleanly in viewport surrounded by note cards
  const bottleX = useTransform(
    smoothProgress,
    [0, 0.35, 0.6, 1],
    isMobile
      ? ['0vw', '0vw', '0vw', '0vw']
      : ['18vw', '18vw', '0vw', '0vw']
  );

  const bottleY = useTransform(
    smoothProgress,
    [0, 0.35, 0.6, 1],
    isMobile
      ? ['-4vh', '-4vh', '0vh', '0vh']
      : ['-2vh', '-2vh', '0vh', '0vh']
  );

  const bottleScale = useTransform(
    smoothProgress,
    [0, 0.35, 0.6, 1],
    isMobile
      ? [0.8, 0.8, 0.9, 0.9]
      : [1.0, 1.0, 1.15, 1.15]
  );

  // Stage 1 Hero Text Opacity & Y
  const heroOpacity = useTransform(smoothProgress, [0, 0.28, 0.38], [1, 0.8, 0]);
  const heroY = useTransform(smoothProgress, [0, 0.35], ['0px', '-40px']);

  // Pedestal block fade out as bottle detaches
  const pedestalOpacity = useTransform(smoothProgress, [0, 0.25, 0.35], [1, 0.5, 0]);

  // Stage 2 Note Cards Opacity & Y
  const notesOpacity = useTransform(smoothProgress, [0.35, 0.48, 1], [0, 1, 1]);
  const notesY = useTransform(smoothProgress, [0.35, 0.48], ['30px', '0px']);

  const scrollToPyramid = () => {
    if (containerRef.current) {
      const targetScroll = containerRef.current.offsetTop + window.innerHeight * 1.1;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-[220vh] bg-[#F8F5EE] text-[#1C1B1A]">
      {/* STICKY VIEWPORT CONTAINER */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between select-none">
        {/* Warm Sunlight & Ambient Atmosphere matching video */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F4] via-[#F8F5EE] to-[#F3EFE6] pointer-events-none" />

        {/* Soft Organic Palm / Botanical Shadows in Background */}
        <div className="absolute -top-1/4 -right-1/4 w-[700px] h-[700px] bg-gradient-to-br from-[#EAE3D2]/40 via-transparent to-transparent rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#E5DEC9]/35 via-transparent to-transparent rounded-full blur-[80px] pointer-events-none" />

        {/* ========================================================
            THE CORE FLACON (DESCENDING THROUGH SCROLL)
           ======================================================== */}
        <motion.div
          style={{
            x: bottleX,
            y: bottleY,
            scale: bottleScale,
            willChange: 'transform'
          }}
          className="absolute inset-0 m-auto w-[260px] sm:w-[300px] h-[400px] sm:h-[450px] pointer-events-none z-30 flex items-center justify-center"
        >
          <LuxuryFlaconRender imageUrl={customBottleImg} scentName="Amber Raj" />
        </motion.div>

        {/* ========================================================
            STAGE 1: HERO OVERLAY (Matching frame_00 in video)
           ======================================================== */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="absolute inset-0 flex items-center z-20 pointer-events-auto"
        >
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Column: Scent Typography & Actions matching video */}
            <div className="md:col-span-7 xl:col-span-6 space-y-5">
              {/* Pill Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#EAE4D9] shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A7B38]">
                  The Signature Flacon
                </span>
              </div>

              {/* Fragrance Title in massive elegant serif matching video */}
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal text-[#1C1B1A] tracking-tight leading-[1.05]">
                Amber Raj
              </h1>

              {/* Subheading */}
              <div className="text-sm sm:text-base font-serif italic text-[#8C8477]">
                24% Royal Extrait, aged for 30 moon passes
              </div>

              {/* Three Botanical Note Pills matching video */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {['Saffron', 'Rose', 'Agarwood'].map((note) => (
                  <span
                    key={note}
                    className="px-3 py-1 rounded-full bg-white/90 border border-[#EAE4D9] text-[#635F59] text-xs font-semibold uppercase tracking-wider shadow-xs"
                  >
                    {note}
                  </span>
                ))}
              </div>

              {/* Poetic Description */}
              <p className="text-xs sm:text-sm text-[#635F59] max-w-lg leading-relaxed font-sans pt-1">
                A high-concentration jaipur extrait of a living composition. It opens bright, blossoms into velvet, and dries down warm on your pulse points.
              </p>

              {/* CTA Row matching video */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={() => onAddToCart('amber-raj')}
                  className="px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest bg-[#1C1B1A] hover:bg-black text-white shadow-[0_8px_20px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.25)] transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Add to Bag — ₹8,500</span>
                </button>

                <button
                  onClick={scrollToPyramid}
                  className="text-xs font-bold uppercase tracking-widest text-[#1C1B1A] hover:text-[#9A7B38] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Discover the Scent</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Pedestal & Floating Botanical Particles matching video */}
            <div className="hidden md:flex md:col-span-5 xl:col-span-6 relative h-[500px] items-end justify-center">
              {/* Travertine Marble Pedestal Block */}
              <motion.div
                style={{ opacity: pedestalOpacity }}
                className="absolute bottom-6 w-[280px] h-[110px] rounded-2xl bg-gradient-to-b from-[#FFFFFF] via-[#F7F3EA] to-[#EAE2D2] border border-[#E0D8C8] shadow-[0_20px_45px_rgba(40,30,15,0.1)] flex flex-col justify-end p-3 z-10"
              >
                <div className="w-full text-center text-[10px] uppercase font-bold tracking-[0.25em] text-[#A89E90] border-t border-[#EAE2D2]/80 pt-2">
                  Ceremonial Travertine Pedestal
                </div>
              </motion.div>

              {/* Floating Botanical Elements matching video: Rose petals, saffron threads, wood */}
              {/* Rose Petal */}
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-28 right-12 z-20 w-9 h-9 rounded-full bg-gradient-to-br from-rose-200 via-rose-300 to-rose-400 opacity-80 blur-[0.5px] shadow-sm flex items-center justify-center text-[10px]"
                title="Damascena Rose Petal"
              >
                🌸
              </motion.div>

              {/* Saffron Strand */}
              <motion.div
                animate={{ y: [0, 8, 0], rotate: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute bottom-36 left-8 z-20 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-600/40 text-[10px] text-amber-700 font-bold"
                title="Kashmiri Saffron Strand"
              >
                ✨ Saffron
              </motion.div>

              {/* Wild Agarwood Bark */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-36 left-4 z-20 px-2 py-0.5 rounded-full bg-amber-900/15 border border-amber-950/30 text-[10px] text-amber-900 font-bold"
                title="Wild Assam Oud"
              >
                🪵 Aged Oud
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ========================================================
            STAGE 2: FRAGRANCE PYRAMID OVERLAY (Matching frame_01)
           ======================================================== */}
        <motion.div
          style={{ opacity: notesOpacity, y: notesY }}
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
        >
          <NoteCards />
        </motion.div>

        {/* Scroll Indicator at bottom of hero */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-[#A89E90]">
          <ArrowDown className="w-3 h-3 text-[#C5A059] animate-bounce" />
          <span>Scroll to Explore Fragrance Architecture</span>
        </div>
      </div>
    </div>
  );
}
