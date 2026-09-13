// Дублюємо заявку в Make.com (сценарій СММ пересилає рядок у Google
// Таблицю) — паралельно з основною відправкою в KeepinCRM, а не замість
// неї. MAKE_WEBHOOK_URL з'являється в Vercel, коли власниця отримає
// Webhook URL зі свого сценарію в Make; поки змінної нема — просто
// нічого не відправляємо, нічого не ламаємо.
const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL;

export async function sendToMakeWebhook(payload: Record<string, string>) {
  if (!MAKE_WEBHOOK_URL) {
    console.error("[sendToMakeWebhook] MAKE_WEBHOOK_URL не задано — заявка в Make не відправлена");
    return false;
  }
  try {
    const res = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error(`[sendToMakeWebhook] Make повернув помилку: ${res.status} ${res.statusText}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[sendToMakeWebhook] Помилка відправки в Make:", err);
    return false;
  }
}
