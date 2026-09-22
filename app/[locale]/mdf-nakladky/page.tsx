import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata, breadcrumbJsonLd, faqPageJsonLd } from "@/lib/seo";
import ContactCta from "@/components/ContactCta";
import Breadcrumbs from "@/components/Breadcrumbs";

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const t = dict.mdfNakladky;
  return buildMetadata({
    locale: params.locale,
    path: "/mdf-nakladky",
    title: t.pageTitle,
    description: t.metaDescription,
  });
}

export default async function MdfNakladkyPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { sent?: string };
}) {
  const dict = await getDictionary(params.locale);
  const t = dict.mdfNakladky;
  const c = dict.common;
  const breadcrumbItems = [
    { name: c.breadcrumbHome, path: "" },
    { name: t.heading, path: "/mdf-nakladky" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems, params.locale)),
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(t.faq)) }}
      />
      <Breadcrumbs items={breadcrumbItems} locale={params.locale} />

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
              {t.segmentsTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-navy-dim">{t.segmentsText}</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {t.segments.map((s, i) => (
              <div key={s.title} className="rounded-xl bg-panel p-6">
                <span className="font-serif text-2xl font-bold text-gold-dim">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-serif text-lg font-bold text-navy-dark">{s.title}</h3>
                <p className="mt-2 text-sm text-navy-dim">{s.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-navy-dim">
              {t.moreSegmentsTitle}
            </p>
            <div className="mx-auto mt-6 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {t.moreSegments.map((s) => (
                <div key={s.title} className="rounded-xl bg-panel p-5 text-left">
                  <h3 className="font-serif text-base font-bold text-navy-dark">{s.title}</h3>
                  <p className="mt-2 text-sm text-navy-dim">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-24">
        <h2 className="font-serif text-2xl font-bold text-navy-dark sm:text-3xl">{t.offerTitle}</h2>
        <p className="mt-4 text-navy-dim">{t.offerText}</p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:pb-24">
        <h2 className="text-center font-serif text-2xl font-bold text-navy-dark sm:text-3xl">
          {t.faqTitle}
        </h2>
        <div className="mt-8 divide-y divide-navy-dim/10 overflow-hidden rounded-xl bg-panel shadow-sm">
          {t.faq.map((item) => (
            <details key={item.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-base font-bold text-navy-dark marker:content-none">
                {item.q}
                <span className="shrink-0 text-xl text-gold-dim transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-navy-dim">{item.a}</p>
            </details>
          ))}
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
        source="МДФ-накладки"
        sent={searchParams.sent === "1"}
        extraFields={[
          { placeholder: t.formSizes },
          { placeholder: t.formQuantity, type: "number" },
          { placeholder: t.formCoating },
        ]}
      />
    </>
  );
}
