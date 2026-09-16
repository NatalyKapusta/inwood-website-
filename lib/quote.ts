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
// ETALON — короб/лиштва/добір INSIDE (алюмінієвий профіль) не продаються в
// жодному з варіантів; короб прихованого монтажу STANDART/LUX — тільки з
// варіантами "Алюмінієва крайка" і "Алюмінієва крайка INSIDE", не з базою.
export function isAddonCompatible(collection: string, variantType: VariantType, itemLabel: string) {
  if (collection === "frezzatti" || collection === "perfetto") {
    const isRal = itemLabel.includes("RAL/NCS");
    return variantType === "ral" ? isRal : !isRal;
  }
  if (collection === "etalon") {
    const isHiddenKorob = itemLabel.includes("прихованого монтажу");
    // Короб прихованого монтажу STANDART/LUX продається з варіантами
    // "Алюмінієва крайка" і "Алюмінієва крайка INSIDE" — для бази сенсу
    // немає, її там немає. Короби INSIDE (Телескопічний/Компланарний INSIDE)
    // не продаються в жодному з варіантів ETALON.
    if (isAluEdgeVariant(variantType)) return isHiddenKorob || !itemLabel.includes("INSIDE");
    return !isHiddenKorob && !itemLabel.includes("INSIDE");
  }
  return true;
}

export type QuoteLineItem = {
  label: string;
  unitPrice: number;
  qty: number;
  amount: number;
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

export function positionTotal(position: QuotePosition) {
  return position.rows.reduce((sum, r) => sum + r.amount, 0);
}
