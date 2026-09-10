// 301-редіректи зі старого сайту inwood.com.ua (Tilda/шаблонний рушій) на
// новий — щоб проіндексовані Google-ом сторінки не давали 404 після
// перенесення домену. Побудовано зі списку 436 URL зі старих sitemap.xml
// (sitemap_pages.xml + shop/sitemap.xml + blog/sitemap.xml, зібрано
// власницею сайту 31.08.2026).
//
// Мапимо лише туди, де старий слаг ВІДРІЗНЯЄТЬСЯ від нового, або сторінки
// зовсім нема на новому сайті (тоді ведемо на найближчий смисловий
// відповідник). Сторінки з ідентичним слагом (напр. /pro-nas, /garantiya)
// тут не перелічені — їх і так підхоплює загальне правило middleware
// (проставляє мовний префікс /ua до будь-якого шляху без нього).
export const LEGACY_EXACT_REDIRECTS: Record<string, string> = {
  // ---- UA (старий сайт: корінь без префіксу) ----
  "/kontakti": "/ua/kontakty",
  "/storinka-vdyachnosti": "/ua",
  "/chim-vidriznyayutsya-nashi-dveri": "/ua/harakterystyky",
  "/servisne-obslugovuvannya": "/ua/servis",
  "/etalon": "/ua/catalog#etalon",
  "/nominal": "/ua/catalog#nominal",
  "/frezzatti": "/ua/catalog#frezzatti",
  "/perfetto": "/ua/catalog#perfetto",
  "/video": "/ua",
  "/dveri-pryhovanoho-montazhu": "/ua/catalog#hidden-doors",
  "/dveri/shchytovi": "/ua/blog/shhytovi-chy-tsargovi-dveri",
  "/dveri-z-pokryttyam": "/ua/catalog",
  "/farbovani-dveri": "/ua/catalog",
  "/pryhovani-dveri": "/ua/catalog#hidden-doors",
  "/pogonazhni-vyroby": "/ua/catalog",
  "/standart": "/ua/catalog",
  "/vidhuk": "/ua",
  "/blog-mizhkimnatni-dveri": "/ua/blog",
  "/cooperation": "/ua/spivpratsya",
  "/door_shop": "/ua/catalog",
  "/dveri-kiev": "/ua/nashi-dileri/kyiv",
  "/dveri-kharkiv": "/ua/nashi-dileri/kharkiv",
  "/dveri-odessa": "/ua/nashi-dileri/odesa",
  "/dveri-dnipro": "/ua/nashi-dileri/dnipro",
  "/dveri-poltava": "/ua/nashi-dileri/poltava",
  "/dveri-jitomir": "/ua/nashi-dileri/zhytomyr",
  "/dveri-cherkasy": "/ua/nashi-dileri/cherkasy",
  "/dveri-rivne": "/ua/nashi-dileri/rivne",
  "/dveri-ternopil": "/ua/nashi-dileri/ternopil",
  "/dveri-boryspil": "/ua/nashi-dileri/boryspil",
  "/dveri-brovary": "/ua/nashi-dileri/brovary",
  "/dveri-kryvyi-rih": "/ua/nashi-dileri/kryvyi-rih",
  "/dveri-bolhrad": "/ua/nashi-dileri/bolhrad",
  "/dveri-kamianets-podilskyi": "/ua/nashi-dileri/kamianets-podilskyi",
  "/dveri-kremenchuk": "/ua/nashi-dileri/kremenchuk",

  // ---- EN (старий сайт: власні англійські слаги) ----
  "/en/about-us": "/en/pro-nas",
  "/en/contacts": "/en/kontakty",
  "/en/warranty": "/en/garantiya",
  "/en/shipping-and-payment": "/en/oplata-dostavka",
  "/en/door-features": "/en/harakterystyky",
  "/en/service": "/en/servis",
  "/en/cooperation": "/en/spivpratsya",
  "/en/dealers": "/en/nashi-dileri",
  "/en/gallery-etalon": "/en/galereya",
  "/en/gallery-nominal": "/en/galereya",
  "/en/gallery-frezzatti": "/en/galereya",
  "/en/gallery-perfetto": "/en/galereya",
  "/en/video": "/en",
  "/en/hidden-doors": "/en/catalog#hidden-doors",
  "/en/flush-doors": "/en/catalog#hidden-doors",
  "/en/pvc-coated-doors": "/en/catalog",
  "/en/painted-doors": "/en/catalog",
  "/en/concealed-doors": "/en/catalog#hidden-doors",
  "/en/mouldings": "/en/catalog",

  // ---- RU (старий сайт: ті самі слаги, що й UA, з префіксом /ru/) ----
  "/ru/kontakti": "/ru/kontakty",
  "/ru/storinka-vdyachnosti": "/ru",
  "/ru/chim-vidriznyayutsya-nashi-dveri": "/ru/harakterystyky",
  "/ru/servisne-obslugovuvannya": "/ru/servis",
  "/ru/cooperation": "/ru/spivpratsya",
  "/ru/etalon": "/ru/catalog#etalon",
  "/ru/nominal": "/ru/catalog#nominal",
  "/ru/frezzatti": "/ru/catalog#frezzatti",
  "/ru/perfetto": "/ru/catalog#perfetto",
  "/ru/video": "/ru",
  "/ru/dveri-pryhovanoho-montazhu": "/ru/catalog#hidden-doors",
  "/ru/dveri/shchytovi": "/ru/blog/shhytovi-chy-tsargovi-dveri",
  "/ru/dveri-z-pokryttyam": "/ru/catalog",
  "/ru/farbovani-dveri": "/ru/catalog",
  "/ru/pryhovani-dveri": "/ru/catalog#hidden-doors",
  "/ru/pogonazhni-vyroby": "/ru/catalog",
  "/ru/standart": "/ru/catalog",
  "/ru/blog-mizhkimnatni-dveri": "/ru/blog",
  "/ru/dveri-kiev": "/ru/nashi-dileri/kyiv",
  "/ru/dveri-kharkiv": "/ru/nashi-dileri/kharkiv",
  "/ru/dveri-odessa": "/ru/nashi-dileri/odesa",
  "/ru/dveri-dnipro": "/ru/nashi-dileri/dnipro",
  "/ru/dveri-poltava": "/ru/nashi-dileri/poltava",
  "/ru/dveri-jitomir": "/ru/nashi-dileri/zhytomyr",
  "/ru/dveri-cherkasy": "/ru/nashi-dileri/cherkasy",
  "/ru/dveri-rivne": "/ru/nashi-dileri/rivne",
  "/ru/dveri-ternopil": "/ru/nashi-dileri/ternopil",
  "/ru/dveri-boryspil": "/ru/nashi-dileri/boryspil",
  "/ru/dveri-brovary": "/ru/nashi-dileri/brovary",
  "/ru/dveri-kryvyi-rih": "/ru/nashi-dileri/kryvyi-rih",
  "/ru/dveri-bolhrad": "/ru/nashi-dileri/bolhrad",
  "/ru/dveri-kamianets-podilskyi": "/ru/nashi-dileri/kamianets-podilskyi",
  "/ru/dveri-kremenchuk": "/ru/nashi-dileri/kremenchuk",
};

