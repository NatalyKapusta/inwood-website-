import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { HARDWARE_BRAND_LABELS, HARDWARE_BRAND_ORDER, hardwareCategoryLabels } from "@/lib/quote";
import { HARDWARE_CATEGORY_ORDER, getPublicHardware, getPublicPlintus, getPublicNakladka } from "@/lib/publicShop";
import { getPricesVisible } from "@/lib/siteSettings";
import ContactCta from "@/components/ContactCta";
import AddToCartButton from "@/components/AddToCartButton";
import FurnituraHardware from "@/components/FurnituraHardware";

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

  const [hardwareItems, plintusItems, nakladkaItems, pricesVisible] = await Promise.all([
    getPublicHardware(),
    getPublicPlintus(),
    getPublicNakladka(),
    getPricesVisible(params.locale),
  ]);

  const hasAnything = hardwareItems.length > 0 || plintusItems.length > 0 || nakladkaItems.length > 0;

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

        {hardwareItems.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-navy-dark">{t.hardwareTitle}</h2>
            <div className="mt-8">
              <FurnituraHardware
                items={hardwareItems}
                brandLabels={HARDWARE_BRAND_LABELS}
                brandOrder={HARDWARE_BRAND_ORDER}
                categoryLabels={hardwareCategoryLabels}
                categoryOrder={HARDWARE_CATEGORY_ORDER}
                allLabel={catalogT.all}
                noPhotoLabel={t.noPhoto}
                addToCartLabel={c.addToCart}
                addedToCartLabel={c.addedToCart}
              />
            </div>
          </section>
        )}

        {nakladkaItems.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-navy-dark">{t.nakladkaTitle}</h2>
            <ul className="mt-6 divide-y divide-navy-dim/10 rounded-xl border border-navy-dim/10 bg-panel">
              {nakladkaItems.map((item) => (
                <li key={item.code} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                  <div>
                    <span className="text-navy-dark">{item.label}</span>
                    <p className="mt-0.5 text-xs text-navy-dim">
                      {pricesVisible ? fmtUah(item.price) : catalogT.findOutPrice}
                    </p>
                  </div>
                  <AddToCartButton
                    id={`nakladka-${item.code}`}
                    label={`${t.nakladkaTitle}: ${item.label}`}
                    price={pricesVisible ? item.price : null}
                    addLabel={c.addToCart}
                    addedLabel={c.addedToCart}
                  />
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
                  <div>
                    <span className="text-navy-dark">{item.label}</span>
                    <p className="mt-0.5 text-xs text-navy-dim">
                      {pricesVisible ? `${fmtUah(item.price)} ${t.perMeter}` : catalogT.findOutPrice}
                    </p>
                  </div>
                  <AddToCartButton
                    id={`plintus-${item.code}`}
                    label={`${t.plintusTitle}: ${item.label} (${t.perMeter})`}
                    price={pricesVisible ? item.price : null}
                    addLabel={c.addToCart}
                    addedLabel={c.addedToCart}
                  />
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
