import { Resend } from "resend";
import type { LeadPayload } from "./sendLead";
import { SITE_URL } from "./seo";

// Дублюємо кожну заявку на пошту напряму (Resend), незалежно від того, чи
// пройшла вона в KeepinCRM — вебхук виявився ненадійним, і поки з ним
// розбираємось, жодна заявка не має губитись. Отримувачі захардкожені
// (це не секрет), а доступ до Resend — через змінну середовища RESEND_API_KEY
// (ключ видає сам сервіс, це не пароль від поштової скриньки).
const RECIPIENTS = ["info@inwood.com.ua", "hodes.nv@gmail.com"];
const FROM = process.env.RESEND_FROM_EMAIL ?? "IN WOOD — сайт <site@inwood.com.ua>";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("Resend не налаштовано (RESEND_API_KEY)");
    return null;
  }
  return new Resend(key);
}

export async function sendLeadEmail(payload: LeadPayload) {
  const resend = getResend();
  if (!resend) return false;

  const rows: [string, string | undefined][] = [
    ["Ім'я", payload.client],
    ["Телефон", payload.phone],
    ["Email", payload.email],
    ["Місто", payload.misto],
    ["Коментар", payload.comment],
    ["Джерело", payload.source],
  ];
  const textLines = rows.filter(([, v]) => v).map(([label, v]) => `${label}: ${v}`);
  const htmlRows = rows
    .filter(([, v]) => v)
    .map(([label, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#8A90A6;">${label}</td><td>${v}</td></tr>`)
    .join("");

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: RECIPIENTS,
      subject: `Нова заявка з сайту — ${payload.source}`,
      text: textLines.join("\n"),
      html: `<table>${htmlRows}</table>`,
    });
    if (error) {
      console.error("Не вдалося надіслати заявку на пошту (Resend)", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Не вдалося надіслати заявку на пошту (Resend)", err);
    return false;
  }
}

// Каталог — 14МБ, завеликий для вкладення (більшість поштових служб ріжуть
// вкладення на 10-25МБ, та й великий файл сам по собі шкодить доставлюваності)
// — тому клієнту йде посилання на файл, що вже лежить на сайті.
const CATALOG_URL = `${SITE_URL}/documents/catalog-ua.pdf`;

export async function sendCatalogToClient(name: string, email: string) {
  const resend = getResend();
  if (!resend) return false;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Каталог продукції IN WOOD",
      text: `Вітаємо, ${name}!\n\nДякуємо за інтерес до IN WOOD. Ось посилання на каталог продукції (відкривається для перегляду):\n${CATALOG_URL}\n\nЯкщо виникнуть питання — пишіть на info@inwood.com.ua.`,
      html: `
        <p>Вітаємо, ${name}!</p>
        <p>Дякуємо за інтерес до IN WOOD. Ось каталог продукції:</p>
        <p><a href="${CATALOG_URL}">Переглянути каталог</a></p>
        <p>Якщо виникнуть питання — пишіть на <a href="mailto:info@inwood.com.ua">info@inwood.com.ua</a>.</p>
      `,
    });
    if (error) {
      console.error("Не вдалося надіслати каталог клієнту на пошту (Resend)", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Не вдалося надіслати каталог клієнту на пошту", err);
    return false;
  }
}
