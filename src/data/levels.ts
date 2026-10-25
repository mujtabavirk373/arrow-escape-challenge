import { Arrow, LevelData, Direction } from '../types';

export const getPathCells = (row: number, col: number, direction: Direction): { row: number; col: number }[] => {
  const cells: { row: number; col: number }[] = [];
  if (direction === 'UP') {
    for (let r = row - 1; r >= 0; r--) {
      cells.push({ row: r, col });
    }
  } else if (direction === 'DOWN') {
    for (let r = row + 1; r < 5; r++) {
      cells.push({ row: r, col });
    }
  } else if (direction === 'LEFT') {
    for (let c = col - 1; c >= 0; c--) {
      cells.push({ row, col: c });
    }
  } else if (direction === 'RIGHT') {
    for (let c = col + 1; c < 5; c++) {
      cells.push({ row, col: c });
    }
  }
  return cells;
};

// Check if an arrow is blocked by any remaining arrows on board
export const isArrowBlocked = (arrow: Arrow, boardArrows: Arrow[]): boolean => {
  const path = getPathCells(arrow.row, arrow.col, arrow.direction);
  return path.some((cell) =>
    boardArrows.some((other) => other.id !== arrow.id && other.row === cell.row && other.col === cell.col)
  );
};

// Solver test: returns true if the level is 100% solvable from start to finish
export const verifyLevelSolvability = (levelArrows: Arrow[]): boolean => {
  let remaining = [...levelArrows];
  while (remaining.length > 0) {
    const unblocked = remaining.filter((a) => !isArrowBlocked(a, remaining));
    if (unblocked.length === 0) {
      return false; // Stalled, puzzle is impossible!
    }
    // Remove unblocked arrow
    remaining = remaining.filter((a) => a.id !== unblocked[0].id);
  }
  return true;
};

