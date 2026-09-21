import * as THREE from 'three';
import type { Geom } from '../geometry';
import { geom } from '../geometry';
import { collOf, modelOf } from '../state';
import type { DoorModel, DoorState, Anchor, LineEl, PathEl, RectEl } from '../types';
import type { Materials } from './materials';

export interface BuildCtx {
  M: Materials;
  /** Розмір плитки текстури плівки, м (залежить від плівки). */
  tile: number;
  /** Випадковий зсув текстури для полотна (щоб малюнок не повторювався між збірками). */
  uvoff: [number, number];
}

type Mat = THREE.Material | THREE.Material[];
interface BoxOpts {
  n?: string;
  uv?: [number, number];
  gx?: boolean;
}

/** Паралелепіпед. Для матеріалу плівки (або масиву матеріалів) UV рахуються в метрах — текстура має реальний масштаб. */
function box(
  c: BuildCtx, w: number, h: number, d: number, mat: Mat, x = 0, y = 0, z = 0, o: BoxOpts = {},
): THREE.Mesh {
  const g = new THREE.BoxGeometry(w, h, d);
  if (mat === c.M.film || Array.isArray(mat)) {
    const uv = g.attributes.uv as THREE.BufferAttribute;
    const ox = o.uv ? c.uvoff[0] : Math.random(), oy = o.uv ? c.uvoff[1] : Math.random();
    const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
    for (let f = 0; f < 6; f++) {
      for (let i = 0; i < 4; i++) {
        const k = f * 4 + i, u = uv.getX(k), v = uv.getY(k);
        let U = (u * dims[f][0]) / c.tile, V = (v * dims[f][1]) / c.tile;
        if (o.gx && f >= 4) {
          U = (v * dims[f][1]) / c.tile;
          V = (u * dims[f][0]) / c.tile;
        }
        if (o.uv && f >= 4) {
          U = ((f === 4 ? u - 0.5 : 0.5 - u) * w + o.uv[0] + x) / c.tile;
          V = ((v - 0.5) * h + o.uv[1] + y) / c.tile;
        }
        uv.setXY(k, U + ox, V + oy);
      }
    }
  }
  const m = new THREE.Mesh(g, mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  if (o.n) m.name = o.n;
  return m;
}

function cyl(
  r: number, len: number, axis: 'x' | 'z' | null, mat: THREE.Material, x: number, y: number, z: number, n: string,
): THREE.Mesh {
  const g = new THREE.CylinderGeometry(r, r, len, 28);
  if (axis === 'z') g.rotateX(Math.PI / 2);
  else if (axis === 'x') g.rotateZ(Math.PI / 2);
  const m = new THREE.Mesh(g, mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  m.name = n || 'part';
  return m;
}

export function disposeGroup(g: THREE.Object3D | null) {
  if (!g) return;
  g.traverse((o) => {
    const geo = (o as THREE.Mesh).geometry as THREE.BufferGeometry | undefined;
    if (geo) geo.dispose();
  });
  if (g.parent) g.parent.remove(g);
}

/** Розрахунок позиції елемента візуалу для довільного розміру полотна. */
export function pv(v: number, a: Anchor, size: number, base: number): number {
  if (a === 'L' || a === 'T') return v;
  if (a === 'R' || a === 'B') return size - (base - v);
  if (a === 'P') return (v * size) / base;
  return size / 2 + (v - base / 2);
}

type Pt = [number, number];
function clipPoly(poly: Pt[], W: number, H: number): Pt[] {
  const edges: [(p: Pt) => boolean, (a: Pt, b: Pt) => Pt][] = [
    [(p) => p[0] >= 0, (a, b) => [0, a[1] + ((0 - a[0]) / (b[0] - a[0])) * (b[1] - a[1])]],
    [(p) => p[0] <= W, (a, b) => [W, a[1] + ((W - a[0]) / (b[0] - a[0])) * (b[1] - a[1])]],
    [(p) => p[1] >= 0, (a, b) => [a[0] + ((0 - a[1]) / (b[1] - a[1])) * (b[0] - a[0]), 0]],
    [(p) => p[1] <= H, (a, b) => [a[0] + ((H - a[1]) / (b[1] - a[1])) * (b[0] - a[0]), H]],
  ];
  edges.forEach((e) => {
    const inp = poly;
    poly = [];
    for (let i = 0; i < inp.length; i++) {
      const a = inp[i], b = inp[(i + 1) % inp.length], ia = e[0](a), ib = e[0](b);
      if (ia) {
        poly.push(a);
        if (!ib) poly.push(e[1](a, b));
      } else if (ib) poly.push(e[1](a, b));
    }
  });
  return poly;
}

/** Діагональна вставка: смуга завширшки w мм між двома точками, обрізана по контуру полотна. */
function lineMesh(c: BuildCtx, el: LineEl, W: number, H: number, t: number, mir: boolean): THREE.Mesh | null {
  const sx = (W * 1000) / 800, sy = (H * 1000) / 2000;
  let x0 = el[1] * sx, y0 = el[2] * sy, x1 = el[3] * sx, y1 = el[4] * sy;
  const w = el[5];
  let dx = x1 - x0, dy = y1 - y0;
  const L = Math.sqrt(dx * dx + dy * dy);
  dx /= L;
  dy /= L;
  if (el[6]) {
    x0 -= dx * 90;
    y0 -= dy * 90;
  }
  if (el[7]) {
    x1 += dx * 90;
    y1 += dy * 90;
  }
  const nx = (-dy * w) / 2, ny = (dx * w) / 2;
  let poly: Pt[] = [[x0 + nx, y0 + ny], [x1 + nx, y1 + ny], [x1 - nx, y1 - ny], [x0 - nx, y0 - ny]];
  if (mir) poly = poly.map((p): Pt => [W * 1000 - p[0], p[1]]).reverse();
  poly = clipPoly(poly, W * 1000, H * 1000);
  if (poly.length < 3) return null;
  const sh = new THREE.Shape(poly.map((p) => new THREE.Vector2(p[0] / 1000 - W / 2, H / 2 - p[1] / 1000)));
  const d = t + 0.0012, ge = new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: false });
  ge.translate(0, 0, -d / 2);
  const m = new THREE.Mesh(ge, c.M.insert);
  m.castShadow = true;
  m.receiveShadow = true;
  m.name = 'leaf_insert_diag';
  return m;
}

