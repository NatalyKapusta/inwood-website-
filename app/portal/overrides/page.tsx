import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createOverride } from "@/app/portal/actions";

export default async function PortalOverridesPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "staff") redirect("/portal");

  const { data: overrides } = await supabase
    .from("price_overrides")
    .select("id, product_code, custom_price, custom_size_note, comment, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-navy-dark">
        Ручне перевизначення ціни/розміру
      </h1>
      <p className="mt-2 text-sm text-navy-dim">
        Для нестандартних замовлень поза стандартною сіткою тарифів.
      </p>

      {searchParams.error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {searchParams.error}
        </p>
      )}

      <form action={createOverride} className="mt-6 grid gap-3 rounded-xl bg-panel p-6 shadow-sm sm:grid-cols-2">
        <input
          type="text"
          name="product_code"
          placeholder="Код товару (наприклад Et-01)"
          required
          className="rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 outline-none focus:border-gold"
        />
        <input
          type="number"
          step="0.01"
          name="custom_price"
          placeholder="Індивідуальна ціна, грн"
          className="rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 outline-none focus:border-gold"
        />
        <input
          type="text"
          name="custom_size_note"
          placeholder="Нестандартний розмір"
          className="rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 outline-none focus:border-gold"
        />
        <input
          type="text"
          name="comment"
          placeholder="Коментар"
          className="rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 outline-none focus:border-gold"
        />
        <button
          type="submit"
          className="rounded-full bg-navy-dark px-7 py-3 font-semibold text-white transition hover:bg-gold hover:text-navy-dark sm:col-span-2"
        >
          Зберегти
        </button>
      </form>

      <div className="mt-8 overflow-x-auto rounded-xl bg-panel shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-dark text-white">
            <tr>
              <th className="px-4 py-3">Код товару</th>
              <th className="px-4 py-3">Ціна</th>
              <th className="px-4 py-3">Розмір</th>
              <th className="px-4 py-3">Коментар</th>
              <th className="px-4 py-3">Дата</th>
            </tr>
          </thead>
          <tbody>
            {(overrides ?? []).map((o) => (
              <tr key={o.id} className="border-t border-navy-dim/10">
                <td className="px-4 py-3 font-medium text-navy-dark">{o.product_code}</td>
                <td className="px-4 py-3 text-navy-dark">
                  {o.custom_price != null ? `${o.custom_price} грн` : "—"}
                </td>
                <td className="px-4 py-3 text-navy-dark">{o.custom_size_note ?? "—"}</td>
                <td className="px-4 py-3 text-navy-dim">{o.comment ?? "—"}</td>
                <td className="px-4 py-3 text-navy-dim">
                  {new Date(o.created_at).toLocaleDateString("uk-UA")}
                </td>
              </tr>
            ))}
            {(overrides ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-navy-dim">
                  Ще немає жодного перевизначення
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