// Старий інтернет-магазин (/shop/...) — 339 URL (13 категорій + 99 товарів,
// кожен ×3 мови). Новий сайт не має окремих сторінок на кожен товар/колір
// (каталог — одна сторінка з фільтром), тому ведемо на відповідний розділ
// каталогу; категорії, що впізнаються як реальна колекція — одразу на її
// якір.
const SHOP_COLLECTION_ANCHOR: Record<string, string> = {
  etalon: "etalon",
  "etalon-lite": "etalon",
  nominal: "nominal",
  frezzatti: "frezzatti",
  frezatti: "frezzatti",
  "frezzatti-farbovani": "frezzatti",
  perfetto: "perfetto",
  "prihovanogo-montazhu": "hidden-doors",
};

export function resolveLegacyRedirect(pathname: string): string | null {
  const exact = LEGACY_EXACT_REDIRECTS[pathname];
  if (exact) return exact;

  // UA-слаги в мапі вище без префікса (бо на старому сайті UA був у
  // корені) — але хтось міг зберегти/натиснути посилання вже з "/ua/"
  // (напр. проіндексоване Google-ом чи вручну набране), тож пробуємо
  // ще й без цього префікса.
  if (pathname.startsWith("/ua/")) {
    const withoutUaPrefix = LEGACY_EXACT_REDIRECTS[pathname.slice(3)];
    if (withoutUaPrefix) return withoutUaPrefix;
  }

  const segments = pathname.split("/").filter(Boolean);
  let locale = "ua";
  let rest = segments;
  if (segments[0] === "en" || segments[0] === "ru") {
    locale = segments[0];
    rest = segments.slice(1);
  }
  if (rest[0] === "shop") {
    if (rest[1] === "cat" && rest[2]) {
      const anchor = SHOP_COLLECTION_ANCHOR[rest[2]];
      return anchor ? `/${locale}/catalog#${anchor}` : `/${locale}/catalog`;
    }
    return `/${locale}/catalog`;
  }
  return null;
}
