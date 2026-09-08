import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata } from "@/lib/seo";
import { collections, collectionOrder } from "@/lib/products";
import CatalogFilter from "@/components/CatalogFilter";

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
      <div className="text-center">
        <p className="text-sm uppercase tracking-wide text-gold-dim">{t.kicker}</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-navy-dark sm:text-4xl">
          {t.heading}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-navy-dim">{t.intro}</p>
      </div>

      <div className="mt-12">
        <CatalogFilter sections={sections} orderEmail={dict.common.email} t={t} />
      </div>
    </div>
  );
}
