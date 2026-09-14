import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { collections, collectionOrder } from "@/lib/products";
import { HARDWARE_BRAND_LABELS, HARDWARE_BRAND_ORDER, hardwareCategoryLabels } from "@/lib/quote";
import {
  HARDWARE_CATEGORY_ORDER,
  getPublicHardware,
  getPublicPogonazhni,
  getPublicPlintus,
  getPublicNakladka,
} from "@/lib/publicShop";
import { getPricesVisible } from "@/lib/siteSettings";
import ContactCta from "@/components/ContactCta";

// Дані фурнітури/аксесуарів живуть у Supabase (не в products.json).
// lib/publicShop.ts читає їх публічним клієнтом (не чіпає cookies()), тому
// сторінка може безпечно лишатись ISR-кешованою — раз на хвилину дані
// оновлюються наново, без повного force-dynamic на кожен запит.
export const revalidate = 60;

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  return buildMetadata({
    locale: params.locale,
    path: "/furnitura",
    title: dict.furnitura.title,
    description: dict.furnitura.metaDescription,
  });
}

function fmtUah(n: number) {
  return `${new Intl.NumberFormat("uk-UA").format(n)} ₴`;
}

export default async function FurnituraPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { sent?: string };
}) {
  const dict = await getDictionary(params.locale);
  const t = dict.furnitura;
  const c = dict.common;
  const catalogT = dict.catalog;

  const [hardwareItems, pogonazhniItems, plintusItems, nakladkaItems, pricesVisible] = await Promise.all([
    getPublicHardware(),
    getPublicPogonazhni(),
    getPublicPlintus(),
    getPublicNakladka(),
    getPricesVisible(params.locale),
  ]);

  const hardwareByBrand = HARDWARE_BRAND_ORDER.map((brand) => ({
    brand,
    label: HARDWARE_BRAND_LABELS[brand] ?? brand,
    categories: HARDWARE_CATEGORY_ORDER.map((category) => ({
      category,
      label: hardwareCategoryLabels[category],
      items: hardwareItems.filter((i) => i.brand === brand && i.category === category),
    })).filter((g) => g.items.length > 0),
  })).filter((b) => b.categories.length > 0);

  const addonTypeLabel = { korob: catalogT.korob, lishtva: catalogT.lyshtva, dobir: catalogT.dobir } as const;
  const pogonazhniByCollection = collectionOrder
    .filter((id) => pogonazhniItems.some((r) => r.collection === id))
    .map((id) => ({
      id,
      label: collections[id]?.label ?? id,
      groups: (["korob", "lishtva", "dobir"] as const)
        .map((addon_type) => ({
          addon_type,
          label: addonTypeLabel[addon_type],
          items: pogonazhniItems.filter((r) => r.collection === id && r.addon_type === addon_type),
        }))
        .filter((g) => g.items.length > 0),
    }));

  const hasAnything =
    hardwareByBrand.length > 0 || pogonazhniByCollection.length > 0 || plintusItems.length > 0 || nakladkaItems.length > 0;

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(
              [
                { name: c.breadcrumbHome, path: "" },
                { name: t.heading, path: "/furnitura" },
              ],
              params.locale
            )
          ),
        }}
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="text-center">
          <p className="text-sm uppercase tracking-wide text-gold-dim">{t.kicker}</p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-navy-dark sm:text-4xl">{t.heading}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-navy-dim">{t.intro}</p>
          <Link
            href={`/${params.locale}/catalog`}
            className="mt-6 inline-block text-sm font-semibold text-gold-dim hover:text-navy-dark"
          >
            {t.backToCatalog}
          </Link>
        </div>

        {!hasAnything && (
          <p className="mx-auto mt-16 max-w-md text-center text-navy-dim">{t.comingSoon}</p>
        )}

        {hardwareByBrand.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-navy-dark">{t.hardwareTitle}</h2>
            <div className="mt-8 space-y-12">
              {hardwareByBrand.map((brandGroup) => (
                <div key={brandGroup.brand}>
                  <h3 className="font-serif text-xl font-bold text-navy-dark">{brandGroup.label}</h3>
                  <div className="mt-6 space-y-8">
                    {brandGroup.categories.map((catGroup) => (
                      <div key={catGroup.category}>
                        <p className="text-sm font-semibold uppercase tracking-wide text-gold-dim">
                          {catGroup.label}
                        </p>
                        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {catGroup.items.map((item) => (
                            <div
                              key={`${item.brand}-${item.article}`}
                              className="overflow-hidden rounded-xl border border-navy-dim/10 bg-panel"
                            >
                              <div className="relative flex aspect-square items-center justify-center bg-panel-alt">
                                {item.photo ? (
                                  <Image
                                    src={item.photo}
                                    alt={`${item.name} ${item.article}, ${brandGroup.label}`}
                                    fill
                                    sizes="(min-width: 1280px) 280px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                    className="object-contain p-4"
                                  />
                                ) : (
                                  <span className="px-4 text-center text-xs text-navy-dim/60">{t.noPhoto}</span>
                                )}
                              </div>
                              <div className="p-4">
                                <p className="text-sm font-semibold text-navy-dark">{item.name}</p>
                                <p className="mt-0.5 text-xs text-navy-dim">
                                  {item.article}
                                  {item.material ? ` · ${item.material}` : ""}
                                </p>
                                <p className="mt-2 font-serif text-lg font-bold text-navy-dark">
                                  {fmtUah(item.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {pogonazhniByCollection.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-navy-dark">{t.pogonazhniTitle}</h2>
            <div className="mt-8 space-y-10">
              {pogonazhniByCollection.map((col) => (
                <div key={col.id}>
                  <h3 className="font-serif text-xl font-bold text-navy-dark">{col.label}</h3>
                  <div className="mt-4 space-y-6">
                    {col.groups.map((g) => (
                      <div key={g.addon_type}>
                        <p className="text-sm font-semibold uppercase tracking-wide text-gold-dim">{g.label}</p>
                        <ul className="mt-2 divide-y divide-navy-dim/10 rounded-xl border border-navy-dim/10 bg-panel">
                          {g.items.map((item) => (
                            <li
                              key={item.item_label}
                              className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
                            >
                              <span className="text-navy-dark">{item.item_label}</span>
                              <span className="font-semibold text-navy-dark">
                                {pricesVisible ? fmtUah(item.price) : catalogT.findOutPrice}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {nakladkaItems.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-navy-dark">{t.nakladkaTitle}</h2>
            <ul className="mt-6 divide-y divide-navy-dim/10 rounded-xl border border-navy-dim/10 bg-panel">
              {nakladkaItems.map((item) => (
                <li key={item.code} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                  <span className="text-navy-dark">{item.label}</span>
                  <span className="font-semibold text-navy-dark">
                    {pricesVisible ? fmtUah(item.price) : catalogT.findOutPrice}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {plintusItems.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-navy-dark">{t.plintusTitle}</h2>
            <ul className="mt-6 divide-y divide-navy-dim/10 rounded-xl border border-navy-dim/10 bg-panel">
              {plintusItems.map((item) => (
                <li key={item.code} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                  <span className="text-navy-dark">{item.label}</span>
                  <span className="font-semibold text-navy-dark">
                    {pricesVisible ? `${fmtUah(item.price)} ${t.perMeter}` : catalogT.findOutPrice}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <ContactCta
        title={t.ctaTitle}
        text={t.ctaText}
        nameLabel={c.formName}
        phoneLabel={c.formPhone}
        submitLabel={c.formSubmit}
        sentLabel={c.formSentMessage}
        phoneManualLabel={c.phoneManual}
        phoneChooseCountryLabel={c.phoneChooseCountry}
        phoneInvalidLabel={c.phoneInvalid}
        source="Фурнітура та аксесуари"
        sent={searchParams.sent === "1"}
      />
    </>
  );
}
