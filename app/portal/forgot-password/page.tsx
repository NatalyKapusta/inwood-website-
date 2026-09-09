import Link from "next/link";
import { requestPasswordReset } from "@/app/portal/actions";

export const metadata = { title: "Відновлення пароля — Партнерський портал IN WOOD" };

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string; sent?: string };
}) {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-serif text-2xl font-bold text-navy-dark">Відновлення пароля</h1>
      <p className="mt-2 text-sm text-navy-dim">
        Вкажіть email, на який зареєстровано доступ до порталу — надішлемо посилання для
        встановлення нового пароля.
      </p>

      {searchParams.error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {searchParams.error}
        </p>
      )}

      {searchParams.sent ? (
        <p className="mt-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Якщо такий email зареєстровано в порталі — на нього надіслано лист із посиланням для
          скидання пароля.
        </p>
      ) : (
        <form action={requestPasswordReset} className="mt-6 flex flex-col gap-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            autoComplete="email"
            className="rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 outline-none focus:border-gold"
          />
          <button
            type="submit"
            className="rounded-full bg-navy-dark px-7 py-3 font-semibold text-white transition hover:bg-gold hover:text-navy-dark"
          >
            Надіслати посилання
          </button>
        </form>
      )}

      <Link href="/portal/login" className="mt-6 block text-sm text-navy-dim hover:text-gold-dim">
        ← Повернутися до входу
      </Link>
    </div>
  );
}
