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

// Для кожної категорії — позиція, найближча до медіанної ціни (не
// найдешевша, яка знецінює двері, і не найдорожча, яка відлякує), з фото,
// якщо в категорії взагалі є бодай одна позиція з фото.
export function selectCrossSellItems(items: PublicHardwareItem[]): PublicHardwareItem[] {
  const selected: PublicHardwareItem[] = [];
  for (const category of CROSS_SELL_CATEGORIES) {
    const candidates = items.filter((i) => i.category === category);
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
