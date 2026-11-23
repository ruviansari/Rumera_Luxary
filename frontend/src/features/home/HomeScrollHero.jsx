import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowDown, Droplets, Crown, Award, Gift, ShieldCheck, Sun, Flower2, Trees } from 'lucide-react';
import LuxuryFlaconRender from '../experience/LuxuryFlaconRender';

export default function HomeScrollHero({
  onNavigate = () => {},
  onOpenSampleModal = () => {}
}) {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Continuous Scroll-Linked Animation (Bottles falling down and up smoothly)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001
  });

  // Bottle Coordinate Transforms
  // Stage 1 (0 to 0.35): Poised on pedestal on right (24vw)
  // Stage 2 (0.45 to 0.75): Glides to center of screen (0vw) with note cards around it
  // Stage 3 (0.85 to 1.0): Fades into next section
  const bottleX = useTransform(
    smoothProgress,
    [0, 0.35, 0.55, 0.75, 1],
    isMobile
      ? ['0vw', '0vw', '0vw', '0vw', '0vw']
      : ['24vw', '24vw', '0vw', '0vw', '0vw']
  );

  const bottleY = useTransform(
    smoothProgress,
    [0, 0.35, 0.55, 0.75, 1],
    isMobile
      ? ['8vh', '8vh', '0vh', '0vh', '-6vh']
      : ['-2vh', '-2vh', '0vh', '0vh', '-4vh']
  );

  const bottleScale = useTransform(
    smoothProgress,
    [0, 0.35, 0.55, 0.75, 1],
    isMobile
      ? [0.75, 0.75, 0.88, 0.88, 0.7]
      : [1.0, 1.0, 1.15, 1.15, 0.85]
  );

  const bottleRotate = useTransform(
    smoothProgress,
    [0, 0.35, 0.55, 0.75, 1],
    ['-3deg', '-3deg', '0deg', '0deg', '0deg']
  );

  // Stage 1 Hero Text Opacity & Y
  const heroOpacity = useTransform(smoothProgress, [0, 0.28, 0.40], [1, 0.8, 0]);
  const heroY = useTransform(smoothProgress, [0, 0.35], ['0px', '-40px']);

  // Pedestal block fade out as bottle detaches and falls down
  const pedestalOpacity = useTransform(smoothProgress, [0, 0.22, 0.34], [1, 0.5, 0]);

  // Stage 2 Note Cards Opacity & Y
  const notesOpacity = useTransform(smoothProgress, [0.38, 0.52, 0.75, 0.88], [0, 1, 1, 0]);
  const notesY = useTransform(smoothProgress, [0.38, 0.52, 0.75, 0.88], ['30px', '0px', '0px', '-30px']);

  // Overall bottle opacity at the end of the scroll stage
  const bottleOpacity = useTransform(smoothProgress, [0, 0.8, 0.95], [1, 1, 0]);

  const scrollToPyramid = () => {
    if (containerRef.current) {
      const targetScroll = containerRef.current.offsetTop + window.innerHeight * 1.15;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-[230vh] bg-[#14231F] text-[#FAF7F0] select-none">
      {/* STICKY VIEWPORT CONTAINER */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between select-none">
        {/* Background Atmospheric Radial Light */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 75% 40%, rgba(183, 139, 69, 0.25) 0%, rgba(20, 35, 31, 0.98) 70%)'
          }}
        />

        {/* Ambient Subtle Gold Dust Overlay */}
        <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:36px_36px]" />

        {/* ========================================================
            THE CORE HERO FLACON (FALLING DOWN & UP WITH SCROLL)
           ======================================================== */}
        <motion.div
          style={{
            x: bottleX,
            y: bottleY,
            scale: bottleScale,
            rotate: bottleRotate,
            opacity: bottleOpacity,
            willChange: 'transform'
          }}
          className="absolute inset-0 m-auto w-[270px] sm:w-[310px] h-[410px] sm:h-[460px] pointer-events-none z-30 flex items-center justify-center"
        >
          <LuxuryFlaconRender
            imageUrl="/images/showcase/royal_amber_flacon.jpg"
            scentName="Amber Raj"
            className="w-full h-full"
          />
        </motion.div>

        {/* ========================================================
            STAGE 1: HERO OVERLAY (Progress 0.0 -> 0.35)
           ======================================================== */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="absolute inset-0 flex items-center z-20 pointer-events-auto"
        >
          <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 flex items-center justify-between">
            {/* Left Column: Scent Typography & Actions (Strict max-w-xl so it NEVER collides with the right bottle!) */}
            <div className="max-w-xl w-full lg:w-[48%] space-y-5">
              {/* Royal House Insignia Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#1A2E29]/90 border border-[#D4AF37]/45 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                <img src="/images/rumera_crest_emblem.png" alt="Rumera Crest" className="w-5 h-5 object-contain" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8CA89]">
                  RUMÉRA <span className="text-[#D4AF37]">HAUTE PARFUMERIE</span>
                </span>
                <span className="text-white/20">•</span>
                <span className="text-[10px] text-white/70 uppercase tracking-wider">
                  Royal Awadh
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#FAF7F0] tracking-tight leading-[1.08]">
                The Sacred Symphony <br />
                <span className="italic font-light text-[#D4AF37]">
                  of Indian Perfumery.
                </span>
              </h1>

              {/* Subheading & Scent Notes */}
              <div className="flex items-center gap-2 flex-wrap text-xs text-[#E8CA89] font-medium tracking-wide">
                <span className="font-serif italic text-sm text-[#FAF7F0]">Amber Raj</span>
                <span>•</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-[#D4AF37]/30 text-[10px] uppercase font-bold text-[#FAF7F0]">
                  Saffron
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-[#D4AF37]/30 text-[10px] uppercase font-bold text-[#FAF7F0]">
                  Rose
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-[#D4AF37]/30 text-[10px] uppercase font-bold text-[#FAF7F0]">
                  Assam Oud
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#D1DDD6] leading-relaxed font-sans max-w-lg">
                Meticulously hydro-distilled in traditional copper degs across Kannauj and Assam. Aged wild agarwood resins, pure morning Damascena roses, and ceremonial botanicals crafted for the truly discerning.
              </p>

              {/* CTA Row */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={() => onNavigate('shop')}
                  className="px-7 py-3 rounded-full font-bold text-xs uppercase tracking-widest bg-gradient-to-r from-[#D4AF37] via-[#E8CA89] to-[#B78B45] text-black shadow-[0_6px_25px_rgba(212,175,55,0.35)] hover:shadow-[0_10px_35px_rgba(212,175,55,0.55)] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore The Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onOpenSampleModal}
                  className="px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest bg-white/[0.06] hover:bg-white/[0.12] border border-[#D4AF37]/50 text-[#FAF7F0] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Free Sample</span>
                </button>

                <button
                  onClick={() => onNavigate('owner')}
                  className="px-5 py-3 rounded-full font-semibold text-xs tracking-wider uppercase text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  Meet The Founder
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-5 pt-3 text-xs text-white/60 border-t border-white/10 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>100% Pure Attar Extracts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Serialized Flacons</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Er. Rumana Ansari</span>
                </div>
              </div>
            </div>

            {/* Right Column: Pedestal and Floating Botanical Particles */}
            <div className="hidden lg:flex w-[48%] relative h-[480px] items-end justify-center">
              {/* Ceremonial Pedestal Block */}
              <motion.div
                style={{ opacity: pedestalOpacity }}
                className="w-[280px] h-[100px] rounded-2xl bg-gradient-to-b from-[#1C362F] via-[#142621] to-[#0D1916] border border-[#D4AF37]/40 shadow-[0_20px_45px_rgba(0,0,0,0.6)] flex flex-col justify-end p-3 z-10"
              >
                <div className="w-full text-center text-[10px] uppercase font-bold tracking-[0.25em] text-[#E8CA89] border-t border-[#D4AF37]/30 pt-2">
                  Ceremonial Pedestal
                </div>
              </motion.div>

              {/* Floating Botanicals */}
              {/* Rose Petal */}
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-28 right-16 z-20 w-8 h-8 rounded-full bg-rose-400/20 border border-rose-300/40 text-[11px] flex items-center justify-center shadow-md"
                title="Damascena Rose Petal"
              >
                🌸
              </motion.div>

              {/* Saffron Strand */}
              <motion.div
                animate={{ y: [0, 8, 0], rotate: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute bottom-32 left-12 z-20 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[10px] text-[#E8CA89] font-bold"
                title="Kashmiri Saffron"
              >
                ✨ Saffron
              </motion.div>

              {/* Aged Oud Bark */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-36 left-8 z-20 px-2.5 py-0.5 rounded-full bg-amber-950/40 border border-amber-700/40 text-[10px] text-[#D4AF37] font-bold"
                title="Wild Assam Oud"
              >
                🪵 Aged Oud
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ========================================================
            STAGE 2: FRAGRANCE PYRAMID OVERLAY (Progress 0.38 -> 0.75)
            Bottle glides into exact center, surrounded by 3 cards
           ======================================================== */}
        <motion.div
          style={{ opacity: notesOpacity, y: notesY }}
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
        >
          <div className="relative w-full max-w-6xl mx-auto h-[620px] pointer-events-auto px-4">
            {/* Top Notes (Left Card) */}
            <div className="absolute top-16 left-4 md:left-12 max-w-[310px] sm:max-w-[340px] p-5 sm:p-6 rounded-2xl bg-[#142621]/95 backdrop-blur-md border border-[#D4AF37]/35 shadow-[0_15px_40px_rgba(0,0,0,0.6)] z-20">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#E8CA89] text-[10px] font-bold tracking-[0.2em] uppercase">
                  <Sun className="w-3 h-3 text-[#D4AF37]" />
                  Top Notes • 00–10 Min
                </span>
                <span className="text-[11px] text-[#D4AF37] font-serif italic">Solar Sparkle</span>
              </div>
              <h3 className="font-serif text-lg text-[#FAF7F0] font-semibold mb-1">
                Saffron, Pink Pepper, Bergamot
              </h3>
              <p className="text-xs text-[#B6C4BC] leading-relaxed">
                Bright and piquant the first ten minutes. Solar citrus sparkle marrying fine Kashmiri saffron thread and pink pepper crystals.
              </p>
            </div>

            {/* Heart Notes (Right Card) */}
            <div className="absolute top-20 right-4 md:right-12 max-w-[310px] sm:max-w-[340px] p-5 sm:p-6 rounded-2xl bg-[#142621]/95 backdrop-blur-md border border-[#D4AF37]/35 shadow-[0_15px_40px_rgba(0,0,0,0.6)] z-20">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#E8CA89] text-[10px] font-bold tracking-[0.2em] uppercase">
                  <Flower2 className="w-3 h-3 text-[#D4AF37]" />
                  Heart • 01–04 Hours
                </span>
                <span className="text-[11px] text-[#D4AF37] font-serif italic">Velvet Bloom</span>
              </div>
              <h3 className="font-serif text-lg text-[#FAF7F0] font-semibold mb-1">
                Rose de Mai, Frankincense
              </h3>
              <p className="text-xs text-[#B6C4BC] leading-relaxed">
                Velvety and floral. An opulent accord for your afternoon. Pure morning Kannauj rose petals steeped in sacred temple smoke.
              </p>
            </div>

            {/* Base Notes (Bottom Card) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-[340px] sm:max-w-[400px] w-full p-5 sm:p-6 rounded-2xl bg-[#142621]/95 backdrop-blur-md border border-[#D4AF37]/35 shadow-[0_15px_40px_rgba(0,0,0,0.6)] z-20 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#E8CA89] text-[10px] font-bold tracking-[0.2em] uppercase">
                  <Trees className="w-3 h-3 text-[#D4AF37]" />
                  Base Notes • 04–24+ Hours
                </span>
              </div>
              <h3 className="font-serif text-lg text-[#FAF7F0] font-semibold mb-1">
                Assam Oud, Leather, Amber
              </h3>
              <p className="text-xs text-[#B6C4BC] leading-relaxed">
                Deep, dark, and resinous. Wild legacy extends on your pulse points well into the evening, fusing Mysore sandalwood with golden amber.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-[#D4AF37]">
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          <span>Scroll down to see bottle descend & fragrance notes</span>
        </div>
      </div>
    </div>
  );
}
