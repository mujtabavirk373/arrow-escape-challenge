import React from 'react';
import { GameSettings } from '../types';
import { Volume2, VolumeX, Sparkles, Smartphone, ArrowLeft } from 'lucide-react';
import { triggerHaptic } from '../utils/storage';
import { sound } from '../utils/sound';
import { PWAInstallButton } from './PWAInstallButton';

interface SettingsScreenProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onBack,
}) => {
  const toggleSound = () => {
    const updated = !settings.soundEnabled;
    sound.setEnabled(updated);
    if (updated) {
      sound.playTap();
    }
    triggerHaptic('light');
    onUpdateSettings({ ...settings, soundEnabled: updated });
  };

  const toggleAnimations = () => {
    sound.playTap();
    triggerHaptic('light');
    onUpdateSettings({ ...settings, animationsEnabled: !settings.animationsEnabled });
  };

  const toggleHaptics = () => {
    sound.playTap();
    const updated = !settings.hapticsEnabled;
    if (updated && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(20);
    }
    onUpdateSettings({ ...settings, hapticsEnabled: updated });
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col justify-between h-full min-h-[520px] p-4 text-slate-100">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[#1b2f54]">
          <button
            onClick={() => {
              sound.playTap();
              triggerHaptic('light');
              onBack();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0f1c34] hover:bg-[#162a4d] border border-[#1e3a6a] text-cyan-400 font-semibold text-xs transition-all active:scale-95 cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h2 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-teal-300 to-blue-400 bg-clip-text text-transparent">
            Settings
          </h2>
          <div className="w-16" /> {/* Balance spacer */}
        </div>

        {/* Settings Toggles List */}
        <div className="mt-6 flex flex-col gap-3.5">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0d1830] border border-[#1c335a] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#142649] flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                {settings.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-cyan-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-500" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-100">Sound Effects</span>
                <span className="text-xs text-slate-400">Audio for moves and victories</span>
              </div>
            </div>

            <button
              onClick={toggleSound}
              role="switch"
              aria-checked={settings.soundEnabled}
              aria-label="Toggle Sound Effects"
              className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 cursor-pointer flex items-center ${
                settings.soundEnabled ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Animation Effects Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0d1830] border border-[#1c335a] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#142649] flex items-center justify-center text-teal-400 border border-teal-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-100">Animations & Sparks</span>
                <span className="text-xs text-slate-400">Flight trails and particle bursts</span>
              </div>
            </div>

            <button
              onClick={toggleAnimations}
              role="switch"
              aria-checked={settings.animationsEnabled}
              aria-label="Toggle Animations"
              className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 cursor-pointer flex items-center ${
                settings.animationsEnabled ? 'bg-teal-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                  settings.animationsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Haptic Feedback Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0d1830] border border-[#1c335a] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#142649] flex items-center justify-center text-blue-400 border border-blue-500/20">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-100">Haptic Feedback</span>
                <span className="text-xs text-slate-400">Vibration on taps (supported devices)</span>
              </div>
            </div>

            <button
              onClick={toggleHaptics}
              role="switch"
              aria-checked={settings.hapticsEnabled}
              aria-label="Toggle Haptic Feedback"
              className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 cursor-pointer flex items-center ${
                settings.hapticsEnabled ? 'bg-blue-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                  settings.hapticsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* PWA App Installation Row */}
          <PWAInstallButton variant="settings-row" />
        </div>

        {/* Info Box */}
        <div className="mt-8 p-3 rounded-xl bg-[#0a1324] border border-[#162747] text-center">
          <p className="text-xs text-slate-400">
            Arrow Escape Challenge · Offline Mode Active
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Progress is automatically saved to your device.
          </p>
        </div>
      </div>

      {/* Done CTA */}
      <div className="pt-6">
        <button
          onClick={() => {
            sound.playTap();
            triggerHaptic('light');
            onBack();
          }}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};
