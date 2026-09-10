import type { ReactNode } from "react";
import Script from "next/script";
import "@/app/globals.css";

// Окрема (поза [locale]) рекламна лендинг-сторінка для партнерської програми —
// без шапки/футера/нав публічного сайту, як і /portal. Не в navigation, не в
// sitemap.xml; middleware.ts додатково позначає її noindex для хоста
// partnership.inwood.com.ua. Тут же лишається FB Pixel зі старої Netlify-версії
// (реклама йде з Meta, піксель потрібен для оптимізації кампанії) — той самий
// ID, що й був на partnership.inwood.com.ua раніше.
const FB_PIXEL_ID = "3180845672111598";
const GA_MEASUREMENT_ID = "G-R75X510R1Z";

export const metadata = {
  title: "Стати партнером IN WOOD — виробник міжкімнатних дверей у Полтаві",
  description:
    "IN WOOD — виробник міжкімнатних дверей із 20-річним досвідом. Власне виробництво в Полтаві, каталог продукції, калькулятор цін та підтримка менеджера з першого дня співпраці.",
  robots: { index: false, follow: false },
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
