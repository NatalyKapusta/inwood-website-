'use client';

import { useEffect, useState } from 'react';
import { WALLS } from '../data/options';
import { wallHexOf } from '../state';
import type { Action } from '../state';
import type { DoorState, Translate } from '../types';
import { LINE, cn } from './kit';

const CONIC = 'bg-[conic-gradient(#e3b6b6,#e3d6b0,#b9dfb5,#b0d6e3,#b9b5e3,#e3b0d9,#e3b6b6)]';
const dot = cn(
  'relative h-[30px] w-[30px] shrink-0 overflow-hidden rounded-full border p-0',
  LINE,
  'aria-pressed:outline aria-pressed:outline-2 aria-pressed:outline-offset-2 aria-pressed:outline-navy-dark',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-dark',
);

function normHex(v: string): string | null {
  let x = String(v || '').trim();
  if (x && x[0] !== '#') x = '#' + x;
  if (/^#[0-9a-fA-F]{3}$/.test(x)) x = '#' + x[1] + x[1] + x[2] + x[2] + x[3] + x[3];
  return /^#[0-9a-fA-F]{6}$/.test(x) ? x.toLowerCase() : null;
}

/** Кольори стіни: шість готових + власний (палітра й HEX-поле). */
export function WallColor({ s, dispatch, t }: { s: DoorState; dispatch: (a: Action) => void; t: Translate }) {
  const hex = wallHexOf(s).toUpperCase();
  const [draft, setDraft] = useState(hex);
  useEffect(() => setDraft(hex), [hex]);
  const setWall = (v: string) => dispatch({ type: 'wallHex', hex: v });
  return (
    <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label={t('l_wall')} data-testid="walls">
      {WALLS.map((c, i) => (
        <button
          key={c}
          type="button"
          data-testid={`wall-${i}`}
          className={dot}
          style={{ background: c }}
          title={t('w' + i)}
          aria-label={t('w' + i)}
          aria-pressed={s.wall === i}
          onClick={() => dispatch({ type: 'wall', index: i })}
        />
      ))}
      <label
        data-testid="wall-custom"
        title={t('wall_custom')}
        aria-pressed={s.wall === -1}
        className={cn(dot, CONIC, 'cursor-pointer')}
      >
        <input
          type="color"
          aria-label={t('wall_custom')}
          value={s.wallHex}
          onChange={(e) => setWall(e.target.value)}
          onClick={() => {
            if (s.wall !== -1) setWall(s.wallHex);
          }}
          className="absolute inset-0 h-full w-full cursor-pointer border-0 p-0 opacity-0"
        />
      </label>
      <input
        type="text"
        data-testid="wallHex"
        maxLength={7}
        placeholder="#RRGGBB"
        aria-label={t('aria_hex')}
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          const v = normHex(e.target.value);
          if (v && e.target.value.replace('#', '').length === 6) setWall(v);
        }}
        onBlur={() => {
          const v = normHex(draft);
          if (v) setWall(v);
          else setDraft(hex);
        }}
        className={cn(
          'w-24 rounded-full border bg-white px-3 py-1.5 text-xs text-navy-dark',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-dark',
          LINE,
        )}
      />
    </div>
  );
}
