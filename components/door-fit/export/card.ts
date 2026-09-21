import { collOf, filmOf, wallHexOf } from '../state';
import { filmLabel } from '../i18n';
import type { DoorState, Translate } from '../types';
import { LOGO_SRC } from './logo';

export interface CardInput {
  state: DoorState;
  t: Translate;
  /** Рядки специфікації (specRows). */
  rows: [string, string][];
  /** Знімок фасаду, DoorEngine.renderFront(900, 1650). */
  front: HTMLCanvasElement;
  /** Зображення текстури плівки (DoorEngine.filmImage) або null. */
  filmImage: CanvasImageSource | null;
  /** Посилання на конфігурацію; null — без блоку з посиланням. */
  shareUrl: string | null;
  /** CSS font-family для canvas (з next/font): без-засічковий і з засічками. */
  fonts: { sans: string; serif: string };
}

const loadLogo = () =>
  new Promise<HTMLImageElement | null>((res) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => res(null);
    im.src = LOGO_SRC;
  });

function wrapText(g: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number): number {
  const words = String(text).split(' ');
  let line = '', yy = y;
  words.forEach((w) => {
    const t = line ? line + ' ' + w : w;
    if (g.measureText(t).width > maxW && line) {
      g.fillText(line, x, yy);
      line = w;
      yy += lh;
    } else line = t;
  });
  if (line) {
    g.fillText(line, x, yy);
    yy += lh;
  }
  return yy;
}

function rrect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

/** Шрифти для canvas мають бути завантажені, інакше картка намалюється запасним шрифтом. */
export async function ensureFonts(fonts: { sans: string; serif: string }) {
  try {
    if (document.fonts) {
      await Promise.all([
        document.fonts.load('500 17px ' + fonts.sans), document.fonts.load('600 19px ' + fonts.sans),
        document.fonts.load('700 30px ' + fonts.sans), document.fonts.load('700 46px ' + fonts.serif),
      ]);
      await document.fonts.ready;
    }
  } catch {
    /* шрифт не завантажився — буде запасний */
  }
}

