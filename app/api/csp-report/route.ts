import { NextResponse, type NextRequest } from "next/server";

// Content-Security-Policy-Report-Only (next.config.mjs) шле сюди кожне
// порушення політики, яке зафіксував браузер відвідувача. Тиждень збираємо
// лог (Vercel → Logs → фільтр "csp-report"), доповнюємо політику реальними
// джерелами, і лише тоді вмикаємо блокуючий Content-Security-Policy
// (SEO-аудит Vercel, 09.10.2026, пункт 1).
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const report = JSON.parse(body);
    console.warn("[csp-report]", JSON.stringify(report));
  } catch {
    // Браузери іноді шлють порожнє чи нечитабельне тіло — просто ігноруємо.
  }
  return new NextResponse(null, { status: 204 });
}