export const LEVELS: LevelData[] = [
  // Level 1: 8 arrows - Very easy, gentle interlocking loop
  {
    id: 1,
    name: 'First Steps',
    arrows: [
      { id: 'l1-1', row: 0, col: 1, direction: 'UP', colorTheme: 'cyan' }, // Escapes immediately!
      { id: 'l1-2', row: 2, col: 1, direction: 'UP', colorTheme: 'blue' },
      { id: 'l1-3', row: 2, col: 3, direction: 'LEFT', colorTheme: 'turquoise' },
      { id: 'l1-4', row: 1, col: 3, direction: 'DOWN', colorTheme: 'cyan' },
      { id: 'l1-5', row: 1, col: 0, direction: 'RIGHT', colorTheme: 'blue' },
      { id: 'l1-6', row: 4, col: 0, direction: 'UP', colorTheme: 'turquoise' },
      { id: 'l1-7', row: 4, col: 4, direction: 'LEFT', colorTheme: 'cyan' },
      { id: 'l1-8', row: 0, col: 4, direction: 'DOWN', colorTheme: 'blue' },
    ],
  },

  // Level 2: 8 arrows - Crossroad divergence
  {
    id: 2,
    name: 'Crossroads',
    arrows: [
      { id: 'l2-1', row: 4, col: 1, direction: 'DOWN', colorTheme: 'turquoise' }, // Escapes immediately (row 4 -> down)
      { id: 'l2-2', row: 2, col: 1, direction: 'DOWN', colorTheme: 'cyan' },
      { id: 'l2-3', row: 2, col: 0, direction: 'RIGHT', colorTheme: 'blue' },
      { id: 'l2-4', row: 0, col: 0, direction: 'DOWN', colorTheme: 'turquoise' },
      { id: 'l2-5', row: 0, col: 3, direction: 'LEFT', colorTheme: 'cyan' },
      { id: 'l2-6', row: 3, col: 3, direction: 'UP', colorTheme: 'blue' },
      { id: 'l2-7', row: 3, col: 4, direction: 'LEFT', colorTheme: 'turquoise' },
      { id: 'l2-8', row: 1, col: 4, direction: 'DOWN', colorTheme: 'cyan' },
    ],
  },

  // Level 3: 9 arrows - Center spiral
  {
    id: 3,
    name: 'Spiral In',
    arrows: [
      { id: 'l3-1', row: 2, col: 4, direction: 'RIGHT', colorTheme: 'cyan' }, // Escapes immediately (col 4 -> right)
      { id: 'l3-2', row: 2, col: 2, direction: 'RIGHT', colorTheme: 'turquoise' },
      { id: 'l3-3', row: 4, col: 2, direction: 'UP', colorTheme: 'blue' },
      { id: 'l3-4', row: 4, col: 0, direction: 'RIGHT', colorTheme: 'cyan' },
      { id: 'l3-5', row: 1, col: 0, direction: 'DOWN', colorTheme: 'turquoise' },
      { id: 'l3-6', row: 1, col: 3, direction: 'LEFT', colorTheme: 'blue' },
      { id: 'l3-7', row: 0, col: 3, direction: 'DOWN', colorTheme: 'cyan' },
      { id: 'l3-8', row: 0, col: 1, direction: 'RIGHT', colorTheme: 'turquoise' },
      { id: 'l3-9', row: 3, col: 1, direction: 'UP', colorTheme: 'blue' },
    ],
  },

  // Level 4: 10 arrows - Dual Gateway
  {
    id: 4,
    name: 'Dual Gateways',
    arrows: [
      { id: 'l4-1', row: 0, col: 0, direction: 'LEFT', colorTheme: 'cyan' }, // Escapes immediately
      { id: 'l4-2', row: 0, col: 2, direction: 'LEFT', colorTheme: 'blue' },
      { id: 'l4-3', row: 2, col: 2, direction: 'UP', colorTheme: 'turquoise' },
      { id: 'l4-4', row: 2, col: 4, direction: 'LEFT', colorTheme: 'cyan' },
      { id: 'l4-5', row: 1, col: 4, direction: 'DOWN', colorTheme: 'blue' },
      { id: 'l4-6', row: 4, col: 4, direction: 'RIGHT', colorTheme: 'turquoise' }, // Escapes immediately
      { id: 'l4-7', row: 4, col: 2, direction: 'RIGHT', colorTheme: 'cyan' },
      { id: 'l4-8', row: 3, col: 2, direction: 'DOWN', colorTheme: 'blue' },
      { id: 'l4-9', row: 3, col: 0, direction: 'RIGHT', colorTheme: 'turquoise' },
      { id: 'l4-10', row: 1, col: 0, direction: 'DOWN', colorTheme: 'cyan' },
    ],
  },

  // Level 5: 11 arrows - Zig-Zag Orbit
  {
    id: 5,
    name: 'Zig-Zag Orbit',
    arrows: [
      { id: 'l5-1', row: 4, col: 3, direction: 'DOWN', colorTheme: 'cyan' }, // Escapes immediately
      { id: 'l5-2', row: 2, col: 3, direction: 'DOWN', colorTheme: 'blue' },
      { id: 'l5-3', row: 2, col: 1, direction: 'RIGHT', colorTheme: 'turquoise' },
      { id: 'l5-4', row: 4, col: 1, direction: 'UP', colorTheme: 'cyan' },
      { id: 'l5-5', row: 4, col: 0, direction: 'RIGHT', colorTheme: 'blue' },
      { id: 'l5-6', row: 3, col: 0, direction: 'DOWN', colorTheme: 'turquoise' },
      { id: 'l5-7', row: 3, col: 4, direction: 'LEFT', colorTheme: 'cyan' },
      { id: 'l5-8', row: 0, col: 4, direction: 'DOWN', colorTheme: 'blue' },
      { id: 'l5-9', row: 0, col: 2, direction: 'RIGHT', colorTheme: 'turquoise' },
      { id: 'l5-10', row: 1, col: 2, direction: 'UP', colorTheme: 'cyan' },
      { id: 'l5-11', row: 1, col: 0, direction: 'RIGHT', colorTheme: 'blue' },
    ],
  },

  // Level 6: 12 arrows - The Pinwheel
  {
    id: 6,
    name: 'The Pinwheel',
    arrows: [
      { id: 'l6-1', row: 4, col: 4, direction: 'UP', colorTheme: 'cyan' },
      { id: 'l6-2', row: 4, col: 2, direction: 'UP', colorTheme: 'blue' },
      { id: 'l6-3', row: 2, col: 0, direction: 'RIGHT', colorTheme: 'turquoise' },
      { id: 'l6-4', row: 0, col: 3, direction: 'UP', colorTheme: 'cyan' },
      { id: 'l6-5', row: 2, col: 2, direction: 'UP', colorTheme: 'blue' },
      { id: 'l6-6', row: 0, col: 2, direction: 'LEFT', colorTheme: 'turquoise' },
      { id: 'l6-7', row: 1, col: 4, direction: 'RIGHT', colorTheme: 'cyan' },
      { id: 'l6-8', row: 1, col: 0, direction: 'LEFT', colorTheme: 'blue' },
      { id: 'l6-9', row: 4, col: 1, direction: 'DOWN', colorTheme: 'turquoise' },
      { id: 'l6-10', row: 3, col: 0, direction: 'LEFT', colorTheme: 'cyan' },
      { id: 'l6-11', row: 1, col: 3, direction: 'DOWN', colorTheme: 'blue' },
      { id: 'l6-12', row: 1, col: 1, direction: 'UP', colorTheme: 'turquoise' },
    ],
  },

  // Level 7: 13 arrows - The Labyrinth
  {
    id: 7,
    name: 'The Labyrinth',
    arrows: [
      { id: 'l7-1', row: 1, col: 4, direction: 'LEFT', colorTheme: 'cyan' },
      { id: 'l7-2', row: 4, col: 2, direction: 'UP', colorTheme: 'blue' },
      { id: 'l7-3', row: 2, col: 4, direction: 'DOWN', colorTheme: 'turquoise' },
      { id: 'l7-4', row: 3, col: 1, direction: 'UP', colorTheme: 'cyan' },
      { id: 'l7-5', row: 0, col: 4, direction: 'UP', colorTheme: 'blue' },
      { id: 'l7-6', row: 1, col: 3, direction: 'UP', colorTheme: 'turquoise' },
      { id: 'l7-7', row: 3, col: 4, direction: 'RIGHT', colorTheme: 'cyan' },
      { id: 'l7-8', row: 2, col: 0, direction: 'UP', colorTheme: 'blue' },
      { id: 'l7-9', row: 4, col: 4, direction: 'RIGHT', colorTheme: 'turquoise' },
      { id: 'l7-10', row: 0, col: 0, direction: 'LEFT', colorTheme: 'cyan' },
      { id: 'l7-11', row: 4, col: 1, direction: 'LEFT', colorTheme: 'blue' },
      { id: 'l7-12', row: 2, col: 1, direction: 'UP', colorTheme: 'turquoise' },
      { id: 'l7-13', row: 3, col: 0, direction: 'DOWN', colorTheme: 'cyan' },
    ],
  },

  // Level 8: 14 arrows - Gridlock Nexus
  {
    id: 8,
    name: 'Gridlock Nexus',
    arrows: [
      { id: 'l8-1', row: 3, col: 0, direction: 'UP', colorTheme: 'cyan' },
      { id: 'l8-2', row: 1, col: 0, direction: 'UP', colorTheme: 'blue' },
      { id: 'l8-3', row: 4, col: 2, direction: 'UP', colorTheme: 'turquoise' },
      { id: 'l8-4', row: 1, col: 4, direction: 'UP', colorTheme: 'cyan' },
      { id: 'l8-5', row: 2, col: 4, direction: 'LEFT', colorTheme: 'blue' },
      { id: 'l8-6', row: 2, col: 3, direction: 'DOWN', colorTheme: 'turquoise' },
      { id: 'l8-7', row: 4, col: 3, direction: 'DOWN', colorTheme: 'cyan' },
      { id: 'l8-8', row: 0, col: 1, direction: 'UP', colorTheme: 'blue' },
      { id: 'l8-9', row: 4, col: 1, direction: 'DOWN', colorTheme: 'turquoise' },
      { id: 'l8-10', row: 0, col: 4, direction: 'RIGHT', colorTheme: 'cyan' },
      { id: 'l8-11', row: 4, col: 0, direction: 'LEFT', colorTheme: 'blue' },
      { id: 'l8-12', row: 2, col: 2, direction: 'LEFT', colorTheme: 'turquoise' },
      { id: 'l8-13', row: 3, col: 4, direction: 'RIGHT', colorTheme: 'cyan' },
      { id: 'l8-14', row: 4, col: 4, direction: 'DOWN', colorTheme: 'blue' },
    ],
  },

  // Level 9: 15 arrows - Master Matrix
  {
    id: 9,
    name: 'Master Matrix',
    arrows: [
      { id: 'l9-1', row: 0, col: 2, direction: 'UP', colorTheme: 'cyan' },
      { id: 'l9-2', row: 3, col: 1, direction: 'UP', colorTheme: 'blue' },
      { id: 'l9-3', row: 0, col: 0, direction: 'UP', colorTheme: 'turquoise' },
      { id: 'l9-4', row: 2, col: 3, direction: 'DOWN', colorTheme: 'cyan' },
      { id: 'l9-5', row: 4, col: 0, direction: 'RIGHT', colorTheme: 'blue' },
      { id: 'l9-6', row: 3, col: 0, direction: 'LEFT', colorTheme: 'turquoise' },
      { id: 'l9-7', row: 1, col: 0, direction: 'LEFT', colorTheme: 'cyan' },
      { id: 'l9-8', row: 1, col: 2, direction: 'DOWN', colorTheme: 'blue' },
      { id: 'l9-9', row: 0, col: 3, direction: 'RIGHT', colorTheme: 'turquoise' },
      { id: 'l9-10', row: 2, col: 1, direction: 'LEFT', colorTheme: 'cyan' },
      { id: 'l9-11', row: 3, col: 2, direction: 'DOWN', colorTheme: 'blue' },
      { id: 'l9-12', row: 4, col: 2, direction: 'RIGHT', colorTheme: 'turquoise' },
      { id: 'l9-13', row: 3, col: 3, direction: 'DOWN', colorTheme: 'cyan' },
      { id: 'l9-14', row: 2, col: 0, direction: 'LEFT', colorTheme: 'blue' },
      { id: 'l9-15', row: 4, col: 3, direction: 'DOWN', colorTheme: 'turquoise' },
    ],
  },

  // Level 10: 16 arrows - Grand Escape
  {
    id: 10,
    name: 'Grand Escape',
    arrows: [
      { id: 'l10-1', row: 2, col: 0, direction: 'UP', colorTheme: 'cyan' },
      { id: 'l10-2', row: 2, col: 4, direction: 'DOWN', colorTheme: 'blue' },
      { id: 'l10-3', row: 3, col: 1, direction: 'DOWN', colorTheme: 'turquoise' },
      { id: 'l10-4', row: 0, col: 0, direction: 'LEFT', colorTheme: 'cyan' },
      { id: 'l10-5', row: 4, col: 0, direction: 'LEFT', colorTheme: 'blue' },
      { id: 'l10-6', row: 0, col: 1, direction: 'RIGHT', colorTheme: 'turquoise' },
      { id: 'l10-7', row: 1, col: 2, direction: 'DOWN', colorTheme: 'cyan' },
      { id: 'l10-8', row: 1, col: 0, direction: 'LEFT', colorTheme: 'blue' },
      { id: 'l10-9', row: 3, col: 0, direction: 'LEFT', colorTheme: 'turquoise' },
      { id: 'l10-10', row: 3, col: 3, direction: 'DOWN', colorTheme: 'cyan' },
      { id: 'l10-11', row: 4, col: 2, direction: 'DOWN', colorTheme: 'blue' },
      { id: 'l10-12', row: 4, col: 4, direction: 'DOWN', colorTheme: 'turquoise' },
      { id: 'l10-13', row: 2, col: 3, direction: 'UP', colorTheme: 'cyan' },
      { id: 'l10-14', row: 4, col: 1, direction: 'DOWN', colorTheme: 'blue' },
      { id: 'l10-15', row: 4, col: 3, direction: 'DOWN', colorTheme: 'turquoise' },
      { id: 'l10-16', row: 1, col: 3, direction: 'UP', colorTheme: 'cyan' },
    ],
  },
];
