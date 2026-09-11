import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata } from "@/lib/seo";
import ContactCta from "@/components/ContactCta";
import RelatedLinks from "@/components/RelatedLinks";

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  return buildMetadata({
    locale: params.locale,
    path: "/pro-nas",
    title: dict.proNas.title,
    description: dict.proNas.metaDescription,
  });
}

export default async function ProNasPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { sent?: string };
}) {
  const dict = await getDictionary(params.locale);
  const t = dict.proNas;
  const c = dict.common;

  return (
    <>
      <section className="bg-navy-dark py-16 text-center text-white sm:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-serif text-3xl font-bold sm:text-4xl">{t.heading}</h1>
          <p className="mt-4 text-lg text-gold">{t.intro}</p>
          <p className="mt-4 text-white/85">{t.lead}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-24">
        <p className="text-navy-dim">{t.text}</p>

        <div className="mt-10 grid gap-3 text-left sm:grid-cols-2">
          {t.points.map((p) => (
            <div key={p} className="flex items-start gap-2 rounded-lg bg-panel-alt p-4">
              <span className="text-gold-dim">✔</span>
              <span className="text-sm text-navy-dark">{p}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-panel-alt py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 grid gap-12 sm:grid-cols-2">
          <div>
            <h2 className="font-serif text-xl font-bold text-navy-dark">{t.principlesTitle}</h2>
            <ul className="mt-4 space-y-2 text-sm text-navy-dim">
              {t.principles.map((p) => (
                <li key={p}>— {p}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-navy-dark">{t.valuesTitle}</h2>
            <ul className="mt-4 space-y-2 text-sm text-navy-dim">
              {t.values.map((v) => (
                <li key={v}>— {v}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <RelatedLinks
        locale={params.locale}
        title={c.relatedTitle}
        links={c.nav.filter((n) =>
          ["/galereya", "/harakterystyky", "/nashi-dileri"].includes(n.href)
        )}
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
      source="Про нас"
      sent={searchParams.sent === "1"}
      />
    </>
  );
}
