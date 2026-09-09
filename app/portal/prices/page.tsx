import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { collections, collectionOrder } from "@/lib/products";
import { VIEW_AS_COOKIE, isPortalRole, TARIFFS_BY_ROLE, type Tariff } from "@/lib/portalRole";

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

  // Якщо власник переглядає портал "чужими очима" — звужуємо набір тарифів
  // до того, що бачила б обрана роль (дані вже все одно доступні власнику
  // через RLS, це лише звуження відображення для чесного прев'ю).
  const { data: myProfile } = await supabase.from("profiles").select("is_owner").eq("id", user.id).single();
  let viewAsTariffs: Tariff[] | null = null;
  if (myProfile?.is_owner) {
    const jar = await cookies();
    const cookieValue = jar.get(VIEW_AS_COOKIE)?.value;
    if (isPortalRole(cookieValue)) {
      const tariffs = TARIFFS_BY_ROLE[cookieValue];
      if (tariffs !== "all") viewAsTariffs = tariffs;
    }
  }

  const byProduct = new Map<string, Record<string, number>>();
  for (const row of prices ?? []) {
    if (viewAsTariffs && !viewAsTariffs.includes(row.tariff as Tariff)) continue;
    if (!byProduct.has(row.product_code)) byProduct.set(row.product_code, {});
    byProduct.get(row.product_code)![row.tariff] = row.price;
  }

  const tariffsPresent = Array.from(
    new Set((prices ?? []).filter((r) => !viewAsTariffs || viewAsTariffs.includes(r.tariff as Tariff)).map((r) => r.tariff))
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
