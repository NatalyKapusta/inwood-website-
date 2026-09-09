import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { locales } from "@/lib/i18n";
import { RECRUIT_CITIES, findRecruitCity, getRecruitCityDisplayName } from "@/lib/recruitCities";
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
  const t = dict.dealerRecruit;
  const cityName = getRecruitCityDisplayName(found, params.locale);
  return buildMetadata({
    locale: params.locale,
    path: `/staty-dylerom/${params.city}`,
    title: `${t.titlePrefix} ${cityName}: ${t.titleSuffix}`,
    description: `${t.metaPrefix} ${cityName}. ${t.metaSuffix}`,
  });
}

export default async function DealerRecruitCityPage({
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
  const t = dict.dealerRecruit;
  const s = dict.spivpratsya;
  const c = dict.common;
  const cityName = getRecruitCityDisplayName(found, params.locale);

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
                { name: s.heading, path: "/spivpratsya" },
                { name: cityName, path: `/staty-dylerom/${params.city}` },
              ],
              params.locale
            )
          ),
        }}
      />

      <section className="bg-navy-dark py-16 text-center text-white sm:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <Link href={`/${params.locale}/spivpratsya`} className="text-sm text-white/60 hover:text-gold">
            {t.backLink}
          </Link>
          <h1 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">
            {t.heading} — {cityName}
          </h1>
          <p className="mt-4 text-white/85">{t.intro}</p>
        </div>
      </section>

      <section className="bg-panel-alt py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-navy-dark sm:text-3xl">
              {s.toolsTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-navy-dim">{s.toolsText}</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {s.tools.map((tool, i) => (
              <div key={tool.title} className="rounded-xl bg-panel p-6">
                <span className="font-serif text-2xl font-bold text-gold-dim">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-serif text-lg font-bold text-navy-dark">{tool.title}</h3>
                <p className="mt-2 text-sm text-navy-dim">{tool.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-dark py-16 text-white sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center font-serif text-2xl font-bold sm:text-3xl">
            {s.stepsTitle}
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {s.steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 font-serif text-lg font-bold text-gold">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-serif text-base font-bold">{step.title}</h3>
                <p className="mt-2 text-sm text-white/75">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactCta
        title={t.ctaTitle}
        text={t.ctaText}
        nameLabel={c.formName}
        phoneLabel={c.formPhone}
        submitLabel={c.formSubmit}
        phoneManualLabel={c.phoneManual}
        phoneChooseCountryLabel={c.phoneChooseCountry}
        phoneInvalidLabel={c.phoneInvalid}
        source={`Шукаємо дилера — ${found.city}`}
        sent={searchParams.sent === "1"}
        extraFields={[
          { placeholder: s.formRole, options: s.formRoleOptions },
          { placeholder: s.formEmail, type: "email", name: "email" },
          { placeholder: s.formMessage },
        ]}
      />
    </>
  );
}
