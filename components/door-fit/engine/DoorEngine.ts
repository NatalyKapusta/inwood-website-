import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EDGE_COL, FLOORS, HANDLES, HINGE_COL, INSERT_COL } from '../data/options';
import { geom } from '../geometry';
import { collOf, filmById, filmOf, modelOf, wallHexOf } from '../state';
import type { DoorState, ViewId } from '../types';
import { buildDoor, buildRoom, disposeGroup } from './build';
import type { BuildCtx } from './build';
import { col, createMaterials, floorCanvas, prepTex } from './materials';
import type { Materials } from './materials';

export interface EngineOptions {
  canvas: HTMLCanvasElement;
  /** Другий (2D) полотно поверх 3D — розмірні лінії. */
  dims: HTMLCanvasElement;
  stage: HTMLElement;
  /** URL папки з текстурами плівок, напр. '/door-fit/textures'. */
  textureBase: string;
  /** CSS-значення font-family (з next/font), яким малюються підписи розмірів. */
  fontFamily: string;
}

const RB = 1.3; // компенсація низької експозиції, підібраної під кольори плівок
const TEX_VER = '1';
const TOK = { accent: '#333958', panel: '#FFFFFF', ink: '#333958' };
const rad = (d: number) => (d * Math.PI) / 180;

type Tween = { p0: THREE.Vector3; t0: THREE.Vector3; p1: THREE.Vector3; t1: THREE.Vector3; t: number };

/**
 * 3D-рушій примірки. Не знає про React: отримує повну конфігурацію через sync(state) і сам вирішує,
 * що перебудувати (модель, стіну) або лише перефарбувати (матеріали).
 */
export class DoorEngine {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
  readonly controls: OrbitControls;

  private opts: EngineOptions;
  private M: Materials = createMaterials();
  private ctx: BuildCtx = { M: this.M, tile: 0.25, uvoff: [0, 0] };
  private S: DoorState | null = null;
  private cur = 24;
  private view: ViewId = 'persp';
  private labels = { mm: 'mm', wall: 'wall' };

  private door: THREE.Group | null = null;
  private pivot: THREE.Group | null = null;
  private room: THREE.Group | null = null;
  private floorMesh: THREE.Mesh;
  private floorTex: Record<string, THREE.CanvasTexture> = {};

  private loader = new THREE.TextureLoader();
  private filmTex: Record<string, THREE.Texture> = {};
  private texReady: Record<string, boolean> = {};

  private keys: Record<string, string> = {};
  private dirty = true;
  private tw: Tween | null = null;
  private RM = false;
  private raf = 0;
  private last = 0;
  private disposed = false;
  private ro: ResizeObserver | null = null;
  private dctx: CanvasRenderingContext2D;

  constructor(opts: EngineOptions) {
    this.opts = opts;
    this.renderer = new THREE.WebGLRenderer({ canvas: opts.canvas, antialias: true, alpha: true });
    const r = this.renderer;
    r.outputEncoding = THREE.sRGBEncoding;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 0.48;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.setClearColor(0x000000, 0);
    this.dctx = opts.dims.getContext('2d') as CanvasRenderingContext2D;
    try {
      this.RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      /* без matchMedia анімація лишається */
    }

    this.setupScene();

    this.controls = new OrbitControls(this.camera, opts.canvas);
    const c = this.controls;
    c.enableDamping = true;
    c.dampingFactor = 0.09;
    c.minDistance = 1.2;
    c.maxDistance = 11;
    c.maxPolarAngle = Math.PI * 0.495;
    c.screenSpacePanning = true;
    c.addEventListener('start', () => {
      this.tw = null;
    });
    c.addEventListener('change', () => {
      this.dirty = true;
    });

    FLOORS.forEach((f) => {
      const t = prepTex(new THREE.CanvasTexture(floorCanvas(f.id, f.base)), 8);
      t.repeat.set(7 / 1.2, 7.5 / 1.2);
      this.floorTex[f.id] = t;
    });
    this.floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(7, 7.5), this.M.floor);
    this.floorMesh.rotation.x = -Math.PI / 2;
    this.floorMesh.position.set(0, 0, 0.75);
    this.floorMesh.receiveShadow = true;
    this.scene.add(this.floorMesh);

