"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { sendLeadToKeepinCRM } from "@/lib/sendLead";

export async function submitLead(formData: FormData) {
  const extraComments: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("comment_") && String(value).trim()) {
      extraComments.push(`${key.slice("comment_".length)}: ${value}`);
    }
  }
  const baseComment = String(formData.get("comment") ?? "").trim();
  const comment = [baseComment, ...extraComments].filter(Boolean).join(". ");

  await sendLeadToKeepinCRM({
    client: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    misto: String(formData.get("misto") ?? ""),
    comment,
    source: String(formData.get("source") ?? "з сайту"),
  });

  const referer = (await headers()).get("referer") ?? "/";
  const url = new URL(referer);
  url.searchParams.set("sent", "1");
  redirect(url.pathname + url.search);
}
