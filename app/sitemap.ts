import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { SITE_URL, hreflang } from "@/lib/seo";
import { blogPosts } from "@/data/blog";
import dealers from "@/data/dealers.json";
import { getCitiesWithDealers } from "@/lib/dealers";
import { RECRUIT_CITIES, getAllDealerRecruitCities } from "@/lib/recruitCities";
import { COLLECTION_PAGE_SLUGS } from "@/lib/collectionPages";

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

  // Сторінки колекцій (/catalog/etalon тощо) — поки тільки українською:
  // переклади ru/en/pl ще не передані (див. коментар у сторінці), тому не
  // додаємо в sitemap мовні версії, яких на сайті ще немає (вели б на 404).
  // alternates обмежені однією мовою — x-default теж на ua, без інших
  // hreflang, яких поки немає.
  const collectionEntries = COLLECTION_PAGE_SLUGS.map((slug) => {
    const url = `${SITE_URL}/ua/catalog/${slug}`;
    return {
      url,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: { uk: url, "x-default": url },
      },
    };
  });

  return [...localizedEntries, ...collectionEntries];
}
