import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { COLLECTION_PAGE_SLUGS } from "@/lib/collectionPages";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShowroomMap from "@/components/ShowroomMap";
import ContactCta from "@/components/ContactCta";

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const t = dict.poltava;
  return buildMetadata({
    locale: params.locale,
    path: "/mizhkimnatni-dveri-poltava",
    title: t.title,
    description: t.metaDescription,
  });
}

export default async function PoltavaPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { sent?: string };
}) {
  const dict = await getDictionary(params.locale);
  const t = dict.poltava;
  const cp = dict.collectionPages;
  const c = dict.common;
  const breadcrumbItems = [
    { name: c.breadcrumbHome, path: "" },
    { name: t.breadcrumbName, path: "/mizhkimnatni-dveri-poltava" },
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
      <Breadcrumbs items={breadcrumbItems} locale={params.locale} />

      <section className="bg-navy-dark py-16 text-center text-white sm:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-serif text-3xl font-bold sm:text-4xl">{t.h1}</h1>
          <p className="mt-4 text-white/85">{t.intro}</p>
        </div>
      </section>

      <section className="bg-panel-alt py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-center font-serif text-lg font-bold text-navy-dark">{t.reasonsLead}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {t.reasons.map((r) => (
              <div key={r.title} className="rounded-xl bg-panel p-6">
                <h2 className="font-serif text-base font-bold text-navy-dark">{r.title}</h2>
                <p className="mt-2 text-sm text-navy-dim">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold text-navy-dark sm:text-3xl">
            {t.whatWeMakeTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-navy-dim">{t.whatWeMakeIntro}</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {COLLECTION_PAGE_SLUGS.map((slug) => (
            <Link
              key={slug}
              href={`/${params.locale}/catalog/${slug}`}
              className="rounded-xl bg-panel-alt p-5 transition hover:shadow-md"
            >
              <h3 className="font-serif text-base font-bold text-gold-dim">
                {cp.items[slug].breadcrumbName}
              </h3>
              <p className="mt-1 text-sm text-navy-dim">{t.collectionBlurbs[slug]}</p>
            </Link>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-navy-dim">{t.factoryNote}</p>
      </section>

      <section className="bg-panel-alt py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-2xl font-bold text-navy-dark sm:text-3xl">{t.sizesTitle}</h2>
          <p className="mt-4 text-navy-dim">{t.sizesText}</p>
          <p className="mt-2 text-navy-dim">{t.sizesExtra}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <h2 className="text-center font-serif text-2xl font-bold text-navy-dark sm:text-3xl">
          {t.orderTitle}
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.orderSteps.map((step, i) => (
            <div key={step} className="text-center">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-navy-dark font-serif text-lg font-bold text-gold">
                {i + 1}
              </span>
              <p className="mt-3 text-sm text-navy-dim">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-panel-alt py-16 sm:py-24">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy-dark sm:text-3xl">{t.visitTitle}</h2>
            <p className="mt-4 text-navy-dark">{c.address}</p>
            <a href={`tel:${c.phone.replace(/[^+\d]/g, "")}`} className="mt-1 block text-navy-dark hover:text-gold-dim">
              {c.phone}
            </a>
            <a href={`mailto:${c.email}`} className="mt-1 block text-navy-dark hover:text-gold-dim">
              {c.email}
            </a>
            <p className="mt-4 text-xs uppercase tracking-wide text-gold-dim">{c.hoursLabel}</p>
            <p className="mt-1 text-navy-dark">{c.hours}</p>
            <Link
              href={`/${params.locale}/nashi-dileri`}
              className="mt-6 inline-block text-sm text-navy-dim underline decoration-dotted underline-offset-4 hover:text-gold-dim"
            >
              {t.dealersLinkText}
            </Link>
          </div>
          <ShowroomMap address={c.address} getDirectionsLabel={c.getDirections} />
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
        source="Двері Полтава"
        sent={searchParams.sent === "1"}
      />
    </>
  );
}
