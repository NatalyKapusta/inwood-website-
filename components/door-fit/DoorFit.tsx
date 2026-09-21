'use client';

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { DoorEngine } from './engine/DoorEngine';
import { ensureFonts, makeCard } from './export/card';
import { copyText, saveBlob } from './export/download';
import { pdfFromJpeg } from './export/pdf';
import { makeT } from './i18n';
import { configQuery, hasConfig, stateFromQuery } from './share';
import { fileBase, readme, specRows } from './spec';
import { INITIAL_STATE, reducer } from './state';
import type { DoorFitDict, DoorState, ViewId } from './types';
import { cn } from './ui/kit';
import { Panel } from './ui/Panel';
import { Stage } from './ui/Stage';

export interface DoorFitProps {
  /** Словник тексту інструмента (dictionaries/<locale>.json), завантажується на сервері й передається сюди. */
  dict: DoorFitDict;
  /** Відступ зверху для «липкої» 3D-сцени на десктопі — висота липкої шапки сайту, px. */
  stickyTop?: number;
  /** Показувати власний заголовок над налаштуваннями (вимкніть, якщо сторінка вже має заголовок). */
  showHeader?: boolean;
  /** Де лежать текстури плівок. */
  textureBase?: string;
  /** Базова адреса для посилання «Скопіювати посилання» (за замовчуванням — поточна сторінка). */
  shareBaseUrl?: string;
  className?: string;
}

function initialState(): DoorState {
  if (typeof window === 'undefined') return INITIAL_STATE;
  try {
    const q = new URLSearchParams(window.location.search);
    return hasConfig(q) ? stateFromQuery(q) : INITIAL_STATE;
  } catch {
    return INITIAL_STATE;
  }
}

