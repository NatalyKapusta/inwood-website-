import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata, productListJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { collections, collectionOrder } from "@/lib/products";
import { getPricesVisible } from "@/lib/siteSettings";
import { getPublicPogonazhni, getPublicPlintus, getPublicNakladka } from "@/lib/publicShop";
import { catalogCategories, catalogCategorySlugs, type CatalogCategorySlug } from "@/lib/catalogCategories";
import { COLLECTION_PAGE_SLUGS, THEMATIC_PAGE_SLUGS } from "@/lib/collectionPages";
import CatalogFilter from "@/components/CatalogFilter";
import CategoryBanner from "@/components/CategoryBanner";
import DoorFit3dBanner from "@/components/DoorFit3dBanner";
import HardwareCrossSell from "@/components/HardwareCrossSell";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";

// Сторінка кешується статично, але раз на хвилину перевіряє
// prices_visible наново — щоб перемикач у порталі діяв без редеплою.
export const revalidate = 60;

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  return buildMetadata({
    locale: params.locale,
    path: "/catalog",
    title: dict.catalog.title,
    description: dict.catalog.metaDescription,
  });
}

export default async function CatalogPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const t = dict.catalog;
  const baseSections = collectionOrder
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

  // Остання вкладка "Погонажні вироби" — короб/лиштва/добір окремо від
  // полотна (по всіх лініях), плюс дверна накладка й плінтус (не прив'язані
  // до лінії, тому groupуються під власною "псевдо-колекцією"). Це частина
  // повного каталогу (не входить у жодну з категорій-пілів).
  const [pogonazhni, plintus, nakladka] = await Promise.all([
    getPublicPogonazhni(),
    getPublicPlintus(),
    getPublicNakladka(),
  ]);
  const addons = [
    ...pogonazhni.map((row) => ({
      collectionLabel: collections[row.collection]?.label ?? row.collection,
      addon_type: row.addon_type,
      item_label: row.item_label,
      price: row.price,
    })),
    ...nakladka.map((item) => ({
      collectionLabel: dict.furnitura.nakladkaTitle,
      addon_type: "nakladka" as const,
      item_label: item.label,
      price: item.price,
    })),
    ...plintus.map((item) => ({
      collectionLabel: dict.furnitura.plintusTitle,
      addon_type: "plintus" as const,
      item_label: item.label,
      price: item.price,
      unitSuffix: dict.furnitura.perMeter,
    })),
  ];
  const sections =
    addons.length > 0
      ? [...baseSections, { id: "pogonazhni", data: { label: dict.furnitura.pogonazhniTitle, addons } }]
      : baseSections;

  // Піли-категорії з головної сторінки ведуть сюди з ?category=... — той
  // фільтр тепер читається на клієнті (CatalogFilter/CategoryBanner), а тут
  // заздалегідь рахуємо звужений набір секцій під кожну з 6 категорій, щоб
  // сервер більше не читав searchParams (це форсувало динамічний рендер і
  // ламало кешування сторінки).
  const sectionsByCategory: Partial<Record<CatalogCategorySlug, typeof sections>> = {};
  for (const slug of catalogCategorySlugs) {
    const category = catalogCategories[slug];
    sectionsByCategory[slug] = baseSections
      .filter((s) => category.collections.includes(s.id))
      .map((s) => {
        const excluded = category.excludeModelCodes?.[s.id];
        if (!excluded || !s.data.models) return s;
        return { ...s, data: { ...s.data, models: s.data.models.filter((m) => !excluded.includes(m.code)) } };
      });
  }

  const pricesVisible = await getPricesVisible(params.locale);
  // Немає окремого PL-каталогу — для польської версії видаємо англійський
  // PDF (зрозуміліший польському відвідувачу, ніж український), а не
  // українську версію за замовчуванням.
  const catalogPdf =
    params.locale === "en" || params.locale === "pl"
      ? "/documents/catalog-en.pdf"
      : "/documents/catalog-ua.pdf";
  const breadcrumbItems = [
    { name: dict.common.breadcrumbHome, path: "" },
    { name: t.heading, path: "/catalog" },
  ];

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
          __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems, params.locale)),
        }}
      />
      <Breadcrumbs items={breadcrumbItems} locale={params.locale} />
      <div className="text-center">
        <h1 className="font-serif text-3xl font-bold text-navy-dark sm:text-4xl">
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

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
        {COLLECTION_PAGE_SLUGS.map((slug) => (
          <Link
            key={slug}
            href={`/${params.locale}/catalog/${slug}`}
            className="rounded-full border border-navy-dim/25 px-5 py-2 text-navy-dark transition hover:border-gold hover:text-gold-dim"
          >
            {dict.collectionPages.items[slug].breadcrumbName}
          </Link>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs">
        {THEMATIC_PAGE_SLUGS.map((slug) => (
          <Link
            key={slug}
            href={`/${params.locale}/catalog/${slug}`}
            className="rounded-full border border-navy-dim/15 px-4 py-1.5 text-navy-dim transition hover:border-gold hover:text-gold-dim"
          >
            {dict.catalogThemePages.items[slug].breadcrumbName}
          </Link>
        ))}
      </div>

      <CategoryBanner
        locale={params.locale}
        categoryLabels={dict.home.categories}
        showAllLabel={t.showAllCatalog}
      />

      <div className="mt-12">
        <DoorFit3dBanner
          locale={params.locale}
          kicker={dict.spivpratsya.doorFitKicker}
          title={dict.spivpratsya.doorFitTitle}
          cta={dict.spivpratsya.doorFitCta}
        />
      </div>

      <div className="mt-8">
        <CatalogFilter
          sections={sections}
          sectionsByCategory={sectionsByCategory}
          t={t}
          pricesVisible={pricesVisible}
          nakladkaLabel={dict.furnitura.nakladkaShort}
          plintusLabel={dict.furnitura.plintusTitle}
          addToCartLabel={dict.common.addToCart}
          addedToCartLabel={dict.common.addedToCart}
        />
      </div>

      <HardwareCrossSell
        locale={params.locale}
        heading={dict.hardwareCrossSell.heading}
        intro={dict.hardwareCrossSell.intro}
        cardLabels={dict.hardwareCrossSell.cardLabels}
        linkLabel={dict.hardwareCrossSell.linkLabel}
        noPhotoLabel={dict.furnitura.noPhoto}
        addToCartLabel={dict.common.addToCart}
        addedToCartLabel={dict.common.addedToCart}
      />

      <div className="mt-6 text-center">
        <Link href={`/${params.locale}/blog`} className="text-sm font-semibold text-gold-dim hover:text-navy-dark">
          {dict.blog.heading}: {dict.blog.intro} →
        </Link>
      </div>
    </div>
  );
}
