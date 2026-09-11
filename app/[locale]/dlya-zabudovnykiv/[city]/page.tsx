import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { locales } from "@/lib/i18n";
import {
  RECRUIT_CITIES,
  findRecruitCity,
  getRecruitCityDisplayName,
  getRecruitCityInPhrase,
} from "@/lib/recruitCities";
import ContactCta from "@/components/ContactCta";

export function generateStaticParams() {
  return locales.flatMap((locale) => RECRUIT_CITIES.map((c) => ({ locale, city: c.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; city: string };
}) {
  const found = findRecruitCity(params.city);
  if (!found) return {};
  const dict = await getDictionary(params.locale);
  const t = dict.dlyaZabudovnykiv;
  const cityName = getRecruitCityDisplayName(found, params.locale);
  const inCityPhrase = getRecruitCityInPhrase(found, params.locale);
  return buildMetadata({
    locale: params.locale,
    path: `/dlya-zabudovnykiv/${params.city}`,
    title: `${t.cityTitlePrefix} ${cityName}: ${t.cityTitleSuffix}`,
    description: `${t.cityMetaPrefix} ${inCityPhrase}. ${t.cityMetaSuffix}`,
  });
}

export default async function DlyaZabudovnykivCityPage({
  params,
  searchParams,
}: {
  params: { locale: Locale; city: string };
  searchParams: { sent?: string };
}) {
  const found = findRecruitCity(params.city);
  if (!found) {
    return null;
  }
  const dict = await getDictionary(params.locale);
  const t = dict.dlyaZabudovnykiv;
  const s = dict.spivpratsya;
  const c = dict.common;
  const cityName = getRecruitCityDisplayName(found, params.locale);
  const inCityPhrase = getRecruitCityInPhrase(found, params.locale);

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
                { name: t.heading, path: "/dlya-zabudovnykiv" },
                { name: cityName, path: `/dlya-zabudovnykiv/${params.city}` },
              ],
              params.locale
            )
          ),
        }}
      />

      <section className="bg-navy-dark py-16 text-center text-white sm:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <Link href={`/${params.locale}/dlya-zabudovnykiv`} className="text-sm text-white/60 underline decoration-dotted underline-offset-4 hover:text-gold">
            {t.cityBackLink}
          </Link>
          <h1 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">
            {t.cityTitlePrefix} {cityName}
          </h1>
          <p className="mt-4 text-white/85">{t.cityIntro}</p>
        </div>
      </section>

      <section className="bg-panel-alt py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-navy-dark sm:text-3xl">
              {t.benefitsTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-navy-dim">{t.benefitsText}</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.benefits.map((b, i) => (
              <div key={b.title} className="rounded-xl bg-panel p-6">
                <span className="font-serif text-2xl font-bold text-gold-dim">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-serif text-lg font-bold text-navy-dark">{b.title}</h3>
                <p className="mt-2 text-sm text-navy-dim">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactCta
        title={`${t.cityCtaTitlePrefix} ${inCityPhrase}${t.cityCtaTitleSuffix}`}
        text={t.cityCtaText}
        nameLabel={c.formName}
        phoneLabel={c.formPhone}
        submitLabel={c.formSubmit}
        sentLabel={c.formSentMessage}
        phoneManualLabel={c.phoneManual}
        phoneChooseCountryLabel={c.phoneChooseCountry}
        phoneInvalidLabel={c.phoneInvalid}
        source={`Забудовники — ${found.city}`}
        sent={searchParams.sent === "1"}
        extraFields={[
          { placeholder: s.formEmail, type: "email", name: "email" },
          { placeholder: s.formMessage },
        ]}
      />
    </>
  );
}
