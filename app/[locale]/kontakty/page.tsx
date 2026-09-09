import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata } from "@/lib/seo";
import PhoneInput from "@/components/PhoneInput";
import SocialLinks from "@/components/SocialLinks";
import { submitLead } from "@/app/actions/lead";

const FEATURE_ICONS = [
  // Консультація та підтримка
  <svg key="chat" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>,
  // Індивідуальний підхід
  <svg key="handshake" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 12l3 3 6-6" />
    <circle cx="12" cy="12" r="9" />
  </svg>,
  // Співпраця по всьому світу
  <svg key="globe" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
  </svg>,
  // Швидкі відповіді
  <svg key="clock" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" strokeLinecap="round" />
  </svg>,
];

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  return buildMetadata({
    locale: params.locale,
    path: "/kontakty",
    title: dict.kontakty.title,
    description: dict.kontakty.metaDescription,
  });
}

export default async function KontaktyPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { sent?: string };
}) {
  const dict = await getDictionary(params.locale);
  const t = dict.kontakty;
  const c = dict.common;
  const sent = searchParams.sent === "1";

  return (
    <>
      <section className="bg-navy-dark text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h1 className="font-serif text-3xl font-bold leading-tight sm:text-4xl">
              {t.heroTitle}
            </h1>
            <p className="mt-4 max-w-lg text-white/80">{t.heroText}</p>
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {t.heroFeatures.map((label: string, i: number) => (
                <div key={label} className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold">
                    {FEATURE_ICONS[i]}
                  </span>
                  <span className="text-xs text-white/85">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl lg:aspect-auto lg:h-full lg:max-w-none">
            <Image
              src="/photos/interiors/frezzatti-fz-02-dub-portovyi.jpg"
              alt={t.heroTitle}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <h2 className="text-center font-serif text-3xl font-bold text-navy-dark sm:text-4xl">
        {t.heading}
      </h2>

      <div className="mt-12 grid gap-10 sm:grid-cols-2">
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-gold-dim">Адреса</p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(c.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-navy-dark hover:text-gold-dim"
            >
              {c.address}
            </a>
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
          <SocialLinks tone="light" />
        </div>

        <div className="rounded-xl bg-panel-alt p-6">
          <h2 className="font-serif text-lg font-bold text-navy-dark">{t.formTitle}</h2>
          <p className="mt-1 text-sm text-navy-dim">{t.formText}</p>
          {sent ? (
            <p className="mt-6 rounded-lg bg-panel px-4 py-3 text-navy-dark">
              Дякуємо! Заявку надіслано, ми скоро з вами зв&apos;яжемось.
            </p>
          ) : (
            <form action={submitLead} className="mt-6 flex flex-col gap-3">
              <input type="hidden" name="source" value="Контакти" />
              <input
                type="text"
                name="name"
                placeholder={c.formName}
                required
                className="rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 outline-none focus:border-gold"
              />
              <PhoneInput
                placeholder={c.formPhone}
                required
                className="w-full rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 outline-none focus:border-gold"
              />
              <input
                type="email"
                name="email"
                placeholder="Пошта"
                className="rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 outline-none focus:border-gold"
              />
              <textarea
                name="comment"
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
          )}
        </div>
      </div>
    </section>
    </>
  );
}
