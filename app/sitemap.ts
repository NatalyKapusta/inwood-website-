import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { SITE_URL, hreflang } from "@/lib/seo";
import { blogPosts } from "@/data/blog";
import dealers from "@/data/dealers.json";
import { getCitiesWithDealers } from "@/lib/dealers";
import { RECRUIT_CITIES, getAllDealerRecruitCities } from "@/lib/recruitCities";

const paths = [
  "",
  "/catalog",
  "/galereya",
  "/pro-nas",
  "/harakterystyky",
  "/nashi-dileri",
  "/spivpratsya",
  "/export",
  "/oplata-dostavka",
  "/servis",
  "/garantiya",
  "/faq",
  "/blog",
  "/kontakty",
  ...blogPosts.ua.map((post) => `/blog/${post.slug}`),
  ...getCitiesWithDealers(dealers).map((c) => `/nashi-dileri/${c.slug}`),
  ...getAllDealerRecruitCities().map((c) => `/staty-dylerom/${c.slug}`),
  "/dlya-zabudovnykiv",
  ...RECRUIT_CITIES.map((c) => `/dlya-zabudovnykiv/${c.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const localizedEntries = paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" || path === "/catalog" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path === "/catalog" ? 0.9 : 0.6,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [hreflang[l], `${SITE_URL}/${l}${path}`])),
      },
    }))
  );

  // /partnership живе поза [locale] (без мовного префікса, без alternates) —
  // єдина сторінка, яка навмисно НЕ в навігації, але має індексуватись і рости
  // в органічному пошуку. Рекламний піддомен partnership.inwood.com.ua віддає
  // той самий контент через rewrite, але позначений noindex у middleware.ts,
  // щоб не дублювати цей запис.
  const partnershipEntry = {
    url: `${SITE_URL}/partnership`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  };

  return [...localizedEntries, partnershipEntry];
}
