import React, { useState } from 'react';
import { HeroIllustration } from './HeroIllustration';
import {
  Play,
  RotateCcw,
  Settings,
  Trophy,
  AlertTriangle,
  Calendar,
  Coins,
  CheckCircle2,
} from 'lucide-react';
import { sound } from '../utils/sound';
import { triggerHaptic } from '../utils/storage';
import { PWAInstallButton } from './PWAInstallButton';

interface HomeScreenProps {
  currentLevel: number;
  unlockedLevel: number;
  coins: number;
  isDailyCompletedToday: boolean;
  todayFormattedDate: string;
  onPlayNewGame: () => void;
  onContinue: () => void;
  onStartDaily: () => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentLevel,
  unlockedLevel,
  coins,
  isDailyCompletedToday,
  todayFormattedDate,
  onPlayNewGame,
  onContinue,
  onStartDaily,
  onOpenSettings,
}) => {
  const [showConfirmNewGame, setShowConfirmNewGame] = useState(false);

  const handlePlayClick = () => {
    sound.playTap();
    triggerHaptic('light');

    // If the user has made progress beyond level 1, ask for confirmation first
    if (unlockedLevel > 1 || currentLevel > 1) {
      setShowConfirmNewGame(true);
    } else {
      onPlayNewGame();
    }
  };

  const confirmStartNew = () => {
    sound.playTap();
    triggerHaptic('medium');
    setShowConfirmNewGame(false);
    onPlayNewGame();
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col justify-between items-center h-full min-h-[560px] px-4 py-3 text-slate-100 relative">
      {/* Top Header & Branding with Coin Counter and Install Option */}
      <div className="w-full flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 font-extrabold text-xs shadow-sm">
          <Coins className="w-4 h-4 text-amber-400 fill-amber-400/30" />
          <span className="tabular-nums">{coins}</span>
        </div>

        <div className="flex items-center gap-2">
          <PWAInstallButton variant="button" />

          <button
            onClick={() => {
              sound.playTap();
              triggerHaptic('light');
              onOpenSettings();
            }}
            className="w-8 h-8 rounded-xl bg-[#0e1a33] border border-[#1e345e] hover:border-cyan-400/50 flex items-center justify-center text-slate-400 hover:text-cyan-400 active:scale-90 transition-all cursor-pointer shadow-sm"
            aria-label="Settings"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Title & Hero Artwork */}
      <div className="my-auto py-1 flex flex-col items-center text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-teal-300 to-blue-400 bg-clip-text text-transparent drop-shadow-md">
          Arrow Escape
        </h1>
        <p className="text-[11px] tracking-widest uppercase font-semibold text-cyan-400/90 mt-0.5">
          Challenge
        </p>

        <HeroIllustration />

        {/* Highest Unlocked Level Metric */}
        <div className="mt-1 flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d1830] border border-[#1b3158] shadow-sm">
          <Trophy className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs text-slate-300 font-medium">
            Highest Level:
          </span>
          <span className="text-xs font-extrabold text-cyan-400 tabular-nums">
            {unlockedLevel}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col gap-2 pb-1">
        {/* Continue Button (if progress exists) */}
        {unlockedLevel > 1 || currentLevel > 1 ? (
          <button
            onClick={() => {
              sound.playTap();
              triggerHaptic('light');
              onContinue();
            }}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 active:scale-[0.98] text-slate-950 font-black text-sm shadow-[0_8px_25px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current text-slate-950" />
            <span>Continue Level {currentLevel}</span>
          </button>
        ) : null}

        {/* Daily Challenge Button */}
        <button
          onClick={() => {
            sound.playTap();
            triggerHaptic('light');
            onStartDaily();
          }}
          className={`w-full py-3 px-4 rounded-2xl border transition-all active:scale-[0.98] flex items-center justify-between cursor-pointer ${
            isDailyCompletedToday
              ? 'bg-[#12233f] hover:bg-[#182f54] border-emerald-500/40 text-slate-200'
              : 'bg-gradient-to-r from-[#172b52] to-[#12284c] hover:from-[#1d3768] hover:to-[#17325e] border-amber-400/50 shadow-[0_4px_20px_rgba(245,158,11,0.15)] text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isDailyCompletedToday
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold leading-tight">Daily Challenge</span>
              <span className="text-[10px] text-slate-400">{todayFormattedDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {isDailyCompletedToday ? (
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Done
              </span>
            ) : (
              <span className="text-[11px] font-extrabold text-amber-300 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40">
                <Coins className="w-3 h-3 fill-amber-300" />
                +25
              </span>
            )}
          </div>
        </button>

        {/* Play Button */}
        <button
          onClick={handlePlayClick}
          className={`w-full py-3 px-5 rounded-2xl active:scale-[0.98] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            unlockedLevel > 1 || currentLevel > 1
              ? 'bg-[#101e38] hover:bg-[#162a4d] border border-[#1e3a6a] text-slate-200 hover:text-white'
              : 'bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-[0_8px_25px_rgba(6,182,212,0.35)]'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>{unlockedLevel > 1 || currentLevel > 1 ? 'Start at Level 1' : 'Play Game'}</span>
        </button>
      </div>

      {/* Confirmation Modal when Play is pressed and progress exists */}
      {showConfirmNewGame && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
        >
          <div className="w-full max-w-xs p-5 rounded-2xl bg-[#0e1b34] border border-cyan-500/30 shadow-2xl text-center">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <h3 id="confirm-modal-title" className="text-lg font-bold text-slate-100">
              Start at Level 1?
            </h3>
            <p className="text-xs text-slate-300 mt-2 mb-4 leading-relaxed">
              You are currently on <span className="text-cyan-400 font-bold">Level {currentLevel}</span> (highest unlocked: {unlockedLevel}).
              Starting at Level 1 will reset the active board to Stage 1.
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={confirmStartNew}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all active:scale-95 cursor-pointer"
              >
                Yes, Start Level 1
              </button>
              <button
                onClick={() => {
                  sound.playTap();
                  setShowConfirmNewGame(false);
                }}
                className="w-full py-2.5 rounded-xl bg-[#142340] hover:bg-[#1c3055] text-slate-300 font-semibold text-xs transition-all active:scale-95 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