/** Фрезерована канавка по ламаній: стрічка завширшки el[1] мм з обох боків полотна. */
function pathMesh(c: BuildCtx, el: PathEl, W: number, H: number, t: number, mir: boolean): THREE.Mesh {
  let pts: Pt[] = el[2].map((p): Pt => [pv(p[0], p[1], W * 1000, 800), pv(p[2], p[3], H * 1000, 2000)]);
  if (mir) pts = pts.map((p): Pt => [W * 1000 - p[0], p[1]]);
  const hw = el[1] / 2, pos: number[] = [], idx: number[] = [], n = pts.length;
  const X = (v: number) => v / 1000 - W / 2, Y = (v: number) => H / 2 - v / 1000;
  [t / 2 + 0.0006, -t / 2 - 0.0006].forEach((z) => {
    const b = pos.length / 3;
    for (let i = 0; i < n; i++) {
      const a = pts[Math.max(0, i - 1)], cc = pts[Math.min(n - 1, i + 1)];
      const tx = cc[0] - a[0], ty = cc[1] - a[1], L = Math.sqrt(tx * tx + ty * ty) || 1;
      const nx = (-ty / L) * hw, ny = (tx / L) * hw;
      pos.push(X(pts[i][0] + nx), Y(pts[i][1] + ny), z, X(pts[i][0] - nx), Y(pts[i][1] - ny), z);
    }
    for (let i = 0; i < n - 1; i++) {
      const q = b + i * 2;
      idx.push(q, q + 1, q + 2, q + 1, q + 3, q + 2);
    }
  });
  const ge = new THREE.BufferGeometry();
  ge.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  ge.setIndex(idx);
  ge.computeVertexNormals();
  const m = new THREE.Mesh(ge, c.M.groove);
  m.name = 'leaf_groove_path';
  return m;
}

