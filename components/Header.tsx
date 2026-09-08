import Image from "next/image";
import Link from "next/link";
import { locales, localeLabels, type Locale } from "@/lib/i18n";

type NavItem = { label: string; href: string };

export default function Header({
  locale,
  phone,
  address,
  email,
  nav,
}: {
  locale: Locale;
  phone: string;
  address: string;
  email: string;
  nav: NavItem[];
}) {
  return (
    <header className="sticky top-0 z-50 bg-panel">
      {/* Верхня контактна панель */}
      <div className="bg-navy text-white text-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2">
          <div className="flex items-center gap-2">
            {locales.map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                className={
                  l === locale
                    ? "font-bold text-gold"
                    : "text-white/70 hover:text-gold"
                }
              >
                {localeLabels[l]}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-white/90">
            <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="hover:text-gold">
              {phone}
            </a>
            <span className="hidden sm:inline">{address}</span>
            <a href={`mailto:${email}`} className="hover:text-gold">
              {email}
            </a>
          </div>
        </div>
      </div>

      {/* Навігація */}
      <div className="bg-navy-dark text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-4">
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src="/logo/inwood-logo-gold.svg"
              alt="IN WOOD"
              width={110}
              height={75}
              priority
            />
          </Link>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm uppercase tracking-wide">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="text-white/85 hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
