import { CITY_SLUGS, CITY_NAMES } from "./dealers";

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
  pl: string;
  // "у/в [Місто]" — місцевий відмінок (UA), предложный падеж (RU) і
  // miejscownik (PL) з прийменником, бо назва міста в тексті сторінки
  // (напр. "Будуєте у Львові?") відмінюється, а не просто підставляється
  // як є.
  inCityUa: string;
  inCityRu: string;
  inCityPl: string;
};

export const RECRUIT_CITIES: RecruitCity[] = [
  { city: "Львів", slug: "lviv", ru: "Львов", en: "Lviv", pl: "Lwów", inCityUa: "у Львові", inCityRu: "во Львове", inCityPl: "we Lwowie" },
  { city: "Вінниця", slug: "vinnytsia", ru: "Винница", en: "Vinnytsia", pl: "Winnica", inCityUa: "у Вінниці", inCityRu: "в Виннице", inCityPl: "w Winnicy" },
  { city: "Івано-Франківськ", slug: "ivano-frankivsk", ru: "Ивано-Франковск", en: "Ivano-Frankivsk", pl: "Iwano-Frankiwsk", inCityUa: "в Івано-Франківську", inCityRu: "в Ивано-Франковске", inCityPl: "w Iwano-Frankiwsku" },
  { city: "Ужгород", slug: "uzhhorod", ru: "Ужгород", en: "Uzhhorod", pl: "Użhorod", inCityUa: "в Ужгороді", inCityRu: "в Ужгороде", inCityPl: "w Użhorodzie" },
  { city: "Чернівці", slug: "chernivtsi", ru: "Черновцы", en: "Chernivtsi", pl: "Czerniowce", inCityUa: "в Чернівцях", inCityRu: "в Черновцах", inCityPl: "w Czerniowcach" },
  { city: "Хмельницький", slug: "khmelnytskyi", ru: "Хмельницкий", en: "Khmelnytskyi", pl: "Chmielnicki", inCityUa: "у Хмельницькому", inCityRu: "в Хмельницком", inCityPl: "w Chmielnickim" },
  { city: "Кропивницький", slug: "kropyvnytskyi", ru: "Кропивницкий", en: "Kropyvnytskyi", pl: "Kropywnicki", inCityUa: "у Кропивницькому", inCityRu: "в Кропивницком", inCityPl: "w Kropywnickim" },
  // Міста-супутники Києва з активним будівництвом новобудов — не обласні
  // центри, але саме тут зараз найбільший попит на двері для забудовників.
  { city: "Ірпінь", slug: "irpin", ru: "Ирпень", en: "Irpin", pl: "Irpień", inCityUa: "в Ірпені", inCityRu: "в Ирпене", inCityPl: "w Irpieniu" },
  { city: "Буча", slug: "bucha", ru: "Буча", en: "Bucha", pl: "Bucza", inCityUa: "у Бучі", inCityRu: "в Буче", inCityPl: "w Buczy" },
  { city: "Вишневе", slug: "vyshneve", ru: "Вишневое", en: "Vyshneve", pl: "Wiszniewe", inCityUa: "у Вишневому", inCityRu: "в Вишневом", inCityPl: "w Wiszniewem" },
];

export function getRecruitCityDisplayName(
  c: { city: string; ru: string; en: string; pl: string },
  locale: "ua" | "ru" | "en" | "pl"
): string {
  if (locale === "ua") return c.city;
  return c[locale];
}

// "Шукаємо дилера" — на відміну від RECRUIT_CITIES (де немає жодного
// дилера), тут навмисно об'єднуємо їх з містами, де дилер вже є: більшість
// міст цілком може підтримати кількох дилерів одночасно, і власниця
// бізнесу хоче активно шукати ще там теж. Не використовується для сторінок
// "для забудовників" — там лишаємо тільки міста без дилера, щоб не
// підривати оптовий бізнес існуючого партнера в тому ж місті.
export type DealerRecruitTarget = { city: string; slug: string; ru: string; en: string; pl: string };

export function getAllDealerRecruitCities(): DealerRecruitTarget[] {
  const fromRecruit: DealerRecruitTarget[] = RECRUIT_CITIES.map((c) => ({
    city: c.city,
    slug: c.slug,
    ru: c.ru,
    en: c.en,
    pl: c.pl,
  }));
  const fromDealerCities: DealerRecruitTarget[] = Object.entries(CITY_SLUGS).map(([city, slug]) => ({
    city,
    slug,
    ru: CITY_NAMES[city]?.ru ?? city,
    en: CITY_NAMES[city]?.en ?? city,
    pl: CITY_NAMES[city]?.pl ?? city,
  }));
  return [...fromRecruit, ...fromDealerCities];
}

export function findDealerRecruitCity(slug: string): DealerRecruitTarget | undefined {
  return getAllDealerRecruitCities().find((c) => c.slug === slug);
}

// "у/в [Місто]" з правильним відмінком — для EN просто "in [City]", бо
// англійська назва міста не відмінюється.
export function getRecruitCityInPhrase(c: RecruitCity, locale: "ua" | "ru" | "en" | "pl"): string {
  if (locale === "ua") return c.inCityUa;
  if (locale === "ru") return c.inCityRu;
  if (locale === "pl") return c.inCityPl;
  return `in ${c.en}`;
}

export function findRecruitCity(slug: string): RecruitCity | undefined {
  return RECRUIT_CITIES.find((c) => c.slug === slug);
}
