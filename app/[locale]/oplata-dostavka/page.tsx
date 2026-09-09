import type { Locale } from "@/lib/i18n";
import ContactCta from "@/components/ContactCta";
import Tabs from "@/components/Tabs";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  return buildMetadata({
    locale: params.locale,
    path: "/oplata-dostavka",
    title: dict.oplataDostavka.title,
    description: dict.oplataDostavka.metaDescription,
  });
}

export default async function OplataDostavkaPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { sent?: string };
}) {
  const dict = await getDictionary(params.locale);
  const t = dict.oplataDostavka;
  const c = dict.common;

  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-24">
        <h1 className="font-serif text-3xl font-bold text-navy-dark sm:text-4xl">{t.heading}</h1>
        <p className="mt-4 text-navy-dim">{t.intro}</p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:pb-24">
        <Tabs
          tabs={[
            {
              id: "payment",
              label: t.tabs.payment,
              content: (
                <ol className="space-y-4">
                  {t.payment.map((step, i) => (
                    <li key={step} className="flex gap-4 rounded-lg bg-panel-alt p-4">
                      <span className="font-serif text-xl font-bold text-gold-dim">{i + 1}</span>
                      <p className="text-sm text-navy-dark">{step}</p>
                    </li>
                  ))}
                </ol>
              ),
            },
            {
              id: "delivery",
              label: t.tabs.delivery,
              content: (
                <div className="grid gap-4 sm:grid-cols-2">
                  {t.delivery.map((d) => (
                    <div key={d.title} className="rounded-lg bg-panel-alt p-4">
                      <h3 className="font-serif font-bold text-navy-dark">{d.title}</h3>
                      <p className="mt-2 text-sm text-navy-dim">{d.text}</p>
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </section>

      <ContactCta
        title={c.ctaTitle}
        text={c.ctaText}
        nameLabel={c.formName}
        phoneLabel={c.formPhone}
        submitLabel={c.formSubmit}
        phoneManualLabel={c.phoneManual}
        phoneChooseCountryLabel={c.phoneChooseCountry}
        phoneInvalidLabel={c.phoneInvalid}
      source="Оплата та доставка"
      sent={searchParams.sent === "1"}
      />
    </>
  );
}
