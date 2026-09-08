import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { collections, collectionOrder } from "@/lib/products";

const tariffLabels: Record<string, string> = {
  retail: "Роздрібна",
  dealer: "Дилерська",
  distributor: "Дистриб'юторська",
  builder: "Забудовник",
  epicenter: "Епіцентр",
  export: "Експорт",
};

export default async function PortalPricesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  // RLS сама відфільтрує рядки за роллю користувача
  const { data: prices } = await supabase
    .from("product_tariff_prices")
    .select("product_code, tariff, price")
    .order("product_code");

  const byProduct = new Map<string, Record<string, number>>();
  for (const row of prices ?? []) {
    if (!byProduct.has(row.product_code)) byProduct.set(row.product_code, {});
    byProduct.get(row.product_code)![row.tariff] = row.price;
  }

  const tariffsPresent = Array.from(
    new Set((prices ?? []).map((r) => r.tariff))
  ).sort((a, b) => Object.keys(tariffLabels).indexOf(a) - Object.keys(tariffLabels).indexOf(b));

  const models = collectionOrder.flatMap((key) => {
    const collection = collections[key];
    if (!collection?.models) return [];
    return collection.models.map((m) => ({ code: m.code, collectionLabel: collection.label }));
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-navy-dark">Ціни за вашим тарифом</h1>

      {tariffsPresent.length === 0 ? (
        <p className="mt-6 rounded-lg bg-panel p-6 text-navy-dim">
          Тарифні ціни ще не завантажені у систему. Зверніться до менеджера IN WOOD.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl bg-panel shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-dark text-white">
              <tr>
                <th className="px-4 py-3">Колекція</th>
                <th className="px-4 py-3">Модель</th>
                {tariffsPresent.map((t) => (
                  <th key={t} className="px-4 py-3">
                    {tariffLabels[t] ?? t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {models.map((m) => {
                const row = byProduct.get(m.code);
                if (!row) return null;
                return (
                  <tr key={m.code} className="border-t border-navy-dim/10">
                    <td className="px-4 py-3 text-navy-dim">{m.collectionLabel}</td>
                    <td className="px-4 py-3 font-medium text-navy-dark">{m.code}</td>
                    {tariffsPresent.map((t) => (
                      <td key={t} className="px-4 py-3 text-navy-dark">
                        {row[t] != null ? `${row[t]} грн` : "—"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