type Rect4 = [number, number, number, number];
/** Скошена рамка філенки: контур o на глибині zo → контур i на глибині zi (обидві сторони полотна). */
function bevelRing(c: BuildCtx, g: THREE.Group, o: Rect4, i: Rect4, zo: number, zi: number, mat: Mat) {
  const pos: number[] = [], uv: number[] = [];
  const C = (r: Rect4): Pt[] => [[r[0], r[2]], [r[1], r[2]], [r[1], r[3]], [r[0], r[3]]];
  [1, -1].forEach((sg) => {
    const A = C(o), B = C(i);
    for (let k = 0; k < 4; k++) {
      const k2 = (k + 1) % 4;
      const q = sg > 0 ? [A[k], A[k2], B[k2], B[k]] : [A[k], B[k], B[k2], A[k2]];
      const zs = sg > 0 ? [zo, zo, zi, zi] : [zo, zi, zi, zo];
      [[0, 1, 2], [0, 2, 3]].forEach((tri) => {
        tri.forEach((j) => {
          const pt = q[j], z = zs[j] * sg;
          pos.push(pt[0], pt[1], z);
          uv.push((sg > 0 ? pt[0] : -pt[0]) / c.tile + c.uvoff[0], pt[1] / c.tile + c.uvoff[1]);
        });
      });
    }
  });
  const ge = new THREE.BufferGeometry();
  ge.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  ge.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  ge.computeVertexNormals();
  const m = new THREE.Mesh(ge, mat);
  m.castShadow = true;
  m.receiveShadow = true;
  m.name = 'leaf_panel_bevel';
  g.add(m);
}

/** Філенчасте полотно: стійки й перемички на повну товщину, поля заглиблені, усередині — підвищена філенка зі скошеною рамкою. */
function buildPanels(c: BuildCtx, g: THREE.Group, G: Geom, mdl: DoorModel & { pf: NonNullable<DoorModel['pf']> }, e: THREE.Material) {
  const W = G.W, H = G.H, t = G.lt, rd = 0.01, st = Math.min(0.105, W * 0.13), rl = 0.093, n = mdl.pf.n;
  const fh = (H - (n + 1) * rl) / n, F = c.M.film;
  g.add(box(c, W - 0.0008, H - 0.0008, t - 2 * rd, [e, e, e, e, F, F], 0, 0, 0, { n: 'leaf_core', uv: [0, 0] }));
  g.add(box(c, st, H, t, [F, e, e, e, F, F], -(W / 2 - st / 2), 0, 0, { n: 'leaf_stile_left', uv: [0, 0] }));
  g.add(box(c, st, H, t, [e, F, e, e, F, F], W / 2 - st / 2, 0, 0, { n: 'leaf_stile_right', uv: [0, 0] }));
  for (let k = 0; k <= n; k++) {
    if (mdl.pf.g.some((gr) => gr[0] <= k - 1 && k <= gr[1])) continue;
    const y0 = k * (fh + rl);
    const mats = k === 0 ? [F, F, e, F, F, F] : k === n ? [F, F, F, e, F, F] : [F, F, F, F, F, F];
    g.add(box(c, W - 2 * st, rl, t, mats, 0, H / 2 - y0 - rl / 2, 0, { n: 'leaf_rail', uv: [0, 0] }));
  }
  const m0 = 0.004, ip = 0.036, zo = t / 2 - rd, zi = t / 2 - 0.003;
  mdl.pf.g.forEach((gr) => {
    const top = rl + gr[0] * (fh + rl), bot = rl + gr[1] * (fh + rl) + fh, xa = W / 2 - st, ya = H / 2 - top, yb = H / 2 - bot;
    bevelRing(c, g, [-xa + m0, xa - m0, yb + m0, ya - m0], [-xa + ip, xa - ip, yb + ip, ya - ip], zo, zi, F);
    g.add(box(c, 2 * xa - 2 * ip, ya - yb - 2 * ip, 2 * zi, F, 0, (ya + yb) / 2, 0, { n: 'leaf_panel', uv: [0, 0] }));
  });
}

