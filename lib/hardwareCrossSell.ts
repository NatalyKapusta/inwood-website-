import type { PublicHardwareItem } from "@/lib/publicShop";
import type { HardwareCategory } from "@/lib/quote";

// Категорії блоку допродажу на сторінках колекцій — по одній позиції з
// кожної (ручка / завіси / механізм замка / упор), решта категорій
// (накладки, циліндри, розсувні системи тощо) сюди не потрапляють.
export const CROSS_SELL_CATEGORIES: HardwareCategory[] = ["ruchky", "zavisy", "mekhanizmy", "upory"];

function median(prices: number[]): number {
  const sorted = [...prices].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// Позначка "Спосіб монтажу: прихований" зараз живе просто підрядком у полі
// material (немає окремої колонки в hardware_tariff_prices) — так додані
// приховані завіси AN 140 3D / AN 172 3D (supabase/migrations/0016, 0022).
const HIDDEN_MOUNT_MARKER = "Спосіб монтажу: прихований";

// Для кожної категорії — позиція, найближча до медіанної ціни (не
// найдешевша, яка знецінює двері, і не найдорожча, яка відлякує), з фото,
// якщо в категорії взагалі є бодай одна позиція з фото.
//
// hiddenMountHinges: для /catalog/pryhovani-dveri медіану по "Завісах"
// рахуємо лише серед прихованих/магнітних завіс — звичайні для цієї
// сторінки не підходять (ТЗ 23.09.2026, задача 3). Решта категорій без
// змін. Позиції закріплюємо не вручну (артикул/наявність можуть
// змінитись і мовчки зламати блок), а фільтром за атрибутом.
export function selectCrossSellItems(
  items: PublicHardwareItem[],
  options?: { hiddenMountHinges?: boolean }
): PublicHardwareItem[] {
  const selected: PublicHardwareItem[] = [];
  for (const category of CROSS_SELL_CATEGORIES) {
    let candidates = items.filter((i) => i.category === category);
    if (category === "zavisy" && options?.hiddenMountHinges) {
      candidates = candidates.filter((i) => i.material.includes(HIDDEN_MOUNT_MARKER));
    }
    if (candidates.length === 0) continue;
    const med = median(candidates.map((i) => i.price));
    const byDistance = [...candidates].sort(
      (a, b) => Math.abs(a.price - med) - Math.abs(b.price - med)
    );
    const withPhoto = byDistance.find((i) => i.photo);
    selected.push(withPhoto ?? byDistance[0]);
  }
  return selected;
}
