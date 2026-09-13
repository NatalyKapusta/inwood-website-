"use server";

import { redirect } from "next/navigation";
import { sendLeadToKeepinCRM } from "@/lib/sendLead";
import { sendCatalogToClient } from "@/lib/sendLeadEmail";
import { sendToMakeWebhook } from "@/lib/sendToMake";
import { isSpam } from "@/lib/isSpam";

const UTM_FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;

function getUtm(formData: FormData) {
  const utm: Record<string, string> = {};
  for (const key of UTM_FIELDS) utm[key] = String(formData.get(key) ?? "");
  return utm;
}

// Окремі дії (не спільний app/actions/lead.ts submitLead) — на цій сторінці
// дві незалежні форми (заявка на партнерство + каталог), і потрібно розрізняти
// в редіректі, яка саме форма відправлена, щоб показати правильне повідомлення.
export async function submitPartnerForm(formData: FormData) {
  if (isSpam(formData)) {
    redirect(`/partnership?sent=partner-${Date.now()}#form-section`);
  }

  const name = String(formData.get("name") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const city = String(formData.get("city") ?? "");
  const role = String(formData.get("role") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const comment = [role ? `Варіант співпраці: ${role}` : "", message].filter(Boolean).join(". ");
  const utm = getUtm(formData);

  // CRM — як і раніше; Make (Google Таблиця СММ) — паралельно, окремим
  // потоком, який не впливає на основну відправку.
  await Promise.all([
    sendLeadToKeepinCRM({
      client: name,
      phone,
      misto: city,
      comment,
      source: "Партнерський лендинг — заявка",
    }),
    sendToMakeWebhook({
      date: new Date().toISOString(),
      form_type: "partner",
      name,
      phone,
      city,
      product: role,
      comment: message,
      ...utm,
    }),
  ]);

  // Унікальний хвіст у "sent" — інакше повторна відправка (закрили спливаюче
  // вікно й надіслали ще раз) веде на той самий URL, і React може не оновити
  // компонент вікна, бо перехід "нікуди не змінився".
  redirect(`/partnership?sent=partner-${Date.now()}#form-section`);
}

export async function submitCatalogForm(formData: FormData) {
  if (isSpam(formData)) {
    redirect(`/partnership?sent=catalog-${Date.now()}#catalog-section`);
  }

  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const utm = getUtm(formData);

  // Три незалежні відправки паралельно: нам — заявка (CRM), клієнту —
  // лист з каталогом, і паралельно в Make (Google Таблиця СММ). Одна не
  // залежить від іншої.
  await Promise.all([
    sendLeadToKeepinCRM({
      client: name,
      phone,
      email,
      comment: "Запит каталогу з партнерського лендингу",
      source: "Партнерський лендинг — каталог",
    }),
    email ? sendCatalogToClient(name, email) : Promise.resolve(false),
    sendToMakeWebhook({
      date: new Date().toISOString(),
      form_type: "catalog",
      name,
      phone,
      email,
      ...utm,
    }),
  ]);

  redirect(`/partnership?sent=catalog-${Date.now()}#catalog-section`);
}
