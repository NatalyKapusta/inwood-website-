import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import ContactCta from "@/components/ContactCta";

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const t = dict.export;
  return buildMetadata({
    locale: params.locale,
    path: "/export",
    title: t.pageTitle,
    description: t.metaDescription,
  });
}

export default async function ExportPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { sent?: string };
}) {
  const dict = await getDictionary(params.locale);
  const t = dict.export;
  const s = dict.spivpratsya;
  const c = dict.common;

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
                { name: t.heading, path: "/export" },
              ],
              params.locale
            )
          ),
        }}
      />

      <section className="bg-navy-dark py-16 text-center text-white sm:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <Link
            href={`/${params.locale}/spivpratsya`}
            className="inline-flex items-center gap-1 rounded-full border border-white/30 px-4 py-1.5 text-xs font-semibold text-white/80 transition hover:border-gold hover:text-gold"
          >
            {t.backLink}
          </Link>
          <h1 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">{t.heading}</h1>
          <p className="mt-4 text-white/85">{t.intro}</p>
        </div>
      </section>

      <section className="bg-panel-alt py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-serif text-2xl font-bold text-navy-dark sm:text-3xl">
            {t.countriesTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-dim">{t.countriesText}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {t.countries.map((country) => (
              <div
                key={country.name}
                className="flex min-w-[140px] flex-col items-center gap-2 rounded-xl bg-panel px-6 py-5 shadow-sm"
              >
                <span className="text-4xl" aria-hidden="true">
                  {country.flag}
                </span>
                <span className="font-semibold text-navy-dark">{country.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-24">
        <h2 className="font-serif text-2xl font-bold text-navy-dark sm:text-3xl">{t.openTitle}</h2>
        <p className="mt-4 text-navy-dim">{t.openText}</p>
      </section>

      <section className="bg-panel-alt py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center font-serif text-2xl font-bold text-navy-dark sm:text-3xl">
            {t.whyTitle}
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.reasons.map((r, i) => (
              <div key={r.title} className="rounded-xl bg-panel p-6">
                <span className="font-serif text-2xl font-bold text-gold-dim">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-serif text-lg font-bold text-navy-dark">{r.title}</h3>
                <p className="mt-2 text-sm text-navy-dim">{r.text}</p>
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
        sentLabel={c.formSentMessage}
        phoneManualLabel={c.phoneManual}
        phoneChooseCountryLabel={c.phoneChooseCountry}
        phoneInvalidLabel={c.phoneInvalid}
        source="Експорт"
        sent={searchParams.sent === "1"}
        extraFields={[
          { placeholder: s.formEmail, type: "email", name: "email" },
          { placeholder: s.formMessage },
        ]}
      />
    </>
  );
}
