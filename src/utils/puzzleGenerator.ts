import { Arrow, Direction, ArrowColorTheme, LevelData } from '../types';

// Deterministic Pseudo-Random Number Generator (Mulberry32)
export function createPRNG(seed: number) {
  let s = seed >>> 0;
  return function next(): number {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Determine grid size based on difficulty curve
export function getGridSizeForLevel(level: number): number {
  if (level <= 15) return 5;
  if (level <= 35) return 6;
  return 7;
}

// Determine target arrow count
export function getArrowCountForLevel(level: number): number {
  if (level === 1) return 8;
  if (level <= 5) return 8;
  if (level <= 10) return 9 + Math.floor((level - 6) * 0.75); // 9 to 12
  if (level <= 15) return 12 + Math.floor((level - 11) * 0.5); // 12 to 14
  if (level <= 20) return 14 + (level - 16); // 14 to 18
  if (level <= 35) return 17 + Math.floor((level - 21) * 0.3); // 17 to 21
  if (level <= 50) return 20 + Math.floor((level - 36) * 0.35); // 20 to 25
  return Math.min(28, 24 + Math.floor((level - 51) * 0.1)); // 24 to 28 (capped for comfortable mobile touch)
}

// Difficulty title generator
export function getLevelTitle(level: number): string {
  if (level === 1) return 'First Steps';
  if (level <= 5) return `Stage ${level} · Tutorial`;
  if (level <= 10) return `Stage ${level} · Easy`;
  if (level <= 20) return `Stage ${level} · Medium`;
  if (level <= 35) return `Stage ${level} · Hard`;
  if (level <= 50) return `Stage ${level} · Very Hard`;
  return `Stage ${level} · Expert`;
}

// Calculate path cells between arrow and board edge
export function getPathCells(
  row: number,
  col: number,
  direction: Direction,
  gridSize: number
): { row: number; col: number }[] {
  const cells: { row: number; col: number }[] = [];
  if (direction === 'UP') {
    for (let r = row - 1; r >= 0; r--) {
      cells.push({ row: r, col });
    }
  } else if (direction === 'DOWN') {
    for (let r = row + 1; r < gridSize; r++) {
      cells.push({ row: r, col });
    }
  } else if (direction === 'LEFT') {
    for (let c = col - 1; c >= 0; c--) {
      cells.push({ row, col: c });
    }
  } else if (direction === 'RIGHT') {
    for (let c = col + 1; c < gridSize; c++) {
      cells.push({ row, col: c });
    }
  }
  return cells;
}

// Forward simulation validator: verifies complete solvability from start to finish
export function validateSolvability(
  arrows: Arrow[],
  gridSize: number
): { isSolvable: boolean; initialEscapableCount: number; moveSequence: string[] } {
  let remaining = [...arrows];
  const moveSequence: string[] = [];
  let initialEscapableCount = 0;
  let wave = 0;

  while (remaining.length > 0) {
    const unblocked = remaining.filter((a) => {
      const path = getPathCells(a.row, a.col, a.direction, gridSize);
      return !path.some((cell) =>
        remaining.some(
          (other) => other.id !== a.id && other.row === cell.row && other.col === cell.col
        )
      );
    });

    if (unblocked.length === 0) {
      return { isSolvable: false, initialEscapableCount: 0, moveSequence: [] };
    }

    if (wave === 0) {
      initialEscapableCount = unblocked.length;
    }
    wave++;

    // Pick the first unblocked arrow to simulate a player's move
    const nextArrow = unblocked[0];
    moveSequence.push(nextArrow.id);
    remaining = remaining.filter((a) => a.id !== nextArrow.id);
  }

  return {
    isSolvable: true,
    initialEscapableCount,
    moveSequence,
  };
}

// Handcrafted iconic Level 1 to teach basic concepts
const HANDCRAFTED_LEVEL_1: LevelData = {
  id: 1,
  name: 'First Steps',
  gridSize: 5,
  arrows: [
    { id: 'l1-1', row: 0, col: 1, direction: 'UP', colorTheme: 'cyan' },
    { id: 'l1-2', row: 2, col: 1, direction: 'UP', colorTheme: 'blue' },
    { id: 'l1-3', row: 2, col: 3, direction: 'LEFT', colorTheme: 'turquoise' },
    { id: 'l1-4', row: 1, col: 3, direction: 'DOWN', colorTheme: 'cyan' },
    { id: 'l1-5', row: 1, col: 0, direction: 'RIGHT', colorTheme: 'blue' },
    { id: 'l1-6', row: 4, col: 0, direction: 'UP', colorTheme: 'turquoise' },
    { id: 'l1-7', row: 4, col: 4, direction: 'LEFT', colorTheme: 'cyan' },
    { id: 'l1-8', row: 0, col: 4, direction: 'DOWN', colorTheme: 'blue' },
  ],
};

// Known-solvable fallbacks in case generation attempts are exhausted
const FALLBACK_5X5: Arrow[] = [
  { id: 'fb-1', row: 0, col: 0, direction: 'UP', colorTheme: 'cyan' },
  { id: 'fb-2', row: 2, col: 0, direction: 'UP', colorTheme: 'blue' },
  { id: 'fb-3', row: 2, col: 2, direction: 'LEFT', colorTheme: 'turquoise' },
  { id: 'fb-4', row: 4, col: 2, direction: 'UP', colorTheme: 'cyan' },
  { id: 'fb-5', row: 4, col: 4, direction: 'LEFT', colorTheme: 'blue' },
  { id: 'fb-6', row: 0, col: 4, direction: 'DOWN', colorTheme: 'turquoise' },
  { id: 'fb-7', row: 0, col: 2, direction: 'RIGHT', colorTheme: 'cyan' },
  { id: 'fb-8', row: 3, col: 3, direction: 'RIGHT', colorTheme: 'blue' },
];

const FALLBACK_6X6: Arrow[] = [
  { id: 'fb6-1', row: 0, col: 0, direction: 'LEFT', colorTheme: 'cyan' },
  { id: 'fb6-2', row: 0, col: 3, direction: 'LEFT', colorTheme: 'blue' },
  { id: 'fb6-3', row: 3, col: 3, direction: 'UP', colorTheme: 'turquoise' },
  { id: 'fb6-4', row: 3, col: 5, direction: 'LEFT', colorTheme: 'cyan' },
  { id: 'fb6-5', row: 5, col: 5, direction: 'UP', colorTheme: 'blue' },
  { id: 'fb6-6', row: 5, col: 2, direction: 'RIGHT', colorTheme: 'turquoise' },
  { id: 'fb6-7', row: 2, col: 2, direction: 'DOWN', colorTheme: 'cyan' },
  { id: 'fb6-8', row: 2, col: 0, direction: 'RIGHT', colorTheme: 'blue' },
  { id: 'fb6-9', row: 4, col: 0, direction: 'UP', colorTheme: 'turquoise' },
  { id: 'fb6-10', row: 4, col: 4, direction: 'LEFT', colorTheme: 'cyan' },
];

const FALLBACK_7X7: Arrow[] = [
  { id: 'fb7-1', row: 0, col: 0, direction: 'UP', colorTheme: 'cyan' },
  { id: 'fb7-2', row: 3, col: 0, direction: 'UP', colorTheme: 'blue' },
  { id: 'fb7-3', row: 3, col: 3, direction: 'LEFT', colorTheme: 'turquoise' },
  { id: 'fb7-4', row: 6, col: 3, direction: 'UP', colorTheme: 'cyan' },
  { id: 'fb7-5', row: 6, col: 6, direction: 'LEFT', colorTheme: 'blue' },
  { id: 'fb7-6', row: 2, col: 6, direction: 'DOWN', colorTheme: 'turquoise' },
  { id: 'fb7-7', row: 2, col: 2, direction: 'RIGHT', colorTheme: 'cyan' },
  { id: 'fb7-8', row: 5, col: 2, direction: 'UP', colorTheme: 'blue' },
  { id: 'fb7-9', row: 5, col: 5, direction: 'LEFT', colorTheme: 'turquoise' },
  { id: 'fb7-10', row: 1, col: 5, direction: 'DOWN', colorTheme: 'cyan' },
  { id: 'fb7-11', row: 1, col: 1, direction: 'RIGHT', colorTheme: 'blue' },
  { id: 'fb7-12', row: 4, col: 4, direction: 'DOWN', colorTheme: 'turquoise' },
];

// In-memory level cache so identical levels load instantly
const levelCache = new Map<number, LevelData>();

// Main generator entry point
export function getLevelData(level: number): LevelData {
  if (level === 1) {
    return HANDCRAFTED_LEVEL_1;
  }

  if (levelCache.has(level)) {
    return levelCache.get(level)!;
  }

  const gridSize = getGridSizeForLevel(level);
  const targetCount = getArrowCountForLevel(level);
  const dirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
  const colors: ArrowColorTheme[] = ['cyan', 'blue', 'turquoise'];

  const MAX_ATTEMPTS = 40;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const rng = createPRNG(level * 31337 + attempt * 7919 + 17);
    const placed: Arrow[] = [];
    const occupied = new Set<string>();

    let step = 0;
    while (step < targetCount) {
      const candidates: {
        r: number;
        c: number;
        dir: Direction;
        blocksCount: number;
      }[] = [];

      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          if (occupied.has(`${r},${c}`)) continue;

          for (const d of dirs) {
            const myPath = getPathCells(r, c, d, gridSize);
            const isBlockedByPlaced = myPath.some((p) => occupied.has(`${p.row},${p.col}`));

            if (!isBlockedByPlaced) {
              // Count how many already placed arrows this new arrow will block
              let blocksCount = 0;
              for (const prev of placed) {
                const prevPath = getPathCells(prev.row, prev.col, prev.direction, gridSize);
                if (prevPath.some((p) => p.row === r && p.col === c)) {
                  blocksCount++;
                }
              }
              candidates.push({ r, c, dir: d, blocksCount });
            }
          }
        }
      }

      if (candidates.length === 0) break; // Dead end in this attempt

      // In later levels, prefer candidates that form deep interlocking dependencies
      let pool = candidates;
      const chainBias = level <= 5 ? 0.3 : level <= 20 ? 0.65 : 0.8;
      if (step > 0 && rng() < chainBias) {
        const blockingCandidates = candidates.filter((c) => c.blocksCount > 0);
        if (blockingCandidates.length > 0) {
          pool = blockingCandidates;
        }
      }

      const pick = pool[Math.floor(rng() * pool.length)];
      placed.push({
        id: `l${level}-${step + 1}`,
        row: pick.r,
        col: pick.c,
        direction: pick.dir,
        colorTheme: colors[placed.length % colors.length],
      });
      occupied.add(`${pick.r},${pick.c}`);
      step++;
    }

    // If all targetCount arrows were placed, validate forward solvability
    if (placed.length === targetCount) {
      const { isSolvable, initialEscapableCount } = validateSolvability(placed, gridSize);

      if (isSolvable && initialEscapableCount >= 1) {
        const generatedLevel: LevelData = {
          id: level,
          name: getLevelTitle(level),
          gridSize,
          arrows: placed,
        };
        levelCache.set(level, generatedLevel);
        return generatedLevel;
      }
    }
  }

  // Safe fallback if max attempts reached (prevents game freeze)
  const fallbackArrows =
    gridSize === 5 ? FALLBACK_5X5 : gridSize === 6 ? FALLBACK_6X6 : FALLBACK_7X7;

  const fallbackLevel: LevelData = {
    id: level,
    name: getLevelTitle(level),
    gridSize,
    arrows: fallbackArrows.map((a, idx) => ({
      ...a,
      id: `l${level}-fb-${idx + 1}`,
    })),
  };

  levelCache.set(level, fallbackLevel);
  return fallbackLevel;
}

