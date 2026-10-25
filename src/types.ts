export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type ArrowColorTheme = 'cyan' | 'turquoise' | 'blue';

export interface Arrow {
  id: string;
  row: number; // 0 to gridSize - 1
  col: number; // 0 to gridSize - 1
  direction: Direction;
  colorTheme: ArrowColorTheme;
}

export interface LevelData {
  id: number;
  name: string;
  gridSize?: number;
  arrows: Arrow[];
}

export type ScreenState = 'HOME' | 'GAME' | 'SETTINGS';

export type GameMode = 'NORMAL' | 'DAILY';

export interface GameSettings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  hapticsEnabled: boolean;
}

export interface CoinData {
  coins: number;
  rewardedLevelIds: number[];
  rewardedDailyDates: string[];
}
