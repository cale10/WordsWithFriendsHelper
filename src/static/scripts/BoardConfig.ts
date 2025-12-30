/**
 * @author Enhanced by Claude Code
 * Board configuration presets for different sizes
 */

export interface BoardConfig {
  size: number;
  bonuses: string[][];
}

/** 15x15 Board Configuration (Standard Words With Friends) */
export const BOARD_15X15: BoardConfig = {
  size: 15,
  bonuses: [
    ['  ', '  ', '  ', 'TW', '  ', '  ', 'TL', '  ', 'TL', '  ', '  ', 'TW', '  ', '  ', '  '],
    ['  ', '  ', 'DL', '  ', '  ', 'DW', '  ', '  ', '  ', 'DW', '  ', '  ', 'DL', '  ', '  '],
    ['  ', 'DL', '  ', '  ', 'DL', '  ', '  ', '  ', '  ', '  ', 'DL', '  ', '  ', 'DL', '  '],
    ['TW', '  ', '  ', 'TL', '  ', '  ', '  ', 'DW', '  ', '  ', '  ', 'TL', '  ', '  ', 'TW'],
    ['  ', '  ', 'DL', '  ', '  ', '  ', 'DL', '  ', 'DL', '  ', '  ', '  ', 'DL', '  ', '  '],
    ['  ', 'DW', '  ', '  ', '  ', 'TL', '  ', '  ', '  ', 'TL', '  ', '  ', '  ', 'DW', '  '],
    ['TL', '  ', '  ', '  ', 'DL', '  ', '  ', '  ', '  ', '  ', 'DL', '  ', '  ', '  ', 'TL'],
    ['  ', '  ', '  ', 'DW', '  ', '  ', '  ', 'ST', '  ', '  ', '  ', 'DW', '  ', '  ', '  '],
    ['TL', '  ', '  ', '  ', 'DL', '  ', '  ', '  ', '  ', '  ', 'DL', '  ', '  ', '  ', 'TL'],
    ['  ', 'DW', '  ', '  ', '  ', 'TL', '  ', '  ', '  ', 'TL', '  ', '  ', '  ', 'DW', '  '],
    ['  ', '  ', 'DL', '  ', '  ', '  ', 'DL', '  ', 'DL', '  ', '  ', '  ', 'DL', '  ', '  '],
    ['TW', '  ', '  ', 'TL', '  ', '  ', '  ', 'DW', '  ', '  ', '  ', 'TL', '  ', '  ', 'TW'],
    ['  ', 'DL', '  ', '  ', 'DL', '  ', '  ', '  ', '  ', '  ', 'DL', '  ', '  ', 'DL', '  '],
    ['  ', '  ', 'DL', '  ', '  ', 'DW', '  ', '  ', '  ', 'DW', '  ', '  ', 'DL', '  ', '  '],
    ['  ', '  ', '  ', 'TW', '  ', '  ', 'TL', '  ', 'TL', '  ', '  ', 'TW', '  ', '  ', '  '],
  ]
};

/** 11x11 Board Configuration (Compact Words With Friends) */
export const BOARD_11X11: BoardConfig = {
  size: 11,
  bonuses: [
    ['TW', '  ', '  ', 'DL', '  ', '  ', '  ', 'DL', '  ', '  ', 'TW'],
    ['  ', 'DW', '  ', '  ', '  ', 'TL', '  ', '  ', '  ', 'DW', '  '],
    ['  ', '  ', 'DW', '  ', '  ', '  ', '  ', '  ', 'DW', '  ', '  '],
    ['DL', '  ', '  ', 'TL', '  ', '  ', '  ', 'TL', '  ', '  ', 'DL'],
    ['  ', '  ', '  ', '  ', 'DW', '  ', 'DW', '  ', '  ', '  ', '  '],
    ['  ', 'TL', '  ', '  ', '  ', 'ST', '  ', '  ', '  ', 'TL', '  '],
    ['  ', '  ', '  ', '  ', 'DW', '  ', 'DW', '  ', '  ', '  ', '  '],
    ['DL', '  ', '  ', 'TL', '  ', '  ', '  ', 'TL', '  ', '  ', 'DL'],
    ['  ', '  ', 'DW', '  ', '  ', '  ', '  ', '  ', 'DW', '  ', '  '],
    ['  ', 'DW', '  ', '  ', '  ', 'TL', '  ', '  ', '  ', 'DW', '  '],
    ['TW', '  ', '  ', 'DL', '  ', '  ', '  ', 'DL', '  ', '  ', 'TW'],
  ]
};

/** Tile type enum */
export enum TileType {
  Plain = 'plain',
  DoubleLetter = 'double-letter',
  TripleLetter = 'triple-letter',
  DoubleWord = 'double-word',
  TripleWord = 'triple-word',
  Start = 'start'
}

/** Maps bonus codes to CSS classes and display text */
export const BONUS_MAP: Record<string, { cssClass: string, display: string, type: TileType }> = {
  '  ': { cssClass: '', display: '', type: TileType.Plain },
  'DL': { cssClass: 'double-letter', display: 'DL', type: TileType.DoubleLetter },
  'TL': { cssClass: 'triple-letter', display: 'TL', type: TileType.TripleLetter },
  'DW': { cssClass: 'double-word', display: 'DW', type: TileType.DoubleWord },
  'TW': { cssClass: 'triple-word', display: 'TW', type: TileType.TripleWord },
  'ST': { cssClass: 'start-cell', display: '⭐', type: TileType.Start }
};

/** Get board configuration by size */
export function getBoardConfig(size: number): BoardConfig {
  if (size === 11) {
    return JSON.parse(JSON.stringify(BOARD_11X11));
  }
  return JSON.parse(JSON.stringify(BOARD_15X15));
}
