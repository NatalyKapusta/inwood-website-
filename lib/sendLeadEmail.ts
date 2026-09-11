import nodemailer from "nodemailer";
import type { LeadPayload } from "./sendLead";

// Дублюємо кожну заявку на пошту напряму (SMTP), незалежно від того, чи
// пройшла вона в KeepinCRM — вебхук виявився ненадійним, і поки з ним
// розбираємось, жодна заявка не має губитись. Отримувачі захардкожені
// (це не секрет), а SMTP-доступ — через змінні середовища (реальний пароль
// від поштової скриньки не можна тримати в репозиторії).
const RECIPIENTS = ["info@inwood.com.ua", "hodes.nv@gmail.com"];

export async function sendLeadEmail(payload: LeadPayload) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !port || !user || !pass) {
    console.error("SMTP не налаштовано (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS)");
    return false;
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass },
  });

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
