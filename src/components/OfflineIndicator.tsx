import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-xs w-[90%] flex items-center justify-center gap-2 rounded-xl bg-[#142340]/95 backdrop-blur-md border border-amber-500/50 px-3.5 py-2 text-xs font-medium text-amber-200 shadow-xl shadow-black/50 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
      </span>
      <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      <span className="truncate">Offline Mode — Cached game active</span>
    </div>
  );
};
