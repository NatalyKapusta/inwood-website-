import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n";
import type { Collection } from "@/lib/products";

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
      "Виробник міжкімнатних дверей повного циклу — Полтава, Україна. Дилерська мережа та експорт до Великої Британії, Франції, Швейцарії, Литви та Латвії.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "провулок Спортивний, 4",
      addressLocality: "Полтава",
      addressCountry: "UA",
    },
    // Реальні країни експорту (підтверджено власником) — конкретні країни
    // замість загального "worldwide" дають Google/AI-пошуковикам точніший
    // сигнал про те, куди саме постачається продукція.
    areaServed: ["UA", "GB", "FR", "CH", "LT", "LV"],
    sameAs: ["https://www.facebook.com/inwood.official", "https://www.instagram.com/in_wood_official"],
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
        areaServed: ["UA", "GB", "FR", "CH", "LT", "LV"],
        availableLanguage: ["en", "uk"],
      },
    ],
  };
}

export function faqPageJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}/${locale}${item.path}`,
    })),
  };
}

// Product-розмітка для каталогу — ціна включається тільки коли prices_visible
// увімкнено в порталі (той самий перемикач, що ховає ціни на сторінці).
export function productListJsonLd({
  sections,
  locale,
  pricesVisible,
}: {
  sections: { id: string; data: Collection }[];
  locale: Locale;
  pricesVisible: boolean;
}) {
  const catalogUrl = `${SITE_URL}/${locale}/catalog`;
  const products = sections.flatMap(({ id, data }) => {
    const fromModels = (data.models ?? []).map((model) => ({
      "@type": "Product" as const,
      name: `${data.label} ${model.code}`,
      image: model.colors[0] ? `${SITE_URL}${model.colors[0].image}` : undefined,
      url: `${catalogUrl}#${id}`,
      brand: { "@type": "Brand", name: "IN WOOD" },
      ...(pricesVisible
        ? {
            offers: {
              "@type": "Offer",
              price: model.basePrice,
              priceCurrency: "UAH",
              availability: "https://schema.org/InStock",
              url: `${catalogUrl}#${id}`,
            },
          }
        : {}),
    }));
    const fromVariants = (data.variants ?? []).map((variant) => ({
      "@type": "Product" as const,
      name: `${data.label} — ${variant.label}`,
      image: `${SITE_URL}${variant.image}`,
      url: `${catalogUrl}#${id}`,
      brand: { "@type": "Brand", name: "IN WOOD" },
      ...(pricesVisible
        ? {
            offers: {
              "@type": "Offer",
              price: variant.price,
              priceCurrency: "UAH",
              availability: "https://schema.org/InStock",
              url: `${catalogUrl}#${id}`,
            },
          }
        : {}),
    }));
    return [...fromModels, ...fromVariants];
  });

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: product,
    })),
  };
}
