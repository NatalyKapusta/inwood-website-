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

export type VariantType = "base" | "alu" | "alu-inside" | "ral";

export type ModelVariant = { code: string; variantType: VariantType; label: string };

export type ModelVariantsData = {
  variantsByBaseCode: Record<string, ModelVariant[]>;
  variantTypeByCode: Record<string, VariantType>;
};

export function isAluEdgeVariant(variantType: VariantType) {
  return variantType === "alu" || variantType === "alu-inside";
}

// Мірить filterAddonsByRal/INSIDE-фільтр з оригінального калькулятора:
// FREZZATTI/PERFETTO — короб/лиштва/добір фільтруються по підрядку "RAL/NCS";
// ETALON — короб фільтрується по підрядку "INSIDE" (лиштва/добір спільні для всіх варіантів);
// короб прихованого монтажу ETALON у конструкторі КП поки не підтримується.
export function isAddonCompatible(collection: string, variantType: VariantType, itemLabel: string) {
  if (collection === "frezzatti" || collection === "perfetto") {
    const isRal = itemLabel.includes("RAL/NCS");
    return variantType === "ral" ? isRal : !isRal;
  }
  if (collection === "etalon") {
    if (itemLabel.includes("прихованого монтажу")) return false;
    const isInside = itemLabel.includes("INSIDE");
    return variantType === "alu-inside" ? isInside : !isInside;
  }
  return true;
}

export type QuoteLineItem = {
  label: string;
  unitPrice: number;
  qty: number;
  amount: number;
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
