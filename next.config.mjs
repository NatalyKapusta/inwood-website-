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
        source: "/photos/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/documents/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
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
};

export default nextConfig;
