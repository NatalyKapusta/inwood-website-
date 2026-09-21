'use client';

import { COLLECTIONS, COLL_ORDER } from '../data/collections';
import { FLOORS, HANDLE_IDS } from '../data/options';
import { filmLabel } from '../i18n';
import {
  collOf, edgesFor, filmById, filmOf, modelOf, modelsOf, nonstd, paletteOf,
} from '../state';
import type { Action } from '../state';
import { SWATCHES } from '../data/swatches';
import type { DoorState, Translate } from '../types';
import { Field, LINE, Note, Section, Seg, btnGhost, btnPrimary, cn } from './kit';
import { WallColor } from './WallColor';

interface Props {
  s: DoorState;
  dispatch: (a: Action) => void;
  t: Translate;
  specRows: [string, string][];
  showHeader: boolean;
  busy: { zip: boolean; png: boolean; card: boolean };
  /** WebGL недоступний — експорт неможливий. */
  noGl: boolean;
  shareOut: string | null;
  onFilmHover: (id: string) => void;
  onZip: () => void;
  onPng: () => void;
  onCard: (kind: 'pdf' | 'png') => void;
  onShare: () => void;
  onZipHover: () => void;
}

const range = 'w-full accent-navy-dark m-0';
const filmBtn = cn(
  'aspect-square rounded-[10px] border bg-cover bg-center p-0',
  LINE,
  'aria-pressed:outline aria-pressed:outline-2 aria-pressed:outline-offset-2 aria-pressed:outline-navy-dark',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-dark',
);

