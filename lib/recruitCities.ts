// Міста, де IN WOOD ще не має дилерів (перевірено — немає збігів у
// data/dealers.json) і де ми свідомо шукаємо партнера: сторінки націлені
// на запит "стати дилером/дистриб'ютором", а не на "купити двері в місті".
// Список навмисно обмежений безпечними, стабільно працюючими регіонами;
// прикордонні та прифронтові міста (Суми, Чернігів, Миколаїв, Запоріжжя,
// Херсон) сюди свідомо не включені — це окреме рішення для власника бізнесу.
export type RecruitCity = { city: string; slug: string; ru: string; en: string };

export const RECRUIT_CITIES: RecruitCity[] = [
  { city: "Львів", slug: "lviv", ru: "Львов", en: "Lviv" },
  { city: "Вінниця", slug: "vinnytsia", ru: "Винница", en: "Vinnytsia" },
  { city: "Івано-Франківськ", slug: "ivano-frankivsk", ru: "Ивано-Франковск", en: "Ivano-Frankivsk" },
  { city: "Ужгород", slug: "uzhhorod", ru: "Ужгород", en: "Uzhhorod" },
  { city: "Чернівці", slug: "chernivtsi", ru: "Черновцы", en: "Chernivtsi" },
  { city: "Хмельницький", slug: "khmelnytskyi", ru: "Хмельницкий", en: "Khmelnytskyi" },
  { city: "Кропивницький", slug: "kropyvnytskyi", ru: "Кропивницкий", en: "Kropyvnytskyi" },
];

export function getRecruitCityDisplayName(c: RecruitCity, locale: "ua" | "ru" | "en"): string {
  if (locale === "ua") return c.city;
  return c[locale];
}

export function findRecruitCity(slug: string): RecruitCity | undefined {
  return RECRUIT_CITIES.find((c) => c.slug === slug);
}
