import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { locales, defaultLocale } from "./lib/i18n";
import { resolveLegacyRedirect } from "./lib/legacyRedirects";

function getLocaleFromPath(pathname: string) {
  return locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
}

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

  // Рекламний піддомен partnership.inwood.com.ua — на нього ллють платний
  // трафік по дилерству, але окремого лендингу під нього ще нема. Тимчасово
  // віддаємо звідти /ua/spivpratsya (rewrite, адреса в браузері лишається
  // partnership.inwood.com.ua) і ховаємо від індексації — щоб реклама не
  // впиралась у биту сторінку, поки не готовий фінальний дизайн. Замінити
  // на dedicated-сторінку, коли вона буде.
  const hostname = request.headers.get("host") ?? "";
  if (hostname.startsWith("partnership.")) {
    const url = request.nextUrl.clone();
    url.pathname = "/ua/spivpratsya";
    const rewritten = NextResponse.rewrite(url);
    rewritten.headers.set("X-Robots-Tag", "noindex, nofollow");
    return rewritten;
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

  // Немає мовного префікса — редірект на дефолтну локаль (ua)
  if (!isPortalRoute && !getLocaleFromPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
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
