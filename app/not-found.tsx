// Для адрес ПОЗА [locale] (боти на кшталт /wp-login.php з невалідним
// "locale"-сегментом тепер ловляться саме тут, через dynamicParams = false
// у app/[locale]/layout.tsx — той layout для таких запитів взагалі не
// рендериться, тому Header/Footer і Tailwind-класи сайту тут недоступні).
// Кореневий app/layout.tsx навмисно "прозорий" (без <html>/<body> — ті
// задаються лише в app/[locale]/layout.tsx), тож цій сторінці потрібні
// власні — звичайний inline-styled HTML, без залежності від build-пайплайну.
export default function RootNotFound() {
  return (
    <html lang="uk">
      <head>
        <meta charSet="utf-8" />
        <title>IN WOOD</title>
        <meta name="robots" content="noindex, nofollow" />
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
          <p style={{ fontSize: 48, fontWeight: 700, color: "#cda052", margin: 0 }}>404</p>
          <p style={{ maxWidth: "32em", lineHeight: 1.5 }}>Сторінку не знайдено.</p>
          <a href="/ua" style={{ color: "#cda052" }}>
            inwood.com.ua
          </a>
        </div>
      </body>
    </html>
  );
}
