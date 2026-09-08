export const locales = ["ua", "ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ua";

// RU навмисно без прапора — лише текстова позначка "RU" у перемикачі мов.
export const localeLabels: Record<Locale, string> = {
  ua: "UA",
  ru: "RU",
  en: "EN",
};
