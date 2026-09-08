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
