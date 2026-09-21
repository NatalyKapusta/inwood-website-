import { collOf, modelOf } from './state';
import type { DoorState } from './types';

export interface Geom {
  W: number; H: number; T: number; jt: number; gap: number; fg: number; lt: number; cw: number; ct: number;
  inW: number; inH: number; outW: number; outH: number; hid: boolean;
  /** Половина зовнішньої ширини (з лиштвою) з лицьового / тильного боку. */
  ceF: number; ceB: number;
  d: number; cop: boolean; csF: boolean; csB: boolean; dir: 1 | -1; hy: number; lz: number;
}

/** Розміри в метрах: полотно, короб, лиштва, добір. Чиста функція від конфігурації. */
export function geom(s: DoorState): Geom {
  const C = collOf(s);
  const hid = !!C.flush;
  const W = s.W / 1000, H = s.H / 1000, T = s.T / 1000;
  const jt = hid ? 0.004 : 0.03, gap = hid ? 0.003 : 0.004, fg = hid ? 0.004 : 0.006;
  const lt = (hid && s.hi ? 56 : C.lt || 40) / 1000;
  const cw = 0.08, ct = s.ct === 'cop' ? 0.007 : 0.01;
  const d = hid ? 0 : s.dob / 1000;
  const cop = !hid && s.ft === 'cop';
  const csF = !hid && s.casing && (s.cs === 'both' || s.cs === 'front');
  const csB = !hid && s.casing && (s.cs === 'both' || s.cs === 'back');
  const inW = W + 2 * gap, inH = H + fg + gap, outW = inW + 2 * jt, outH = inH + jt;
  return {
    W, H, T, jt, gap, fg, lt, cw, ct, inW, inH, outW, outH, hid,
    ceF: csF ? inW / 2 + 0.016 + cw : outW / 2,
    ceB: csB ? inW / 2 + 0.016 + cw : outW / 2,
    d, cop, csF, csB, dir: s.hinge === 'L' ? 1 : -1, hy: modelOf(s).hy, lz: hid || cop ? T / 2 - lt / 2 : 0,
  };
}
