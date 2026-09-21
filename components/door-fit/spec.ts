import { geom } from './geometry';
import { filmLabel } from './i18n';
import { collOf, filmOf, modelOf, nonstd } from './state';
import type { DoorState, Translate } from './types';

export const edgeName = (s: DoorState, t: Translate) => t('en_' + s.edge) + (s.edge === 'aral' ? ' ' + s.edgeHex.toUpperCase() : '');

/** Рядки специфікації (без цін): [підпис, значення]. Використовуються в панелі й на картці клієнта. */
export function specRows(s: DoorState, t: Translate): [string, string][] {
  const C = collOf(s), ns = nonstd(s), m = modelOf(s);
  const lt = Math.round(geom(s).lt * 1000);
  const rows: [string, string][] = [
    [t('sp_coll'), C.name + (C.flush ? '' : ' · ' + s.model)],
    [t('sp_leaf'), s.W + ' × ' + s.H + ' × ' + lt + (C.flush && s.hi ? ' · Inside' : '') + (ns.w || ns.h ? ' ' + t('sp_ns') : '')],
    [
      t(C.flush || s.film === 'paint' ? 'sp_paint' : 'sp_film'),
      s.film === 'paint' ? 'RAL / NCS ' + s.paint.toUpperCase() + ' ' + t('sp_approx') : filmLabel(t, filmOf(s)),
    ],
    [t('sp_edge'), edgeName(s, t)],
  ];
  if (m.ins) rows.push([t('sp_insert'), t('ins_' + s.insert)]);
  if (C.flush) {
    rows.push([t('sp_box'), t('sp_box_flush') + ', ' + t('hb_' + s.hb)], [t('sp_wall'), s.T + ' ' + t('mm')]);
  } else {
    rows.push([t('sp_frame2'), t('ftv_' + s.ft) + ' ' + s.T + ' ' + t('mm')]);
    if (s.dob) rows.push([t('sp_dob'), s.dob + ' ' + t('mm')]);
    rows.push([t('sp_casing'), s.casing ? t('csv_' + s.cs) + ', ' + t('ctv_' + s.ct) : t('sp_casing_no')]);
  }
  if (C.hinges) rows.push([t('sp_hinges'), t('hgc_' + s.hgc)]);
  rows.push([t('sp_open'), t(s.hinge === 'L' ? 'sp_left' : 'sp_right')], [t('sp_handle'), t('h_' + s.handle)]);
  if (!C.flush) rows.push([t('sp_outer'), s.W + 68 + ' × ' + (s.H + 40)]);
  rows.push([t('sp_hole'), s.W + (C.flush ? 14 : 88) + ' × ' + (s.H + (C.flush ? 18 : 50))]);
  return rows;
}

export const fileBase = (s: DoorState) =>
  'IN-WOOD_' + collOf(s).name.replace(/\s+/g, '-') + '_' + s.model + '_' + s.W + 'x' + s.H + '_' +
  (s.film === 'paint' ? 'paint-' + s.paint.slice(1).toUpperCase() : s.film);

/** README.txt всередині ZIP-архіву з 3D-моделлю. */
export function readme(s: DoorState, t: Translate): string {
  const C = collOf(s), hasIns = modelOf(s).ins, paint = s.film === 'paint', lt = Math.round(geom(s).lt * 1000);
  const colorLine = C.flush || paint ? t('r_color_paint', [s.paint.toUpperCase()]) : t('r_color_film', [filmLabel(t, filmOf(s))]);
  const frame = C.flush
    ? t('r_frame_flush', [s.T]) + t('r_hbox', [t('hb_' + s.hb)])
    : t('r_frame2', [
        t('ftv_' + s.ft), s.T, s.dob ? t('r_dob', [s.dob]) : '',
        s.casing ? t('csv_' + s.cs) + ', ' + t('ctv_' + s.ct) : t('r_casing_no'),
      ]);
  return [
    C.flush ? t('r_head_flush', [C.name, s.model, s.W, s.H]) : t('r_head', [C.name, s.model, s.W, s.H]),
    '',
    t('r_files', [fileBase(s)]),
    t('r_units'),
    t('r_origin'),
    t('r_mesh', [Math.round(s.open)]),
    '',
    t('r_leaf', [s.W, s.H, colorLine, edgeName(s, t), hasIns ? t('r_ins', [t('ins_' + s.insert)]) : '', lt]),
    frame + t('r_open', [t(s.hinge === 'L' ? 'sp_left' : 'sp_right')]),
    (C.flush ? '' : t('r_outer', [s.W + 68, s.H + 40])) + t('r_hole', [s.W + (C.flush ? 14 : 88), s.H + (C.flush ? 18 : 50)]),
    t('r_nowall'),
    '',
    t('r_foot'),
  ].join('\r\n');
}