/** Права колонка: усі налаштування, специфікація, експорт. */
export function Panel(p: Props) {
  const { s, dispatch, t } = p;
  const C = collOf(s), m = modelOf(s), ns = nonstd(s), f = filmOf(s);
  const flush = !!C.flush;
  const edges = edgesFor(s);
  const models = modelsOf(s.coll);
  const flag = <span className="ml-1.5 rounded-[5px] border border-navy-dark px-1.5 py-px text-[10.5px] font-semibold tracking-[0.02em] text-navy-dark">{t('flag_ns')}</span>;
  const filmTitle = flush ? 'film_paint' : C.paint ? 'film_pvcpaint' : 'film_pvc';
  const rowsMain = p.specRows;
  return (
    <aside aria-label={t('aria_params')} className="flex min-w-0 flex-col gap-5">
      {p.showHeader ? (
        <header>
          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-dim">{t('eyebrow')}</p>
          <h2 className="mb-2 mt-1.5 font-serif text-[30px] font-bold leading-[1.15] [text-wrap:balance]">{t('title')}</h2>
          <p className="m-0 max-w-[36ch] text-navy-dim">{t('lede')}</p>
        </header>
      ) : null}

      <Section title={t('s_coll')} value={C.name}>
        <Seg
          cols={3}
          testId="segColl"
          label={t('aria_coll')}
          value={s.coll}
          onChange={(v) => dispatch({ type: 'coll', id: v })}
          items={COLL_ORDER.map((id) => ({ v: id, label: COLLECTIONS[id].name === 'HIDDEN DOORS' ? 'HIDDEN' : COLLECTIONS[id].name, title: COLLECTIONS[id].name }))}
        />
        <Note testId="collNote">{t('cn_' + s.coll)}</Note>
      </Section>

      <Section title={t('s_model')} value={m.id}>
        <Seg
          cols={6}
          testId="segModel"
          label={t('aria_modelseg')}
          value={s.model}
          onChange={(v) => dispatch({ type: 'model', id: v })}
          items={models.map((x) => ({ v: x.id, label: x.id.replace(/^[A-Z]+-/, ''), title: x.id }))}
        />
        <Note testId="modelNote">{t('cm_' + s.coll)}</Note>
      </Section>

      <Section title={t('s_size')}>
        <div className="grid gap-1.5">
          <div className="flex items-center justify-between gap-3">
            <label className="text-[12.5px] text-navy-dim" htmlFor="dfit-w">{t('l_w')}</label>
            <output htmlFor="dfit-w" data-testid="wOut" className="text-[12.5px] font-semibold tabular-nums">
              {s.W} {t('mm')}{ns.w ? flag : null}
            </output>
          </div>
          <input id="dfit-w" data-testid="rngW" type="range" min={400} max={1000} step={50} value={s.W} className={range}
            onChange={(e) => dispatch({ type: 'W', v: +e.target.value })} />
        </div>
        <div className="grid gap-1.5">
          <div className="flex items-center justify-between gap-3">
            <label className="text-[12.5px] text-navy-dim" htmlFor="dfit-h">{t('l_h')}</label>
            <output htmlFor="dfit-h" data-testid="hOut" className="text-[12.5px] font-semibold tabular-nums">
              {s.H} {t('mm')}{ns.h ? flag : null}
            </output>
          </div>
          <input id="dfit-h" data-testid="rngH" type="range" min={1800} max={2300} step={50} value={s.H} className={range}
            onChange={(e) => dispatch({ type: 'H', v: +e.target.value })} />
        </div>
        {!flush && C.cop ? (
          <Field label={t('l_ft')}>
            <Seg testId="segFt" label={t('aria_ft')} value={s.ft} onChange={(v) => dispatch({ type: 'ft', v })}
              items={[{ v: 'tel', label: t('ft_tel') }, { v: 'cop', label: t('ft_cop') }]} />
          </Field>
        ) : null}
        <Field label={t(flush ? 'box_flush' : 'box_tel')}>
          <Seg testId="segT" label={t('aria_frame')} value={s.T} onChange={(v) => dispatch({ type: 'T', v })}
            items={[80, 100, 120].map((v) => ({ v, label: String(v) }))} />
        </Field>
        {!flush ? (
          <Field label={t('l_dob')}>
            <Seg testId="segDob" label={t('aria_dob')} value={s.dob} onChange={(v) => dispatch({ type: 'dob', v })}
              items={[{ v: 0, label: t('dob_0') }, ...[100, 150, 200].map((v) => ({ v, label: String(v) }))]} />
          </Field>
        ) : null}
        {flush ? (
          <>
            <Field label={t('l_hi')}>
              <Seg testId="segHi" label={t('aria_hi')} value={s.hi} onChange={(v) => dispatch({ type: 'hi', v })}
                items={[{ v: 0, label: t('hi_0') }, { v: 1, label: t('hi_1') }]} />
            </Field>
            <Field label={t('l_hb')}>
              <Seg testId="segHb" label={t('aria_hb')} value={s.hb} onChange={(v) => dispatch({ type: 'hb', v })}
                items={[{ v: 'std', label: t('hb_std_s') }, { v: 'lux', label: t('hb_lux_s') }]} />
            </Field>
          </>
        ) : null}
      </Section>

      <Section title={t(filmTitle)} value={filmLabel(t, f)}>
        <div role="group" aria-label={t('aria_films')} data-testid="films" className="grid grid-cols-7 gap-2">
          {paletteOf(s).map((id) => {
            const fl = filmById(id, s.paint), name = filmLabel(t, fl);
            const pre = () => p.onFilmHover(id);
            return (
              <button
                key={id}
                type="button"
                data-testid={`film-${id}`}
                title={name}
                aria-label={name}
                aria-pressed={s.film === id}
                className={filmBtn}
                style={SWATCHES[id] ? { backgroundImage: `url(${SWATCHES[id]})` } : { background: fl.k }}
                onPointerEnter={pre}
                onFocus={pre}
                onTouchStart={pre}
                onClick={() => dispatch({ type: 'film', id })}
              />
            );
          })}
          {C.paint ? (
            <label
              data-testid="film-paint"
              title={t('paint_title')}
              aria-pressed={s.film === 'paint'}
              className={cn(filmBtn, 'relative cursor-pointer overflow-hidden bg-[conic-gradient(#e3b6b6,#e3d6b0,#b9dfb5,#b0d6e3,#b9b5e3,#e3b0d9,#e3b6b6)]')}
            >
              <span className="pointer-events-none absolute inset-0 grid place-items-center text-center text-[9.5px] font-bold leading-none tracking-[0.02em] text-navy-dark">
                RAL<br />NCS
              </span>
              <input
                type="color"
                data-testid="paintIn"
                aria-label={t('aria_paint')}
                value={s.paint.length === 7 ? s.paint : '#ffffff'}
                onChange={(e) => dispatch({ type: 'paint', hex: e.target.value })}
                onClick={() => dispatch({ type: 'paintOpen' })}
                className="absolute inset-0 h-full w-full cursor-pointer border-0 p-0 opacity-0"
              />
            </label>
          ) : null}
        </div>
      </Section>

      <Section title={t('s_insedge')}>
        {m.ins ? (
          <Field label={t('l_insert')}>
            <Seg testId="segInsert" label={t('aria_insert')} value={s.insert} onChange={(v) => dispatch({ type: 'insert', id: v })}
              items={[{ v: 'black', label: t('insl_black') }, { v: 'grey', label: t('insl_grey') }]} />
          </Field>
        ) : null}
        <Field label={t(flush ? 'edge_leaf' : 'edge_color')}>
          <Seg testId="segEdge" label={t('aria_edge')} value={s.edge} wrap={edges.length > 3}
            onChange={(v) => dispatch({ type: 'edge', id: v })}
            items={edges.map((k) => ({ v: k, label: t('e_' + k), hidden: k === 'film' && flush && !!s.hi }))} />
        </Field>
        {s.edge === 'aral' ? (
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12.5px] text-navy-dim">{t('l_edgeral')}</span>
            <input
              type="color"
              data-testid="edgeIn"
              aria-label={t('aria_edgeral')}
              value={s.edgeHex}
              onChange={(e) => dispatch({ type: 'edgeHex', hex: e.target.value })}
              className={cn('h-[30px] w-11 cursor-pointer rounded-lg border bg-white p-0', LINE)}
            />
          </div>
        ) : null}
      </Section>

      <Section title={t('s_kit')}>
        <Field label={t('l_hinge')}>
          <Seg testId="segHinge" label={t('aria_hinge')} value={s.hinge} onChange={(v) => dispatch({ type: 'hinge', v })}
            items={[{ v: 'L', label: t('hinge_l') }, { v: 'R', label: t('hinge_r') }]} />
        </Field>
        {!flush ? (
          <Field label={t('l_cs')}>
            <Seg testId="segCs" label={t('aria_cs')} value={s.cs} onChange={(v) => dispatch({ type: 'cs', v })}
              items={(['both', 'front', 'back', 'none'] as const).map((v) => ({ v, label: t('cs_' + v) }))} />
          </Field>
        ) : null}
        {!flush && s.cs !== 'none' ? (
          <Field label={t('l_ct')}>
            <Seg testId="segCt" label={t('aria_ct')} value={s.ct} onChange={(v) => dispatch({ type: 'ct', v })}
              items={[
                { v: 'std', label: t('ct_std') }, { v: 'w40', label: t('ct_w40') },
                { v: 'cop', label: t('ct_cop'), hidden: !C.cop },
              ]} />
          </Field>
        ) : null}
        <Field label={t('l_handle')}>
          <Seg testId="segHandle" label={t('aria_handle')} value={s.handle} onChange={(v) => dispatch({ type: 'handle', v })}
            items={HANDLE_IDS.map((k) => ({ v: k, label: t('hl_' + k) }))} />
        </Field>
        {s.coll === 'ETALON' ? (
          <Field label={t('l_shape')}>
            <Seg testId="segShape" label={t('aria_shape')} value={s.hshape} onChange={(v) => dispatch({ type: 'hshape', v })}
              items={[{ v: 'sq', label: t('shape_sq') }, { v: 'rd', label: t('shape_rd') }]} />
          </Field>
        ) : null}
        {C.hinges ? (
          <Field label={t('l_hgc')}>
            <Seg testId="segHgc" label={t('aria_hgc')} value={s.hgc} onChange={(v) => dispatch({ type: 'hgc', v })}
              items={[{ v: 'std', label: t('hgcs_std') }, { v: 'black', label: t('hgcs_black') }, { v: 'white', label: t('hgcs_white') }]} />
          </Field>
        ) : null}
        {!flush ? <Note testId="kitNote">{t('kit_note')}</Note> : null}
      </Section>

      <Section title={t('s_interior')}>
        <Field label={t('l_wall')}>
          <WallColor s={s} dispatch={dispatch} t={t} />
        </Field>
        <Field label={t('l_floor')}>
          <Seg testId="segFloor" label={t('aria_floor')} value={s.floor} onChange={(v) => dispatch({ type: 'floor', id: v })}
            items={FLOORS.map((x) => ({ v: x.id, label: t('f_' + x.id) }))} />
        </Field>
      </Section>

      <Section title={t('s_open')}>
        <div className="grid grid-cols-[1fr_auto] items-center gap-2.5">
          <input type="range" data-testid="angle" min={0} max={105} step={1} value={s.open} aria-label={t('aria_angle')}
            className={range} onChange={(e) => dispatch({ type: 'open', v: +e.target.value })} />
          <output data-testid="angleOut" className="min-w-[4ch] text-right text-[13px] font-semibold tabular-nums">{Math.round(s.open)}°</output>
        </div>
        <button type="button" data-testid="openBtn" className={btnGhost}
          onClick={() => dispatch({ type: 'open', v: s.open >= 45 ? 0 : 85 })}>
          {t(s.open >= 45 ? 'close_btn' : 'open_btn')}
        </button>
      </Section>

      <Section title={t('s_spec')}>
        <dl data-testid="spec" className="m-0 grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-[7px] text-[13px]">
          {rowsMain.map((r, i) => (
            <div key={i} className="contents">
              <dt className="text-navy-dim">{r[0]}</dt>
              <dd className="m-0 text-right text-[12.5px] font-semibold tabular-nums">{r[1]}</dd>
            </div>
          ))}
        </dl>
        <Note>{t('spec_note')}</Note>
      </Section>

      <Section title={t('s_project')}>
        <div className="grid gap-2">
          <button type="button" data-testid="dlZip" disabled={p.busy.zip || p.noGl} className={btnPrimary} onClick={p.onZip}
            onPointerEnter={p.onZipHover} onFocus={p.onZipHover}>
            {t('b_zip')}
          </button>
          <button type="button" data-testid="dlPng" disabled={p.busy.png || p.noGl} className={btnGhost} onClick={p.onPng}>
            {t('b_png')}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" data-testid="cardPdf" disabled={p.busy.card || p.noGl} className={btnGhost} onClick={() => p.onCard('pdf')}>
              {t('b_cardpdf')}
            </button>
            <button type="button" data-testid="cardPng" disabled={p.busy.card || p.noGl} className={btnGhost} onClick={() => p.onCard('png')}>
              {t('b_cardpng')}
            </button>
          </div>
          <button type="button" data-testid="shareBtn" className={btnGhost} onClick={p.onShare}>
            {t('b_share')}
          </button>
          {p.shareOut ? (
            <input
              readOnly
              data-testid="shareOut"
              aria-label={t('aria_share')}
              value={p.shareOut}
              onFocus={(e) => e.currentTarget.select()}
              className={cn('w-full rounded-[10px] border bg-white px-3 py-2 text-xs text-navy-dark', LINE)}
            />
          ) : null}
        </div>
        <Note>{t('note_export')}</Note>
        <Note>{t('note_models')}</Note>
      </Section>
    </aside>
  );
}