// In-memory cache for daily challenges
const dailyCache = new Map<string, LevelData>();

// Deterministic Daily Challenge generator based on date string (YYYY-MM-DD)
export function getDailyChallenge(dateStr: string): LevelData {
  if (dailyCache.has(dateStr)) {
    return dailyCache.get(dateStr)!;
  }

  // Hash date string to integer seed
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed = (seed * 31 + dateStr.charCodeAt(i)) >>> 0;
  }

  const gridSize = 6; // Balanced 6x6 grid for Daily Challenges
  const targetCount = 14;
  const dirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
  const colors: ArrowColorTheme[] = ['cyan', 'blue', 'turquoise'];
  const MAX_ATTEMPTS = 35;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const rng = createPRNG(seed + attempt * 7919 + 42);
    const placed: Arrow[] = [];
    const occupied = new Set<string>();

    let step = 0;
    while (step < targetCount) {
      const candidates: {
        r: number;
        c: number;
        dir: Direction;
        blocksCount: number;
      }[] = [];

      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          if (occupied.has(`${r},${c}`)) continue;

          for (const d of dirs) {
            const myPath = getPathCells(r, c, d, gridSize);
            const isBlockedByPlaced = myPath.some((p) => occupied.has(`${p.row},${p.col}`));

            if (!isBlockedByPlaced) {
              let blocksCount = 0;
              for (const prev of placed) {
                const prevPath = getPathCells(prev.row, prev.col, prev.direction, gridSize);
                if (prevPath.some((p) => p.row === r && p.col === c)) {
                  blocksCount++;
                }
              }
              candidates.push({ r, c, dir: d, blocksCount });
            }
          }
        }
      }

      if (candidates.length === 0) break;

      let pool = candidates;
      if (step > 0 && rng() < 0.65) {
        const blocking = candidates.filter((c) => c.blocksCount > 0);
        if (blocking.length > 0) pool = blocking;
      }

      const pick = pool[Math.floor(rng() * pool.length)];
      placed.push({
        id: `daily-${dateStr}-${step + 1}`,
        row: pick.r,
        col: pick.c,
        direction: pick.dir,
        colorTheme: colors[placed.length % colors.length],
      });
      occupied.add(`${pick.r},${pick.c}`);
      step++;
    }

    if (placed.length === targetCount) {
      const { isSolvable, initialEscapableCount } = validateSolvability(placed, gridSize);
      if (isSolvable && initialEscapableCount >= 1) {
        const levelData: LevelData = {
          id: -1,
          name: 'Daily Challenge',
          gridSize,
          arrows: placed,
        };
        dailyCache.set(dateStr, levelData);
        return levelData;
      }
    }
  }

  // Known-solvable 6x6 fallback for Daily Challenge
  const fallbackDaily: LevelData = {
    id: -1,
    name: 'Daily Challenge',
    gridSize: 6,
    arrows: FALLBACK_6X6.map((a, idx) => ({
      ...a,
      id: `daily-${dateStr}-fb-${idx + 1}`,
    })),
  };
  dailyCache.set(dateStr, fallbackDaily);
  return fallbackDaily;
}
