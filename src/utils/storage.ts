// Storage utility for local progress persistence, settings, and coins with in-memory fallback
import { GameSettings, CoinData } from '../types';

const STORAGE_KEYS = {
  UNLOCKED_LEVEL: 'arrow_escape_unlocked_level',
  CURRENT_LEVEL: 'arrow_escape_current_level',
  COMPLETED_LEVELS: 'arrow_escape_completed_levels',
  SETTINGS: 'arrow_escape_settings',
  COINS: 'arrow_escape_coins',
  REWARDED_LEVELS: 'arrow_escape_rewarded_levels',
  REWARDED_DAILY_DATES: 'arrow_escape_rewarded_daily_dates',
};

// In-memory fallback if localStorage is disabled or throws
const memoryFallback: Record<string, string> = {};

function safeGet(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    // Fallback
  }
  return memoryFallback[key] || null;
}

function safeSet(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // Fallback
  }
  memoryFallback[key] = value;
}

export function getSavedProgress(): {
  unlockedLevel: number;
  currentLevel: number;
  completedLevels: number[];
} {
  const rawUnlocked = safeGet(STORAGE_KEYS.UNLOCKED_LEVEL);
  const rawCurrent = safeGet(STORAGE_KEYS.CURRENT_LEVEL);
  const rawCompleted = safeGet(STORAGE_KEYS.COMPLETED_LEVELS);

  const unlockedLevel = rawUnlocked ? Math.max(1, parseInt(rawUnlocked, 10) || 1) : 1;
  const currentLevel = rawCurrent ? Math.max(1, parseInt(rawCurrent, 10) || 1) : 1;

  let completedLevels: number[] = [];
  if (rawCompleted) {
    try {
      const parsed = JSON.parse(rawCompleted);
      if (Array.isArray(parsed)) {
        completedLevels = parsed.map((n) => Number(n)).filter((n) => !isNaN(n));
      }
    } catch {
      completedLevels = [];
    }
  }

  return { unlockedLevel, currentLevel, completedLevels };
}

export function saveProgress(
  currentLevel: number,
  unlockedLevel: number,
  completedLevels: number[]
): void {
  safeSet(STORAGE_KEYS.CURRENT_LEVEL, currentLevel.toString());
  safeSet(STORAGE_KEYS.UNLOCKED_LEVEL, unlockedLevel.toString());
  safeSet(STORAGE_KEYS.COMPLETED_LEVELS, JSON.stringify(completedLevels));
}

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  animationsEnabled: true,
  hapticsEnabled: true,
};

export function getSavedSettings(): GameSettings {
  const raw = safeGet(STORAGE_KEYS.SETTINGS);
  if (!raw) return { ...DEFAULT_SETTINGS };

  try {
    const parsed = JSON.parse(raw);
    return {
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
      animationsEnabled: typeof parsed.animationsEnabled === 'boolean' ? parsed.animationsEnabled : true,
      hapticsEnabled: typeof parsed.hapticsEnabled === 'boolean' ? parsed.hapticsEnabled : true,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: GameSettings): void {
  safeSet(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// Safe haptic feedback trigger
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' = 'light'): void {
  try {
    const settings = getSavedSettings();
    if (!settings.hapticsEnabled) return;

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      if (type === 'light') navigator.vibrate(12);
      else if (type === 'medium') navigator.vibrate(28);
      else if (type === 'heavy') navigator.vibrate([35, 20, 35]);
    }
  } catch {
    // Unsupported or blocked
  }
}

// --- Date Helpers ---
export function getLocalDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getFormattedDate(dateStr?: string): string {
  try {
    let dateObj: Date;
    if (dateStr) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      } else {
        dateObj = new Date();
      }
    } else {
      dateObj = new Date();
    }
    return dateObj.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr || 'Today';
  }
}

// --- Coin Rewards Management ---
export function getCoinsData(): CoinData {
  const rawCoins = safeGet(STORAGE_KEYS.COINS);
  const rawRewardedLevels = safeGet(STORAGE_KEYS.REWARDED_LEVELS);
  const rawRewardedDaily = safeGet(STORAGE_KEYS.REWARDED_DAILY_DATES);

  const coins = rawCoins ? Math.max(0, parseInt(rawCoins, 10) || 0) : 0;

  let rewardedLevelIds: number[] = [];
  if (rawRewardedLevels) {
    try {
      const parsed = JSON.parse(rawRewardedLevels);
      if (Array.isArray(parsed)) {
        rewardedLevelIds = parsed.map((n) => Number(n)).filter((n) => !isNaN(n));
      }
    } catch {
      rewardedLevelIds = [];
    }
  }

  let rewardedDailyDates: string[] = [];
  if (rawRewardedDaily) {
    try {
      const parsed = JSON.parse(rawRewardedDaily);
      if (Array.isArray(parsed)) {
        rewardedDailyDates = parsed.filter((s) => typeof s === 'string');
      }
    } catch {
      rewardedDailyDates = [];
    }
  }

  return { coins, rewardedLevelIds, rewardedDailyDates };
}

export function hasClaimedLevel(levelId: number): boolean {
  const { rewardedLevelIds } = getCoinsData();
  return rewardedLevelIds.includes(levelId);
}

export function hasClaimedDailyToday(dateStr: string): boolean {
  const { rewardedDailyDates } = getCoinsData();
  return rewardedDailyDates.includes(dateStr);
}

export function addCoinsForNormalLevel(levelId: number): {
  awarded: boolean;
  coinsAwarded: number;
  newTotal: number;
} {
  const data = getCoinsData();
  if (data.rewardedLevelIds.includes(levelId)) {
    return { awarded: false, coinsAwarded: 0, newTotal: data.coins };
  }

  const coinsAwarded = 10;
  const newTotal = data.coins + coinsAwarded;
  const updatedRewarded = [...data.rewardedLevelIds, levelId];

  safeSet(STORAGE_KEYS.COINS, newTotal.toString());
  safeSet(STORAGE_KEYS.REWARDED_LEVELS, JSON.stringify(updatedRewarded));

  return { awarded: true, coinsAwarded, newTotal };
}

export function addCoinsForDaily(dateStr: string): {
  awarded: boolean;
  coinsAwarded: number;
  newTotal: number;
} {
  const data = getCoinsData();
  if (data.rewardedDailyDates.includes(dateStr)) {
    return { awarded: false, coinsAwarded: 0, newTotal: data.coins };
  }

  const coinsAwarded = 25;
  const newTotal = data.coins + coinsAwarded;
  const updatedRewarded = [...data.rewardedDailyDates, dateStr];

  safeSet(STORAGE_KEYS.COINS, newTotal.toString());
  safeSet(STORAGE_KEYS.REWARDED_DAILY_DATES, JSON.stringify(updatedRewarded));

  return { awarded: true, coinsAwarded, newTotal };
}
