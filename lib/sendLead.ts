export type LeadPayload = {
  client: string;
  phone: string;
  email?: string;
  misto?: string;
  comment?: string;
  source: string;
};

// Той самий вебхук KeepinCRM, що працював на старому сайті (Weblium) —
// приймає заявку одразу і в CRM, і на пошту менеджера.
export async function sendLeadToKeepinCRM(payload: LeadPayload) {
  const url = process.env.KEEPINCRM_WEBHOOK_URL;
  if (!url) {
    console.error("KEEPINCRM_WEBHOOK_URL не налаштовано");
    return false;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.error("Не вдалося надіслати заявку в KeepinCRM", err);
    return false;
  }
}
