"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";

// not-found.tsx не отримує params пропсом (обмеження Next.js) — тому локаль
// береться через useParams() на клієнті. Коротке самодостатнє повідомлення
// на 4 мовах, без залежності від dictionaries/ (ті вантажаться асинхронно
// на сервері, тут це було б зайвим ускладненням заради сторінки-заглушки).
const TEXT: Record<Locale, { heading: string; text: string; catalog: string; home: string }> = {
  ua: {
    heading: "Сторінку не знайдено",
    text: "Можливо, посилання застаріло або адресу набрано з помилкою.",
    catalog: "Перейти в каталог",
    home: "На головну",
  },
  ru: {
    heading: "Страница не найдена",
    text: "Возможно, ссылка устарела или адрес набран с ошибкой.",
    catalog: "Перейти в каталог",
    home: "На главную",
  },
  en: {
    heading: "Page not found",
    text: "The link may be outdated, or the address was mistyped.",
    catalog: "Browse the catalog",
    home: "Go to homepage",
  },
  pl: {
    heading: "Nie znaleziono strony",
    text: "Link mógł się zdezaktualizować albo adres zawiera błąd.",
    catalog: "Przejdź do katalogu",
    home: "Strona główna",
  },
};

export default function LocaleNotFound() {
  const params = useParams();
  const locale = (typeof params.locale === "string" ? params.locale : "ua") as Locale;
  const t = TEXT[locale] ?? TEXT.ua;

  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-serif text-6xl font-bold text-gold-dim">404</p>
      <h1 className="mt-4 font-serif text-2xl font-bold text-navy-dark">{t.heading}</h1>
      <p className="mt-3 text-navy-dim">{t.text}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={`/${locale}/catalog`}
          className="rounded-full bg-navy-dark px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gold hover:text-navy-dark"
        >
          {t.catalog}
        </Link>
        <Link
          href={`/${locale}`}
          className="rounded-full border border-navy-dim/30 px-6 py-2.5 text-sm font-semibold text-navy-dark transition hover:border-gold hover:text-gold-dim"
        >
          {t.home}
        </Link>
      </div>
      <a href="tel:+380508803841" className="mt-6 block text-sm text-navy-dim hover:text-gold-dim">
        +380 50 880 38 41
      </a>
    </section>
  );
}
