import React from 'react';
import { Direction, ArrowColorTheme } from '../types';

interface ArrowGraphicProps {
  direction: Direction;
  colorTheme?: ArrowColorTheme;
  isBlocked?: boolean;
}

export const ArrowGraphic: React.FC<ArrowGraphicProps> = ({
  direction,
  colorTheme = 'cyan',
  isBlocked = false,
}) => {
  // Rotation mapping
  const rotationDegrees: Record<Direction, number> = {
    UP: 0,
    RIGHT: 90,
    DOWN: 180,
    LEFT: 270,
  };

  const rot = rotationDegrees[direction];

  // Theme palettes
  const themeConfig = {
    cyan: {
      gradientStart: '#22d3ee', // bright cyan
      gradientMid: '#06b6d4',
      gradientEnd: '#0891b2',
      glow: 'rgba(6, 182, 212, 0.45)',
      stroke: '#67e8f9',
      innerHighlight: '#cffafe',
      accent: '#083344',
    },
    turquoise: {
      gradientStart: '#34d399', // bright turquoise / mint
      gradientMid: '#14b8a6',
      gradientEnd: '#0f766e',
      glow: 'rgba(20, 184, 166, 0.45)',
      stroke: '#5eead4',
      innerHighlight: '#ccfbf1',
      accent: '#042f2e',
    },
    blue: {
      gradientStart: '#60a5fa', // vibrant electric sky/blue
      gradientMid: '#3b82f6',
      gradientEnd: '#1d4ed8',
      glow: 'rgba(59, 130, 246, 0.45)',
      stroke: '#93c5fd',
      innerHighlight: '#dbeafe',
      accent: '#172554',
    },
  }[colorTheme];

  const idPrefix = `${colorTheme}-${direction}`;

  return (
    <div
      className="w-full h-full flex items-center justify-center transition-transform duration-200"
      style={{
        transform: `rotate(${rot}deg)`,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-[82%] h-[82%] drop-shadow-md select-none pointer-events-none"
        style={{
          filter: isBlocked
            ? 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))'
            : `drop-shadow(0 0 8px ${themeConfig.glow})`,
        }}
        aria-hidden="true"
      >
        <defs>
          {/* Main Gradient */}
          <linearGradient id={`grad-${idPrefix}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              stopColor={isBlocked ? '#f87171' : themeConfig.gradientStart}
            />
            <stop
              offset="50%"
              stopColor={isBlocked ? '#ef4444' : themeConfig.gradientMid}
            />
            <stop
              offset="100%"
              stopColor={isBlocked ? '#b91c1c' : themeConfig.gradientEnd}
            />
          </linearGradient>

          {/* Inner Light Beam */}
          <linearGradient id={`shine-${idPrefix}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer Shadow Base / Silhouette */}
        <path
          d="M 50 8 
             L 86 44 
             L 66 44 
             L 66 84 
             C 66 88, 62 92, 58 92 
             L 42 92 
             C 38 92, 34 88, 34 84 
             L 34 44 
             L 14 44 
             Z"
          fill="rgba(0, 0, 0, 0.35)"
          transform="translate(0, 3)"
        />

        {/* Arrow Main Body */}
        <path
          d="M 50 8 
             L 86 44 
             L 66 44 
             L 66 84 
             C 66 88, 62 92, 58 92 
             L 42 92 
             C 38 92, 34 88, 34 84 
             L 34 44 
             L 14 44 
             Z"
          fill={`url(#grad-${idPrefix})`}
          stroke={isBlocked ? '#fca5a5' : themeConfig.stroke}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Sharp Arrowhead Ridge Accent */}
        <path
          d="M 50 14 L 50 86"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* High-Gloss Bevel On Top Arrowhead */}
        <path
          d="M 50 12 L 80 42 L 64 42 L 50 26 L 36 42 L 20 42 Z"
          fill={`url(#shine-${idPrefix})`}
          opacity="0.6"
        />

        {/* Directional Chevron Chevron Inner Notch */}
        <polyline
          points="32,46 50,28 68,46"
          fill="none"
          stroke="rgba(255, 255, 255, 0.55)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
