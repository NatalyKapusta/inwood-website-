import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { SITE_URL, hreflang } from "@/lib/seo";
import { blogPosts } from "@/data/blog";
import dealers from "@/data/dealers.json";
import { getCitiesWithDealers } from "@/lib/dealers";
import { COLLECTION_PAGE_SLUGS, THEMATIC_PAGE_SLUGS } from "@/lib/collectionPages";
import { getAllDealerRecruitCities, RECRUIT_CITIES } from "@/lib/recruitCities";

const paths = [
  "",
  "/catalog",
  "/furnitura",
  "/galereya",
  "/pro-nas",
  "/harakterystyky",
  "/nashi-dileri",
  "/spivpratsya",
  "/3d-prymirka-dverei",
  "/export",
  "/derzhavnym-zakladam",
  "/mdf-nakladky",
  "/mizhkimnatni-dveri-poltava",
  "/oplata-dostavka",
  "/servis",
  "/garantiya",
  "/faq",
  "/blog",
  "/kontakty",
  ...blogPosts.ua.map((post) => `/blog/${post.slug}`),
  ...getCitiesWithDealers(dealers).map((c) => `/nashi-dileri/${c.slug}`),
  "/dlya-zabudovnykiv",
  // SEO-аудит 28.09.2026, задача 1: ці сторінки мали noindex, тепер прибрано —
  // додаємо їх у sitemap, щоб Google дізнався про них швидше, ніж по посиланнях.
  ...getAllDealerRecruitCities().map((c) => `/staty-dylerom/${c.slug}`),
  ...RECRUIT_CITIES.map((c) => `/dlya-zabudovnykiv/${c.slug}`),
  ...COLLECTION_PAGE_SLUGS.map((slug) => `/catalog/${slug}`),
  ...THEMATIC_PAGE_SLUGS.map((slug) => `/catalog/${slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      // Навмисно без lastModified: new Date() — реальної дати останньої
      // зміни кожної сторінки ми не відстежуємо, а "завжди сьогодні" на
      // всіх 368 адресах лише привчає Google ігнорувати це поле (SEO-аудит
      // Vercel, 09.10.2026, пункт 6.1).
      changeFrequency: path === "" || path === "/catalog" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path === "/catalog" ? 0.9 : 0.6,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [hreflang[l], `${SITE_URL}/${l}${path}`])),
      },
    }))
  );
}
