import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata, productListJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { collections, collectionOrder } from "@/lib/products";
import { getPricesVisible } from "@/lib/siteSettings";
import { catalogCategories, catalogCategorySlugs, type CatalogCategorySlug } from "@/lib/catalogCategories";
import CatalogFilter from "@/components/CatalogFilter";
import Link from "next/link";

// Сторінка кешується статично, але раз на хвилину перевіряє
// prices_visible наново — щоб перемикач у порталі діяв без редеплою.
export const revalidate = 60;

function isCategorySlug(v: string | undefined): v is CatalogCategorySlug {
  return !!v && (catalogCategorySlugs as string[]).includes(v);
}

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  return buildMetadata({
    locale: params.locale,
    path: "/catalog",
    title: dict.catalog.title,
    description: dict.catalog.metaDescription,
  });
}

export default async function CatalogPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { category?: string };
}) {
  const dict = await getDictionary(params.locale);
  const t = dict.catalog;
  let sections = collectionOrder
    .filter((id) => collections[id])
    .map((id) => {
      const data = collections[id];
      // Моделі ETALON можна монтувати і приховано — показуємо їх ще й у секції
      // "Двері прихованого монтажу" (лише на сайті, komplekt цієї секції лишається
      // рідний — коробка STANDART/LUX), не чіпаючи саму секцію ETALON і дані порталу.
      if (id === "hidden-doors") {
        return { id, data: { ...data, models: collections.etalon?.models } };
      }
      return { id, data };
    });

  // Піли-категорії з головної сторінки ведуть сюди з ?category=... — звужуємо
  // список секцій (і, для "dekor", ще й моделі всередині) під конкретну
  // категорію, замість показу всього каталогу.
  const categorySlug = isCategorySlug(searchParams.category) ? searchParams.category : undefined;
  const category = categorySlug ? catalogCategories[categorySlug] : undefined;
  if (category) {
    sections = sections
      .filter((s) => category.collections.includes(s.id))
      .map((s) => {
        const excluded = category.excludeModelCodes?.[s.id];
        if (!excluded || !s.data.models) return s;
        return { ...s, data: { ...s.data, models: s.data.models.filter((m) => !excluded.includes(m.code)) } };
      });
  }
  const categoryLabel = categorySlug
    ? dict.home.categories[catalogCategorySlugs.indexOf(categorySlug)]
    : undefined;

  const pricesVisible = await getPricesVisible(params.locale);
  // Немає окремого PL-каталогу — для польської версії видаємо англійський
  // PDF (зрозуміліший польському відвідувачу, ніж український), а не
  // українську версію за замовчуванням.
  const catalogPdf =
    params.locale === "en" || params.locale === "pl"
      ? "/documents/catalog-en.pdf"
      : "/documents/catalog-ua.pdf";

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            productListJsonLd({ sections, locale: params.locale, pricesVisible })
          ),
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(
              [
                { name: dict.common.breadcrumbHome, path: "" },
                { name: t.heading, path: "/catalog" },
              ],
              params.locale
            )
          ),
        }}
      />
      <div className="text-center">
        <p className="text-sm uppercase tracking-wide text-gold-dim">{t.kicker}</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-navy-dark sm:text-4xl">
          {t.heading}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-navy-dim">{t.intro}</p>
        <a
          href={catalogPdf}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy-dark px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold hover:text-navy-dark"
        >
          {t.downloadCatalog}
        </a>
      </div>

      {categoryLabel && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
          <span className="rounded-full bg-gold/15 px-4 py-1.5 font-semibold text-gold-dim">
            {categoryLabel}
          </span>
          <Link href={`/${params.locale}/catalog`} className="text-navy-dim underline decoration-dotted underline-offset-4 hover:text-navy-dark">
            {t.showAllCatalog}
          </Link>
        </div>
      )}

      <div className="mt-12">
        <CatalogFilter
          sections={sections}
          orderEmail={dict.common.email}
          t={t}
          pricesVisible={pricesVisible}
          phoneManual={dict.common.phoneManual}
          phoneChooseCountry={dict.common.phoneChooseCountry}
          phoneInvalid={dict.common.phoneInvalid}
          sendFailedRetry={dict.common.sendFailedRetry}
          nameLabel={dict.common.formName}
          phoneLabel={dict.common.formPhone}
          formSentMessage={dict.common.formSentMessage}
        />
      </div>

      <div className="mt-12 text-center">
        <Link href={`/${params.locale}/blog`} className="text-sm font-semibold text-gold-dim hover:text-navy-dark">
          {dict.blog.heading}: {dict.blog.intro} →
        </Link>
      </div>
    </div>
  );
}
