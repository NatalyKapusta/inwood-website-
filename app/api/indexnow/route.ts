import type { NextRequest } from "next/server";
import { SITE_URL } from "@/lib/seo";
import sitemap from "@/app/sitemap";

// Ключ верифікації лежить у public/a82eef18c778dbb7b3c3875a1bad881d.txt
// (вимога протоколу IndexNow — файл {key}.txt має бути доступний на хості).
const INDEXNOW_KEY = "a82eef18c778dbb7b3c3875a1bad881d";

// Сповіщає Bing/Yandex та інших учасників IndexNow про всі URL з sitemap —
// замість очікування, поки пошуковик сам прийде сканувати. Викликати вручну
// після значних оновлень контенту (GET /api/indexnow?token=...).
//
// Захищено секретом з env — без нього будь-хто міг дьоргати цей маршрут
// скільки завгодно разів, і IndexNow міг почати ігнорувати наш ключ
// (SEO-аудит Vercel, 09.10.2026, пункт 5.2). Поки INDEXNOW_TRIGGER_SECRET
// не заданий у Vercel — маршрут відмовляє всім запитам (fail closed).
export async function GET(request: NextRequest) {
  const secret = process.env.INDEXNOW_TRIGGER_SECRET;
  const token = request.nextUrl.searchParams.get("token");
  if (!secret || token !== secret) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const entries = sitemap();
  const urlList = entries.map((e) => e.url);
  const host = new URL(SITE_URL).host;

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  });

  return Response.json({
    submittedUrls: urlList.length,
    indexNowStatus: res.status,
    ok: res.ok,
  });
}
