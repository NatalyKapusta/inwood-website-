import { NextResponse, type NextRequest } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { createClient } from "@/lib/supabase/server";
import { canSeePriceLists } from "@/lib/portalRole";

// Дилерський/роздрібний прайс, довідник співробітників і шаблон офлайн-
// калькулятора раніше лежали у public/ — посилання на них є тільки в
// закритому /portal, але самі файли роздавались будь-кому, хто знав адресу
// (SEO-аудит Vercel, 09.10.2026, розділ 5: дилерські ціни були доступні без
// входу). Тепер файли лежать у private-documents/ (поза public/, Next сам
// його нікому не роздає) і йдуть лише через цей маршрут — з перевіркою
// сесії й ролі, так само як решта /portal.
const DOCS: Record<string, { file: string; access: "any" | "priceLists" | "owner" }> = {
  "prays-dilerska": { file: "prays-dilerska.html", access: "priceLists" },
  "prays-rozdrib": { file: "prays-rozdrib.html", access: "priceLists" },
  "dovidnyk-spivrobitnykiv": { file: "dovidnyk-spivrobitnykiv.html", access: "any" },
  "dovidnyk-spivrobitnykiv-en": { file: "dovidnyk-spivrobitnykiv-en.html", access: "any" },
  "offline-calculator-template": { file: "offline-calculator-template.html", access: "owner" },
};

export async function GET(request: NextRequest, { params }: { params: { name: string } }) {
  const doc = DOCS[params.name];
  if (!doc) return new NextResponse("Not found", { status: 404 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/portal/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (doc.access !== "any") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_owner")
      .eq("id", user.id)
      .single();
    const isOwner = profile?.is_owner ?? false;
    const allowed = doc.access === "owner" ? isOwner : canSeePriceLists(isOwner, profile?.role);
    if (!allowed) return new NextResponse("Forbidden", { status: 403 });
  }

  const filePath = path.join(process.cwd(), "private-documents", doc.file);
  const html = await readFile(filePath, "utf8");

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "private, no-store",
    },
  });
}
