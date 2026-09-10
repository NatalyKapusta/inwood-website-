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
};

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
// ETALON — короб/лиштва/добір СПІЛЬНІ для всіх варіантів (база/алюм. крайка/INSIDE) —
// в оригінальному калькуляторі вони ніколи не фільтруються по варіанту полотна
// (це підтверджено кодом калькулятора: перефільтровується лише FREZZATTI/PERFETTO).
// Добір узагалі не має окремих INSIDE-позицій, тож фільтр по "INSIDE" робив
// добір (і лиштву) порожніми для варіанту "алюм. крайка INSIDE" — це був баг.
// Короб прихованого монтажу лишається виключеним з цього списку — він продається
// окремою колекцією "Двері прихованого монтажу".
export function isAddonCompatible(collection: string, variantType: VariantType, itemLabel: string) {
  if (collection === "frezzatti" || collection === "perfetto") {
    const isRal = itemLabel.includes("RAL/NCS");
    return variantType === "ral" ? isRal : !isRal;
  }
  if (collection === "etalon") {
    return !itemLabel.includes("прихованого монтажу");
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
