import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n";

// Реальна адреса сайту зараз — Vercel (домен inwood.com.ua ще не перенесено).
// Коли домен перенесуть, змінити тут або задати env-змінну NEXT_PUBLIC_SITE_URL.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://inwood-website.vercel.app";

const ogLocale: Record<Locale, string> = {
  ua: "uk_UA",
  ru: "ru_UA",
  en: "en_US",
};

// URL-префікс лишається "/ua/" (усталена адреса сайту), але правильний
// ISO 639-1 код української мови для hreflang — "uk", не "ua" (це код країни).
export const hreflang: Record<Locale, string> = {
  ua: "uk",
  ru: "ru",
  en: "en",
};

export function buildMetadata({
  locale,
  path,
  title,
  description,
  image,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image?: string;
}): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;
  const languages = Object.fromEntries(
    locales.map((l) => [hreflang[l], `${SITE_URL}/${l}${path}`])
  );
  const ogImage = image ?? `${SITE_URL}/og-image.jpg`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "IN WOOD",
      locale: ogLocale[locale],
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "IN WOOD",
    url: SITE_URL,
    logo: `${SITE_URL}/logo/inwood-logo-gold.svg`,
    description:
      "Виробник міжкімнатних дверей повного циклу — Полтава, Україна. Дилерська мережа та експорт.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "провулок Спортивний, 4",
      addressLocality: "Полтава",
      addressCountry: "UA",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+380-50-880-38-41",
        contactType: "sales",
        areaServed: "UA",
        availableLanguage: ["uk", "ru"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+380-50-308-18-99",
        contactType: "sales",
        areaServed: ["UA", "EU", "worldwide"],
        availableLanguage: ["en", "uk"],
      },
    ],
  };
}
