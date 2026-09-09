import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { SITE_URL, hreflang } from "@/lib/seo";
import { blogPosts } from "@/data/blog";

const paths = [
  "",
  "/catalog",
  "/galereya",
  "/pro-nas",
  "/harakterystyky",
  "/nashi-dileri",
  "/spivpratsya",
  "/oplata-dostavka",
  "/servis",
  "/garantiya",
  "/faq",
  "/blog",
  "/kontakty",
  ...blogPosts.ua.map((post) => `/blog/${post.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) =>
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
}
