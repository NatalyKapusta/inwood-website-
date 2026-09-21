'use client';

import type { ReactNode } from 'react';

export const cn = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ');

/**
 * Стилі інструмента. Свідомо НЕ використовуємо комбінації класів, на які в globals.css сайту навішані
 * глобальні ефекти: `rounded-xl border border-navy-dim/10 bg-panel` (підйом картки при наведенні) —
 * їх тут немає. Кнопки `rounded-full bg-navy-dark` навмисно лишаються в стилі сайту (тінь + легкий підйом).
 */
export const LINE = 'border-[#E1E2EC]';

export interface SegItem<T extends string | number> {
  v: T;
  label: string;
  hidden?: boolean;
  title?: string;
}

export function Seg<T extends string | number>({
  items, value, onChange, label, testId, cols, wrap,
}: {
  items: SegItem<T>[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  testId: string;
  cols?: 3 | 6;
  wrap?: boolean;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      data-testid={testId}
      className={cn(
        'gap-0.5 rounded-xl bg-panel-alt p-[3px]',
        cols === 3 ? 'grid grid-cols-3' : cols === 6 ? 'grid grid-cols-6' : 'flex',
        wrap && 'flex-wrap',
      )}
    >
      {items
        .filter((it) => !it.hidden)
        .map((it) => (
          <button
            key={String(it.v)}
            type="button"
            data-testid={`${testId}-${it.v}`}
            aria-pressed={value === it.v}
            title={it.title}
            onClick={() => onChange(it.v)}
            className={cn(
              'min-w-0 whitespace-nowrap rounded-[9px] px-1 tabular-nums text-navy-dim transition-colors hover:text-navy-dark',
              'font-medium aria-pressed:bg-white aria-pressed:font-semibold aria-pressed:text-navy-dark',
              'aria-pressed:shadow-[0_0_0_1px_#E1E2EC,0_1px_2px_rgba(51,57,88,0.18)]',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-dark',
              cols === 3 ? 'py-2 text-[12.5px] tracking-[0.02em]' : 'py-[7px] text-[13px]',
              wrap ? 'flex-[1_1_30%]' : !cols && 'flex-1',
            )}
          >
            {it.label}
          </button>
        ))}
    </div>
  );
}

export function Section({ title, value, children }: { title: ReactNode; value?: ReactNode; children: ReactNode }) {
  return (
    <section className={cn('grid gap-3 border-t pt-[18px]', LINE)}>
      <h3 className="flex items-baseline justify-between gap-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-navy-dim">
        <span>{title}</span>
        {value ? <span className="text-right text-[13px] font-medium normal-case tracking-normal text-navy-dark">{value}</span> : null}
      </h3>
      {children}
    </section>
  );
}

export function Field({ label, children, testId }: { label: ReactNode; children: ReactNode; testId?: string }) {
  return (
    <div className="grid gap-1.5" data-testid={testId}>
      <span className="text-[12.5px] text-navy-dim">{label}</span>
      {children}
    </div>
  );
}

export const Note = ({ children, testId }: { children: ReactNode; testId?: string }) => (
  <p className="m-0 text-xs text-navy-dim" data-testid={testId}>
    {children}
  </p>
);

export const btnBase =
  'rounded-full px-4 py-[11px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 ' +
  'focus-visible:outline-offset-2 focus-visible:outline-navy-dark disabled:cursor-not-allowed disabled:opacity-50';
/** Другорядна кнопка: біла з рамкою. */
export const btnGhost = cn(btnBase, 'border bg-white text-navy-dark hover:border-navy-dark', LINE);
/** Основна кнопка — у стилі кнопок сайту (`rounded-full bg-navy-dark`). */
export const btnPrimary = cn(btnBase, 'bg-navy-dark text-white');