function buildLeaf(c: BuildCtx, G: Geom, s: DoorState): THREE.Group {
  const W = G.W, H = G.H, t = G.lt, g = new THREE.Group();
  g.name = 'leaf';
  const e = s.edge === 'film' ? c.M.film : c.M.edge;
  c.uvoff = [Math.random(), Math.random()];
  const mdl = modelOf(s), mir = s.hinge !== mdl.nh;
  if (mdl.pf) buildPanels(c, g, G, mdl as DoorModel & { pf: NonNullable<DoorModel['pf']> }, e);
  else g.add(box(c, W, H, t, [e, e, e, e, c.M.film, c.M.film], 0, 0, 0, { n: 'leaf_body', uv: [0, 0] }));
  mdl.els.forEach((el) => {
    if (el[0] === 'l') {
      const m = lineMesh(c, el, W, H, t, mir);
      if (m) g.add(m);
      return;
    }
    if (el[0] === 'p') {
      g.add(pathMesh(c, el, W, H, t, mir));
      return;
    }
    const r = el as RectEl;
    let X0 = pv(r[1], r[2], W * 1000, 800), X1 = pv(r[3], r[4], W * 1000, 800);
    const Y0 = pv(r[5], r[6], H * 1000, 2000), Y1 = pv(r[7], r[8], H * 1000, 2000);
    if (mir) {
      const q = X0;
      X0 = W * 1000 - X1;
      X1 = W * 1000 - q;
    }
    const w = (X1 - X0) / 1000;
    let h = (Y1 - Y0) / 1000;
    const full = Y1 - Y0 > H * 1000 - 1;
    if (full) h += 0.0008;
    const gr = r[0] === 'g', mr = r[0] === 'm';
    g.add(
      box(c, w, h, t + (gr ? 0.0006 : 0.0012), gr ? c.M.groove : mr ? c.M.mirror : c.M.insert,
        -W / 2 + (X0 + X1) / 2000, H / 2 - (Y0 + Y1) / 2000, 0,
        { n: gr ? 'leaf_groove' : mr ? 'leaf_mirror' : 'leaf_insert' }),
    );
  });
  return g;
}

function buildHandle(c: BuildCtx, G: Geom, s: DoorState): THREE.Group {
  const g = new THREE.Group();
  g.name = 'handle';
  const lt = G.lt, sq = s.hshape !== 'rd', H = c.M.handle;
  [1, -1].forEach((f) => {
    if (sq) {
      g.add(box(c, 0.072, 0.072, 0.01, H, 0, 0, f * (lt / 2 + 0.005), { n: 'handle_rose' }));
      g.add(box(c, 0.016, 0.016, 0.03, H, 0, 0, f * (lt / 2 + 0.025), { n: 'handle_neck' }));
      g.add(box(c, 0.14, 0.023, 0.023, H, -G.dir * 0.048, 0, f * (lt / 2 + 0.0525), { n: 'handle_lever' }));
    } else {
      g.add(cyl(0.0235, 0.01, 'z', H, 0, 0, f * (lt / 2 + 0.005), 'handle_rose'));
      g.add(cyl(0.009, 0.03, 'z', H, 0, 0, f * (lt / 2 + 0.025), 'handle_neck'));
      g.add(cyl(0.0085, 0.125, 'x', H, -G.dir * 0.05, 0, f * (lt / 2 + 0.0485), 'handle_lever'));
    }
  });
  return g;
}

export interface DoorBuild {
  door: THREE.Group;
  pivot: THREE.Group;
}