/** Картка для клієнта 1240×1754 (A4): візуалізація, параметри, колір стіни, посилання. Без цін. */
export async function makeCard(inp: CardInput): Promise<HTMLCanvasElement> {
  const { state: S, t, rows, front, filmImage, shareUrl, fonts } = inp;
  const logo = await loadLogo();
  const C = collOf(S), f = filmOf(S), fname = filmLabel(t, f), wall = wallHexOf(S);
  const W = 1240, H = 1754, cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const g = cv.getContext('2d') as CanvasRenderingContext2D;
  const ink = '#333958', muted = '#626998', gold = '#8A6836', line = '#E1E2EC';
  const sans = fonts.sans, serif = fonts.serif;
  const tagline = t('eyebrow').split(' · ').pop() || '';
  g.fillStyle = '#F7F6F2';
  g.fillRect(0, 0, W, H);
  g.fillStyle = '#FFFFFF';
  rrect(g, 40, 40, W - 80, H - 80, 28);
  g.fill();
  g.textBaseline = 'alphabetic';
  if (logo) {
    const lw = Math.round((104 * logo.width) / logo.height);
    g.drawImage(logo, 80, 52, lw, 104);
    g.fillStyle = gold;
    g.font = '700 20px ' + sans;
    g.fillText(tagline.toUpperCase(), 80 + lw + 28, 112);
  } else {
    g.fillStyle = ink;
    g.font = '700 46px ' + serif;
    g.fillText('IN WOOD', 80, 128);
    g.fillStyle = gold;
    g.font = '700 17px ' + sans;
    g.fillText(tagline.toUpperCase(), 82, 158);
  }
  g.textAlign = 'right';
  g.fillStyle = muted;
  g.font = '600 22px ' + sans;
  g.fillText(t('card_title'), W - 80, 128);
  g.textAlign = 'left';
  g.strokeStyle = line;
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(80, 190);
  g.lineTo(W - 80, 190);
  g.stroke();

  // зображення дверей
  const ix = 80, iy = 222, iw = 560, ih = 1027;
  g.save();
  rrect(g, ix, iy, iw, ih, 22);
  g.clip();
  const gr = g.createLinearGradient(0, iy, 0, iy + ih);
  gr.addColorStop(0, '#FBFAF7');
  gr.addColorStop(1, '#E4E2DA');
  g.fillStyle = gr;
  g.fillRect(ix, iy, iw, ih);
  g.drawImage(front, ix, iy, iw, ih);
  g.restore();

  // правий стовпчик
  const x0 = 690, cw = W - 80 - x0;
  let y = 300;
  g.fillStyle = ink;
  g.font = '700 72px ' + serif;
  g.fillText(C.flush ? 'HD-01' : S.model, x0, y);
  y += 48;
  g.fillStyle = muted;
  g.font = '600 26px ' + sans;
  g.fillText(C.name, x0, y);
  y += 56;
  const sw = 112;
  g.save();
  rrect(g, x0, y, sw, sw, 16);
  g.clip();
  if (f.k || S.film === 'paint') {
    g.fillStyle = S.film === 'paint' ? S.paint : (f.k as string);
    g.fillRect(x0, y, sw, sw);
  } else if (filmImage) {
    const im = filmImage as CanvasImageSource & { width: number; height: number };
    g.drawImage(im, 0, 0, im.width, im.height, x0, y, sw, sw);
  } else {
    g.fillStyle = f.m || '#999';
    g.fillRect(x0, y, sw, sw);
  }
  g.restore();
  g.strokeStyle = line;
  g.lineWidth = 2;
  rrect(g, x0, y, sw, sw, 16);
  g.stroke();
  g.fillStyle = ink;
  g.font = '700 30px ' + sans;
  wrapText(g, S.film === 'paint' ? 'RAL / NCS ' + S.paint.toUpperCase() : fname, x0 + sw + 24, y + 46, cw - sw - 24, 38);
  y += sw + 52;
  rows.forEach((r, idx) => {
    if (idx === 0 || r[1] === fname) return;
    let val = String(r[1]).replace(/ (мм|mm)/g, ' $1');
    val = val.charAt(0).toUpperCase() + val.slice(1);
    g.fillStyle = muted;
    g.font = '600 19px ' + sans;
    g.fillText(String(r[0]).toUpperCase(), x0, y);
    g.fillStyle = ink;
    g.font = '600 28px ' + sans;
    const yy = wrapText(g, val, x0, y + 32, cw, 33);
    y = Math.max(y + 62, yy + 10);
    g.strokeStyle = line;
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(x0, y - 28);
    g.lineTo(x0 + cw, y - 28);
    g.stroke();
  });

  // стіна
  g.fillStyle = muted;
  g.font = '600 19px ' + sans;
  g.fillText(t('card_wall').toUpperCase(), x0, y);
  g.fillStyle = wall;
  rrect(g, x0, y + 16, 44, 44, 10);
  g.fill();
  g.strokeStyle = line;
  g.lineWidth = 2;
  rrect(g, x0, y + 16, 44, 44, 10);
  g.stroke();
  g.fillStyle = ink;
  g.font = '600 24px ' + sans;
  g.fillText(wall.toUpperCase(), x0 + 60, y + 48);

  // низ
  const by = Math.max(1300, y + 84);
  g.strokeStyle = line;
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(80, by - 10);
  g.lineTo(W - 80, by - 10);
  g.stroke();
  let ly = by + 20;
  if (shareUrl) {
    g.fillStyle = muted;
    g.font = '600 19px ' + sans;
    g.fillText(t('card_link').toUpperCase(), 80, by + 30);
    g.fillStyle = ink;
    g.font = '500 17px ' + sans;
    let cur = '';
    const maxw = W - 190;
    ly = by + 58;
    for (let k = 0; k < shareUrl.length; k++) {
      cur += shareUrl[k];
      if (g.measureText(cur).width > maxw || k === shareUrl.length - 1) {
        g.fillText(cur, 80, ly);
        cur = '';
        ly += 25;
        if (ly > 1620) break;
      }
    }
  }
  g.fillStyle = muted;
  g.font = '500 21px ' + sans;
  wrapText(g, t('card_note'), 80, Math.max(ly + 16, 1626), W - 160, 30);
  g.textAlign = 'right';
  g.fillStyle = gold;
  g.font = '700 21px ' + sans;
  g.fillText('inwood.com.ua', W - 80, H - 70);
  g.textAlign = 'left';
  return cv;
}
