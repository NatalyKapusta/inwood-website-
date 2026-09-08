import type { Locale } from "@/lib/i18n";
import ContactCta from "@/components/ContactCta";
import ua from "@/dictionaries/ua.json";

export const metadata = { title: ua.garantiya.title };

export default function GarantiyaPage({ params }: { params: { locale: Locale } }) {
  const t = ua.garantiya;

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
        nameLabel={ua.common.formName}
        phoneLabel={ua.common.formPhone}
        submitLabel={ua.common.formSubmit}
      />
    </>
  );
}
