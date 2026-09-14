import { createClient } from "@/lib/supabase/server";
import { hardwareCategoryLabels, type HardwareCategory } from "@/lib/quote";

export const HARDWARE_CATEGORY_ORDER = Object.keys(hardwareCategoryLabels) as HardwareCategory[];

export type PublicHardwareItem = {
  brand: string;
  category: HardwareCategory;
  article: string;
  name: string;
  material: string;
  price: number;
  photo: string | null;
};

// Публічна вітрина "Фурнітура" бере лише роздрібний тариф — доступ дозволено
// анонімним відвідувачам окремою RLS-політикою (0025_public_retail_prices.sql),
// решта тарифів (дилер/дистриб'ютор/...) лишається доступна тільки в порталі.
export async function getPublicHardware(): Promise<PublicHardwareItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("hardware_tariff_prices")
      .select("brand, category, article, name, material, price, photo")
      .eq("tariff", "retail")
      .order("brand")
      .order("category")
      .order("name");
    if (error || !data) return [];
    return data as PublicHardwareItem[];
  } catch {
    return [];
  }
}

export type PublicAddonItem = {
  collection: string;
  addon_type: "korob" | "lishtva" | "dobir";
  item_label: string;
  price: number;
};

// "Погонажні вироби" — короб/лиштва/добір окремо від полотна, по кожній лінії.
export async function getPublicPogonazhni(): Promise<PublicAddonItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("line_addon_prices")
      .select("collection, addon_type, item_label, price")
      .eq("tariff", "retail");
    if (error || !data) return [];
    return data as PublicAddonItem[];
  } catch {
    return [];
  }
}

export type PublicFlatLineItem = { code: string; label: string; price: number };

async function getPublicFlatLine(prefix: string): Promise<PublicFlatLineItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("product_tariff_prices")
      .select("product_code, price")
      .eq("tariff", "retail")
      .like("product_code", `${prefix}%`)
      .order("product_code");
    if (error || !data) return [];
    return data.map((r) => ({
      code: r.product_code,
      label: r.product_code.slice(prefix.length),
      price: r.price,
    }));
  } catch {
    return [];
  }
}

export function getPublicPlintus() {
  return getPublicFlatLine("PLINTUS — ");
}
export function getPublicNakladka() {
  return getPublicFlatLine("NAKLADKA — ");
}
