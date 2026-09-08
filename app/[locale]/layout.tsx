import type { ReactNode } from "react";
import { locales, type Locale } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/app/globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

async function getCommonDict(locale: Locale) {
  // Поки перекладено лише UA — RU/EN дублюють UA-текст до перекладу.
  try {
    const dict = await import(`@/dictionaries/${locale}.json`);
    return dict.default.common;
  } catch {
    const dict = await import("@/dictionaries/ua.json");
    return dict.default.common;
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: Locale };
}) {
  const common = await getCommonDict(params.locale);

  return (
    <html lang={params.locale}>
      <body>
        <Header
          locale={params.locale}
          phone={common.phone}
          address={common.address}
          email={common.email}
          nav={common.nav}
        />
        <main>{children}</main>
        <Footer
          locale={params.locale}
          tagline={common.footerTagline}
          nav={common.nav}
          phone={common.phone}
          exportPhone={common.exportPhone}
          email={common.email}
          exportEmail={common.exportEmail}
          address={common.address}
          hours={common.hours}
        />
      </body>
    </html>
  );
}
