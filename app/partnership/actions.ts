"use server";

import { redirect } from "next/navigation";
import { sendLeadToKeepinCRM } from "@/lib/sendLead";
import { sendCatalogToClient } from "@/lib/sendLeadEmail";
import { isSpam } from "@/lib/isSpam";

// Окремі дії (не спільний app/actions/lead.ts submitLead) — на цій сторінці
// дві незалежні форми (заявка на партнерство + каталог), і потрібно розрізняти
// в редіректі, яка саме форма відправлена, щоб показати правильне повідомлення.
export async function submitPartnerForm(formData: FormData) {
  if (isSpam(formData)) {
    redirect(`/partnership?sent=partner-${Date.now()}#form-section`);
  }

  const role = String(formData.get("role") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const comment = [role ? `Варіант співпраці: ${role}` : "", message].filter(Boolean).join(". ");

  await sendLeadToKeepinCRM({
    client: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    misto: String(formData.get("city") ?? ""),
    comment,
    source: "Партнерський лендинг — заявка",
  });

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

  // Дві незалежні відправки паралельно: нам — заявка (CRM + пошта, як і
  // раніше), клієнту — окремий лист з каталогом. Одна не залежить від іншої.
  await Promise.all([
    sendLeadToKeepinCRM({
      client: name,
      phone: String(formData.get("phone") ?? ""),
      email,
      comment: "Запит каталогу з партнерського лендингу",
      source: "Партнерський лендинг — каталог",
    }),
    email ? sendCatalogToClient(name, email) : Promise.resolve(false),
  ]);

  redirect(`/partnership?sent=catalog-${Date.now()}#catalog-section`);
}