/** Збирає модель дверей (короб, лиштва, полотно, ручка, петлі). Кут відкривання виставляє викликач. */
export function buildDoor(c: BuildCtx, s: DoorState): DoorBuild {
  const G = geom(s), F = c.M.film, mdl = modelOf(s), C = collOf(s);
  const door = new THREE.Group();
  door.name = C.name.replace(/\s+/g, '_') + '_' + s.model + '_' + s.W + 'x' + s.H;
  if (!G.hid) {
    const frame = new THREE.Group();
    frame.name = 'frame';
    frame.add(box(c, G.jt, G.outH, G.T, F, -(G.inW / 2 + G.jt / 2), G.outH / 2, 0, { n: 'frame_jamb_left' }));
    frame.add(box(c, G.jt, G.outH, G.T, F, G.inW / 2 + G.jt / 2, G.outH / 2, 0, { n: 'frame_jamb_right' }));
    frame.add(box(c, G.inW, G.jt, G.T, F, 0, G.inH + G.jt / 2, 0, { gx: true, n: 'frame_head' }));
    if (G.d > 0) {
      const zx = -(G.T / 2 + G.d / 2);
      frame.add(box(c, G.jt, G.outH, G.d, F, -(G.inW / 2 + G.jt / 2), G.outH / 2, zx, { n: 'extension_left' }));
      frame.add(box(c, G.jt, G.outH, G.d, F, G.inW / 2 + G.jt / 2, G.outH / 2, zx, { n: 'extension_right' }));
      frame.add(box(c, G.inW, G.jt, G.d, F, 0, G.inH + G.jt / 2, zx, { gx: true, n: 'extension_head' }));
    }
    door.add(frame);
  } else {
    const rv = new THREE.Group();
    rv.name = 'hidden_box';
    const R = c.M.reveal;
    rv.add(box(c, G.jt, G.outH, G.T, R, -(G.inW / 2 + G.jt / 2), G.outH / 2, 0, { n: 'box_left' }));
    rv.add(box(c, G.jt, G.outH, G.T, R, G.inW / 2 + G.jt / 2, G.outH / 2, 0, { n: 'box_right' }));
    rv.add(box(c, G.inW, G.jt, G.T, R, 0, G.inH + G.jt / 2, 0, { n: 'box_head' }));
    door.add(rv);
  }
  if (G.csF || G.csB) {
    const cs = new THREE.Group();
    cs.name = 'casing';
    [1, -1].forEach((sd) => {
      if (sd > 0 ? !G.csF : !G.csB) return;
      const z = sd > 0 ? G.T / 2 + G.ct / 2 : -(G.T / 2 + G.d + G.ct / 2);
      const rv = 0.016, vx = G.inW / 2 + rv + G.cw / 2, vh = G.inH + rv + G.cw;
      cs.add(box(c, G.cw, vh, G.ct, F, -vx, vh / 2, z, { n: 'casing_left' }));
      cs.add(box(c, G.cw, vh, G.ct, F, vx, vh / 2, z, { n: 'casing_right' }));
      cs.add(box(c, G.inW + 2 * rv, G.cw, G.ct, F, 0, G.inH + rv + G.cw / 2, z, { gx: true, n: 'casing_head' }));
    });
    door.add(cs);
  }
  const pivot = new THREE.Group();
  pivot.name = 'leaf_pivot';
  pivot.position.set(-G.dir * G.W / 2, G.fg, G.lz + G.lt / 2);
  const leaf = buildLeaf(c, G, s);
  leaf.position.set((G.dir * G.W) / 2, G.H / 2, -G.lt / 2);
  const hd = buildHandle(c, G, s);
  hd.position.set(G.dir * (G.W / 2 - (s.hshape === 'rd' ? 0.05 : 0.062)), G.hy - G.fg - G.H / 2, 0);
  leaf.add(hd);
  pivot.add(leaf);
  door.add(pivot);
  if (C.hinges && mdl.hg) {
    const hg = new THREE.Group();
    hg.name = 'hinges';
    mdl.hg.forEach((h, i) => {
      const a: Anchor = i ? 'B' : 'T', y0 = pv(h[0], a, G.H * 1000, 2000), y1 = pv(h[1], a, G.H * 1000, 2000);
      hg.add(
        cyl(0.0055, (y1 - y0) / 1000, null, c.M.hinge, -G.dir * (G.W / 2 - 0.0035), G.fg + G.H - (y0 + y1) / 2000,
          G.lz + G.lt / 2, 'hinge'),
      );
    });
    door.add(hg);
  }
  return { door, pivot };
}

/** Стіна з отвором, плінтуси, задня стіна. */
export function buildRoom(c: BuildCtx, s: DoorState): THREE.Group {
  const G = geom(s), T = G.T, Tt = G.T + G.d, zc = -G.d / 2, wallW = 3.6, wallH = 2.7;
  const room = new THREE.Group();
  room.name = 'room';
  const seg = (w: number, h: number, x: number, y: number) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, Tt), c.M.wall);
    m.position.set(x, y, zc);
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };
  const sideW = wallW / 2 - G.outW / 2;
  room.add(seg(sideW, wallH, -(G.outW / 2 + sideW / 2), wallH / 2));
  room.add(seg(sideW, wallH, G.outW / 2 + sideW / 2, wallH / 2));
  room.add(seg(G.outW, wallH - G.outH, 0, G.outH + (wallH - G.outH) / 2));
  const skH = 0.08, skT = 0.008;
  [-1, 1].forEach((sx) => {
    [-1, 1].forEach((sz) => {
      const ce = sz > 0 ? G.ceF : G.ceB, skL = wallW / 2 - ce;
      const m = new THREE.Mesh(new THREE.BoxGeometry(skL, skH, skT), c.M.skirt);
      m.position.set(sx * (ce + skL / 2), skH / 2, sz > 0 ? T / 2 + skT / 2 : -(T / 2 + G.d + skT / 2));
      m.castShadow = true;
      m.receiveShadow = true;
      room.add(m);
    });
  });
  const back = new THREE.Mesh(new THREE.PlaneGeometry(7, wallH), c.M.back);
  back.position.set(0, wallH / 2, -2.9);
  back.receiveShadow = true;
  room.add(back);
  return room;
}
