import React from 'react';
import { Play, RotateCcw, Home, Settings, Pause } from 'lucide-react';
import { sound } from '../utils/sound';
import { triggerHaptic } from '../utils/storage';

interface PauseMenuProps {
  currentLevel: number;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  onOpenSettings: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  currentLevel,
  onResume,
  onRestart,
  onHome,
  onOpenSettings,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-title"
    >
      <div className="w-full max-w-xs p-6 rounded-3xl bg-[#0e1b33] border border-cyan-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)] text-center select-none">
        {/* Pause Icon Header */}
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
          <Pause className="w-6 h-6 fill-current text-cyan-400" />
        </div>

        <h2 id="pause-title" className="text-2xl font-extrabold text-white tracking-tight">
          Game Paused
        </h2>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          Level {currentLevel} in progress
        </p>

        {/* Buttons List */}
        <div className="flex flex-col gap-2.5">
          {/* Resume */}
          <button
            onClick={() => {
              sound.playTap();
              triggerHaptic('light');
              onResume();
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current text-slate-950" />
            <span>Resume</span>
          </button>

          {/* Restart Level */}
          <button
            onClick={() => {
              sound.playTap();
              triggerHaptic('light');
              onRestart();
            }}
            className="w-full py-3 px-4 rounded-xl bg-[#142340] hover:bg-[#1c3055] border border-[#1e3a6a] text-slate-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <span>Restart Level</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              sound.playTap();
              triggerHaptic('light');
              onOpenSettings();
            }}
            className="w-full py-3 px-4 rounded-xl bg-[#142340] hover:bg-[#1c3055] border border-[#1e3a6a] text-slate-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings</span>
          </button>

          {/* Home */}
          <button
            onClick={() => {
              sound.playTap();
              triggerHaptic('light');
              onHome();
            }}
            className="w-full py-3 px-4 rounded-xl bg-[#0a1426] hover:bg-[#101e38] border border-[#172745] text-slate-400 hover:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
