const URL_PATTERN = /https?:\/\/|www\./i;

// Поля з вільним текстом, куди боти зазвичай вставляють посилання —
// справжні клієнти виробника дверей практично ніколи не пишуть посилання
// в коментарі до заявки.
const FREE_TEXT_FIELDS = ["comment", "message"];

// Заявка вважається спамом, якщо:
// 1) заповнене приховане поле-пастка (components/Honeypot.tsx) — справжня
//    людина його ніколи не бачить і не може заповнити;
// 2) або в текстовому полі коментаря є посилання — типовий патерн
//    спам-ботів, що просувають сторонні сайти через форми зворотного зв'язку.
export function isSpam(formData: FormData): boolean {
  if (String(formData.get("company_url") ?? "").trim().length > 0) return true;

  for (const [key, value] of formData.entries()) {
    const isFreeTextField = FREE_TEXT_FIELDS.includes(key) || key.startsWith("comment_");
    if (isFreeTextField && URL_PATTERN.test(String(value))) return true;
  }

  return false;
}
