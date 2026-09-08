import type { Locale } from "@/lib/i18n";
import ua from "@/dictionaries/ua.json";

export const metadata = { title: ua.kontakty.title };

export default function KontaktyPage({ params }: { params: { locale: Locale } }) {
  const t = ua.kontakty;
  const c = ua.common;

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <h1 className="text-center font-serif text-3xl font-bold text-navy-dark sm:text-4xl">
        {t.heading}
      </h1>

      <div className="mt-12 grid gap-10 sm:grid-cols-2">
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-gold-dim">Адреса</p>
            <p className="mt-1 text-navy-dark">{c.address}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gold-dim">{t.managerLabel}</p>
            <a href={`tel:${c.phone.replace(/[^\d+]/g, "")}`} className="mt-1 block text-navy-dark hover:text-gold-dim">
              {c.phone}
            </a>
            <a href={`mailto:${c.email}`} className="text-navy-dark hover:text-gold-dim">
              {c.email}
            </a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gold-dim">
              {t.exportManagerLabel}
            </p>
            <a
              href={`tel:${c.exportPhone.replace(/[^\d+]/g, "")}`}
              className="mt-1 block text-navy-dark hover:text-gold-dim"
            >
              {c.exportPhone}
            </a>
            <a href={`mailto:${c.exportEmail}`} className="text-navy-dark hover:text-gold-dim">
              {c.exportEmail}
            </a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gold-dim">Режим роботи</p>
            <p className="mt-1 text-navy-dark">{c.hours}</p>
          </div>
        </div>

        <div className="rounded-xl bg-panel-alt p-6">
          <h2 className="font-serif text-lg font-bold text-navy-dark">{t.formTitle}</h2>
          <p className="mt-1 text-sm text-navy-dim">{t.formText}</p>
          <form className="mt-6 flex flex-col gap-3">
            <input
              type="text"
              placeholder={c.formName}
              required
              className="rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 outline-none focus:border-gold"
            />
            <input
              type="tel"
              placeholder={c.formPhone}
              required
              className="rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 outline-none focus:border-gold"
            />
            <input
              type="email"
              placeholder="Пошта"
              className="rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 outline-none focus:border-gold"
            />
            <textarea
              placeholder="Повідомлення"
              rows={4}
              className="rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 outline-none focus:border-gold"
            />
            <button
              type="submit"
              className="rounded-full bg-navy-dark px-7 py-3 font-semibold text-white transition hover:bg-gold hover:text-navy-dark"
            >
              {c.formSubmit}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
