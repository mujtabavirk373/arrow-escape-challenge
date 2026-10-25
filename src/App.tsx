/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Arrow, Direction, ScreenState, GameMode, GameSettings } from './types';
import { GameBoard } from './components/GameBoard';
import { HomeScreen } from './components/HomeScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { PauseMenu } from './components/PauseMenu';
import { OfflineIndicator } from './components/OfflineIndicator';
import { sound } from './utils/sound';
import {
  getLevelData,
  getDailyChallenge,
  getPathCells,
} from './utils/puzzleGenerator';
import {
  getSavedProgress,
  saveProgress,
  getSavedSettings,
  saveSettings,
  triggerHaptic,
  getCoinsData,
  addCoinsForNormalLevel,
  addCoinsForDaily,
  getLocalDateString,
  getFormattedDate,
} from './utils/storage';
import {
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Pause,
  Sparkles,
  Coins,
  Home,
  Calendar,
} from 'lucide-react';

export default function App() {
  // Navigation & Game Mode State
  const [screen, setScreen] = useState<ScreenState>('HOME');
  const [gameMode, setGameMode] = useState<GameMode>('NORMAL');
  const [previousScreen, setPreviousScreen] = useState<'HOME' | 'GAME'>('HOME');
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Settings State
  const [settings, setSettings] = useState<GameSettings>(() => getSavedSettings());

  // Date and Coin Rewards State
  const todayDate = useRef(getLocalDateString()).current;
  const initialCoinsData = useRef(getCoinsData()).current;
  const [coins, setCoins] = useState<number>(initialCoinsData.coins);
  const [rewardMessage, setRewardMessage] = useState<{
    text: string;
    coinsAwarded: number;
    isNewReward: boolean;
  } | null>(null);

  // Load saved normal level progress
  const initialProgress = useRef(getSavedProgress()).current;
  const [currentLevel, setCurrentLevel] = useState<number>(initialProgress.currentLevel);
  const [unlockedLevel, setUnlockedLevel] = useState<number>(initialProgress.unlockedLevel);
  const [completedLevels, setCompletedLevels] = useState<number[]>(initialProgress.completedLevels);

  // Active level data: either from normal level progression or daily challenge
  const activeLevelData =
    gameMode === 'NORMAL'
      ? getLevelData(currentLevel)
      : getDailyChallenge(todayDate);

  const totalArrows = activeLevelData.arrows.length;

  const [arrows, setArrows] = useState<Arrow[]>(activeLevelData.arrows);
  const [arrowsLeft, setArrowsLeft] = useState<number>(activeLevelData.arrows.length);
  const [blockedArrowId, setBlockedArrowId] = useState<string | null>(null);
  const [blockingArrowId, setBlockingArrowId] = useState<string | null>(null);
  const [blockedPosition, setBlockedPosition] = useState<{ row: number; col: number } | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [escapingArrow, setEscapingArrow] = useState<{
    id: string;
    direction: Direction;
    row: number;
    col: number;
    colorTheme: string;
  } | null>(null);
  const [isLevelComplete, setIsLevelComplete] = useState<boolean>(false);
  const [isInputLocked, setIsInputLocked] = useState<boolean>(false);

  const isAnimatingRef = useRef(false);
  const animatingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const blockedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if daily was completed today
  const isDailyCompletedToday = getCoinsData().rewardedDailyDates.includes(todayDate);

  // Sync sound manager enabled state with settings
  useEffect(() => {
    sound.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const handleUpdateSettings = useCallback((newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  }, []);

  // Load a normal level
  const loadNormalLevel = useCallback(
    (lvlNum: number) => {
      if (lvlNum < 1) return;

      if (blockedTimeoutRef.current) clearTimeout(blockedTimeoutRef.current);
      if (animatingTimeoutRef.current) clearTimeout(animatingTimeoutRef.current);
      isAnimatingRef.current = false;
      setIsInputLocked(false);

      const target = getLevelData(lvlNum);
      setGameMode('NORMAL');
      setCurrentLevel(lvlNum);
      setArrows(target.arrows);
      setArrowsLeft(target.arrows.length);
      setBlockedArrowId(null);
      setBlockingArrowId(null);
      setBlockedPosition(null);
      setEscapingArrow(null);
      setIsLevelComplete(false);
      setIsPaused(false);
      setStatusMessage(null);
      setRewardMessage(null);

      saveProgress(lvlNum, unlockedLevel, completedLevels);
    },
    [unlockedLevel, completedLevels]
  );

  // Start Daily Challenge
  const startDailyChallenge = useCallback(() => {
    if (blockedTimeoutRef.current) clearTimeout(blockedTimeoutRef.current);
    if (animatingTimeoutRef.current) clearTimeout(animatingTimeoutRef.current);
    isAnimatingRef.current = false;
    setIsInputLocked(false);

    const daily = getDailyChallenge(todayDate);
    setGameMode('DAILY');
    setArrows(daily.arrows);
    setArrowsLeft(daily.arrows.length);
    setBlockedArrowId(null);
    setBlockingArrowId(null);
    setBlockedPosition(null);
    setEscapingArrow(null);
    setIsLevelComplete(false);
    setIsPaused(false);
    setStatusMessage(null);
    setRewardMessage(null);

    setScreen('GAME');
  }, [todayDate]);

  // Switch level with navigation buttons in normal mode
  const handlePrevLevel = () => {
    if (currentLevel > 1 && gameMode === 'NORMAL') {
      sound.playTap();
      triggerHaptic('light');
      loadNormalLevel(currentLevel - 1);
    }
  };

  const handleNextLevelNav = () => {
    if (currentLevel < unlockedLevel && gameMode === 'NORMAL') {
      sound.playTap();
      triggerHaptic('light');
      loadNormalLevel(currentLevel + 1);
    }
  };

  // Find if another arrow blocks its path
  const findBlocker = (arrow: Arrow, currentArrows: Arrow[]): Arrow | null => {
    const currentGridSize = activeLevelData.gridSize || 5;
    const path = getPathCells(arrow.row, arrow.col, arrow.direction, currentGridSize);
    for (const cell of path) {
      const blocker = currentArrows.find(
        (a) => a.id !== arrow.id && a.row === cell.row && a.col === cell.col
      );
      if (blocker) {
        return blocker;
      }
    }
    return null;
  };

  // Handle arrow tap
  const handleArrowClick = useCallback(
    (arrow: Arrow) => {
      // Prevent input during active animations, double taps, level completion, or pause
      if (isAnimatingRef.current || isInputLocked || isLevelComplete || isPaused) return;

      const blocker = findBlocker(arrow, arrows);

      if (blocker) {
        // Path is blocked
        sound.playBlocked();
        triggerHaptic('medium');
        setBlockedArrowId(arrow.id);
        setBlockingArrowId(blocker.id);
        setBlockedPosition({ row: arrow.row, col: arrow.col });
        setStatusMessage('Blocked! Another arrow is in the way.');

        if (blockedTimeoutRef.current) {
          clearTimeout(blockedTimeoutRef.current);
        }

        blockedTimeoutRef.current = setTimeout(() => {
          setBlockedArrowId(null);
          setBlockingArrowId(null);
          setBlockedPosition(null);
          setStatusMessage(null);
        }, 850);
      } else {
        // Path is clear! Lock input immediately to prevent double-tap
        isAnimatingRef.current = true;
        setIsInputLocked(true);
        sound.playEscape();
        triggerHaptic('light');

        // Update arrows-left counter immediately (guaranteed non-negative)
        const nextArrowsLeft = Math.max(0, arrowsLeft - 1);
        setArrowsLeft(nextArrowsLeft);
        setStatusMessage('Arrow escaped!');

        // Trigger escape animation with spark position
        setEscapingArrow({
          id: arrow.id,
          direction: arrow.direction,
          row: arrow.row,
          col: arrow.col,
          colorTheme: arrow.colorTheme,
        });

        const duration = settings.animationsEnabled ? 360 : 70;

        // Remove the arrow only after the exit animation completes
        animatingTimeoutRef.current = setTimeout(() => {
          setArrows((prev) => {
            const remaining = prev.filter((a) => a.id !== arrow.id);
            if (remaining.length === 0) {
              sound.playVictory();
              triggerHaptic('heavy');

              if (gameMode === 'NORMAL') {
                // Normal Level complete logic
                const reward = addCoinsForNormalLevel(currentLevel);
                if (reward.awarded) {
                  setCoins(reward.newTotal);
                  sound.playCoin();
                  setRewardMessage({
                    text: '+10 Coins Earned!',
                    coinsAwarded: 10,
                    isNewReward: true,
                  });
                } else {
                  setRewardMessage({
                    text: 'Level Cleared! (Reward already claimed)',
                    coinsAwarded: 0,
                    isNewReward: false,
                  });
                }

                // Unlock next level endlessly
                const updatedCompleted = completedLevels.includes(currentLevel)
                  ? completedLevels
                  : [...completedLevels, currentLevel];
                const nextUnlocked = Math.max(unlockedLevel, currentLevel + 1);

                setCompletedLevels(updatedCompleted);
                setUnlockedLevel(nextUnlocked);
                saveProgress(currentLevel, nextUnlocked, updatedCompleted);
              } else {
                // Daily Challenge complete logic
                const reward = addCoinsForDaily(todayDate);
                if (reward.awarded) {
                  setCoins(reward.newTotal);
                  sound.playCoin();
                  setRewardMessage({
                    text: '+25 Coins Earned!',
                    coinsAwarded: 25,
                    isNewReward: true,
                  });
                } else {
                  setRewardMessage({
                    text: "Today's Daily Cleared! (Already Claimed)",
                    coinsAwarded: 0,
                    isNewReward: false,
                  });
                }
              }

              setIsLevelComplete(true);
            }
            return remaining;
          });

          setEscapingArrow(null);
          setIsInputLocked(false);
          isAnimatingRef.current = false;
          setStatusMessage(null);
        }, duration);
      }
    },
    [
      arrows,
      arrowsLeft,
      isLevelComplete,
      isInputLocked,
      isPaused,
      currentLevel,
      unlockedLevel,
      completedLevels,
      activeLevelData.gridSize,
      settings.animationsEnabled,
      gameMode,
      todayDate,
    ]
  );

  // Restart only the active level or daily challenge
  const handleRestart = useCallback(() => {
    if (blockedTimeoutRef.current) clearTimeout(blockedTimeoutRef.current);
    if (animatingTimeoutRef.current) clearTimeout(animatingTimeoutRef.current);

    isAnimatingRef.current = false;
    setIsInputLocked(false);

    sound.playTap();
    triggerHaptic('light');

    const levelDef =
      gameMode === 'NORMAL'
        ? getLevelData(currentLevel)
        : getDailyChallenge(todayDate);

    setArrows(levelDef.arrows);
    setArrowsLeft(levelDef.arrows.length);
    setBlockedArrowId(null);
    setBlockingArrowId(null);
    setBlockedPosition(null);
    setEscapingArrow(null);
    setIsLevelComplete(false);
    setIsPaused(false);
    setStatusMessage(null);
    setRewardMessage(null);
  }, [currentLevel, gameMode, todayDate]);

  // Proceed to next level in normal mode
  const handleNextLevel = useCallback(() => {
    sound.playTap();
    triggerHaptic('light');
    loadNormalLevel(currentLevel + 1);
  }, [currentLevel, loadNormalLevel]);

  // Sync document title with stage
  useEffect(() => {
    if (screen === 'HOME') {
      document.title = 'Arrow Escape Challenge';
    } else if (gameMode === 'DAILY') {
      document.title = `Arrow Escape · Daily Challenge (${todayDate})`;
    } else {
      document.title = `Arrow Escape Challenge · Level ${currentLevel}`;
    }
  }, [screen, gameMode, currentLevel, todayDate]);

  const progressPercent = Math.min(
    100,
    Math.round(((totalArrows - arrowsLeft) / totalArrows) * 100)
  );

  return (
    <div className="min-h-screen w-full bg-[#070b16] text-slate-100 flex flex-col justify-between items-center px-4 py-3 select-none relative overflow-x-hidden">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10"
        aria-hidden="true"
      >
        <div className="w-[380px] h-[380px] rounded-full bg-cyan-600/10 blur-[90px]" />
        <div className="w-[280px] h-[280px] rounded-full bg-blue-600/10 blur-[80px]" />
      </div>

      {/* SCREEN 1: Home Screen */}
      {screen === 'HOME' && (
        <HomeScreen
          currentLevel={currentLevel}
          unlockedLevel={unlockedLevel}
          coins={coins}
          isDailyCompletedToday={isDailyCompletedToday}
          todayFormattedDate={getFormattedDate(todayDate)}
          onPlayNewGame={() => {
            loadNormalLevel(1);
            setScreen('GAME');
          }}
          onContinue={() => {
            loadNormalLevel(currentLevel);
            setScreen('GAME');
          }}
          onStartDaily={startDailyChallenge}
          onOpenSettings={() => {
            setPreviousScreen('HOME');
            setScreen('SETTINGS');
          }}
        />
      )}

      {/* SCREEN 2: Settings Screen */}
      {screen === 'SETTINGS' && (
        <SettingsScreen
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onBack={() => {
            setScreen(previousScreen);
          }}
        />
      )}

      {/* SCREEN 3: Active Gameplay Screen (Normal or Daily Challenge) */}
      {screen === 'GAME' && (
        <div className="w-full max-w-sm mx-auto flex flex-col justify-between items-center h-full flex-1">
          {/* Header Container */}
          <header className="w-full flex flex-col items-center text-center pt-0.5 pb-2">
            {/* Title row with Pause button and Coin Balance */}
            <div className="w-full flex items-center justify-between">
              {/* Pause Button */}
              <button
                onClick={() => {
                  sound.playTap();
                  triggerHaptic('light');
                  setIsPaused(true);
                }}
                aria-label="Pause game"
                title="Pause game"
                className="w-9 h-9 rounded-xl bg-[#0e1a33] border border-[#1e345e] hover:border-cyan-400/50 flex items-center justify-center text-slate-300 hover:text-cyan-400 active:scale-90 transition-all cursor-pointer shadow-sm"
              >
                <Pause className="w-4 h-4 fill-current text-cyan-400" />
              </button>

              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 via-teal-300 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
                Arrow Escape
              </h1>

              {/* Coin Balance Pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0e1a33] border border-amber-400/30 text-amber-300 font-extrabold text-xs shadow-sm">
                <Coins className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
                <span className="tabular-nums">{coins}</span>
              </div>
            </div>

            {/* Level Navigation / Daily Header Bar */}
            <div className="w-full mt-2.5 flex items-center justify-between px-2.5 py-2 rounded-xl bg-[#0f1b33] border border-[#1e345e] shadow-sm">
              {gameMode === 'NORMAL' ? (
                /* Normal Mode Level Navigation */
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevLevel}
                    disabled={currentLevel <= 1}
                    aria-label="Previous level"
                    className={`p-1 rounded-lg transition-colors cursor-pointer ${
                      currentLevel > 1
                        ? 'text-cyan-400 hover:bg-[#162747] active:scale-90'
                        : 'text-slate-600 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex flex-col items-start leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-cyan-400">
                        Level {currentLevel}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40 font-mono">
                        {activeLevelData.gridSize}×{activeLevelData.gridSize}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                      {activeLevelData.name}
                    </span>
                  </div>

                  <button
                    onClick={handleNextLevelNav}
                    disabled={currentLevel >= unlockedLevel}
                    aria-label="Next level"
                    className={`p-1 rounded-lg transition-colors cursor-pointer ${
                      currentLevel < unlockedLevel
                        ? 'text-cyan-400 hover:bg-[#162747] active:scale-90'
                        : 'text-slate-600 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                /* Daily Challenge Header Bar */
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col items-start leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-amber-300">
                        Daily Challenge
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800/40 font-mono">
                        6×6
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {getFormattedDate(todayDate)}
                    </span>
                  </div>
                </div>
              )}

              {/* Arrows Left Counter */}
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Remaining:
                </span>
                <span className="text-base font-extrabold text-white tabular-nums px-2.5 py-0.5 rounded-md bg-[#16294e] border border-cyan-500/30">
                  {arrowsLeft}
                </span>
              </div>
            </div>

            {/* Progress Bar indicating escaped arrows */}
            <div className="w-full mt-2 flex flex-col gap-1">
              <div className="w-full bg-[#091122] h-1.5 rounded-full overflow-hidden border border-[#14233f]">
                <div
                  className={`h-full transition-all duration-300 ease-out ${
                    gameMode === 'DAILY'
                      ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                      : 'bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Status or Micro-hint */}
            <div className="h-5 mt-1 flex items-center justify-center">
              {statusMessage ? (
                <span
                  className={`text-xs font-semibold tracking-wide ${
                    statusMessage.includes('Blocked')
                      ? 'text-red-400 animate-pulse'
                      : 'text-emerald-400'
                  }`}
                >
                  {statusMessage}
                </span>
              ) : (
                <span className="text-xs text-slate-400">
                  Tap an arrow with a clear path to edge to escape
                </span>
              )}
            </div>
          </header>

          {/* Main Game Playfield */}
          <main className="w-full flex-1 flex flex-col items-center justify-center my-auto">
            <GameBoard
              arrows={arrows}
              gridSize={activeLevelData.gridSize}
              onArrowClick={handleArrowClick}
              blockedArrowId={blockedArrowId}
              blockingArrowId={blockingArrowId}
              escapingArrow={escapingArrow}
              blockedPosition={blockedPosition}
              isInputLocked={isInputLocked || isPaused}
              animationsEnabled={settings.animationsEnabled}
            />
          </main>

          {/* Bottom Area: Level Complete Card or Restart Button */}
          <footer className="w-full flex flex-col items-center pb-2 pt-2">
            {isLevelComplete ? (
              /* Celebration Card (Normal or Daily Challenge) */
              <div className="w-full p-4 rounded-2xl bg-gradient-to-b from-[#102a45] to-[#0c1d33] border-2 border-emerald-400/60 shadow-2xl shadow-emerald-500/20 text-center animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-center gap-2 text-emerald-400 mb-1">
                  <CheckCircle2 className="w-6 h-6 animate-bounce" />
                  <h2 className="text-xl font-extrabold tracking-tight">
                    {gameMode === 'NORMAL' ? 'Level Complete!' : 'Daily Challenge Cleared!'}
                  </h2>
                </div>

                {/* Coin Reward Badge */}
                {rewardMessage && (
                  <div className="my-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 font-extrabold text-xs shadow-sm">
                    <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>{rewardMessage.text}</span>
                  </div>
                )}

                <p className="text-xs text-slate-300 mb-3 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  {gameMode === 'NORMAL'
                    ? `Ready for Level ${currentLevel + 1}?`
                    : `Great strategy! Come back tomorrow for a new puzzle.`}
                </p>

                {gameMode === 'NORMAL' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRestart}
                      className="py-3 px-3.5 rounded-xl bg-[#101e38] hover:bg-[#16294d] active:scale-[0.98] border border-[#1e3a6a] text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title="Replay this level"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
                      Replay
                    </button>
                    <button
                      onClick={handleNextLevel}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
                    >
                      <span>Next Level ({currentLevel + 1})</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRestart}
                      className="py-3 px-3.5 rounded-xl bg-[#101e38] hover:bg-[#16294d] active:scale-[0.98] border border-[#1e3a6a] text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title="Replay today's puzzle"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
                      Replay
                    </button>
                    <button
                      onClick={() => {
                        sound.playTap();
                        triggerHaptic('light');
                        setScreen('HOME');
                      }}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 active:scale-[0.98] text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
                    >
                      <Home className="w-4 h-4" />
                      <span>Back to Home</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Normal Play: Restart Button (resets active board) */
              <button
                onClick={handleRestart}
                className="w-full py-3.5 px-4 rounded-xl bg-[#101e38] hover:bg-[#16294d] active:scale-[0.98] border border-[#1e3a6a] text-slate-200 hover:text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-cyan-400" />
                {gameMode === 'NORMAL' ? 'Restart Level' : 'Restart Challenge'}
              </button>
            )}
          </footer>

          {/* Pause Menu Modal Overlay */}
          {isPaused && (
            <PauseMenu
              currentLevel={currentLevel}
              onResume={() => setIsPaused(false)}
              onRestart={() => {
                handleRestart();
                setIsPaused(false);
              }}
              onOpenSettings={() => {
                setPreviousScreen('GAME');
                setScreen('SETTINGS');
                setIsPaused(false);
              }}
              onHome={() => {
                setIsPaused(false);
                setScreen('HOME');
              }}
            />
          )}
        </div>
      )}

      {/* Connectivity & Offline Notification */}
      <OfflineIndicator />
    </div>
  );
}
