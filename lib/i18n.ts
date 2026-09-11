export const locales = ["ua", "ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ua";

// RU навмисно без прапора — лише текстова позначка "RU" у перемикачі мов.
export const localeLabels: Record<Locale, string> = {
  ua: "UA",
  ru: "RU",
  en: "EN",
};

// URL-префікс "ua" — не валідний код мови (BCP 47): "ua" означає країну
// Україна, а не українську мову. Для <html lang> потрібен саме "uk".
export const localeHtmlLang: Record<Locale, string> = {
  ua: "uk",
  ru: "ru",
  en: "en",
};
