import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import dealers from "@/data/dealers.json";
import { getCitiesWithDealers, getCityDisplayName } from "@/lib/dealers";
import { locales } from "@/lib/i18n";

export function generateStaticParams() {
  const cities = getCitiesWithDealers(dealers);
  return locales.flatMap((locale) => cities.map((c) => ({ locale, city: c.slug })));
}

function findCity(slug: string) {
  return getCitiesWithDealers(dealers).find((c) => c.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; city: string };
}) {
  const found = findCity(params.city);
  if (!found) return {};
  const dict = await getDictionary(params.locale);
  const t = dict.nashiDileri;
  const cityName = getCityDisplayName(found.city, params.locale);
  return buildMetadata({
    locale: params.locale,
    path: `/nashi-dileri/${params.city}`,
    title: `${t.cityTitlePrefix} ${cityName}: ${t.cityTitleSuffix}`,
    description: `${t.cityMetaPrefix} ${cityName}. ${t.cityMetaSuffix}`,
  });
}

export default async function DealerCityPage({
  params,
}: {
  params: { locale: Locale; city: string };
}) {
  const found = findCity(params.city);
  if (!found) {
    return null;
  }
  const dict = await getDictionary(params.locale);
  const t = dict.nashiDileri;
  const c = dict.common;
  const cityName = getCityDisplayName(found.city, params.locale);

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
                { name: t.heading, path: "/nashi-dileri" },
                { name: cityName, path: `/nashi-dileri/${params.city}` },
              ],
              params.locale
            )
          ),
        }}
      />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <Link
          href={`/${params.locale}/nashi-dileri`}
          className="text-sm text-navy-dim hover:text-gold-dim"
        >
          {t.cityBackLink}
        </Link>

        <h1 className="mt-4 font-serif text-3xl font-bold text-navy-dark sm:text-4xl">
          {t.cityTitlePrefix} {cityName}: {t.cityTitleSuffix}
        </h1>
        <p className="mt-4 max-w-2xl text-navy-dim">{t.cityIntro}</p>

        <a
          href={`/${params.locale}/catalog`}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy-dark px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold hover:text-navy-dark"
        >
          {t.cityCatalogCta}
        </a>

        <h2 className="mt-12 font-serif text-xl font-bold text-navy-dark">
          {t.cityDealersHeading} ({found.dealers.length})
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {found.dealers.map((d, i) => (
            <div key={`${d.name}-${i}`} className="rounded-lg bg-panel-alt p-4">
              <p className="font-serif font-bold text-navy-dark">{d.name}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(d.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm text-navy-dim hover:text-gold-dim"
              >
                {d.address}
              </a>
              <div className="mt-2 flex flex-col gap-0.5 text-sm">
                {d.phones.map((phone, j) => (
                  <a key={phone} href={`tel:${d.phonesTel[j]}`} className="text-navy hover:text-gold-dim">
                    {phone}
                  </a>
                ))}
              </div>
              {d.sites && d.sites.length > 0 && (
                <a
                  href={d.sites[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-sm text-navy hover:text-gold-dim"
                >
                  {d.sitesLabel?.[0] ?? d.sites[0]}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
