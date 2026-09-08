import type { Locale } from "@/lib/i18n";
import ContactCta from "@/components/ContactCta";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  return buildMetadata({
    locale: params.locale,
    path: "/servis",
    title: dict.servis.title,
    description: dict.servis.metaDescription,
  });
}

export default async function ServisPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const t = dict.servis;

  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-24">
        <h1 className="font-serif text-3xl font-bold text-navy-dark sm:text-4xl">{t.heading}</h1>
        <p className="mt-4 text-navy-dim">{t.intro}</p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.sections.map((s, i) => (
            <div key={s.title} className="rounded-xl bg-panel-alt p-6">
              <span className="font-serif text-2xl font-bold text-gold-dim">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-2 font-serif text-lg font-bold text-navy-dark">{s.title}</h2>
              <p className="mt-2 text-sm text-navy-dim">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <ContactCta
        title={t.ctaTitle}
        text={t.ctaText}
        nameLabel={dict.common.formName}
        phoneLabel={dict.common.formPhone}
        submitLabel={dict.common.formSubmit}
      />
    </>
  );
}
