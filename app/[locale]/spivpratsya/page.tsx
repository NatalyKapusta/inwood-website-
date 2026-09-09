import type { Locale } from "@/lib/i18n";
import Tabs from "@/components/Tabs";
import ContactCta from "@/components/ContactCta";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  return buildMetadata({
    locale: params.locale,
    path: "/spivpratsya",
    title: dict.spivpratsya.title,
    description: dict.spivpratsya.metaDescription,
  });
}

export default async function SpivpratsyaPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { sent?: string };
}) {
  const dict = await getDictionary(params.locale);
  const t = dict.spivpratsya;
  const c = dict.common;

  return (
    <>
      <section className="bg-navy-dark py-16 text-center text-white sm:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-serif text-3xl font-bold sm:text-4xl">{t.heading}</h1>
          <p className="mt-4 text-white/85">{t.intro}</p>
          <p className="mt-2 text-gold">{t.lead}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <Tabs
          tabs={[
            {
              id: "dealership",
              label: t.tabs.dealership,
              content: (
                <div className="grid gap-6 sm:grid-cols-2">
                  {t.dealership.map((d, i) => (
                    <div key={d.title} className="rounded-xl bg-panel-alt p-6">
                      <span className="font-serif text-2xl font-bold text-gold-dim">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-2 font-serif text-lg font-bold text-navy-dark">
                        {d.title}
                      </h3>
                      <p className="mt-2 text-sm text-navy-dim">{d.text}</p>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              id: "export",
              label: t.tabs.export,
              content: (
                <div className="mx-auto max-w-2xl text-center">
                  <p className="font-serif text-xl font-bold text-navy-dark">{t.exportIntro}</p>
                  <p className="mt-4 text-navy-dim">{t.exportText}</p>
                  <p className="mt-4 font-semibold text-navy-dark">{t.exportCountries}</p>
                </div>
              ),
            },
          ]}
        />
      </section>

      <ContactCta
        title={t.ctaTitle}
        text={t.ctaText}
        nameLabel={c.formName}
        phoneLabel={c.formPhone}
        submitLabel={c.formSubmit}
        source="Співпраця"
        sent={searchParams.sent === "1"}
        extraFields={[
          { placeholder: t.formEmail, type: "email", name: "email" },
          { placeholder: t.formCountry },
          { placeholder: t.formCity, name: "misto" },
          { placeholder: t.formMessage },
        ]}
      />
    </>
  );
}
