import { notFound } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata, breadcrumbJsonLd, productListJsonLd } from "@/lib/seo";
import { collections } from "@/lib/products";
import { getPricesVisible } from "@/lib/siteSettings";
import {
  COLLECTION_PAGE_SLUGS,
  COLLECTION_PAGE_TO_ID,
  isCollectionPageSlug,
  THEMATIC_PAGE_SLUGS,
  isThematicPageSlug,
} from "@/lib/collectionPages";
import Breadcrumbs from "@/components/Breadcrumbs";
import RichText from "@/components/RichText";
import SpecsTable from "@/components/SpecsTable";
import ContactCta from "@/components/ContactCta";
import HardwareCrossSell from "@/components/HardwareCrossSell";

// Дані (видимість цін) читаються з Supabase публічним клієнтом (без
// cookies()) — сторінка лишається статичною/ISR, але оновлюється частіше,
// щоб перемикач цін у порталі діяв без редеплою.
export const revalidate = 60;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    [...COLLECTION_PAGE_SLUGS, ...THEMATIC_PAGE_SLUGS].map((collection) => ({ locale, collection }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; collection: string };
}) {
  const dict = await getDictionary(params.locale);
  if (isCollectionPageSlug(params.collection)) {
    const item = dict.collectionPages.items[params.collection];
    return buildMetadata({
      locale: params.locale,
      path: `/catalog/${params.collection}`,
      title: item.title,
      description: item.metaDescription,
    });
  }
  if (isThematicPageSlug(params.collection)) {
    const item = dict.catalogThemePages.items[params.collection];
    return buildMetadata({
      locale: params.locale,
      path: `/catalog/${params.collection}`,
      title: item.title,
      description: item.metaDescription,
    });
  }
  return {};
}

export default async function CollectionPage({
  params,
}: {
  params: { locale: Locale; collection: string };
}) {
  if (isThematicPageSlug(params.collection)) {
    return <ThematicPage params={params} />;
  }
  if (!isCollectionPageSlug(params.collection)) notFound();

  const dict = await getDictionary(params.locale);
  const c = dict.common;
  const cp = dict.collectionPages;
  const item = cp.items[params.collection];
  const collectionId = COLLECTION_PAGE_TO_ID[params.collection];
  const collectionData = collections[collectionId];
  const pricesVisible = await getPricesVisible(params.locale);

  const breadcrumbItems = [
    { name: c.breadcrumbHome, path: "" },
    { name: cp.breadcrumbSection, path: "/catalog" },
    { name: item.breadcrumbName, path: `/catalog/${params.collection}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems, params.locale)),
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            productListJsonLd({
              sections: [{ id: collectionId, data: collectionData }],
              locale: params.locale,
              pricesVisible,
            })
          ),
        }}
      />
      <Breadcrumbs items={breadcrumbItems} locale={params.locale} />

      <section className="mx-auto max-w-3xl px-4 pb-8 pt-6 text-center sm:pt-8">
        <h1 className="font-serif text-3xl font-bold text-navy-dark sm:text-4xl">{item.h1}</h1>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-12">
        <RichText paragraphs={item.body} locale={params.locale} />
        <div className="mt-8 text-center">
          <Link
            href={`/${params.locale}/catalog#${collectionId}`}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-navy-dark transition hover:bg-gold-dim"
          >
            {cp.ctaLabel}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16">
        <SpecsTable title={cp.specsTitle} rows={item.specs} />
      </section>

      <section className="bg-panel-alt py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-serif text-lg font-bold text-navy-dark">{cp.sharedBlockTitle}</h2>
          <div className="mt-4">
            <RichText paragraphs={cp.sharedBlock} locale={params.locale} />
          </div>
        </div>
      </section>

      {/* "Приховані двері": звичайні завіси тут не підходять, тож для цієї
          сторінки медіану по "Завісах" рахуємо лише серед прихованих/
          магнітних (атрибут "Спосіб монтажу: прихований" у даних
          фурнітури) — lib/hardwareCrossSell.ts. Три інші категорії без змін. */}
      <HardwareCrossSell
        locale={params.locale}
        heading={dict.hardwareCrossSell.heading}
        intro={dict.hardwareCrossSell.intro}
        cardLabels={dict.hardwareCrossSell.cardLabels}
        linkLabel={dict.hardwareCrossSell.linkLabel}
        noPhotoLabel={dict.furnitura.noPhoto}
        addToCartLabel={c.addToCart}
        addedToCartLabel={c.addedToCart}
        hiddenMountHinges={params.collection === "pryhovani-dveri"}
      />

      <ContactCta
        title={dict.poltava.ctaTitle}
        text={dict.poltava.ctaText}
        nameLabel={c.formName}
        phoneLabel={c.formPhone}
        submitLabel={c.formSubmit}
        sentLabel={c.formSentMessage}
        phoneManualLabel={c.phoneManual}
        phoneChooseCountryLabel={c.phoneChooseCountry}
        phoneInvalidLabel={c.phoneInvalid}
        source={`${item.breadcrumbName} — сторінка колекції`}
      />
    </>
  );
}

// Тематичні підсторінки (RAL/NCS-фарбування, нестандартні розміри) — не
// прив'язані до однієї колекції, тому без ItemList-розмітки й без кнопки
// на конкретний якір /catalog: тільки текст, характеристики й форма.
async function ThematicPage({
  params,
}: {
  params: { locale: Locale; collection: string };
}) {
  if (!isThematicPageSlug(params.collection)) notFound();

  const dict = await getDictionary(params.locale);
  const c = dict.common;
  const cp = dict.collectionPages;
  const item = dict.catalogThemePages.items[params.collection];

  const breadcrumbItems = [
    { name: c.breadcrumbHome, path: "" },
    { name: cp.breadcrumbSection, path: "/catalog" },
    { name: item.breadcrumbName, path: `/catalog/${params.collection}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems, params.locale)),
        }}
      />
      <Breadcrumbs items={breadcrumbItems} locale={params.locale} />

      <section className="mx-auto max-w-3xl px-4 pb-8 pt-6 text-center sm:pt-8">
        <h1 className="font-serif text-3xl font-bold text-navy-dark sm:text-4xl">{item.h1}</h1>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-12">
        <RichText paragraphs={item.body} locale={params.locale} />
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16">
        <SpecsTable title={cp.specsTitle} rows={item.specs} />
      </section>

      <HardwareCrossSell
        locale={params.locale}
        heading={dict.hardwareCrossSell.heading}
        intro={dict.hardwareCrossSell.intro}
        cardLabels={dict.hardwareCrossSell.cardLabels}
        linkLabel={dict.hardwareCrossSell.linkLabel}
        noPhotoLabel={dict.furnitura.noPhoto}
        addToCartLabel={c.addToCart}
        addedToCartLabel={c.addedToCart}
      />

      <ContactCta
        title={dict.poltava.ctaTitle}
        text={dict.poltava.ctaText}
        nameLabel={c.formName}
        phoneLabel={c.formPhone}
        submitLabel={c.formSubmit}
        sentLabel={c.formSentMessage}
        phoneManualLabel={c.phoneManual}
        phoneChooseCountryLabel={c.phoneChooseCountry}
        phoneInvalidLabel={c.phoneInvalid}
        source={`${item.breadcrumbName} — тематична сторінка`}
      />
    </>
  );
}
