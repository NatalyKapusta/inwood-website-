'use client';

import type { RefObject } from 'react';
import type { Translate, ViewId } from '../types';
import { LINE, cn } from './kit';

const VIEWS: { v: ViewId; key: string | null }[] = [
  { v: 'persp', key: null },
  { v: 'front', key: 'v_front' },
  { v: 'side', key: 'v_side' },
  { v: 'plan', key: 'v_plan' },
];

const chip = cn('border bg-white/90 shadow-[0_1px_3px_rgba(51,57,88,0.18)]', LINE);

interface Props {
  t: Translate;
  stageRef: RefObject<HTMLDivElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  dimsRef: RefObject<HTMLCanvasElement>;
  view: ViewId;
  onView: (v: ViewId) => void;
  showDims: boolean;
  showRoom: boolean;
  onDims: (v: boolean) => void;
  onRoom: (v: boolean) => void;
  toast: string | null;
  glError: boolean;
}

/** Ліва частина: 3D-сцена, перемикачі виду, розмірів і стіни. */
export function Stage(p: Props) {
  const { t } = p;
  return (
    <div
      ref={p.stageRef}
      className={cn(
        'relative h-[min(64vh,540px)] overflow-hidden rounded-2xl bg-gradient-to-b from-[#FBFAF7] to-[#E4E2DA]',
        'lg:h-[calc(100vh-var(--dfit-top,80px)-24px)] lg:min-h-[480px]',
      )}
    >
      <canvas
        ref={p.canvasRef}
        aria-label={t('canvas_aria')}
        data-testid="gl"
        className="absolute inset-0 block h-full w-full cursor-grab touch-none active:cursor-grabbing"
      />
      <canvas ref={p.dimsRef} aria-hidden="true" className="pointer-events-none absolute inset-0 block h-full w-full" />
      {p.glError ? (
        <div className="absolute inset-0 grid place-items-center p-6 text-center text-navy-dim">{t('nogl_gl')}</div>
      ) : null}
      <div className="pointer-events-none absolute inset-x-4 top-4 flex flex-col items-start gap-2 [&>*]:pointer-events-auto">
        <div role="group" aria-label={t('aria_view')} className={cn('inline-flex gap-0.5 rounded-full p-[3px]', chip)}>
          {VIEWS.map((x) => (
            <button
              key={x.v}
              type="button"
              data-testid={`view-${x.v}`}
              aria-pressed={p.view === x.v}
              onClick={() => p.onView(x.v)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-sm font-semibold text-navy-dim transition-colors hover:text-navy-dark',
                'aria-pressed:bg-navy-dark aria-pressed:text-white',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-dark',
              )}
            >
              {x.key ? t(x.key) : '3D'}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <label className={cn('inline-flex cursor-pointer items-center gap-[7px] rounded-full px-[13px] py-1.5 text-[13px]', chip)}>
            <input
              type="checkbox"
              data-testid="tDims"
              className="m-0 accent-navy-dark"
              checked={p.showDims}
              onChange={(e) => p.onDims(e.target.checked)}
            />
            <span>{t('t_dims')}</span>
          </label>
          <label className={cn('inline-flex cursor-pointer items-center gap-[7px] rounded-full px-[13px] py-1.5 text-[13px]', chip)}>
            <input
              type="checkbox"
              data-testid="tRoom"
              className="m-0 accent-navy-dark"
              checked={p.showRoom}
              onChange={(e) => p.onRoom(e.target.checked)}
            />
            <span>{t('t_room')}</span>
          </label>
        </div>
      </div>
      <p className="pointer-events-none absolute inset-x-4 bottom-3.5 m-0">
        <span className="inline-block rounded-full bg-white/85 px-3 py-1 text-xs text-navy-dim">{t('hint')}</span>
      </p>
      {p.toast ? (
        <div
          role="status"
          data-testid="toast"
          className="absolute bottom-11 left-1/2 max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-lg bg-navy-dark px-3.5 py-[9px] text-center text-[13px] text-white"
        >
          {p.toast}
        </div>
      ) : null}
    </div>
  );
}
