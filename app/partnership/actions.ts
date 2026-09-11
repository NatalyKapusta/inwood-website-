"use server";

import { redirect } from "next/navigation";
import { sendLeadToKeepinCRM } from "@/lib/sendLead";

// Окремі дії (не спільний app/actions/lead.ts submitLead) — на цій сторінці
// дві незалежні форми (заявка на партнерство + каталог), і потрібно розрізняти
// в редіректі, яка саме форма відправлена, щоб показати правильне повідомлення.
export async function submitPartnerForm(formData: FormData) {
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
  await sendLeadToKeepinCRM({
    client: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    comment: "Запит каталогу з партнерського лендингу",
    source: "Партнерський лендинг — каталог",
  });

  redirect(`/partnership?sent=catalog-${Date.now()}#catalog-section`);
}