    if (typeof ResizeObserver !== 'undefined') {
      this.ro = new ResizeObserver(() => this.resize());
      this.ro.observe(opts.stage);
    } else window.addEventListener('resize', this.onWinResize);
    this.resize();
    this.setView('persp', true);
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private onWinResize = () => this.resize();

  private setupScene() {
    const scene = this.scene;
    // Середовище для відблисків: градієнт «небо — підлога» з кількома світлими вікнами
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 512;
    const g = c.getContext('2d') as CanvasRenderingContext2D;
    const gr = g.createLinearGradient(0, 0, 0, 512);
    gr.addColorStop(0, '#c9d9e6');
    gr.addColorStop(0.48, '#ffffff');
    gr.addColorStop(0.52, '#b7b2a7');
    gr.addColorStop(1, '#4d4a44');
    g.fillStyle = gr;
    g.fillRect(0, 0, 1024, 512);
    g.fillStyle = '#ffffff';
    g.fillRect(120, 120, 200, 150);
    g.fillRect(560, 150, 260, 120);
    g.fillRect(900, 140, 90, 130);
    g.fillStyle = '#8a94a0';
    g.fillRect(360, 150, 120, 100);
    const t = new THREE.CanvasTexture(c);
    t.mapping = THREE.EquirectangularReflectionMapping;
    t.encoding = THREE.sRGBEncoding;
    const pm = new THREE.PMREMGenerator(this.renderer);
    scene.environment = pm.fromEquirectangular(t).texture;
    pm.dispose();
    t.dispose();

    scene.add(new THREE.HemisphereLight(0xffffff, 0x8c887f, 0.44));
    const sun = new THREE.DirectionalLight(0xfffbf6, 1.7);
    sun.position.set(3.2, 5.4, 4.6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const sc = sun.shadow.camera;
    sc.left = -4.5;
    sc.right = 4.5;
    sc.top = 4.5;
    sc.bottom = -4.5;
    sc.near = 1;
    sc.far = 18;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.012;
    sun.shadow.radius = 3;
    sun.target.position.set(0, 1, 0);
    scene.add(sun);
    scene.add(sun.target);
  }

  /* ---------- текстури плівок: окремі файли, вантажаться лише коли колір обрано (або наведено курсор) ---------- */

  /** Починає завантаження текстури плівки (id текстури = base || id). */
  preload(filmId: string) {
    const f = filmById(filmId, this.S?.paint ?? '#ffffff');
    if (f.tex || f.base) this.getTex(f.base || f.id);
  }

  private getTex(id: string): THREE.Texture {
    if (this.filmTex[id]) return this.filmTex[id];
    const t = this.loader.load(
      `${this.opts.textureBase}/${id}.webp?v=${TEX_VER}`,
      () => {
        if (this.disposed) return;
        this.texReady[id] = true;
        this.dirty = true;
        if (this.S) {
          const f = filmOf(this.S);
          if ((f.base || f.id) === id) this.applyFilm();
        }
      },
      undefined,
      () => {
        /* файл не знайдено — лишається середній колір плівки */
      },
    );
    return (this.filmTex[id] = prepTex(t));
  }

  /** Чекає на текстуру поточної плівки (для картки й експорту), максимум ~4 с. */
  async whenFilmReady(): Promise<void> {
    if (!this.S) return;
    const f = filmOf(this.S), tid = f.k ? null : f.base || f.id;
    if (!tid) return;
    this.getTex(tid);
    for (let w = 0; !this.texReady[tid] && w < 40; w++) await new Promise((r) => setTimeout(r, 100));
  }

  /** Зображення текстури поточної плівки (для картки клієнта), якщо вже завантажене. */
  filmImage(): CanvasImageSource | null {
    if (!this.S) return null;
    const f = filmOf(this.S), tid = f.k ? null : f.base || f.id;
    if (!tid || !this.texReady[tid]) return null;
    return (this.filmTex[tid].image as CanvasImageSource) || null;
  }

  /* ---------- матеріали ---------- */

  private applyFilm() {
    const s = this.S as DoorState, M = this.M, f = filmOf(s), mdl = modelOf(s);
    if (f.k) {
      M.film.map = null;
      M.film.color.copy(col(f.k));
    } else {
      const tid = f.base || f.id, tf = filmById(tid, s.paint), tx = this.getTex(tid);
      let g = f.g;
      if (mdl.gs && f.gs && f.gs[mdl.gs]) g = f.gs[mdl.gs];
      if (this.texReady[tid]) {
        M.film.map = tx;
        if (g) M.film.color.setRGB(g[0], g[1], g[2]);
        else M.film.color.set(0xffffff);
      } else {
        // доки файл вантажиться — рівний середній колір плівки
        M.film.map = null;
        M.film.color.copy(col(tf.m || '#8a8a8a'));
        if (g) M.film.color.multiply(new THREE.Color(g[0], g[1], g[2]));
      }
      if (mdl.gk) M.film.color.multiplyScalar(mdl.gk);
    }
    M.film.roughness = f.r;
    M.film.needsUpdate = true;
    this.ctx.tile = f.s || 0.25;
    M.groove.opacity = collOf(s).grv;
    this.dirty = true;
  }

  private applyEdge(s: DoorState) {
    const M = this.M, c = s.edge === 'aral' ? s.edgeHex : EDGE_COL[s.edge];
    if (s.edge === 'agrey' || s.edge === 'ablack' || s.edge === 'aral') {
      M.edge.metalness = 0.75;
      M.edge.roughness = 0.4;
    } else {
      M.edge.metalness = 0;
      M.edge.roughness = 0.55;
    }
    M.edge.needsUpdate = true;
    M.edge.color.copy(col(c || '#141414'));
    this.dirty = true;
  }

  private applyWall(s: DoorState) {
    const w = wallHexOf(s);
    this.M.wall.color.copy(col(w)).multiplyScalar(RB);
    this.M.back.color.copy(col(w)).multiplyScalar(0.82 * RB);
    this.dirty = true;
  }

  /* ---------- синхронізація зі станом ---------- */

  private changed(name: string, val: string): boolean {
    if (this.keys[name] === val) return false;
    this.keys[name] = val;
    return true;
  }

  sync(s: DoorState) {
    if (this.disposed) return;
    const first = !this.S;
    this.S = s;
    const M = this.M;
    if (first) this.cur = s.open;

    if (this.changed('film', [s.film, s.paint, s.model, s.coll].join('|'))) this.applyFilm();
    if (this.changed('edge', s.edge + '|' + s.edgeHex)) this.applyEdge(s);
    if (this.changed('hinge', s.hgc)) {
      M.hinge.color.copy(col(HINGE_COL[s.hgc]));
      M.hinge.needsUpdate = true;
      this.dirty = true;
    }
    if (this.changed('insert', s.insert)) {
      M.insert.color.copy(col(INSERT_COL[s.insert]));
      this.dirty = true;
    }
    if (this.changed('handle', s.handle)) {
      const h = HANDLES[s.handle];
      M.handle.color.copy(col(h.c));
      M.handle.metalness = h.m;
      M.handle.roughness = h.r;
      M.handle.needsUpdate = true;
      this.dirty = true;
    }
    if (this.changed('wall', wallHexOf(s))) this.applyWall(s);
    if (this.changed('floor', s.floor + '|' + s.room)) {
      M.floor.color.setScalar(RB);
      M.floor.map = this.floorTex[s.floor];
      M.floor.needsUpdate = true;
      this.floorMesh.material = s.room ? M.floor : M.catcher;
      this.dirty = true;
    }

    const G = geom(s);
    const doorKey = [
      s.coll, s.model, s.W, s.H, s.T, s.ft, s.cs, s.casing, s.ct, s.dob, s.hi, s.hinge, s.hshape, s.edge === 'film',
      this.ctx.tile,
    ].join('|');
    if (this.changed('door', doorKey)) this.rebuildDoor(s);
    if (this.changed('room', [G.outW, G.outH, G.T, G.d, G.ceF, G.ceB].join('|'))) this.rebuildRoom(s);
    if (this.room) this.room.visible = s.room;
    if (this.changed('dims', String(s.dims))) this.dirty = true;
    this.dirty = true;
  }

  private rebuildDoor(s: DoorState) {
    disposeGroup(this.door);
    const b = buildDoor(this.ctx, s);
    this.door = b.door;
    this.pivot = b.pivot;
    this.pivot.rotation.y = -geom(s).dir * rad(this.cur);
    this.scene.add(this.door);
    this.dirty = true;
  }

  private rebuildRoom(s: DoorState) {
    disposeGroup(this.room);
    this.room = buildRoom(this.ctx, s);
    this.room.visible = s.room;
    this.scene.add(this.room);
    this.dirty = true;
  }

  setLabels(l: { mm: string; wall: string }) {
    this.labels = l;
    this.dirty = true;
  }

  /* ---------- камера ---------- */

  private stageSize() {
    return { w: Math.max(1, this.opts.stage.clientWidth), h: Math.max(1, this.opts.stage.clientHeight) };
  }

  setView(name: ViewId, instant = false) {
    const sz = this.stageSize(), k = Math.min(1.5, Math.max(1, 0.95 / (sz.w / sz.h)));
    const V = THREE.Vector3;
    let tgt: THREE.Vector3, dir: THREE.Vector3, d: number;
    if (name === 'front') {
      tgt = new V(0, 1.15, 0);
      dir = new V(0, 0.03, 1);
      d = 7.6;
    } else if (name === 'side') {
      tgt = new V(0, 1.15, 0.35);
      dir = new V(1, 0.03, 0.12);
      d = 7.4;
    } else if (name === 'plan') {
      tgt = new V(0, 0, 0.9);
      dir = new V(0, 1, 0.02);
      d = 8.2;
    } else {
      tgt = new V(0, 1.15, 0);
      dir = new V(0.62, 0.17, 1);
      d = 6.3;
    }
    const pos = tgt.clone().add(dir.normalize().multiplyScalar(d * k));
    this.view = name;
    if (instant || this.RM) {
      this.camera.position.copy(pos);
      this.controls.target.copy(tgt);
      this.controls.update();
      this.dirty = true;
      this.tw = null;
      return;
    }
    this.tw = { p0: this.camera.position.clone(), t0: this.controls.target.clone(), p1: pos, t1: tgt, t: 0 };
    this.dirty = true;
  }

  private resize() {
    if (this.disposed) return;
    const sz = this.stageSize(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(sz.w, sz.h, false);
    this.camera.aspect = sz.w / sz.h;
    this.camera.updateProjectionMatrix();
    const dc = this.opts.dims;
    dc.width = Math.round(sz.w * dpr);
    dc.height = Math.round(sz.h * dpr);
    this.dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.dirty = true;
  }

  /* ---------- розмірні лінії ---------- */

  private P(x: number, y: number, z: number) {
    const v = new THREE.Vector3(x, y, z).project(this.camera), s = this.stageSize();
    return { x: (v.x * 0.5 + 0.5) * s.w, y: (-v.y * 0.5 + 0.5) * s.h, ok: v.z > -1 && v.z < 1 };
  }

  private line(a: number[], b: number[], alpha: number, dash?: number[]) {
    const g = this.dctx, pa = this.P(a[0], a[1], a[2]), pb = this.P(b[0], b[1], b[2]);
    if (!pa.ok || !pb.ok) return null;
    g.globalAlpha = alpha;
    g.setLineDash(dash || []);
    g.beginPath();
    g.moveTo(pa.x, pa.y);
    g.lineTo(pb.x, pb.y);
    g.stroke();
    g.setLineDash([]);
    g.globalAlpha = 1;
    return [pa, pb];
  }

  private dim(a: number[], b: number[], label: string) {
    const g = this.dctx, r = this.line(a, b, 1);
    if (!r) return;
    const pa = r[0], pb = r[1], dx = pb.x - pa.x, dy = pb.y - pa.y, L = Math.hypot(dx, dy) || 1;
    const nx = (-dy / L) * 6, ny = (dx / L) * 6;
    [pa, pb].forEach((p) => {
      g.beginPath();
      g.moveTo(p.x - nx, p.y - ny);
      g.lineTo(p.x + nx, p.y + ny);
      g.stroke();
    });
    const mx = (pa.x + pb.x) / 2, my = (pa.y + pb.y) / 2;
    g.font = '600 12px ' + this.opts.fontFamily;
    const w = g.measureText(label).width + 14;
    g.fillStyle = TOK.panel;
    g.globalAlpha = 0.94;
    g.fillRect(mx - w / 2, my - 11, w, 22);
    g.globalAlpha = 1;
    g.strokeRect(mx - w / 2 + 0.5, my - 10.5, w - 1, 21);
    g.fillStyle = TOK.ink;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(label, mx, my + 0.5);
  }

  private drawDims() {
    const g = this.dctx, s = this.stageSize(), S = this.S;
    g.clearRect(0, 0, s.w, s.h);
    if (!S || !S.dims) return;
    const G = geom(S);
    g.strokeStyle = TOK.accent;
    g.lineWidth = 1.25;
    const zF = G.T / 2 + (G.csF ? G.ct : 0) + 0.012, cw = G.csF ? G.cw : 0;
    const yTop = G.fg + G.H, dimY = (G.csF ? G.inH + 0.016 + cw : G.outH) + 0.16, dimX = -(G.outW / 2 + cw + 0.16);
    this.line([-G.W / 2, yTop, zF], [-G.W / 2, dimY, zF], 0.5, [3, 3]);
    this.line([G.W / 2, yTop, zF], [G.W / 2, dimY, zF], 0.5, [3, 3]);
    this.dim([-G.W / 2, dimY, zF], [G.W / 2, dimY, zF], S.W + ' ' + this.labels.mm);
    this.line([-G.W / 2, G.fg, zF], [dimX, G.fg, zF], 0.5, [3, 3]);
    this.line([-G.W / 2, yTop, zF], [dimX, yTop, zF], 0.5, [3, 3]);
    this.dim([dimX, G.fg, zF], [dimX, yTop, zF], S.H + ' ' + this.labels.mm);
    if (this.view === 'plan' || this.view === 'side') {
      const xs = this.view === 'plan' ? -(G.outW / 2 + 0.4) : G.outW / 2 + 0.4;
      this.dim([xs, 2.7, -(G.T / 2 + G.d)], [xs, 2.7, G.T / 2], this.labels.wall + ' ' + Math.round((G.T + G.d) * 1000));
    }
  }

  /* ---------- цикл ---------- */

  private frame = (now: number) => {
    if (this.disposed) return;
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    const S = this.S;
    if (this.tw) {
      const tw = this.tw;
      tw.t = Math.min(1, tw.t + dt / 0.7);
      const e = tw.t < 0.5 ? 2 * tw.t * tw.t : 1 - Math.pow(-2 * tw.t + 2, 2) / 2;
      this.camera.position.lerpVectors(tw.p0, tw.p1, e);
      this.controls.target.lerpVectors(tw.t0, tw.t1, e);
      if (tw.t >= 1) this.tw = null;
      this.dirty = true;
    }
    if (S && this.pivot && this.cur !== S.open) {
      const diff = S.open - this.cur;
      this.cur = this.RM || Math.abs(diff) < 0.05 ? S.open : this.cur + diff * Math.min(1, dt * 7);
      this.pivot.rotation.y = -geom(S).dir * rad(this.cur);
      this.dirty = true;
    }
    if (this.controls.update()) this.dirty = true;
    if (this.dirty) {
      this.dirty = false;
      this.renderer.render(this.scene, this.camera);
      this.drawDims();
    }
    this.raf = requestAnimationFrame(this.frame);
  };

  /* ---------- знімки й експорт ---------- */

  /** Знімок фасаду для картки клієнта: дверне полотно закрите, камера прямо. */
  renderFront(pw: number, ph: number): HTMLCanvasElement {
    const S = this.S as DoorState, G = geom(S), pos0 = this.camera.position.clone(), tgt0 = this.controls.target.clone();
    const cam = this.camera, r = this.renderer;
    r.setPixelRatio(1);
    r.setSize(pw, ph, false);
    cam.aspect = pw / ph;
    cam.updateProjectionMatrix();
    const top = G.fg + G.H + (G.csF ? G.cw + 0.03 : 0.12), ym = top / 2, asp = pw / ph;
    const visH = Math.max(top * 1.16, (G.outW + (G.csF ? 2 * G.cw : 0) + 0.3) / asp);
    const dist = visH / (2 * Math.tan((cam.fov * Math.PI) / 360));
    cam.position.set(0, ym, dist);
    this.controls.target.set(0, ym, 0);
    cam.lookAt(0, ym, 0);
    if (this.pivot) this.pivot.rotation.y = 0;
    if (this.door) this.door.updateMatrixWorld(true);
    r.render(this.scene, cam);
    const c = document.createElement('canvas');
    c.width = pw;
    c.height = ph;
    (c.getContext('2d') as CanvasRenderingContext2D).drawImage(this.opts.canvas, 0, 0);
    cam.position.copy(pos0);
    this.controls.target.copy(tgt0);
    this.controls.update();
    if (this.pivot) this.pivot.rotation.y = -G.dir * rad(this.cur);
    this.resize();
    this.dirty = true;
    return c;
  }

  /** PNG поточного виду (з розмірними лініями), на світлому градієнті «сцени». */
  async snapshotPng(): Promise<Blob> {
    this.renderer.render(this.scene, this.camera);
    const gl = this.opts.canvas, w = gl.width, h = gl.height, c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const g = c.getContext('2d') as CanvasRenderingContext2D, gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#FBFAF7');
    gr.addColorStop(1, '#E4E2DA');
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
    g.drawImage(gl, 0, 0);
    g.drawImage(this.opts.dims, 0, 0);
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, 'image/png'));
    if (!blob) throw new Error('image');
    return blob;
  }

