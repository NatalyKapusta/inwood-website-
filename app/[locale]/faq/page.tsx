import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata, faqPageJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import ContactCta from "@/components/ContactCta";
import RelatedLinks from "@/components/RelatedLinks";

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  return buildMetadata({
    locale: params.locale,
    path: "/faq",
    title: dict.faq.title,
    description: dict.faq.metaDescription,
  });
}

export default async function FaqPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { sent?: string };
}) {
  const dict = await getDictionary(params.locale);
  const t = dict.faq;
  const c = dict.common;

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(t.items)) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(
              [
                { name: c.breadcrumbHome, path: "" },
                { name: t.heading, path: "/faq" },
              ],
              params.locale
            )
          ),
        }}
      />
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-24">
        <h1 className="font-serif text-3xl font-bold text-navy-dark sm:text-4xl">{t.heading}</h1>
        <p className="mt-4 text-navy-dim">{t.intro}</p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:pb-24">
        <div className="divide-y divide-navy-dim/10 overflow-hidden rounded-xl bg-panel shadow-sm">
          {t.items.map((item) => (
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

      <RelatedLinks
        locale={params.locale}
        title={c.relatedTitle}
        links={c.nav.filter((n) => ["/garantiya", "/servis", "/oplata-dostavka"].includes(n.href))}
      />

      <ContactCta
        title={c.ctaTitle}
        text={c.ctaText}
        nameLabel={c.formName}
        phoneLabel={c.formPhone}
        submitLabel={c.formSubmit}
        sentLabel={c.formSentMessage}
        phoneManualLabel={c.phoneManual}
        phoneChooseCountryLabel={c.phoneChooseCountry}
        phoneInvalidLabel={c.phoneInvalid}
        source="Питання та відповіді"
        sent={searchParams.sent === "1"}
      />
    </>
  );
}
