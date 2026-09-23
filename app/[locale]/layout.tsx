import type { ReactNode } from "react";
import Script from "next/script";
import { locales, localeHtmlLang, type Locale } from "@/lib/i18n";
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
    <html lang={localeHtmlLang[params.locale]} className={`${playfairDisplay.variable} ${manrope.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(params.locale)) }}
        />
        <CartProvider>
          <Header
            locale={params.locale}
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
          locale={params.locale}
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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <KeepinCrmA11yPatch />
      </body>
    </html>
  );
}
