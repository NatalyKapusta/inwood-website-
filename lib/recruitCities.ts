// Міста, де IN WOOD ще не має дилерів (перевірено — немає збігів у
// data/dealers.json) і де ми свідомо шукаємо партнера: сторінки націлені
// на запит "стати дилером/дистриб'ютором", а не на "купити двері в місті".
// Список навмисно обмежений безпечними, стабільно працюючими регіонами;
// прикордонні та прифронтові міста (Суми, Чернігів, Миколаїв, Запоріжжя,
// Херсон) сюди свідомо не включені — це окреме рішення для власника бізнесу.
export type RecruitCity = {
  city: string;
  slug: string;
  ru: string;
  en: string;
  // "у/в [Місто]" — місцевий відмінок (UA) і предложный падеж (RU) з
  // прийменником, бо назва міста в тексті сторінки (напр. "Будуєте у
  // Львові?") відмінюється, а не просто підставляється як є.
  inCityUa: string;
  inCityRu: string;
};

export const RECRUIT_CITIES: RecruitCity[] = [
  { city: "Львів", slug: "lviv", ru: "Львов", en: "Lviv", inCityUa: "у Львові", inCityRu: "во Львове" },
  { city: "Вінниця", slug: "vinnytsia", ru: "Винница", en: "Vinnytsia", inCityUa: "у Вінниці", inCityRu: "в Виннице" },
  { city: "Івано-Франківськ", slug: "ivano-frankivsk", ru: "Ивано-Франковск", en: "Ivano-Frankivsk", inCityUa: "в Івано-Франківську", inCityRu: "в Ивано-Франковске" },
  { city: "Ужгород", slug: "uzhhorod", ru: "Ужгород", en: "Uzhhorod", inCityUa: "в Ужгороді", inCityRu: "в Ужгороде" },
  { city: "Чернівці", slug: "chernivtsi", ru: "Черновцы", en: "Chernivtsi", inCityUa: "в Чернівцях", inCityRu: "в Черновцах" },
  { city: "Хмельницький", slug: "khmelnytskyi", ru: "Хмельницкий", en: "Khmelnytskyi", inCityUa: "у Хмельницькому", inCityRu: "в Хмельницком" },
  { city: "Кропивницький", slug: "kropyvnytskyi", ru: "Кропивницкий", en: "Kropyvnytskyi", inCityUa: "у Кропивницькому", inCityRu: "в Кропивницком" },
];

export function getRecruitCityDisplayName(c: RecruitCity, locale: "ua" | "ru" | "en"): string {
  if (locale === "ua") return c.city;
  return c[locale];
}

// "у/в [Місто]" з правильним відмінком — для EN просто "in [City]", бо
// англійська назва міста не відмінюється.
export function getRecruitCityInPhrase(c: RecruitCity, locale: "ua" | "ru" | "en"): string {
  if (locale === "ua") return c.inCityUa;
  if (locale === "ru") return c.inCityRu;
  return `in ${c.en}`;
}

export function findRecruitCity(slug: string): RecruitCity | undefined {
  return RECRUIT_CITIES.find((c) => c.slug === slug);
}
