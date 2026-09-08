import type { Locale } from "@/lib/i18n";
import ContactCta from "@/components/ContactCta";
import ua from "@/dictionaries/ua.json";

export const metadata = { title: ua.harakterystyky.title };

export default function CharacteristicsPage({ params }: { params: { locale: Locale } }) {
  const t = ua.harakterystyky;
  const c = ua.common;

  return (
    <>
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-24">
        <h1 className="font-serif text-3xl font-bold text-navy-dark sm:text-4xl">{t.heading}</h1>
        <p className="mt-4 text-navy-dim">{t.subheading}</p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:pb-24">
        <div className="grid gap-6 sm:grid-cols-2">
          {t.lines.map((line) => (
            <div key={line.name} className="rounded-xl bg-panel-alt p-6">
              <h2 className="font-serif text-xl font-bold text-gold-dim">{line.name}</h2>
              <ul className="mt-4 space-y-2 text-sm text-navy-dark">
                {line.params.map((p) => (
                  <li key={p}>— {p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <ContactCta
        title={t.ctaTitle}
        text={t.ctaText}
        nameLabel={c.formName}
        phoneLabel={c.formPhone}
        submitLabel={c.formSubmit}
      />
    </>
  );
}
