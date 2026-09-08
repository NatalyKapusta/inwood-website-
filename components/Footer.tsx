import Link from "next/link";
import type { Locale } from "@/lib/i18n";

type NavItem = { label: string; href: string };

export default function Footer({
  locale,
  tagline,
  nav,
  phone,
  exportPhone,
  email,
  exportEmail,
  address,
  hours,
}: {
  locale: Locale;
  tagline: string;
  nav: NavItem[];
  phone: string;
  exportPhone: string;
  email: string;
  exportEmail: string;
  address: string;
  hours: string;
}) {
  return (
    <footer className="bg-navy-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <p className="font-serif text-2xl font-bold text-gold">{tagline}</p>

        <nav className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
          {nav.map((item) => (
            <Link key={item.href} href={`/${locale}${item.href}`} className="hover:text-gold">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-10 grid gap-8 text-sm text-white/80 sm:grid-cols-3">
          <div>
            <p className="mb-2 font-semibold uppercase tracking-wide text-gold">Пошта</p>
            <p>{email}</p>
            <p className="mt-1">International Sales Manager {exportEmail}</p>
          </div>
          <div>
            <p className="mb-2 font-semibold uppercase tracking-wide text-gold">Телефон</p>
            <p>{phone}</p>
            <p className="mt-1">International Sales Manager {exportPhone}</p>
          </div>
          <div>
            <p className="mb-2 font-semibold uppercase tracking-wide text-gold">Адреса</p>
            <p>{address}</p>
            <p className="mt-3 mb-2 font-semibold uppercase tracking-wide text-gold">
              Режим роботи
            </p>
            <p>{hours}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
