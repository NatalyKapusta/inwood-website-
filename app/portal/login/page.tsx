import Link from "next/link";
import { login } from "@/app/portal/actions";
import { submitLead } from "@/app/actions/lead";
import PasswordInput from "@/components/PasswordInput";
import PhoneInput from "@/components/PhoneInput";
import SentModal from "@/components/SentModal";
import Honeypot from "@/components/Honeypot";

export const metadata = { title: "Вхід — Партнерський портал IN WOOD" };

export default function PortalLoginPage({
  searchParams,
}: {
  searchParams: { error?: string; sent?: string };
}) {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-serif text-2xl font-bold text-navy-dark">Вхід у портал</h1>
      <p className="mt-2 text-sm text-navy-dim">
        Доступ надається персонально — якщо у вас ще немає логіну, залиште заявку нижче.
      </p>

      {searchParams.error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {searchParams.error}
        </p>
      )}

      <form action={login} className="mt-6 flex flex-col gap-3">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          autoComplete="email"
          className="rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 outline-none focus:border-gold"
        />
        <PasswordInput
          name="password"
          placeholder="Пароль"
          required
          autoComplete="current-password"
          className="rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 outline-none focus:border-gold"
        />
        <button
          type="submit"
          className="rounded-full bg-navy-dark px-7 py-3 font-semibold text-white transition hover:bg-gold hover:text-navy-dark"
        >
          Увійти
        </button>
      </form>

      <Link
        href="/portal/forgot-password"
        className="mt-4 block text-sm text-navy-dim hover:text-gold-dim"
      >
        Забули пароль?
      </Link>

      <div className="mt-10 border-t border-navy-dim/15 pt-8">
        <h2 className="font-serif text-lg font-bold text-navy-dark">Ще не маєте доступу?</h2>
        <p className="mt-2 text-sm text-navy-dim">
          Портал доступний дилерам і партнерам IN WOOD — тут ціни за вашим тарифом і
          конструктор комерційних пропозицій. Залиште заявку, ми зв&apos;яжемось і надамо
          доступ після узгодження умов співпраці.
        </p>

        {searchParams.sent && (
          <SentModal message="Дякуємо! Заявку надіслано, ми скоро з вами зв'яжемось." />
        )}
        <form action={submitLead} className="mt-6 flex flex-col gap-3">
          <input type="hidden" name="source" value="Партнерський портал — заявка на доступ" />
          <Honeypot />
          <input
            type="text"
            name="name"
            placeholder="Ім'я"
            required
            className="rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 outline-none focus:border-gold"
          />
          <PhoneInput
            placeholder="Телефон"
            required
            className="w-full rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 outline-none focus:border-gold"
          />
          <input
            type="email"
            name="email"
            placeholder="Пошта"
            className="rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 outline-none focus:border-gold"
          />
          <input
            type="text"
            name="misto"
            placeholder="Місто / компанія"
            className="rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 outline-none focus:border-gold"
          />
          <button
            type="submit"
            className="rounded-full border border-navy-dark px-7 py-3 font-semibold text-navy-dark transition hover:bg-navy-dark hover:text-white"
          >
            Подати заявку
          </button>
        </form>
      </div>
    </div>
  );
}
