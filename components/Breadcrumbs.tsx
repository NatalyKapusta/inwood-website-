import Link from "next/link";
import type { Locale } from "@/lib/i18n";

type Crumb = { name: string; path: string };

// Той самий масив, що йде в breadcrumbJsonLd() — тут лише візуальний
// рендер для користувача й додаткового текстового сигналу для Google
// (JSON-LD сам по собі не показує ссилки в видимій частині сторінки).
export default function Breadcrumbs({ items, locale }: { items: Crumb[]; locale: Locale }) {
  if (items.length < 2) return null;

  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-4 pt-5">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-navy-dim">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">/</span>}
              {isLast ? (
                <span className="text-navy-dark" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={`/${locale}${item.path}`}
                  className="hover:text-gold-dim hover:underline hover:decoration-dotted hover:underline-offset-4"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
