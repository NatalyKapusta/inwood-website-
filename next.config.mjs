/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    // Фото й документи в public/ — статичні файли, що не змінюються після
    // деплою (нова версія фото = нове ім'я файлу), тому безпечно кешувати
    // їх надовго — це прибирає PageSpeed-зауваження про короткий термін кешу.
    return [
      {
        // Базові заголовки безпеки на всі відповіді (SEO-аудит Vercel,
        // 09.10.2026, пункт 5.3). Повний Content-Security-Policy навмисно НЕ
        // додано — на сайті є GA4, чат KeepinCRM і Leaflet-карта, і без
        // ретельної перевірки кожного джерела CSP легко щось зламає.
        // X-Frame-Options: SAMEORIGIN безпечний — на сайті немає жодного
        // <iframe>, що показує сторінки самого inwood.com.ua (є лише
        // YouTube-embed, який і так показує youtube.com, а не нас).
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/photos/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/documents/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // Інструкції до калькулятора КП (html + скріни) редагуються під тими
        // самими іменами файлів — immutable-кеш вище змушував людей місяцями
        // бачити застарілий текст/скріни навіть після фіксів.
        source: "/documents/instruktsiya-kalkuliator.html",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
      {
        source: "/documents/instruktsiya-kalkuliator-en.html",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
      {
        source: "/documents/instruktsiya-kalkuliator-img/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
      {
        source: "/documents/instruktsiya-kalkuliator-en-img/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
      {
        // Довідник по лінійках (UA/EN) теж регулярно редагується.
        source: "/documents/dovidnyk-spivrobitnykiv.html",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
      {
        source: "/documents/dovidnyk-spivrobitnykiv-en.html",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
      {
        // Прайс-листи в кабінеті дилера — теж редагуються під тими самими іменами.
        source: "/documents/prays-dilerska.html",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
      {
        source: "/documents/prays-rozdrib.html",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
      {
        // Текстури 3D-примірки дверей — той самий файл під тим самим ім'ям
        // ніколи не змінюється (нова версія = новий TEX_VER у door-fit.html),
        // тому теж безпечно кешувати надовго.
        source: "/tools/door-fit/textures/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // Сам door-fit.html може оновлюватись при кожному релізі інструмента —
        // короткий кеш, щоб відвідувачі одразу бачили нову версію.
        source: "/tools/door-fit/door-fit.html",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
    ];
  },
  async redirects() {
    // Карти сайту старого Tilda-сайту — боти й застарілі посилання досі
    // стукаються в ці адреси. Редіректи в next.config.mjs (а не middleware)
    // спеціально, бо middleware пропускає будь-який шлях з крапкою, не
    // перевіряючи resolveLegacyRedirect для нього (SEO-аудит Vercel,
    // 09.10.2026, пункт 3.1).
    return [
      { source: "/sitemap_pages.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/shop/sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/blog/sitemap.xml", destination: "/sitemap.xml", permanent: true },
      // Старі імена PDF-каталогів (стиснуті копії лежать під новими іменами —
      // на /documents/* стоїть immutable-кеш на рік, тому стара назва не
      // оновилась би сама собою). Старі посилання в листах/месенджерах
      // мають продовжити працювати (SEO-аудит Vercel, 09.10.2026, пункт 1).
      { source: "/documents/catalog-ua.pdf", destination: "/documents/catalog-ua-2026-10.pdf", permanent: true },
      { source: "/documents/catalog-en.pdf", destination: "/documents/catalog-en-2026-10.pdf", permanent: true },
    ];
  },
};

export default nextConfig;
