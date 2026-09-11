// Заявка вважається спамом, якщо заповнене приховане поле-пастка
// (components/Honeypot.tsx) — справжня людина його ніколи не бачить і не
// може заповнити, тому непорожнє значення видає автоматичного бота.
export function isSpam(formData: FormData): boolean {
  return String(formData.get("company_url") ?? "").trim().length > 0;
}
