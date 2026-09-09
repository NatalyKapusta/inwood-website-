import { NextRequest, NextResponse } from "next/server";
import { sendLeadToKeepinCRM } from "@/lib/sendLead";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.client || !body?.phone) {
    return NextResponse.json({ ok: false, error: "Вкажіть ім'я та телефон" }, { status: 400 });
  }

  const ok = await sendLeadToKeepinCRM({
    client: String(body.client),
    phone: String(body.phone),
    email: body.email ? String(body.email) : undefined,
    misto: body.misto ? String(body.misto) : undefined,
    comment: body.comment ? String(body.comment) : undefined,
    source: body.source ? String(body.source) : "з сайту",
  });

  return NextResponse.json({ ok });
}