  /** Підвантажує бібліотеки експорту заздалегідь (наприклад, коли курсор наведено на кнопку). */
  prefetchExport() {
    void Promise.all([
      import('three/examples/jsm/exporters/GLTFExporter'),
      import('three/examples/jsm/exporters/OBJExporter'),
      import('jszip'),
    ]).catch(() => undefined);
  }

  /** ZIP з GLB (матеріали + текстура плівки), OBJ (геометрія) і README. Бібліотеки експорту вантажаться лише тут. */
  async exportZip(base: string, readme: string): Promise<Blob> {
    const S = this.S as DoorState;
    const [{ GLTFExporter }, { OBJExporter }, JSZipMod] = await Promise.all([
      import('three/examples/jsm/exporters/GLTFExporter'),
      import('three/examples/jsm/exporters/OBJExporter'),
      import('jszip'),
    ]);
    const JSZip = JSZipMod.default;
    await this.whenFilmReady();
    const G = geom(S), door = this.door as THREE.Group;
    if (this.pivot) this.pivot.rotation.y = -G.dir * rad(S.open);
    door.updateMatrixWorld(true);
    try {
      const glb = await new Promise<ArrayBuffer>((res, rej) => {
        try {
          new GLTFExporter().parse(door, (r) => res(r as ArrayBuffer), { binary: true });
        } catch (e) {
          rej(e);
        }
      });
      const obj = new OBJExporter().parse(door);
      const zip = new JSZip();
      zip.file(base + '.glb', glb);
      zip.file(base + '.obj', obj);
      zip.file('README.txt', readme);
      return await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
    } finally {
      if (this.pivot) this.pivot.rotation.y = -G.dir * rad(this.cur);
      this.dirty = true;
    }
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.ro?.disconnect();
    window.removeEventListener('resize', this.onWinResize);
    this.controls.dispose();
    disposeGroup(this.door);
    disposeGroup(this.room);
    Object.values(this.filmTex).forEach((t) => t.dispose());
    Object.values(this.floorTex).forEach((t) => t.dispose());
    Object.values(this.M).forEach((m) => m.dispose());
    this.floorMesh.geometry.dispose();
    this.scene.environment?.dispose();
    this.renderer.dispose();
  }
}

