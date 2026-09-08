import { createClient } from "@/lib/supabase/server";

// Безпечний дефолт (ціни видимі), якщо Supabase недоступний або
// налаштування ще не створено — сайт не має "ламатись" через це.
export async function getPricesVisible(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "prices_visible")
      .single();
    if (data?.value === false) return false;
    return true;
  } catch {
    return true;
  }
}
