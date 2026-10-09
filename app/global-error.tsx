"use client";

import { useEffect } from "react";

// global-error.tsx ловить збої в самому кореневому layout — рендериться
// ЗАМІСТЬ усього дерева (включно з app/[locale]/layout.tsx), тому, як і
// app/not-found.tsx, має власні <html>/<body> й не може покладатись на
// Tailwind-класи сайту (той рендер міг якраз і впасти).
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {}, []);

  return (
    <html lang="uk">
      <head>
        <meta charSet="utf-8" />
        <title>IN WOOD</title>
      </head>
      <body
        style={{
          fontFamily: "Arial, sans-serif",
          background: "#1b2240",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          margin: 0,
          padding: 24,
          textAlign: "center",
        }}
      >
        <div>
          <p style={{ maxWidth: "32em", lineHeight: 1.5 }}>
            Щось пішло не так. Спробуйте оновити сторінку або зателефонуйте нам: +380 50 880 38 41
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 16,
              borderRadius: 999,
              border: "none",
              background: "#cda052",
              color: "#1b2240",
              fontWeight: 600,
              padding: "10px 24px",
              cursor: "pointer",
            }}
          >
            Спробувати ще раз
          </button>
        </div>
      </body>
    </html>
  );
}
