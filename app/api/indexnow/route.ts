import { SITE_URL } from "@/lib/seo";
import sitemap from "@/app/sitemap";

// Ключ верифікації лежить у public/a82eef18c778dbb7b3c3875a1bad881d.txt
// (вимога протоколу IndexNow — файл {key}.txt має бути доступний на хості).
const INDEXNOW_KEY = "a82eef18c778dbb7b3c3875a1bad881d";

// Сповіщає Bing/Yandex та інших учасників IndexNow про всі URL з sitemap —
// замість очікування, поки пошуковик сам прийде сканувати. Викликати вручну
// після значних оновлень контенту (GET /api/indexnow).
export async function GET() {
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
