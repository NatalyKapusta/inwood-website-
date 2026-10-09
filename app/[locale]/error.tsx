"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";

// error.tsx (як і not-found.tsx) ОБОВ'ЯЗКОВО Client Component — вимога
// Next.js, бо йому треба reset() у браузері. params теж не передаються
// пропсом, тому локаль так само береться через useParams().
const TEXT: Record<Locale, { heading: string; text: string; retry: string }> = {
  ua: { heading: "Щось пішло не так", text: "Спробуйте оновити сторінку або зателефонуйте нам.", retry: "Спробувати ще раз" },
  ru: { heading: "Что-то пошло не так", text: "Попробуйте обновить страницу или позвоните нам.", retry: "Попробовать снова" },
  en: { heading: "Something went wrong", text: "Try reloading the page, or give us a call.", retry: "Try again" },
  pl: { heading: "Coś poszło nie tak", text: "Spróbuj odświeżyć stronę albo do nas zadzwoń.", retry: "Spróbuj ponownie" },
};

export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const params = useParams();
  const locale = (typeof params.locale === "string" ? params.locale : "ua") as Locale;
  const t = TEXT[locale] ?? TEXT.ua;

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-serif text-2xl font-bold text-navy-dark">{t.heading}</h1>
      <p className="mt-3 text-navy-dim">{t.text}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-navy-dark px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gold hover:text-navy-dark"
        >
          {t.retry}
        </button>
      </div>
      <a href="tel:+380508803841" className="mt-6 block text-sm text-navy-dim hover:text-gold-dim">
        +380 50 880 38 41
      </a>
    </section>
  );
}
