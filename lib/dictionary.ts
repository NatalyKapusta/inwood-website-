import type { Locale } from "@/lib/i18n";
import uaDict from "@/dictionaries/ua.json";

export type Dictionary = typeof uaDict;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  try {
    const dict = await import(`@/dictionaries/${locale}.json`);
    return dict.default as Dictionary;
  } catch {
    return uaDict;
  }
}
