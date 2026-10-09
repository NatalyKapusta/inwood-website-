import { NextRequest, NextResponse } from "next/server";
import { isValidPhoneNumber } from "libphonenumber-js";
import { sendLeadToKeepinCRM } from "@/lib/sendLead";

// Той самий патерн, що й lib/isSpam.ts для форм на server actions — тут
// окремо, бо ця форма (кошик) шле JSON через fetch, а не FormData.
const URL_PATTERN = /https?:\/\/|www\./i;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.client || !body?.phone) {
    return NextResponse.json({ ok: false, error: "Вкажіть ім'я та телефон" }, { status: 400 });
  }

  // Прихована пастка для ботів (components/Honeypot-подібне поле в
  // CartDrawer) — відповідаємо "успіхом", щоб не видавати, що бота
  // розпізнали, так само як isSpam.ts робить для інших форм сайту.
  if (String(body.company_url ?? "").trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const client = String(body.client).slice(0, 100);
  const phone = String(body.phone);
  const comment = body.comment ? String(body.comment).slice(0, 2000) : undefined;

  if (URL_PATTERN.test(client) || (comment && URL_PATTERN.test(comment))) {
    return NextResponse.json({ ok: true });
  }

  if (!isValidPhoneNumber(phone)) {
    return NextResponse.json({ ok: false, error: "Невірний номер телефону" }, { status: 400 });
  }

  const ok = await sendLeadToKeepinCRM({
    client,
    phone,
    email: body.email ? String(body.email).slice(0, 200) : undefined,
    misto: body.misto ? String(body.misto).slice(0, 200) : undefined,
    comment,
    source: body.source ? String(body.source).slice(0, 200) : "з сайту",
  });

  return NextResponse.json({ ok });
}
