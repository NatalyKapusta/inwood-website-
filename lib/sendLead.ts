export type LeadPayload = {
  client: string;
  phone: string;
  email?: string;
  misto?: string;
  comment?: string;
  source: string;
};

// KeepinCRM приймав номери у "локальному" українському форматі без "+" і
// пробілів (0508380217) ще з часів інтеграції на старому сайті (Weblium).
// PhoneInput тепер віддає міжнародний формат з "+" і пробілами
// (+380 50 838 0217) — новий вебхук KeepinCRM відповідає 422 саме на такий
// формат. Приводимо українські номери назад до перевіреного локального
// вигляду; номери інших країн лишаємо як є (міжнародний формат).
function normalizePhoneForKeepinCRM(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("380") && digits.length === 12) {
    return "0" + digits.slice(3);
  }
  return phone;
}

// Той самий вебхук KeepinCRM, що працював на старому сайті (Weblium) —
// приймає заявку одразу і в CRM, і на пошту менеджера.
export async function sendLeadToKeepinCRM(payload: LeadPayload) {
  const url = process.env.KEEPINCRM_WEBHOOK_URL;
  if (!url) {
    console.error("KEEPINCRM_WEBHOOK_URL не налаштовано");
    return false;
  }
  const normalized = { ...payload, phone: normalizePhoneForKeepinCRM(payload.phone) };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalized),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`KeepinCRM webhook відповів ${res.status}: ${body}`);
    }
    return res.ok;
  } catch (err) {
    console.error("Не вдалося надіслати заявку в KeepinCRM", err);
    return false;
  }
}
