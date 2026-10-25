import React from 'react';

export const HeroIllustration: React.FC = () => {
  return (
    <div className="relative w-64 h-56 mx-auto flex items-center justify-center select-none pointer-events-none">
      {/* Ambient background aura */}
      <div className="absolute inset-0 bg-cyan-500/10 blur-2xl rounded-full" />

      <svg
        viewBox="0 0 260 220"
        className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)]"
        aria-hidden="true"
      >
        <defs>
          {/* Cyan Gradient */}
          <linearGradient id="hero-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>

          {/* Turquoise Gradient */}
          <linearGradient id="hero-turq" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>

          {/* Vivid Blue Gradient */}
          <linearGradient id="hero-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          {/* Grid Tile Gradient */}
          <linearGradient id="tile-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#142442" />
            <stop offset="100%" stopColor="#091122" />
          </linearGradient>

          {/* Trajectory Dash Gradient */}
          <linearGradient id="trail-cyan" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="trail-blue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Outer Grid Board Base (Isometric/Angled) */}
        <rect
          x="40"
          y="35"
          width="180"
          height="150"
          rx="18"
          fill="#0c172e"
          stroke="#1e3a6a"
          strokeWidth="2.5"
        />

        {/* 3x3 Isometric Cell Slots */}
        {[
          { x: 50, y: 45 },
          { x: 106, y: 45 },
          { x: 162, y: 45 },
          { x: 50, y: 91 },
          { x: 106, y: 91 },
          { x: 162, y: 91 },
          { x: 50, y: 137 },
          { x: 106, y: 137 },
          { x: 162, y: 137 },
        ].map((pos, i) => (
          <rect
            key={i}
            x={pos.x}
            y={pos.y}
            width="48"
            height="38"
            rx="8"
            fill="url(#tile-grad)"
            stroke="#1b2e54"
            strokeWidth="1.5"
          />
        ))}

        {/* Escape Trajectory Trails */}
        <line
          x1="130"
          y1="85"
          x2="130"
          y2="10"
          stroke="url(#trail-cyan)"
          strokeWidth="3"
          strokeDasharray="4 3"
        />
        <line
          x1="162"
          y1="110"
          x2="245"
          y2="110"
          stroke="url(#trail-blue)"
          strokeWidth="3"
          strokeDasharray="4 3"
        />

        {/* Center Arrow: Pointing UP escaping the grid */}
        <g transform="translate(130, 36) scale(0.65)">
          <path
            d="M 0 -38 L 28 2 L 12 2 L 12 36 C 12 40, 8 44, 0 44 C -8 44, -12 40, -12 36 L -12 2 L -28 2 Z"
            fill="url(#hero-cyan)"
            stroke="#67e8f9"
            strokeWidth="3.5"
            filter="drop-shadow(0 0 10px rgba(34, 211, 238, 0.7))"
          />
          <polyline
            points="-12,4 0,-14 12,4"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* Right Arrow: Pointing RIGHT escaping */}
        <g transform="translate(200, 110) rotate(90) scale(0.6)">
          <path
            d="M 0 -38 L 28 2 L 12 2 L 12 36 C 12 40, 8 44, 0 44 C -8 44, -12 40, -12 36 L -12 2 L -28 2 Z"
            fill="url(#hero-blue)"
            stroke="#93c5fd"
            strokeWidth="3.5"
            filter="drop-shadow(0 0 10px rgba(96, 165, 250, 0.7))"
          />
        </g>

        {/* Left Arrow: Inside cell pointing LEFT */}
        <g transform="translate(74, 110) rotate(270) scale(0.55)">
          <path
            d="M 0 -38 L 28 2 L 12 2 L 12 36 C 12 40, 8 44, 0 44 C -8 44, -12 40, -12 36 L -12 2 L -28 2 Z"
            fill="url(#hero-turq)"
            stroke="#5eead4"
            strokeWidth="3.5"
            filter="drop-shadow(0 0 8px rgba(52, 211, 153, 0.6))"
          />
        </g>

        {/* Bottom Arrow: Inside cell pointing DOWN */}
        <g transform="translate(130, 156) rotate(180) scale(0.55)">
          <path
            d="M 0 -38 L 28 2 L 12 2 L 12 36 C 12 40, 8 44, 0 44 C -8 44, -12 40, -12 36 L -12 2 L -28 2 Z"
            fill="url(#hero-cyan)"
            stroke="#67e8f9"
            strokeWidth="3.5"
            filter="drop-shadow(0 0 8px rgba(34, 211, 238, 0.6))"
          />
        </g>

        {/* Sparkling particle starlets */}
        <circle cx="45" cy="30" r="2" fill="#22d3ee" className="animate-pulse" />
        <circle cx="218" cy="40" r="1.5" fill="#38bdf8" />
        <circle cx="230" cy="180" r="2" fill="#34d399" className="animate-pulse" />
        <circle cx="32" cy="165" r="1.5" fill="#60a5fa" />
      </svg>
    </div>
  );
};
