import type { ReactNode } from "react";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { assertLocale, locales, localeHtmlLang, type Locale } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import { organizationJsonLd } from "@/lib/seo";
import { playfairDisplay, manrope } from "@/lib/fonts";
import KeepinCrmA11yPatch from "@/components/KeepinCrmA11yPatch";
import DeferredChatWidget from "@/components/DeferredChatWidget";
import StickyCallButton from "@/components/StickyCallButton";
import ClickTracking from "@/components/ClickTracking";
import "@/app/globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const GA_MEASUREMENT_ID = "G-R75X510R1Z";

async function getCommonDict(locale: Locale) {
  // Усі 4 локалі перекладені повністю — catch тут лише на випадок
  // пошкодженого/відсутнього файлу словника, а не недоперекладу.
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
  // Робить так само, як home/blog вже роблять поштучно: notFound() тут
  // закриває ВСІ сторінки під [locale] одним місцем, для тих 22 з 25
  // сторінок, які самі нічого не індексують по locale (catalog, kontakty,
  // faq тощо) — досі віддавали 200 на будь-якій мові-смітті (SEO-аудит
  // Vercel, 09.10.2026, пункт 2). Виклики в home/blog/[slug] НЕ прибираю:
  // ті сторінки рендеряться паралельно з layout і без власної перевірки
  // знову падають у 500 (перевірено build-тестом раніше в цій сесії).
  const locale = assertLocale(params.locale);
  const common = await getCommonDict(locale);

  return (
    <html lang={localeHtmlLang[locale]} className={`${playfairDisplay.variable} ${manrope.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(locale)) }}
        />
        <CartProvider>
          <Header
            locale={locale}
            phone={common.phone}
            address={common.address}
            email={common.email}
            nav={common.nav}
            portalLabel={common.portalLink}
            menuLabel={common.menuLabel}
            cartLabels={{
              title: common.cartTitle,
              empty: common.cartEmpty,
              total: common.cartTotal,
              findOutPrice: common.cartFindOutPrice,
              remove: common.cartRemove,
              sendInquiry: common.cartSendInquiry,
              close: common.cartClose,
              formSentMessage: common.formSentMessage,
              formName: common.formName,
              formPhone: common.formPhone,
              phoneManual: common.phoneManual,
              phoneChooseCountry: common.phoneChooseCountry,
              phoneInvalid: common.phoneInvalid,
              sendFailedRetry: common.sendFailedRetry,
            }}
          />
          <main className="pb-14 sm:pb-0">{children}</main>
        </CartProvider>
        <Footer
          locale={locale}
          tagline={common.footerTagline}
          nav={common.nav}
          phone={common.phone}
          exportPhone={common.exportPhone}
          email={common.email}
          exportEmail={common.exportEmail}
          address={common.address}
          hours={common.hours}
          mailLabel={common.footerMailLabel}
          phoneLabel={common.footerPhoneLabel}
          addressLabel={common.footerAddressLabel}
          hoursLabel={common.hoursLabel}
        />
        <DeferredChatWidget />
        <StickyCallButton phone={common.phone} />
        <ClickTracking />
        {/* lazyOnload — стартує тільки після події load, тож не конкурує з
            LCP-відмальовкою h1 на головній (LCP-ТЗ 27.09.2026, Правка 2).
            Компроміс: візити коротші за секунду можуть не потрапити в GA4.
            Якщо точність аналітики важливіша — повернути на afterInteractive. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="lazyOnload"
        />
        <Script id="ga4-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <KeepinCrmA11yPatch />
        <SpeedInsights />
      </body>
    </html>
  );
}
