import type { DoorFitDict, Film, Translate } from './types';

/**
 * Переклад за ключем зі словника. {0}, {1}… у тексті підставляються з args.
 * Якщо ключа немає — повертається сам ключ (одразу видно в інтерфейсі).
 */
export function makeT(dict: DoorFitDict): Translate {
  return (key, args) => {
    let s = dict[key];
    if (s === undefined) return key;
    if (args) for (let i = 0; i < args.length; i++) s = s.split('{' + i + '}').join(String(args[i]));
    return s;
  };
}

/** Назва плівки: для «RAL / NCS» — спільний підпис, для інших — ключ film.<id>. */
export function filmLabel(t: Translate, f: Pick<Film, 'id'>): string {
  return f.id === 'paint' ? t('ral_approx') : t('film.' + f.id);
}
