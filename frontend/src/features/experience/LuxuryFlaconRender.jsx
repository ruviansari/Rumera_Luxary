import React from 'react';

/**
 * LuxuryFlaconRender
 * Renders an ultra-luxurious, crystal-faceted flacon with 24K gold filigree cap,
 * glistening amber extrait liquid, and refractive glass reflections.
 * Accepts an optional `imageUrl` prop for users to swap in their custom transparent bottle PNG.
 */
export default function LuxuryFlaconRender({
  imageUrl = null,
  glowColor = 'rgba(212, 175, 55, 0.45)',
  className = '',
  style = {}
}) {
  if (imageUrl) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`} style={style}>
        {/* Ambient Backlight Glow */}
        <div
          className="absolute -inset-6 rounded-full blur-2xl pointer-events-none"
          style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
        />
        <img
          src={imageUrl}
          alt="Rumera Luxury Flacon"
          className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)]"
          style={{ willChange: 'transform' }}
          onError={(e) => {
            // Fallback to vector render if image fails
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // High-fidelity handcrafted SVG Luxury Crystal Flacon
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={style}>
      {/* Ambient Volumetric Backlight */}
      <div
        className="absolute -inset-10 rounded-full blur-3xl pointer-events-none opacity-85"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.35) 0%, rgba(183, 139, 69, 0.15) 50%, transparent 75%)'
        }}
      />

      {/* Handcrafted Octagonal Haute Parfumerie Flacon */}
      <svg
        viewBox="0 0 320 460"
        className="relative z-10 w-full h-full max-h-[520px] filter drop-shadow-[0_30px_50px_rgba(0,0,0,0.92)] drop-shadow-[0_0_25px_rgba(212,175,55,0.25)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ willChange: 'transform' }}
      >
        <defs>
          {/* Gold Finial Gradient */}
          <linearGradient id="goldCapGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF2D1" />
            <stop offset="25%" stopColor="#D4AF37" />
            <stop offset="60%" stopColor="#966B24" />
            <stop offset="85%" stopColor="#DFBF5B" />
            <stop offset="100%" stopColor="#875E1C" />
          </linearGradient>

          {/* Liquid Amber Extract Gradient */}
          <linearGradient id="liquidAmberGrad" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#F5D061" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#C9891F" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#7B4709" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#4A2603" stopOpacity="1" />
          </linearGradient>

          {/* Heavy Crystal Facet Linear Gradients */}
          <linearGradient id="crystalFacetLeft" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="crystalFacetRight" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
          </linearGradient>

          {/* Gold Filigree Band Pattern */}
          <linearGradient id="goldFiligree" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#AA8238" />
            <stop offset="50%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#92621C" />
          </linearGradient>

          <filter id="glassInnerShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
            <feOffset dx="0" dy="4" />
            <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
            <feFlood floodColor="#FFFFFF" floodOpacity="0.25" />
            <feComposite in2="shadowDiff" operator="in" />
            <feComposite in2="SourceGraphic" operator="over" />
          </filter>
        </defs>

        {/* 1. Base Marble Shadow Reflection */}
        <ellipse cx="160" cy="440" rx="90" ry="12" fill="rgba(0,0,0,0.75)" filter="blur(8px)" />
        <ellipse cx="160" cy="438" rx="65" ry="6" fill="rgba(212,175,55,0.22)" filter="blur(4px)" />

        {/* 2. Glass Base Bottom Weight (Heavy Crystal Base) */}
        <polygon
          points="60,420 260,420 244,435 76,435"
          fill="url(#crystalFacetLeft)"
          stroke="#D4AF37"
          strokeWidth="0.8"
          strokeOpacity="0.4"
        />

        {/* 3. Main Crystal Bottle Body (Octagonal Flacon Architecture) */}
        <path
          d="M 90,140 L 230,140 L 265,195 L 265,395 L 245,420 L 75,420 L 55,395 L 55,195 Z"
          fill="#101815"
          fillOpacity="0.55"
          stroke="url(#goldCapGrad)"
          strokeWidth="1.6"
        />

        {/* 4. Rich Amber Perfume Extract (Liquid Interior Fill) */}
        <path
          d="M 94,180 L 226,180 L 253,220 L 253,390 L 237,410 L 83,410 L 67,390 L 67,220 Z"
          fill="url(#liquidAmberGrad)"
        />

        {/* Liquid Meniscus & Shimmer Waves */}
        <ellipse cx="160" cy="180" rx="66" ry="6" fill="#FDE68A" fillOpacity="0.75" />
        <path d="M 94,180 Q 160,186 226,180" stroke="#FFF" strokeWidth="1" strokeOpacity="0.6" />

        {/* 5. Beveled Glass Facets (Left & Right Highlights) */}
        <path
          d="M 90,140 L 125,160 L 125,410 L 75,420 L 55,395 L 55,195 Z"
          fill="url(#crystalFacetLeft)"
        />
        <path
          d="M 230,140 L 195,160 L 195,410 L 245,420 L 265,395 L 265,195 Z"
          fill="url(#crystalFacetRight)"
        />

        {/* Center Vertical Light Ray */}
        <line x1="160" y1="160" x2="160" y2="410" stroke="#FFF" strokeWidth="1.2" strokeOpacity="0.25" />

        {/* 6. Gold Enamelled Crest Cartouche / Label Plaque */}
        <g transform="translate(100, 240)">
          {/* Label Background */}
          <rect
            x="0"
            y="0"
            width="120"
            height="115"
            rx="6"
            fill="#090E0C"
            stroke="url(#goldCapGrad)"
            strokeWidth="1.5"
            filter="drop-shadow(0 4px 10px rgba(0,0,0,0.85))"
          />
          {/* Inner Golden Filigree Border */}
          <rect
            x="4"
            y="4"
            width="112"
            height="107"
            rx="4"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="0.8"
            strokeOpacity="0.6"
            strokeDasharray="2,2"
          />
          {/* Royal Crown Emblem */}
          <path
            d="M 50,22 L 53,28 L 60,18 L 67,28 L 70,22 L 68,32 L 52,32 Z"
            fill="url(#goldCapGrad)"
          />
          <circle cx="50" cy="20" r="1.5" fill="#FFF2D1" />
          <circle cx="60" cy="16" r="2" fill="#FFF2D1" />
          <circle cx="70" cy="20" r="1.5" fill="#FFF2D1" />

          {/* Typography */}
          <text
            x="60"
            y="48"
            textAnchor="middle"
            fill="#FAF7F0"
            fontSize="10"
            fontFamily="'Cormorant Garamond', Georgia, serif"
            letterSpacing="2.5"
            fontWeight="bold"
          >
            RUMÉRA
          </text>
          <text
            x="60"
            y="60"
            textAnchor="middle"
            fill="#D4AF37"
            fontSize="6"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            letterSpacing="1.8"
            fontWeight="600"
          >
            HAUTE PARFUMERIE
          </text>
          <line x1="30" y1="67" x2="90" y2="67" stroke="#D4AF37" strokeWidth="0.6" strokeOpacity="0.6" />
          <text
            x="60"
            y="79"
            textAnchor="middle"
            fill="#E5DFC9"
            fontSize="7.5"
            fontFamily="'Cormorant Garamond', Georgia, serif"
            fontStyle="italic"
          >
            Dehn Al Oud
          </text>
          <text
            x="60"
            y="90"
            textAnchor="middle"
            fill="#A0A0A0"
            fontSize="5"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            letterSpacing="1"
          >
            ROYAL EXTRAIT • 12 ML
          </text>
          <text
            x="60"
            y="102"
            textAnchor="middle"
            fill="#B78B45"
            fontSize="4.5"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            letterSpacing="1.2"
            fontWeight="bold"
          >
            KANNNAUJ • ASSAM
          </text>
        </g>

        {/* 7. Gold Filigree Collar Neck */}
        <rect
          x="125"
          y="120"
          width="70"
          height="20"
          rx="3"
          fill="url(#goldFiligree)"
          stroke="#47300D"
          strokeWidth="1"
          filter="drop-shadow(0 4px 6px rgba(0,0,0,0.6))"
        />
        {/* Intricate Filigree Details on Collar */}
        <circle cx="135" cy="130" r="2" fill="#3D290B" />
        <circle cx="145" cy="130" r="2" fill="#3D290B" />
        <circle cx="155" cy="130" r="2" fill="#3D290B" />
        <circle cx="165" cy="130" r="2" fill="#3D290B" />
        <circle cx="175" cy="130" r="2" fill="#3D290B" />
        <circle cx="185" cy="130" r="2" fill="#3D290B" />

        {/* 8. Crown Cap with Faceted Jewel Finial */}
        {/* Cap Base */}
        <path
          d="M 130,120 L 190,120 L 186,85 L 134,85 Z"
          fill="url(#goldCapGrad)"
          stroke="#523910"
          strokeWidth="1"
        />
        {/* Cap Center Ring */}
        <rect x="132" y="78" width="56" height="8" rx="2" fill="url(#goldFiligree)" />

        {/* Emerald/Onyx Faceted Royal Finial Jewel Dome */}
        <path
          d="M 142,78 C 142,48 178,48 178,78 Z"
          fill="linear-gradient(135deg, #1B352C 0%, #0D1E18 100%)"
          stroke="#D4AF37"
          strokeWidth="1.5"
        />
        <circle cx="160" cy="56" r="3" fill="#D4AF37" />
        <path d="M 152,78 L 160,50 L 168,78" stroke="#D4AF37" strokeWidth="0.8" strokeOpacity="0.6" />

        {/* Specular Glint Reflection on Glass Left Shoulder */}
        <path
          d="M 70,195 Q 60,250 64,370"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeOpacity="0.45"
          filter="blur(0.8px)"
        />
        <path
          d="M 80,185 L 88,155"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />
      </svg>
    </div>
  );
}
