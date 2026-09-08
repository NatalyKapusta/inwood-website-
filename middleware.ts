import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { locales, defaultLocale } from "./lib/i18n";

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

  // Захищаємо портал: без сесії пускаємо лише на сторінку логіну
  if (isPortalRoute && pathname !== "/portal/login" && !user) {
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
