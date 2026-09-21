export type DoorFitLocale = 'ua' | 'ru' | 'en' | 'pl';

export type CollId = 'ETALON' | 'NOMINAL' | 'FREZZATTI' | 'PERFETTO' | 'HIDDEN';
export type EdgeId = 'film' | 'black' | 'white' | 'agrey' | 'ablack' | 'aral';
export type InsertId = 'black' | 'grey';
export type HandleId = 'graphite' | 'black' | 'chrome' | 'brass';
export type FloorId = 'light' | 'grey' | 'dark';
export type ViewId = 'persp' | 'front' | 'side' | 'plan';
export type Side = 'L' | 'R';
export type FrameType = 'tel' | 'cop';
export type CasingSides = 'both' | 'front' | 'back' | 'none';
export type CasingType = 'std' | 'w40' | 'cop';
export type HingeColor = 'std' | 'black' | 'white';
export type HiddenBox = 'std' | 'lux';
export type HandleShape = 'sq' | 'rd';

export type RGB = [number, number, number];

/** Плівка ПВХ / колір. Опис полів — у data/films.ts. */
export interface Film {
  id: string;
  r: number;
  s: number;
  k?: string;
  m?: string;
  g?: RGB;
  gs?: Record<string, RGB>;
  ins?: InsertId;
  base?: string;
  tex?: boolean;
  only?: string;
}

export type Anchor = 'L' | 'R' | 'T' | 'B' | 'P' | 'C';
/** ['r'|'g'|'m', x0, a, x1, a, y0, a, y1, a] */
export type RectEl = ['r' | 'g' | 'm', number, Anchor, number, Anchor, number, Anchor, number, Anchor];
/** ['l', x0, y0, x1, y1, ширина, подовжити_початок(0|1), подовжити_кінець(0|1)] */
export type LineEl = ['l', number, number, number, number, number, number, number];
/** ['p', ширина, [[x, a, y, a], …]] */
export type PathEl = ['p', number, [number, Anchor, number, Anchor][]];
export type ModelEl = RectEl | LineEl | PathEl;

export interface DoorModel {
  id: string;
  c: CollId;
  ins: boolean;
  nh: Side;
  hs: HandleShape;
  hy: number;
  gk?: number;
  gs?: string;
  solid?: string;
  pf?: { n: number; g: [number, number][] };
  hg?: [number, number][];
  els: ModelEl[];
}

export interface Collection {
  id: CollId;
  /** Назва для інтерфейсу / файлів (не перекладається). */
  name: string;
  /** Товщина полотна, мм. */
  lt: number;
  def: string;
  films: string[];
  fdef: string;
  edges: EdgeId[];
  paint: boolean;
  hinges: boolean;
  cop?: boolean;
  flush?: boolean;
  /** Непрозорість пазів-фрезерувань. */
  grv: number;
}

export interface Handle {
  c: string;
  m: number;
  r: number;
}

export interface FloorDef {
  id: FloorId;
  base: string;
}

/** Повна конфігурація дверей. Без цін. */
export interface DoorState {
  coll: CollId;
  model: string;
  W: number;
  H: number;
  T: number;
  film: string;
  edge: EdgeId;
  insert: InsertId;
  hinge: Side;
  casing: boolean;
  ft: FrameType;
  cs: CasingSides;
  ct: CasingType;
  dob: number;
  edgeHex: string;
  hi: 0 | 1;
  hb: HiddenBox;
  hgc: HingeColor;
  handle: HandleId;
  hshape: HandleShape;
  paint: string;
  paintAuto: boolean;
  room: boolean;
  dims: boolean;
  /** Індекс кольору стіни зі списку або -1 для власного (wallHex). */
  wall: number;
  wallHex: string;
  floor: FloorId;
  /** Цільовий кут відкривання, градуси. */
  open: number;
}

export type DoorFitDict = Record<string, string>;
export type Translate = (key: string, args?: (string | number)[]) => string;
