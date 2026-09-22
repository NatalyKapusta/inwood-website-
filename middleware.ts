import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { locales, defaultLocale } from "./lib/i18n";
import { resolveLegacyRedirect } from "./lib/legacyRedirects";
import { SITE_URL } from "./lib/seo";

function getLocaleFromPath(pathname: string) {
  return locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
}

// Проста сторінка-заглушка для заблокованих відвідувачів — без React/
// дерева сторінок, миттєво з middleware, до будь-якої іншої логіки.
const BLOCKED_HTML = `<!DOCTYPE html>
<html lang="uk"><head><meta charset="utf-8" />
<title>IN WOOD</title>
<meta name="robots" content="noindex, nofollow" />
<style>body{font-family:Arial,sans-serif;background:#333958;color:#fff;display:flex;
align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px;
text-align:center}p{max-width:32em;line-height:1.5}</style></head>
<body><p>Доступ до сайту з цього регіону обмежено.<br />
Access to this site is restricted from this region.</p></body></html>`;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Пропускаємо статичні файли та службові маршрути Next.js
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // ТИМЧАСОВО ВИМКНЕНО (Наталія перевіряє, чи саме блок Росії пов'язаний
  // зі зниженням трафіку) — щоб повернути, розкоментувати блок нижче.
  //
  // Блокуємо відвідувачів з росії за геолокацією IP. Це не стовідсотковий
  // захист (VPN обходить), але відсікає пряме відвідування. Якщо хостинг
  // не віддає geo (локальна розробка, деякі середовища) — request.geo
  // буде undefined, і ми нікого не блокуємо (fail open, а не fail closed).
  // if (request.geo?.country === "RU") {
  //   return new NextResponse(BLOCKED_HTML, {
  //     status: 403,
  //     headers: { "Content-Type": "text/html; charset=utf-8" },
  //   });
  // }

  // Рекламний піддомен partnership.inwood.com.ua лили платним трафіком по
  // дилерству; рекламу зняли, а сама сторінка /partnership дублювала
  // /spivpratsya майже дослівно — тому піддомен більше не рендерить
  // окрему сторінку, а веде на основний сайт.
  const hostname = request.headers.get("host") ?? "";
  if (hostname.startsWith("partnership.")) {
    return NextResponse.redirect(new URL("/ua/spivpratsya", SITE_URL), 301);
  }

  // Редіректи зі старого сайту inwood.com.ua — перевіряємо ПЕРШИМ, до
  // загального правила локалі нижче, інакше воно переплутає старий слаг
  // з новим (напр. /kontakti стало б /ua/kontakti, якого не існує,
  // замість правильного /ua/kontakty).
  const legacyTarget = resolveLegacyRedirect(pathname);
  if (legacyTarget) {
    const [newPathname, hash] = legacyTarget.split("#");
    const url = request.nextUrl.clone();
    url.pathname = newPathname;
    url.hash = hash ?? "";
    return NextResponse.redirect(url, 301);
  }

  // Закритий B2B-портал — без мовного префікса, живе поза [locale]
  const isPortalRoute = pathname === "/portal" || pathname.startsWith("/portal/");

  // Немає мовного префікса — редірект на дефолтну локаль (ua).
  // 308 (постійний) — не 307 (тимчасовий, дефолт NextResponse.redirect) —
  // інакше Google не консолідує сигнали на /ua і продовжує вважати
  // канонічною сторінкою корінь домену "/" (саме це й було в Search Console:
  // "Google вибрала іншу канонічну сторінку" для https://inwood.com.ua/ua).
  if (!isPortalRoute && !getLocaleFromPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url, 308);
  }

  // Оновлюємо сесію Supabase (потрібно для закритого порталу /portal) —
  // без цього логін "злітав" би після закриття вкладки.
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Захищаємо портал: без сесії пускаємо лише на сторінку логіну і на
  // відновлення пароля — ці дві сторінки саме для того й існують, щоб
  // ними могла скористатись людина БЕЗ активної сесії (інакше сторінка
  // "Забули пароль" миттєво перекидала б назад на логін, а посилання зі
  // "скидання пароля" з листа — на set-password з токеном у хеші URL —
  // взагалі не встигало б обмінятись на сесію до цього редіректу).
  const isPublicPortalRoute =
    pathname === "/portal/login" ||
    pathname === "/portal/forgot-password" ||
    pathname === "/portal/set-password";
  if (isPortalRoute && !isPublicPortalRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/portal/login";
    return NextResponse.redirect(url);
  }

  // Залогінений — з логіну одразу в портал
  if (pathname === "/portal/login" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/portal";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
