"use client";

import { useState } from "react";
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
  portalLabel,
}: {
  locale: Locale;
  phone: string;
  address: string;
  email: string;
  nav: NavItem[];
  portalLabel: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-panel shadow-[0_4px_20px_-8px_rgba(51,57,88,0.25)]">
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
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden hover:text-gold sm:inline"
            >
              {address}
            </a>
            <a href={`mailto:${email}`} className="hover:text-gold">
              {email}
            </a>
          </div>
        </div>
      </div>

      {/* Навігація */}
      <div className="bg-navy-dark text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href={`/${locale}`} className="flex shrink-0 items-center">
            <Image
              src="/logo/inwood-logo-gold.svg"
              alt="IN WOOD"
              width={110}
              height={75}
              priority
            />
          </Link>

          <nav className="hidden flex-wrap items-center justify-end gap-x-6 gap-y-2 text-sm uppercase tracking-wide lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="text-white/85 hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/portal/login"
              className="rounded-full border border-gold px-4 py-1.5 text-xs font-semibold normal-case tracking-normal text-gold transition hover:bg-gold hover:text-navy-dark"
            >
              {portalLabel}
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Меню"
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white lg:hidden"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4l12 12M16 4L4 16" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        {menuOpen && (
          <nav className="flex flex-col gap-1 border-t border-white/10 px-4 py-4 text-sm uppercase tracking-wide lg:hidden">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-2 py-2 text-white/85 hover:bg-white/5 hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/portal/login"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-lg border border-gold px-2 py-2 text-center normal-case tracking-normal text-gold hover:bg-white/5"
            >
              {portalLabel}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
