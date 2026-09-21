import * as THREE from 'three';
import { WALLS } from '../data/options';

/** Колір із sRGB-hex у лінійний простір (так само, як у попередній версії — кольори збігаються 1:1). */
export const col = (hex: string) => new THREE.Color(hex).convertSRGBToLinear();

export interface Materials {
  film: THREE.MeshStandardMaterial;
  edge: THREE.MeshStandardMaterial;
  insert: THREE.MeshStandardMaterial;
  groove: THREE.MeshStandardMaterial;
  mirror: THREE.MeshStandardMaterial;
  hinge: THREE.MeshStandardMaterial;
  reveal: THREE.MeshStandardMaterial;
  handle: THREE.MeshStandardMaterial;
  wall: THREE.MeshStandardMaterial;
  back: THREE.MeshStandardMaterial;
  skirt: THREE.MeshStandardMaterial;
  floor: THREE.MeshStandardMaterial;
  catcher: THREE.ShadowMaterial;
}

const std = (o: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(o);

export function createMaterials(): Materials {
  const M: Materials = {
    film: std({ color: 0xffffff, roughness: 0.6, metalness: 0, envMapIntensity: 0.45 }),
    edge: std({ color: col('#141414'), roughness: 0.55, envMapIntensity: 0.3 }),
    insert: std({ color: col('#3C3C3D'), roughness: 0.42, metalness: 0, envMapIntensity: 0.3 }),
    groove: std({
      color: 0x000000, roughness: 1, transparent: true, opacity: 0.3, depthWrite: false, envMapIntensity: 0,
      side: THREE.DoubleSide,
    }),
    mirror: std({ color: col('#C9CDD0'), roughness: 0.05, metalness: 1, envMapIntensity: 1.15 }),
    hinge: std({ color: col('#8D8F93'), metalness: 0.55, roughness: 0.4, envMapIntensity: 0.8 }),
    reveal: std({ color: col('#232324'), roughness: 0.9, envMapIntensity: 0.1 }),
    handle: std({ color: col('#4A4D51'), metalness: 0.85, roughness: 0.38, envMapIntensity: 1 }),
    wall: std({ color: col(WALLS[0]), roughness: 0.95, envMapIntensity: 0.25 }),
    back: std({ color: col(WALLS[0]), roughness: 0.95, envMapIntensity: 0.25 }),
    skirt: std({ color: col('#F1F0EC').multiplyScalar(1.3), roughness: 0.6, envMapIntensity: 0.3 }),
    floor: std({ color: 0xffffff, roughness: 0.55, metalness: 0, envMapIntensity: 0.35 }),
    catcher: new THREE.ShadowMaterial({ opacity: 0.24 }),
  };
  // імена матеріалів потрапляють у GLB — щоб у CAD/BIM їх було видно
  M.film.name = 'door_film';
  M.edge.name = 'door_edge';
  M.insert.name = 'door_insert';
  M.groove.name = 'door_groove';
  M.handle.name = 'hardware_metal';
  M.mirror.name = 'door_mirror';
  M.hinge.name = 'hardware_hinge';
  M.reveal.name = 'wall_reveal';
  return M;
}

/* ---------- підлога: процедурна текстура ---------- */
const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
};
const rng = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

export function floorCanvas(id: string, base: string): HTMLCanvasElement {
  const s = 512, c = document.createElement('canvas');
  c.width = s;
  c.height = s;
  const g = c.getContext('2d') as CanvasRenderingContext2D, r = rng(id.length * 131 + 7);
  g.fillStyle = base;
  g.fillRect(0, 0, s, s);
  for (let i = 0; i < 5000; i++) {
    g.fillStyle = hexA(r() > 0.5 ? '#FFFFFF' : '#000000', 0.02 + r() * 0.05);
    g.fillRect(r() * s, r() * s, 1 + r() * 3, 1 + r() * 3);
  }
  return c;
}

export function prepTex<T extends THREE.Texture>(t: T, aniso = 8): T {
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.encoding = THREE.sRGBEncoding;
  t.anisotropy = aniso;
  return t;
}
