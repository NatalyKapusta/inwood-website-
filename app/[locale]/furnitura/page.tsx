import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { HARDWARE_BRAND_LABELS, HARDWARE_BRAND_ORDER, hardwareCategoryLabels } from "@/lib/quote";
import { HARDWARE_CATEGORY_ORDER, getPublicHardware } from "@/lib/publicShop";
import ContactCta from "@/components/ContactCta";
import FurnituraHardware from "@/components/FurnituraHardware";

// Дані фурнітури живуть у Supabase (не в products.json).
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

  const hardwareItems = await getPublicHardware();

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

        {hardwareItems.length === 0 ? (
          <p className="mx-auto mt-16 max-w-md text-center text-navy-dim">{t.comingSoon}</p>
        ) : (
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
