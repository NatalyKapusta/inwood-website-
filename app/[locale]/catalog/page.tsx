import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata, productListJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { collections, collectionOrder } from "@/lib/products";
import { getPricesVisible } from "@/lib/siteSettings";
import CatalogFilter from "@/components/CatalogFilter";
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
  const sections = collectionOrder
    .filter((id) => collections[id])
    .map((id) => ({ id, data: collections[id] }));
  const pricesVisible = await getPricesVisible();
  const catalogPdf = params.locale === "en" ? "/documents/catalog-en.pdf" : "/documents/catalog-ua.pdf";

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
