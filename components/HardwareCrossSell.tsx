import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { HardwareCategory } from "@/lib/quote";
import { getPublicHardware } from "@/lib/publicShop";
import { selectCrossSellItems } from "@/lib/hardwareCrossSell";
import HardwareCrossSellCards from "@/components/HardwareCrossSellCards";

// Серверний компонент: дані фурнітури читаються публічним клієнтом (без
// cookies()/headers()), тож сторінки колекцій, на яких стоїть цей блок,
// лишаються статичними/ISR (revalidate = 60, як на /furnitura).
export default async function HardwareCrossSell({
  locale,
  heading,
  intro,
  cardLabels,
  linkLabel,
  noPhotoLabel,
  addToCartLabel,
  addedToCartLabel,
}: {
  locale: Locale;
  heading: string;
  intro: string;
  cardLabels: Partial<Record<HardwareCategory, string>>;
  linkLabel: string;
  noPhotoLabel: string;
  addToCartLabel: string;
  addedToCartLabel: string;
}) {
  const hardware = await getPublicHardware();
  const items = selectCrossSellItems(hardware);
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center">
        <h2 className="font-serif text-2xl font-bold text-navy-dark">{heading}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-navy-dim">{intro}</p>
      </div>
      <div className="mt-8">
        <HardwareCrossSellCards
          items={items}
          cardLabels={cardLabels}
          noPhotoLabel={noPhotoLabel}
          addToCartLabel={addToCartLabel}
          addedToCartLabel={addedToCartLabel}
        />
      </div>
      <div className="mt-8 text-center">
        <Link href={`/${locale}/furnitura`} className="text-sm font-semibold text-gold-dim hover:text-navy-dark">
          {linkLabel}
        </Link>
      </div>
    </section>
  );
}
