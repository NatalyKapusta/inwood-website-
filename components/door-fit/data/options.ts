import type { EdgeId, FloorDef, Handle, HandleId, InsertId, HingeColor } from '../types';

export const EDGE_COL: Record<EdgeId, string | null> = {
  aral: null,
  film: null,
  black: '#141414',
  white: '#F1F1EE',
  agrey: '#A7AAAD',
  ablack: '#1C1C1D',
};

export const INSERT_COL: Record<InsertId, string> = { black: '#3C3C3D', grey: '#7B7E82' };

export const HANDLES: Record<HandleId, Handle> = {
  graphite: { c: '#46474A', m: 0.35, r: 0.48 },
  black: { c: '#1E1F20', m: 0.55, r: 0.5 },
  chrome: { c: '#DADDDF', m: 1, r: 0.18 },
  brass: { c: '#C9A24C', m: 1, r: 0.28 },
};
export const HANDLE_IDS = Object.keys(HANDLES) as HandleId[];

/** Кольори стіни (назви — у словнику, ключі w0…w5). */
export const WALLS: string[] = ['#ECE8E1', '#D9D4CA', '#C3CCC0', '#B4BEC7', '#8D7F72', '#33403C'];

export const FLOORS: FloorDef[] = [
  { id: 'light', base: '#A9A8A5' },
  { id: 'grey', base: '#8E9190' },
  { id: 'dark', base: '#3F3E3D' },
];

export const HINGE_COL: Record<HingeColor, string> = { std: '#8D8F93', black: '#1E1F20', white: '#ECECEA' };
