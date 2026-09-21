import type { DoorFitDict } from '../types';

/** Словник примірки для мови сайту (ua | ru | en | pl). Немає файлу — запасний варіант UA, як і в решті сайту. */
export async function getDoorFitDictionary(locale: string): Promise<DoorFitDict> {
  try {
    const dict = await import(`./${locale}.json`);
    return dict.default as DoorFitDict;
  } catch {
    const dict = await import('./ua.json');
    return dict.default as DoorFitDict;
  }
}
