import React from 'react';

/**
 * LuxuryFlaconRender
 * Handcrafted vector render matching the luxury amber glass flacon from the KAJU video demo.
 * Renders an ultra-clean glass bottle with rich golden amber extrait, black cylindrical cap with gold collar,
 * and elegant Ruméra Maison label. Supports `imageUrl` prop for custom transparent assets.
 */
export default function LuxuryFlaconRender({
  imageUrl = null,
  glowColor = 'rgba(212, 175, 55, 0.35)',
  className = '',
  style = {},
  scentName = 'Amber Raj'
}) {
  if (imageUrl) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`} style={style}>
        {/* Soft Ambient Warm Backlight */}
        <div
          className="absolute -inset-8 rounded-full blur-2xl pointer-events-none opacity-70"
          style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
        />
        <img
          src={imageUrl}
          alt="Ruméra Luxury Flacon"
          className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)]"
          style={{ willChange: 'transform' }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={style}>
      {/* Soft warm sunlit back-glow */}
      <div
        className="absolute -inset-10 rounded-full blur-3xl pointer-events-none opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(220, 160, 60, 0.4) 0%, rgba(245, 235, 215, 0.2) 50%, transparent 75%)'
        }}
      />

      {/* SVG Luxury Glass Flacon matching video */}
      <svg
        viewBox="0 0 280 420"
        className="relative z-10 w-full h-full max-h-[460px] filter drop-shadow-[0_25px_35px_rgba(40,30,15,0.22)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ willChange: 'transform' }}
      >
        <defs>
          {/* Black Cap Gradient */}
          <linearGradient id="blackCapGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1E1E1E" />
            <stop offset="25%" stopColor="#3A3A3A" />
            <stop offset="50%" stopColor="#121212" />
            <stop offset="80%" stopColor="#2D2D2D" />
            <stop offset="100%" stopColor="#0A0A0A" />
          </linearGradient>

          {/* Gold Collar Gradient */}
          <linearGradient id="goldCollarGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="30%" stopColor="#FFF2D1" />
            <stop offset="60%" stopColor="#B38E36" />
            <stop offset="85%" stopColor="#DFBF5B" />
            <stop offset="100%" stopColor="#966B24" />
          </linearGradient>

          {/* Amber Extrait Liquid Gradient */}
          <linearGradient id="amberLiquidGrad" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#FAD874" stopOpacity="0.88" />
            <stop offset="35%" stopColor="#E39C24" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#BA6E0E" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#7E3F05" stopOpacity="1" />
          </linearGradient>

          {/* Glass Outer Highlight Gradient */}
          <linearGradient id="glassFacetHighlight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
            <stop offset="15%" stopColor="#FFFFFF" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.0" />
            <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.45" />
          </linearGradient>

          {/* Pedestal Cast Shadow */}
          <radialGradient id="basePedestalShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(40,30,15,0.4)" />
            <stop offset="60%" stopColor="rgba(40,30,15,0.15)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        {/* Base Cast Shadow */}
        <ellipse cx="140" cy="402" rx="90" ry="12" fill="url(#basePedestalShadow)" />

        {/* 1. BLACK POLISHED CYLINDRICAL CAP */}
        {/* Cap Top Chamfer */}
        <ellipse cx="140" cy="55" rx="36" ry="7" fill="#2E2E2E" stroke="#4A4A4A" strokeWidth="0.8" />
        {/* Cap Body */}
        <path
          d="M104 55 C104 55 104 110 104 110 C104 114 120 117 140 117 C160 117 176 114 176 110 C176 110 176 55 176 55 Z"
          fill="url(#blackCapGrad)"
        />
        {/* Cap Highlight Line */}
        <path d="M116 58 L116 112" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.35" strokeLinecap="round" />

        {/* 2. GOLD NECK COLLAR */}
        <path
          d="M112 115 C112 113 124 112 140 112 C156 112 168 113 168 115 L170 126 C170 128 156 130 140 130 C124 130 110 128 110 126 Z"
          fill="url(#goldCollarGrad)"
          stroke="#B38E36"
          strokeWidth="0.6"
        />

        {/* 3. SOLID CLEAR GLASS OUTER FLACON */}
        {/* Rounded Shoulder Glass Body */}
        <rect
          x="62"
          y="126"
          width="156"
          height="262"
          rx="22"
          fill="#FAF8F4"
          fillOpacity="0.12"
          stroke="url(#glassFacetHighlight)"
          strokeWidth="3.5"
        />

        {/* Glass Thick Base Solid Bottom (heavy crystal base) */}
        <rect
          x="66"
          y="358"
          width="148"
          height="26"
          rx="12"
          fill="#FFFFFF"
          fillOpacity="0.22"
        />

        {/* 4. LUMINOUS AMBER EXTRAIT LIQUID */}
        <rect
          x="72"
          y="142"
          width="136"
          height="214"
          rx="14"
          fill="url(#amberLiquidGrad)"
        />

        {/* Liquid Surface Meniscus */}
        <ellipse cx="140" cy="144" rx="66" ry="6" fill="#FCE59F" fillOpacity="0.75" />

        {/* 5. PAPER ATELIER CARTUCHE LABEL (Centered in flacon) */}
        <rect
          x="88"
          y="190"
          width="104"
          height="124"
          rx="4"
          fill="#FCFAF6"
          stroke="#C5A059"
          strokeWidth="1.2"
          filter="drop-shadow(0 4px 10px rgba(0,0,0,0.12))"
        />
        {/* Inner Gold Frame Border */}
        <rect
          x="92"
          y="194"
          width="96"
          height="116"
          rx="2"
          fill="none"
          stroke="#C5A059"
          strokeWidth="0.6"
          strokeOpacity="0.6"
        />

        {/* Label Typography */}
        <text
          x="140"
          y="218"
          textAnchor="middle"
          fill="#C5A059"
          fontSize="8.5"
          fontWeight="bold"
          letterSpacing="2.5"
          fontFamily="serif"
        >
          MAISON
        </text>
        <text
          x="140"
          y="238"
          textAnchor="middle"
          fill="#1C1B1A"
          fontSize="14"
          fontWeight="700"
          letterSpacing="3"
          fontFamily="serif"
        >
          RUMÉRA
        </text>
        <line x1="108" y1="248" x2="172" y2="248" stroke="#C5A059" strokeWidth="0.8" strokeOpacity="0.5" />
        <text
          x="140"
          y="266"
          textAnchor="middle"
          fill="#1C1B1A"
          fontSize="11"
          fontWeight="600"
          letterSpacing="1.2"
          fontFamily="serif"
        >
          {scentName.toUpperCase()}
        </text>
        <text
          x="140"
          y="284"
          textAnchor="middle"
          fill="#8C7A58"
          fontSize="7"
          fontWeight="600"
          letterSpacing="1.8"
        >
          ROYAL EXTRAIT
        </text>
        <text
          x="140"
          y="298"
          textAnchor="middle"
          fill="#8C7A58"
          fontSize="6"
          letterSpacing="1.2"
        >
          50 ML • 1.7 FL. OZ.
        </text>

        {/* 6. GLASS SPECULAR HIGHLIGHTS & REFLECTIONS */}
        {/* Left Vertical Soft Glare */}
        <path
          d="M74 150 L74 366"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeOpacity="0.5"
          strokeLinecap="round"
        />
        {/* Right Edge Soft Glare */}
        <path
          d="M206 150 L206 366"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeOpacity="0.3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
