export type Tariff = "retail" | "dealer" | "distributor" | "builder" | "epicenter" | "export";

export const tariffLabels: Record<Tariff, string> = {
  retail: "Роздрібна",
  dealer: "Дилерська",
  distributor: "Дистриб'юторська",
  builder: "Забудовник",
  epicenter: "Епіцентр",
  export: "Експорт",
};

export type PanelRow = { product_code: string; tariff: Tariff; price: number };
export type AddonRow = {
  collection: string;
  addon_type: "korob" | "lishtva" | "dobir";
  item_label: string;
  tariff: Tariff;
  price: number;
};
export type ServiceRow = { service_key: string; tariff: Tariff; price: number };

export type HardwareCategory =
  | "ruchky"
  | "nakladky"
  | "zavisy"
  | "upory"
  | "mekhanizmy"
  | "tsylindry"
  | "rozsuvna"
  | "aksesuary"
  | "inshe";

export const hardwareCategoryLabels: Record<HardwareCategory, string> = {
  ruchky: "Ручки",
  nakladky: "Накладки",
  zavisy: "Завіси",
  upory: "Упори",
  mekhanizmy: "Механізми",
  tsylindry: "Циліндри",
  rozsuvna: "Розсувні системи",
  aksesuary: "Аксесуари",
  inshe: "Інше",
};

export type HardwareRow = {
  brand: string;
  category: HardwareCategory;
  article: string;
  name: string;
  material: string;
  tariff: Tariff;
  price: number;
  photo: string | null;
};

// Фурнітура згрупована по виробнику окремими "лініями" (як в оригінальному
// калькуляторі) — так консультант одразу бачить, чий це товар, а не лише
// артикул. brand у hardware_tariff_prices відповідає ключам цього обʼєкта.
// ABUS об'єднано з MVM (0023) — це той самий партнер-постачальник.
export const HARDWARE_BRAND_LABELS: Record<string, string> = {
  MVM: "Фурнітура MVM",
  AGB_BUONELLE: "Фурнітура Anselmi + AGB",
};
export const HARDWARE_BRAND_ORDER = ["MVM", "AGB_BUONELLE"];

export type VariantType = "base" | "alu" | "alu-inside" | "ral";

export type ModelVariant = { code: string; variantType: VariantType; label: string };

export type ModelVariantsData = {
  variantsByBaseCode: Record<string, ModelVariant[]>;
  variantTypeByCode: Record<string, VariantType>;
};

export function isAluEdgeVariant(variantType: VariantType) {
  return variantType === "alu" || variantType === "alu-inside";
}

// Мірить filterAddonsByRal-фільтр з оригінального калькулятора:
// FREZZATTI/PERFETTO — короб/лиштва/добір фільтруються по підрядку "RAL/NCS".
// ETALON — короб прихованого монтажу STANDART/LUX продається з базою і з
// варіантами "Алюмінієва крайка" та "Алюмінієва крайка INSIDE" (ТЗ 29.09.2026).
// Короби Телескопічний/Компланарний INSIDE — тільки з "Алюмінієва крайка
// INSIDE" (кожен зі своєю ціною за прайсом для всіх тарифів); з базою і зі
// звичайною "Алюмінієва крайка" не продаються.
export function isAddonCompatible(collection: string, variantType: VariantType, itemLabel: string) {
  if (collection === "frezzatti" || collection === "perfetto") {
    const isRal = itemLabel.includes("RAL/NCS");
    return variantType === "ral" ? isRal : !isRal;
  }
  if (collection === "etalon") {
    if (variantType === "alu-inside") return true;
    const isHiddenKorob = itemLabel.includes("прихованого монтажу");
    return isHiddenKorob || !itemLabel.includes("INSIDE");
  }
  return true;
}

// Де взяти ціну рядка — замість одного "замороженого" числа на момент
// додавання позиції. Дає змогу перерахувати вже додані позиції під інший
// тариф (кнопки "Дилерська"/"Роздрібна" тощо нагорі) — і в екрані, і в
// друкованому бланку/PDF — без повторного збирання дверей заново.
// "fixed" — ручне перевизначення (canOverride): число, яке консультант
// вписав сам, не прив'язане до жодного тарифу — лишається незмінним при
// перемиканні тарифу.
export type PriceRef =
  | { kind: "panel"; code: string; surcharge?: number }
  | { kind: "addon"; collection: string; addonType: "korob" | "lishtva" | "dobir"; label: string }
  | { kind: "service"; key: string }
  | { kind: "flat"; code: string }
  | { kind: "hardware"; brand: string; category: HardwareCategory; article: string }
  | { kind: "fixed"; amount: number };

export type PricingData = {
  panelRows: PanelRow[];
  addonRows: AddonRow[];
  serviceRows: ServiceRow[];
  hardwareRows: HardwareRow[];
};

export function priceForRef(ref: PriceRef, tariff: Tariff, data: PricingData): number {
  switch (ref.kind) {
    case "panel": {
      const base = data.panelRows.find((r) => r.product_code === ref.code && r.tariff === tariff)?.price ?? 0;
      return ref.surcharge ? base * ref.surcharge : base;
    }
    case "flat":
      return data.panelRows.find((r) => r.product_code === ref.code && r.tariff === tariff)?.price ?? 0;
    case "addon":
      return (
        data.addonRows.find(
          (r) =>
            r.collection === ref.collection &&
            r.addon_type === ref.addonType &&
            r.item_label === ref.label &&
            r.tariff === tariff
        )?.price ?? 0
      );
    case "service":
      return data.serviceRows.find((r) => r.service_key === ref.key && r.tariff === tariff)?.price ?? 0;
    case "hardware":
      return (
        data.hardwareRows.find(
          (r) => r.brand === ref.brand && r.category === ref.category && r.article === ref.article && r.tariff === tariff
        )?.price ?? 0
      );
    case "fixed":
      return ref.amount;
  }
}

export type QuoteLineItem = {
  label: string;
  ref: PriceRef;
  qty: number;
  photo?: string;
};

export type QuotePosition = {
  id: string;
  collectionLabel: string;
  modelCode: string;
  colorLabel: string;
  photo?: string;
  qty: number;
  rows: QuoteLineItem[];
};

export function lineItemAmount(item: QuoteLineItem, tariff: Tariff, data: PricingData) {
  return priceForRef(item.ref, tariff, data) * item.qty;
}

export function positionTotal(position: QuotePosition, tariff: Tariff, data: PricingData) {
  return position.rows.reduce((sum, r) => sum + lineItemAmount(r, tariff, data), 0);
}
