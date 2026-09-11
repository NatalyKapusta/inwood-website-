import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import ContactCta from "@/components/ContactCta";

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const t = dict.derzhZaklady;
  return buildMetadata({
    locale: params.locale,
    path: "/derzhavnym-zakladam",
    title: t.pageTitle,
    description: t.metaDescription,
  });
}

export default async function DerzhZakladyPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { sent?: string };
}) {
  const dict = await getDictionary(params.locale);
  const t = dict.derzhZaklady;
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
                { name: t.heading, path: "/derzhavnym-zakladam" },
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

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-24">
        <h2 className="font-serif text-2xl font-bold text-navy-dark sm:text-3xl">{t.tenderTitle}</h2>
        <p className="mt-4 text-navy-dim">{t.tenderText}</p>
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
        source="Державні та медичні заклади"
        sent={searchParams.sent === "1"}
        extraFields={[
          { placeholder: s.formEmail, type: "email", name: "email" },
          { placeholder: s.formMessage },
        ]}
      />
    </>
  );
}
