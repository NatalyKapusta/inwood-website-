import { COLLECTIONS } from './data/collections';
import { FILMS } from './data/films';
import { FLOORS, HANDLE_IDS, WALLS } from './data/options';
import { MODELS } from './data/models';
import type {
  CasingSides, CasingType, CollId, DoorModel, DoorState, EdgeId, Film, FloorId, FrameType, HandleId, HandleShape,
  HingeColor, HiddenBox, InsertId, Side,
} from './types';

export const INITIAL_STATE: DoorState = {
  coll: 'ETALON', model: 'ET-02', W: 800, H: 2000, T: 100, film: 'astana-merle', edge: 'film', insert: 'black',
  hinge: 'L', casing: true, ft: 'tel', cs: 'both', ct: 'std', dob: 0, edgeHex: '#8c8f93', hi: 0, hb: 'std', hgc: 'std',
  handle: 'graphite', hshape: 'sq', paint: '#ECE8E1', paintAuto: true, room: true, dims: true, wall: 0,
  wallHex: '#D8D2C8', floor: 'light', open: 24,
};

/* ---------- вибірки (селектори) ---------- */

const FILM_MAP = new Map<string, Film>(FILMS.map((f) => [f.id, f]));
export const modelById = (id: string): DoorModel => MODELS.find((m) => m.id === id) ?? MODELS[0];
export const modelsOf = (coll: CollId): DoorModel[] => MODELS.filter((m) => m.c === coll);
export const collOf = (s: Pick<DoorState, 'coll'>) => COLLECTIONS[s.coll];
export const modelOf = (s: Pick<DoorState, 'model'>) => modelById(s.model);

/** Кольори «RAL / NCS» — умовна плівка без текстури. */
export function filmById(id: string, paint: string): Film {
  if (id === 'paint') return { id: 'paint', k: paint, r: 0.55, s: 0.5 };
  return FILM_MAP.get(id) ?? FILMS[0];
}
export const filmOf = (s: Pick<DoorState, 'film' | 'paint'>) => filmById(s.film, s.paint);

/** ET-18…ET-20 — лише з кромкою в колір полотна (за довідником співробітників). */
export function edgesFor(s: Pick<DoorState, 'coll' | 'model'>): EdgeId[] {
  let e = COLLECTIONS[s.coll].edges;
  if (s.coll === 'ETALON') {
    const n = parseInt(String(s.model).replace(/\D/g, ''), 10);
    if (n > 17) e = e.filter((k) => k !== 'agrey' && k !== 'ablack' && k !== 'aral');
  }
  return e;
}

export function paletteOf(s: Pick<DoorState, 'coll' | 'model'>): string[] {
  const ids = COLLECTIONS[s.coll].films.slice();
  const m = modelById(s.model);
  if (m.solid) ids.push(m.solid);
  return ids;
}

export const wallHexOf = (s: Pick<DoorState, 'wall' | 'wallHex'>) => (s.wall >= 0 ? WALLS[s.wall] : s.wallHex);
export const nonstd = (s: Pick<DoorState, 'W' | 'H'>) => ({ w: s.W > 900, h: s.H > 2100 });
const defaultInsert = (s: DoorState): InsertId => filmOf(s).ins || 'black';

/* ---------- дії ---------- */

export type Action =
  | { type: 'load'; state: DoorState }
  | { type: 'coll'; id: CollId }
  | { type: 'model'; id: string }
  | { type: 'film'; id: string }
  | { type: 'paint'; hex: string }
  | { type: 'paintOpen' }
  | { type: 'edge'; id: EdgeId }
  | { type: 'edgeHex'; hex: string }
  | { type: 'insert'; id: InsertId }
  | { type: 'wall'; index: number }
  | { type: 'wallHex'; hex: string }
  | { type: 'floor'; id: FloorId }
  | { type: 'W'; v: number }
  | { type: 'H'; v: number }
  | { type: 'T'; v: number }
  | { type: 'ft'; v: FrameType }
  | { type: 'dob'; v: number }
  | { type: 'cs'; v: CasingSides }
  | { type: 'ct'; v: CasingType }
  | { type: 'hi'; v: 0 | 1 }
  | { type: 'hb'; v: HiddenBox }
  | { type: 'hgc'; v: HingeColor }
  | { type: 'hinge'; v: Side }
  | { type: 'handle'; v: HandleId }
  | { type: 'hshape'; v: HandleShape }
  | { type: 'room'; v: boolean }
  | { type: 'dims'; v: boolean }
  | { type: 'open'; v: number };

