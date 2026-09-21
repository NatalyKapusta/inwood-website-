import { COLLECTIONS } from './data/collections';
import { HANDLE_IDS, FLOORS, WALLS } from './data/options';
import { INITIAL_STATE, collOf, edgesFor, modelsOf, paletteOf, reducer, wallHexOf } from './state';
import type { Action } from './state';
import type { CollId, DoorState, EdgeId, FloorId, HandleId, HandleShape, InsertId, Side } from './types';

const HEX6 = /^#[0-9a-fA-F]{6}$/;

/**
 * Параметри посилання на конфігурацію. Ті самі імена, що й у попередній (iframe) версії, тож
 * старі посилання, надіслані клієнтам, продовжують працювати. Параметри `lang` і `base` ігноруються
 * (мова береться з адреси сторінки).
 */
export function configQuery(s: DoorState): string {
  const C = collOf(s);
  const p: [string, string | number][] = [
    ['c', s.coll], ['m', s.model], ['w', s.W], ['h', s.H], ['t', s.T], ['f', s.film], ['e', s.edge], ['i', s.insert],
    ['hg', s.hinge], ['cs', s.cs], ['ft', s.ft], ['ct', s.ct], ['db', s.dob], ['hd', s.handle], ['hs', s.hshape],
    ['wl', s.wall >= 0 ? s.wall : s.wallHex], ['fl', s.floor], ['o', Math.round(s.open)],
  ];
  if (s.film === 'paint') {
    // «Колір слідує за стіною» має сенс лише для HIDDEN; в інших колекціях зберігаємо сам колір
    if (s.paintAuto && C.flush) p.push(['pa', 1]);
    else p.push(['p', String(s.paint).toLowerCase()]);
  }
  if (s.edge === 'aral') p.push(['eh', s.edgeHex.toLowerCase()]);
  if (C.flush) p.push(['hi', s.hi], ['hb', s.hb]);
  if (C.hinges) p.push(['hc', s.hgc]);
  return p.map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(String(v))).join('&');
}

export function hasConfig(q: URLSearchParams): boolean {
  return !!(q.get('m') || q.get('c'));
}

/**
 * Відновлення конфігурації з посилання: ті самі дії, у тому самому порядку, що й при ручному виборі
 * (так само як це робила попередня версія), тож залежності між опціями зберігаються.
 */
export function stateFromQuery(q: URLSearchParams, base: DoorState = INITIAL_STATE): DoorState {
  let s = base;
  const go = (a: Action) => {
    s = reducer(s, a);
  };
  const g = (k: string) => q.get(k);

  const c = g('c');
  if (c && Object.prototype.hasOwnProperty.call(COLLECTIONS, c) && c !== s.coll) go({ type: 'coll', id: c as CollId });
  const m = g('m');
  if (m && modelsOf(s.coll).some((x) => x.id === m)) go({ type: 'model', id: m });

  const f = g('f');
  if (f === 'paint') {
    const p = g('p');
    if (HEX6.test(p || '') && collOf(s).paint) go({ type: 'paint', hex: (p as string).toLowerCase() });
  } else if (f && paletteOf(s).includes(f)) go({ type: 'film', id: f });

  const w = +(g('w') ?? NaN), h = +(g('h') ?? NaN);
  if (w >= 400 && w <= 1000 && w % 50 === 0) go({ type: 'W', v: w });
  if (h >= 1800 && h <= 2300 && h % 50 === 0) go({ type: 'H', v: h });

  const t = g('t');
  if (t === '80' || t === '100' || t === '120') go({ type: 'T', v: +t });
  const e = g('e');
  if (e && edgesFor(s).includes(e as EdgeId)) go({ type: 'edge', id: e as EdgeId });
  const i = g('i');
  if (i === 'black' || i === 'grey') go({ type: 'insert', id: i as InsertId });
  const hg = g('hg');
  if (hg === 'L' || hg === 'R') go({ type: 'hinge', v: hg as Side });

  if (!collOf(s).flush) {
    const ft = g('ft');
    if (ft === 'tel' || (ft === 'cop' && collOf(s).cop)) go({ type: 'ft', v: ft });
    const db = g('db');
    if (db === '0' || db === '100' || db === '150' || db === '200') go({ type: 'dob', v: +db });
    let cs = g('cs');
    if (cs === '0') cs = 'none';
    if (cs === '1') cs = 'both';
    if (cs === 'both' || cs === 'front' || cs === 'back' || cs === 'none') go({ type: 'cs', v: cs });
    const ct = g('ct');
    if (ct === 'std' || ct === 'w40' || (ct === 'cop' && collOf(s).cop)) go({ type: 'ct', v: ct });
  }

  const hd = g('hd');
  if (hd && HANDLE_IDS.includes(hd as HandleId)) go({ type: 'handle', v: hd as HandleId });
  const hs = g('hs');
  if (hs === 'sq' || hs === 'rd') go({ type: 'hshape', v: hs as HandleShape });

  const eh = g('eh');
  if (HEX6.test(eh || '')) {
    go({ type: 'edgeHex', hex: (eh as string).toLowerCase() });
    if (e === 'aral' && edgesFor(s).includes('aral')) go({ type: 'edge', id: 'aral' });
  }

  if (collOf(s).flush) {
    const hi = g('hi');
    if (hi === '0' || hi === '1') go({ type: 'hi', v: +hi as 0 | 1 });
    const hb = g('hb');
    if (hb === 'std' || hb === 'lux') go({ type: 'hb', v: hb });
  }
  const hc = g('hc');
  if (collOf(s).hinges && (hc === 'std' || hc === 'black' || hc === 'white')) go({ type: 'hgc', v: hc });

  const wl = g('wl');
  if (/^\d$/.test(wl || '')) {
    if (+(wl as string) < WALLS.length) go({ type: 'wall', index: +(wl as string) });
  } else if (HEX6.test(wl || '')) go({ type: 'wallHex', hex: (wl as string).toLowerCase() });

  if (g('pa') === '1' && collOf(s).flush && collOf(s).paint) {
    go({ type: 'paint', hex: wallHexOf(s) });
    s = { ...s, paintAuto: true };
  }
  const fl = g('fl');
  if (fl && FLOORS.some((x) => x.id === fl)) go({ type: 'floor', id: fl as FloorId });
  const o = +(g('o') ?? NaN);
  if (g('o') !== null && o >= 0 && o <= 105) go({ type: 'open', v: o });
  return s;
}
