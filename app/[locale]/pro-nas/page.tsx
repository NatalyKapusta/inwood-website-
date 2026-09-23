import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata } from "@/lib/seo";
import ContactCta from "@/components/ContactCta";
import RelatedLinks from "@/components/RelatedLinks";
import RichText from "@/components/RichText";

// Публічна сторінка з рідкісним оновленням даних — статична генерація
// з ISR раз на годину (замість повністю динамічного рендеру на кожен
// запит), щоб сторінка кешувалась на CDN Vercel.
export const revalidate = 3600;

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
}: {
  params: { locale: Locale };
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

      {t.sections && t.sections.length > 0 ? (
        <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
          <div className="space-y-10">
            {t.sections.map((s) => (
              <div key={s.heading}>
                <h2 className="font-serif text-xl font-bold text-navy-dark">{s.heading}</h2>
                <div className="mt-3">
                  <RichText paragraphs={s.body} locale={params.locale} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        // Переклад на ru/en/pl ще не готовий (задача 5 з ТЗ 23.09.2026, УА
        // підтверджується першою) — показуємо старий текстовий блок цих мов,
        // а не порожню секцію.
        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-24">
          <p className="text-navy-dim">{t.text}</p>
          <div className="mt-10 grid gap-3 text-left sm:grid-cols-2">
            {t.points?.map((p) => (
              <div key={p} className="flex items-start gap-2 rounded-lg bg-panel-alt p-4">
                <span className="text-gold-dim">✔</span>
                <span className="text-sm text-navy-dark">{p}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-panel-alt py-16 text-center sm:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-serif text-xl font-bold text-navy-dark">{t.certTitle}</h2>
          <p className="mt-4 text-navy-dim">{t.certText}</p>
          <ul className="mx-auto mt-6 max-w-md space-y-2 text-left text-sm text-navy-dark">
            {t.certDetails.map((d) => (
              <li key={d} className="flex items-start gap-2">
                <span className="text-gold-dim">✔</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
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
        title={dict.poltava.ctaTitle}
        text={dict.poltava.ctaText}
        nameLabel={c.formName}
        phoneLabel={c.formPhone}
        submitLabel={c.formSubmit}
        sentLabel={c.formSentMessage}
        phoneManualLabel={c.phoneManual}
        phoneChooseCountryLabel={c.phoneChooseCountry}
        phoneInvalidLabel={c.phoneInvalid}
      source="Про нас"
      />
    </>
  );
}