/** У режимі «HIDDEN» колір полотна слідує за кольором стіни, доки користувач не обрав свій. */
function withPaintAuto(n: DoorState): DoorState {
  return n.paintAuto && collOf(n).flush ? { ...n, paint: wallHexOf(n) } : n;
}

export function reducer(s: DoorState, a: Action): DoorState {
  switch (a.type) {
    case 'load':
      return a.state;
    case 'coll': {
      const C = COLLECTIONS[a.id];
      const n: DoorState = { ...s, coll: a.id, model: C.def };
      n.hshape = modelOf(n).hs;
      n.cs = C.flush ? 'none' : 'both';
      n.casing = !C.flush;
      if (!C.cop) {
        n.ft = 'tel';
        if (n.ct === 'cop') n.ct = 'std';
      }
      const ed = edgesFor(n);
      if (!ed.includes(n.edge)) n.edge = ed[0];
      if (!C.flush) n.hi = 0;
      if (C.flush) {
        n.film = 'paint';
        n.paint = wallHexOf(n);
        n.paintAuto = true;
      } else if (n.film === 'paint' && !C.paint) n.film = C.fdef;
      else if (n.film !== 'paint') n.film = C.fdef;
      n.insert = defaultInsert(n);
      return n;
    }
    case 'model': {
      const m = MODELS.find((x) => x.id === a.id);
      if (!m || m.c !== s.coll) return s;
      const n: DoorState = { ...s, model: m.id, hshape: m.hs };
      if (!edgesFor(n).includes(n.edge)) n.edge = 'film';
      if (m.solid) n.film = m.solid;
      else if (!paletteOf(n).includes(n.film) && n.film !== 'paint') n.film = COLLECTIONS[n.coll].fdef;
      return n;
    }
    case 'film': {
      const n: DoorState = { ...s, film: a.id, paintAuto: false };
      n.insert = defaultInsert(n);
      return n;
    }
    case 'paint':
      return { ...s, paint: a.hex, film: 'paint', paintAuto: false };
    case 'paintOpen':
      return s.film === 'paint' ? s : { ...s, film: 'paint' };
    case 'edge':
      return { ...s, edge: a.id };
    case 'edgeHex':
      return { ...s, edgeHex: a.hex };
    case 'insert':
      return { ...s, insert: a.id };
    case 'wall':
      return withPaintAuto({ ...s, wall: a.index });
    case 'wallHex':
      return withPaintAuto({ ...s, wallHex: a.hex, wall: -1 });
    case 'floor':
      return { ...s, floor: a.id };
    case 'W':
      return { ...s, W: a.v };
    case 'H':
      return { ...s, H: a.v };
    case 'T':
      return { ...s, T: a.v };
    case 'ft': {
      const n: DoorState = { ...s, ft: a.v };
      if (a.v === 'cop') n.ct = 'cop';
      else if (n.ct === 'cop') n.ct = 'std';
      return n;
    }
    case 'dob':
      return { ...s, dob: a.v };
    case 'cs':
      return { ...s, cs: a.v, casing: a.v !== 'none' };
    case 'ct':
      return { ...s, ct: a.v };
    case 'hi': {
      const n: DoorState = { ...s, hi: a.v };
      if (n.hi && n.edge === 'film') n.edge = 'agrey';
      return n;
    }
    case 'hb':
      return { ...s, hb: a.v };
    case 'hgc':
      return { ...s, hgc: a.v };
    case 'hinge':
      return { ...s, hinge: a.v };
    case 'handle':
      return { ...s, handle: a.v };
    case 'hshape':
      return { ...s, hshape: a.v };
    case 'room':
      return { ...s, room: a.v };
    case 'dims':
      return { ...s, dims: a.v };
    case 'open':
      return { ...s, open: a.v };
    default:
      return s;
  }
}

export { FLOORS, HANDLE_IDS, WALLS };
