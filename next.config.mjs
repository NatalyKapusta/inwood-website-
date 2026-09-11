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
    ];
  },
};

export default nextConfig;
