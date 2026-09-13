export type Dealer = {
  name: string;
  address: string;
  phones: string[];
  phonesTel: string[];
  sites?: string[];
  sitesLabel?: string[];
  lat: number;
  lon: number;
};

export function extractCity(address: string): string | null {
  const first = address.split(",")[0].trim();
  const m = first.match(/^(?:м\.?|с\.?)\s*(.+)$/);
  if (m) return m[1].trim();
  if (/^[А-ЯІЇЄҐ][а-яіїєґ'-]+$/.test(first)) return first;
  return null;
}

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Для дилерів без міста в адресі — шукаємо найближче за GPS-координатами
// серед дилерів з відомим містом (у межах 20 км).
export function groupByCity(dealers: Dealer[]): [string, Dealer[]][] {
  const withCity = dealers.map((d) => ({ dealer: d, city: extractCity(d.address) }));
  const knownCities = withCity.filter((x) => x.city) as { dealer: Dealer; city: string }[];

  const resolved = withCity.map(({ dealer, city }) => {
    if (city) return { dealer, city };
    let best: { city: string; dist: number } | null = null;
    for (const known of knownCities) {
      const dist = distanceKm(dealer.lat, dealer.lon, known.dealer.lat, known.dealer.lon);
      if (!best || dist < best.dist) best = { city: known.city, dist };
    }
    return { dealer, city: best && best.dist <= 20 ? best.city : "Інші міста" };
  });

  const groups = new Map<string, Dealer[]>();
  for (const { dealer, city } of resolved) {
    if (!groups.has(city)) groups.set(city, []);
    groups.get(city)!.push(dealer);
  }
  return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0], "uk"));
}

// Транслітерація реальних міст, де є дилери IN WOOD — для чистих URL-адрес
// окремих сторінок "двері в [місті]". Тільки міста, які справді є у
// data/dealers.json (перевірено groupByCity) — жодних вигаданих міст.
export const CITY_SLUGS: Record<string, string> = {
  Полтава: "poltava",
  Одеса: "odesa",
  Київ: "kyiv",
  Харків: "kharkiv",
  Дніпро: "dnipro",
  "Кривий Ріг": "kryvyi-rih",
  Черкаси: "cherkasy",
  Тернопіль: "ternopil",
  Житомир: "zhytomyr",
  Рівне: "rivne",
  Луцьк: "lutsk",
  Кременчук: "kremenchuk",
  Бровари: "brovary",
  Бориспіль: "boryspil",
  "Кам'янець-Подільський": "kamianets-podilskyi",
  Болград: "bolhrad",
};

// Реальні назви цих самих міст іншими мовами сайту (звичайна географічна
// назва, а не переклад бренду чи товару — тому локалізуємо, на відміну
// від назв кольорів/моделей, які лишаються українською скрізь).
export const CITY_NAMES: Record<string, { ru: string; en: string; pl: string }> = {
  Полтава: { ru: "Полтава", en: "Poltava", pl: "Połtawa" },
  Одеса: { ru: "Одесса", en: "Odesa", pl: "Odessa" },
  Київ: { ru: "Киев", en: "Kyiv", pl: "Kijów" },
  Харків: { ru: "Харьков", en: "Kharkiv", pl: "Charków" },
  Дніпро: { ru: "Днепр", en: "Dnipro", pl: "Dnipro" },
  "Кривий Ріг": { ru: "Кривой Рог", en: "Kryvyi Rih", pl: "Krzywy Róg" },
  Черкаси: { ru: "Черкассы", en: "Cherkasy", pl: "Czerkasy" },
  Тернопіль: { ru: "Тернополь", en: "Ternopil", pl: "Tarnopol" },
  Житомир: { ru: "Житомир", en: "Zhytomyr", pl: "Żytomierz" },
  Рівне: { ru: "Ровно", en: "Rivne", pl: "Równe" },
  Луцьк: { ru: "Луцк", en: "Lutsk", pl: "Łuck" },
  Кременчук: { ru: "Кременчуг", en: "Kremenchuk", pl: "Krzemieńczuk" },
  Бровари: { ru: "Бровары", en: "Brovary", pl: "Browary" },
  Бориспіль: { ru: "Борисполь", en: "Boryspil", pl: "Boryspol" },
  "Кам'янець-Подільський": {
    ru: "Каменец-Подольский",
    en: "Kamianets-Podilskyi",
    pl: "Kamieniec Podolski",
  },
  Болград: { ru: "Болград", en: "Bolhrad", pl: "Bołgrad" },
};

export function getCityDisplayName(cityUa: string, locale: "ua" | "ru" | "en" | "pl"): string {
  if (locale === "ua") return cityUa;
  return CITY_NAMES[cityUa]?.[locale] ?? cityUa;
}

export function getCitiesWithDealers(dealers: Dealer[]): { city: string; slug: string; dealers: Dealer[] }[] {
  return groupByCity(dealers)
    .filter(([city]) => CITY_SLUGS[city])
    .map(([city, list]) => ({ city, slug: CITY_SLUGS[city], dealers: list }));
}
