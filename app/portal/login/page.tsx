import { login } from "@/app/portal/actions";

export const metadata = { title: "Вхід — Партнерський портал IN WOOD" };

export default function PortalLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-serif text-2xl font-bold text-navy-dark">Вхід у портал</h1>
      <p className="mt-2 text-sm text-navy-dim">
        Доступ надається персонально — зверніться до вашого менеджера IN WOOD, якщо у вас
        ще немає логіну.
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
        <input
          type="password"
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
    </div>
  );
}
