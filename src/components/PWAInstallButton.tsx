import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, PlusSquare, X, CheckCircle2, Smartphone } from 'lucide-react';
import { sound } from '../utils/sound';
import { triggerHaptic } from '../utils/storage';

interface PWAInstallButtonProps {
  variant?: 'banner' | 'button' | 'settings-row';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'button',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showFallbackModal, setShowFallbackModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already installed into standalone mode, hide from main screen or show installed badge in settings
  if (isInstalled) {
    if (variant === 'settings-row') {
      return (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0d1830] border border-[#1c335a] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-100">App Installed</span>
              <span className="text-xs text-slate-400">Running standalone offline app</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            Active
          </span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    sound.playTap();
    triggerHaptic('light');

    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 3000);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowFallbackModal(true);
    }
  };

  return (
    <>
      {variant === 'settings-row' ? (
        <div className={`flex items-center justify-between p-3.5 rounded-2xl bg-[#0d1830] border border-[#1c335a] shadow-sm ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-100">Install Arrow Escape</span>
              <span className="text-xs text-slate-400">Add to home screen for offline play</span>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all active:scale-95 cursor-pointer shadow-sm shadow-cyan-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
        </div>
      ) : variant === 'banner' ? (
        <div className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-950/80 to-[#0e1d38] border border-cyan-500/40 shadow-lg ${className}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white">Install App</span>
              <span className="text-[10px] text-cyan-200/80">Play full screen & offline</span>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs active:scale-95 transition-all shadow cursor-pointer"
          >
            Install
          </button>
        </div>
      ) : (
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-bold text-xs active:scale-95 transition-all cursor-pointer shadow-sm ${className}`}
          title="Install app to Home Screen"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Install App</span>
        </button>
      )}

      {/* Success Notification */}
      {installSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-2xl animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>App installed successfully!</span>
        </div>
      )}

      {/* iOS Safari Guided Install Dialog */}
      {showIOSModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-modal-title"
        >
          <div className="w-full max-w-xs p-5 rounded-2xl bg-[#0e1b34] border border-cyan-500/40 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-[#1d3560]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 id="ios-modal-title" className="text-base font-extrabold text-white">
                  Install on iOS
                </h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="w-7 h-7 rounded-lg bg-[#142649] flex items-center justify-center text-slate-400 hover:text-white"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Install <strong>Arrow Escape</strong> on your iPhone or iPad for instant offline access and fullscreen gameplay:
            </p>

            <ol className="mt-4 space-y-3 text-xs text-slate-200">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  1
                </span>
                <span>
                  Tap the <strong className="text-cyan-300 inline-flex items-center gap-1"><Share2 className="w-3.5 h-3.5 inline" /> Share</strong> button in Safari's bottom toolbar.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  2
                </span>
                <span>
                  Scroll down and tap <strong className="text-cyan-300 inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5 inline" /> Add to Home Screen</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  3
                </span>
                <span>
                  Tap <strong className="text-cyan-300">Add</strong> in the top right corner.
                </span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-xs transition-all active:scale-95 cursor-pointer shadow-md"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Browser Fallback Modal */}
      {showFallbackModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="fallback-modal-title"
        >
          <div className="w-full max-w-xs p-5 rounded-2xl bg-[#0e1b34] border border-cyan-500/40 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-[#1d3560]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                  <Download className="w-4 h-4" />
                </div>
                <h3 id="fallback-modal-title" className="text-base font-extrabold text-white">
                  Install Arrow Escape
                </h3>
              </div>
              <button
                onClick={() => setShowFallbackModal(false)}
                className="w-7 h-7 rounded-lg bg-[#142649] flex items-center justify-center text-slate-400 hover:text-white"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              To install this web app on your device:
            </p>

            <ul className="mt-3 space-y-2 text-xs text-slate-200 list-disc list-inside">
              <li>
                In Chrome / Edge: Click the <strong>Install</strong> icon in the address bar or select <strong>Install app</strong> from the browser menu (⋮).
              </li>
              <li>
                On Android: Tap the <strong>⋮</strong> menu in Chrome and choose <strong>Add to Home screen</strong> or <strong>Install app</strong>.
              </li>
            </ul>

            <button
              onClick={() => setShowFallbackModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-xs transition-all active:scale-95 cursor-pointer shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
