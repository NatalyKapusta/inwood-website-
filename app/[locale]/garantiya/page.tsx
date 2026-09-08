import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import ContactCta from "@/components/ContactCta";

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  return { title: dict.garantiya.title };
}

export default async function GarantiyaPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const t = dict.garantiya;

  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-24">
        <h1 className="font-serif text-3xl font-bold text-navy-dark sm:text-4xl">{t.heading}</h1>
        <p className="mt-4 text-navy-dim">{t.intro}</p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:pb-24">
        <div className="grid gap-6 sm:grid-cols-2">
          {t.sections.map((s) => (
            <div key={s.title} className="rounded-xl bg-panel-alt p-6">
              <h2 className="font-serif text-lg font-bold text-navy-dark">{s.title}</h2>
              <p className="mt-2 text-sm text-navy-dim">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="font-serif text-lg font-bold text-navy-dark">{t.procedureTitle}</h2>
            <p className="mt-2 text-sm text-navy-dim">{t.procedureIntro}</p>
            <ul className="mt-2 space-y-1 text-sm text-navy-dim">
              {t.procedure.map((p) => (
                <li key={p}>— {p}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-navy-dark">{t.exclusionsTitle}</h2>
            <p className="mt-2 text-sm text-navy-dim">{t.exclusionsIntro}</p>
            <ul className="mt-2 space-y-1 text-sm text-navy-dim">
              {t.exclusions.map((e) => (
                <li key={e}>— {e}</li>
              ))}
            </ul>
          </div>
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
