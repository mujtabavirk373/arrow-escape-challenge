import React from 'react';
import { Arrow, Direction } from '../types';
import { ArrowGraphic } from './ArrowGraphic';

interface EscapingArrowData {
  id: string;
  direction: Direction;
  row: number;
  col: number;
  colorTheme: string;
}

interface GameBoardProps {
  arrows: Arrow[];
  gridSize?: number;
  onArrowClick: (arrow: Arrow) => void;
  blockedArrowId: string | null;
  blockingArrowId: string | null;
  escapingArrow: EscapingArrowData | null;
  blockedPosition: { row: number; col: number } | null;
  isInputLocked?: boolean;
  animationsEnabled?: boolean;
}

// 6 radial spark trajectories for escape burst
const SPARKS = [
  { x: 0, y: -26 },
  { x: 23, y: -13 },
  { x: 23, y: 13 },
  { x: 0, y: 26 },
  { x: -23, y: 13 },
  { x: -23, y: -13 },
];

export const GameBoard: React.FC<GameBoardProps> = ({
  arrows,
  gridSize = 5,
  onArrowClick,
  blockedArrowId,
  blockingArrowId,
  escapingArrow,
  blockedPosition,
  isInputLocked = false,
  animationsEnabled = true,
}) => {
  const rows = Array.from({ length: gridSize }, (_, i) => i);
  const cols = Array.from({ length: gridSize }, (_, i) => i);
  const cellStepPct = 100 / gridSize;

  // Helper to get escape translation distance based on direction
  const getEscapeTransform = (direction: Direction) => {
    switch (direction) {
      case 'UP':
        return 'translateY(-360px) scale(0.9)';
      case 'DOWN':
        return 'translateY(360px) scale(0.9)';
      case 'LEFT':
        return 'translateX(-360px) scale(0.9)';
      case 'RIGHT':
        return 'translateX(360px) scale(0.9)';
    }
  };

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-square mx-auto p-2 sm:p-2.5 bg-[#0d162a]/90 backdrop-blur-sm rounded-2xl border border-cyan-500/20 shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_24px_rgba(6,182,212,0.12)] select-none">
      {/* Dynamic Grid Cells */}
      <div
        className="grid gap-1 sm:gap-1.5 w-full h-full relative"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {rows.map((r) =>
          cols.map((c) => {
            const arrow = arrows.find((a) => a.row === r && a.col === c);
            const isBlocked = arrow && blockedArrowId === arrow.id;
            const isBlocking = arrow && blockingArrowId === arrow.id;
            const isEscaping = arrow && escapingArrow?.id === arrow.id;

            return (
              <div
                key={`${r}-${c}`}
                className={`relative rounded-xl flex items-center justify-center transition-all duration-150 ${
                  arrow
                    ? 'bg-[#111f38] border border-[#1e345b] shadow-inner cursor-pointer hover:border-cyan-400/50 active:scale-95'
                    : 'bg-[#091122]/60 border border-[#14233f]/40'
                } ${
                  isBlocking
                    ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#080d1a] bg-[#1a2333]'
                    : ''
                }`}
                onClick={() => {
                  if (arrow && !isEscaping && !isInputLocked) {
                    onArrowClick(arrow);
                  }
                }}
                role={arrow ? 'button' : undefined}
                aria-label={
                  arrow
                    ? `Arrow pointing ${arrow.direction} at row ${r + 1}, column ${c + 1}`
                    : undefined
                }
                tabIndex={arrow && !isInputLocked ? 0 : -1}
                onKeyDown={(e) => {
                  if (arrow && !isEscaping && !isInputLocked && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onArrowClick(arrow);
                  }
                }}
              >
                {/* Arrow rendering */}
                {arrow && (
                  <div
                    className={`w-full h-full flex items-center justify-center transition-all ${
                      isBlocked ? 'animate-shake' : ''
                    }`}
                    style={{
                      transform: isEscaping
                        ? getEscapeTransform(escapingArrow.direction)
                        : undefined,
                      opacity: isEscaping ? 0 : 1,
                      transitionDuration: isEscaping ? '360ms' : '150ms',
                      transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
                    }}
                  >
                    <ArrowGraphic
                      direction={arrow.direction}
                      colorTheme={arrow.colorTheme}
                      isBlocked={Boolean(isBlocked)}
                    />
                  </div>
                )}

                {/* Subtle cell coordinate dot for empty cells */}
                {!arrow && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1c2c4d]/40 pointer-events-none" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Tasteful escape particle burst effect */}
      {escapingArrow && animationsEnabled && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            top: `${escapingArrow.row * cellStepPct + cellStepPct / 2}%`,
            left: `${escapingArrow.col * cellStepPct + cellStepPct / 2}%`,
            transform: 'translate(-50%, -50%)',
          }}
          aria-hidden="true"
        >
          {/* Radial shockwave pulse */}
          <div className="w-10 h-10 -ml-5 -mt-5 rounded-full border-2 border-cyan-400 animate-escape-burst" />

          {/* Spark particles */}
          {SPARKS.map((spark, idx) => (
            <div
              key={idx}
              className="absolute w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-cyan-300 animate-spark"
              style={
                {
                  '--tx': `${spark.x}px`,
                  '--ty': `${spark.y}px`,
                  boxShadow: '0 0 6px rgba(34, 211, 238, 0.85)',
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* Floating "Blocked!" banner / message */}
      {blockedPosition && (
        <div
          className="absolute z-30 pointer-events-none flex flex-col items-center transition-all duration-200 animate-in fade-in zoom-in-95"
          style={{
            top: `${blockedPosition.row * cellStepPct + 2}%`,
            left: `${blockedPosition.col * cellStepPct + cellStepPct / 2}%`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="px-2.5 py-1 bg-red-500 text-white font-bold text-xs tracking-wider uppercase rounded-md shadow-lg shadow-red-500/40 border border-red-300 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            Blocked!
          </div>
          {/* Tooltip triangle */}
          <div className="w-2 h-2 bg-red-500 rotate-45 -mt-1 border-r border-b border-red-300" />
        </div>
      )}
    </div>
  );
};
