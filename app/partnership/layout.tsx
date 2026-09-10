import type { ReactNode } from "react";
import Script from "next/script";
import "@/app/globals.css";
import { SITE_URL } from "@/lib/seo";

// Окрема (поза [locale]) сторінка для партнерської програми — без шапки/футера/нав
// публічного сайту, як і /portal. Не в navigation, але (на відміну від /portal)
// індексується Google — має рости в органічному пошуку, а не лише приймати платну
// рекламу. Доступна з двох URL: https://inwood.com.ua/partnership (канонічний,
// індексується) і https://partnership.inwood.com.ua (рекламний піддомен — той
// самий контент через rewrite в middleware.ts, яке саме для цього хоста додає
// заголовок X-Robots-Tag: noindex, щоб не створювати дубль у пошуку).
// FB Pixel лишається зі старої Netlify-версії (реклама йде з Meta, піксель
// потрібен для оптимізації кампанії) — той самий ID, що й був там раніше.
const FB_PIXEL_ID = "3180845672111598";
const GA_MEASUREMENT_ID = "G-R75X510R1Z";
const PAGE_URL = `${SITE_URL}/partnership`;
const TITLE = "Стати партнером IN WOOD — виробник міжкімнатних дверей у Полтаві";
const DESCRIPTION =
  "IN WOOD — виробник міжкімнатних дверей із 20-річним досвідом. Власне виробництво в Полтаві, каталог продукції, калькулятор цін та підтримка менеджера з першого дня співпраці.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "IN WOOD",
    locale: "uk_UA",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_URL}/og-image.jpg`],
  },
};

export default function PartnershipLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