export default function DoorFit({
  dict, stickyTop = 80, showHeader = true, textureBase = '/door-fit/textures', shareBaseUrl, className,
}: DoorFitProps) {
  const t = useMemo(() => makeT(dict), [dict]);
  const [s, dispatch] = useReducer(reducer, undefined, initialState);
  const [view, setViewState] = useState<ViewId>('persp');
  const [toast, setToast] = useState<string | null>(null);
  const [glError, setGlError] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState({ zip: false, png: false, card: false });
  const [shareOut, setShareOut] = useState<string | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const serifRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dimsRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<DoorEngine | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sRef = useRef(s);
  sRef.current = s;

  /** Шрифти сайту (next/font) для canvas: беремо реальні назви з обчислених стилів. */
  const getFonts = useCallback(() => {
    const sans = rootRef.current ? getComputedStyle(rootRef.current).fontFamily : 'Arial, sans-serif';
    const serif = serifRef.current ? getComputedStyle(serifRef.current).fontFamily : 'Georgia, serif';
    return { sans, serif };
  }, []);

  useEffect(() => {
    let engine: DoorEngine | null = null;
    try {
      engine = new DoorEngine({
        canvas: canvasRef.current as HTMLCanvasElement,
        dims: dimsRef.current as HTMLCanvasElement,
        stage: stageRef.current as HTMLDivElement,
        textureBase,
        fontFamily: getFonts().sans,
      });
    } catch {
      setGlError(true);
      return;
    }
    engineRef.current = engine;
    engine.sync(sRef.current);
    setReady(true);
    return () => {
      engine?.dispose();
      engineRef.current = null;
      setReady(false);
    };
  }, [textureBase, getFonts]);

  useEffect(() => {
    if (ready) engineRef.current?.sync(s);
  }, [s, ready]);

  useEffect(() => {
    if (ready) engineRef.current?.setLabels({ mm: t('mm'), wall: t('wall_dim') });
  }, [t, ready]);

  const showToast = useCallback((msg: string, ms = 3000) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), ms);
  }, []);
  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const rows = useMemo(() => specRows(s, t), [s, t]);
  const errText = (e: unknown) => t('t_savefail') + (e instanceof Error && e.message ? ': ' + e.message : '');
  const setBusyKey = (k: 'zip' | 'png' | 'card', v: boolean) => setBusy((b) => ({ ...b, [k]: v }));

  const shareURL = (st: DoorState) => {
    const base = shareBaseUrl ?? ((location.origin && location.origin !== 'null' ? location.origin : '') + location.pathname);
    return base + (base.indexOf('?') < 0 ? '?' : '&') + configQuery(st);
  };

  const onView = (v: ViewId) => {
    setViewState(v);
    engineRef.current?.setView(v);
  };

  const onZip = async () => {
    const e = engineRef.current;
    if (!e) return;
    setBusyKey('zip', true);
    showToast(t('t_prep'), 8000);
    try {
      const base = fileBase(s);
      const blob = await e.exportZip(base, readme(s, t));
      saveBlob(blob, base + '.zip');
      showToast(t('t_done'));
    } catch (err) {
      showToast(errText(err), 4200);
    } finally {
      setBusyKey('zip', false);
    }
  };

  const onPng = async () => {
    const e = engineRef.current;
    if (!e) return;
    setBusyKey('png', true);
    try {
      saveBlob(await e.snapshotPng(), fileBase(s) + '.png');
      showToast(t('t_png'));
    } catch (err) {
      showToast(errText(err), 4200);
    } finally {
      setBusyKey('png', false);
    }
  };

  const onCard = async (kind: 'pdf' | 'png') => {
    const e = engineRef.current;
    if (!e) return;
    setBusyKey('card', true);
    showToast(t('t_card'), 8000);
    try {
      await e.whenFilmReady();
      const fonts = getFonts();
      await ensureFonts(fonts);
      const front = e.renderFront(900, 1650);
      const cv = await makeCard({ state: s, t, rows: specRows(s, t), front, filmImage: e.filmImage(), shareUrl: shareURL(s), fonts });
      const name = fileBase(s) + '-card';
      if (kind === 'png') {
        const blob = await new Promise<Blob | null>((r) => cv.toBlob(r, 'image/png'));
        if (!blob) throw new Error(t('e_img'));
        saveBlob(blob, name + '.png');
      } else {
        const jb = await new Promise<Blob | null>((r) => cv.toBlob(r, 'image/jpeg', 0.93));
        if (!jb) throw new Error(t('e_img'));
        saveBlob(pdfFromJpeg(new Uint8Array(await jb.arrayBuffer()), cv.width, cv.height), name + '.pdf');
      }
      showToast(t('t_card_done'));
    } catch (err) {
      showToast(errText(err), 4200);
    } finally {
      setBusyKey('card', false);
    }
  };

  const onShare = async () => {
    const u = shareURL(s);
    if (await copyText(u)) {
      showToast(t('t_copied'));
      setShareOut(null);
    } else {
      setShareOut(u);
      showToast(t('t_copy_manual'), 4000);
    }
  };

  return (
    <div
      ref={rootRef}
      data-testid="door-fit"
      className={cn('font-sans text-sm leading-normal text-navy-dark', className)}
      style={{ '--dfit-top': stickyTop + 'px' } as CSSProperties}
    >
      <span ref={serifRef} className="hidden font-serif" aria-hidden="true" />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
        <div className="lg:sticky lg:top-[var(--dfit-top,80px)]">
          <Stage
            t={t}
            stageRef={stageRef}
            canvasRef={canvasRef}
            dimsRef={dimsRef}
            view={view}
            onView={onView}
            showDims={s.dims}
            showRoom={s.room}
            onDims={(v) => dispatch({ type: 'dims', v })}
            onRoom={(v) => dispatch({ type: 'room', v })}
            toast={toast}
            glError={glError}
          />
        </div>
        <Panel
          s={s}
          dispatch={dispatch}
          t={t}
          specRows={rows}
          showHeader={showHeader}
          busy={busy}
          noGl={glError}
          shareOut={shareOut}
          onFilmHover={(id) => engineRef.current?.preload(id)}
          onZip={onZip}
          onPng={onPng}
          onCard={onCard}
          onShare={onShare}
          onZipHover={() => engineRef.current?.prefetchExport()}
        />
      </div>
    </div>
  );
}
