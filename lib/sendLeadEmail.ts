import nodemailer from "nodemailer";
import type { LeadPayload } from "./sendLead";
import { SITE_URL } from "./seo";

// Дублюємо кожну заявку на пошту напряму (SMTP), незалежно від того, чи
// пройшла вона в KeepinCRM — вебхук виявився ненадійним, і поки з ним
// розбираємось, жодна заявка не має губитись. Отримувачі захардкожені
// (це не секрет), а SMTP-доступ — через змінні середовища (реальний пароль
// від поштової скриньки не можна тримати в репозиторії).
const RECIPIENTS = ["info@inwood.com.ua", "hodes.nv@gmail.com"];

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !port || !user || !pass) {
    console.error("SMTP не налаштовано (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS)");
    return null;
  }
  return {
    user,
    transporter: nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: { user, pass },
    }),
  };
}

export async function sendLeadEmail(payload: LeadPayload) {
  const smtp = getTransporter();
  if (!smtp) return false;
  const { user, transporter } = smtp;

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
    await transporter.sendMail({
      from: `"IN WOOD — сайт" <${user}>`,
      to: RECIPIENTS,
      subject: `Нова заявка з сайту — ${payload.source}`,
      text: textLines.join("\n"),
      html: `<table>${htmlRows}</table>`,
    });
    return true;
  } catch (err) {
    console.error("Не вдалося надіслати заявку на пошту (SMTP)", err);
    return false;
  }
}

// Каталог — 14МБ, завеликий для вкладення (більшість поштових служб ріжуть
// вкладення на 10-25МБ, та й великий файл сам по собі шкодить доставлюваності)
// — тому клієнту йде посилання на файл, що вже лежить на сайті.
const CATALOG_URL = `${SITE_URL}/documents/catalog-ua.pdf`;

export async function sendCatalogToClient(name: string, email: string) {
  const smtp = getTransporter();
  if (!smtp) return false;
  const { user, transporter } = smtp;

  try {
    await transporter.sendMail({
      from: `"IN WOOD" <${user}>`,
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
    return true;
  } catch (err) {
    console.error("Не вдалося надіслати каталог клієнту на пошту", err);
    return false;
  }
}
