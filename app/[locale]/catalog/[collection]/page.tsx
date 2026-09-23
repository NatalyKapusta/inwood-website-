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
} from "@/lib/collectionPages";
import Breadcrumbs from "@/components/Breadcrumbs";
import RichText from "@/components/RichText";
import SpecsTable from "@/components/SpecsTable";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    COLLECTION_PAGE_SLUGS.map((collection) => ({ locale, collection }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; collection: string };
}) {
  if (!isCollectionPageSlug(params.collection)) return {};
  const dict = await getDictionary(params.locale);
  const item = dict.collectionPages.items[params.collection];
  return buildMetadata({
    locale: params.locale,
    path: `/catalog/${params.collection}`,
    title: item.title,
    description: item.metaDescription,
  });
}

export default async function CollectionPage({
  params,
}: {
  params: { locale: Locale; collection: string };
}) {
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
    </>
  );
}
