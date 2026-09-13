import { createClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/i18n";

async function getRawPricesVisible(): Promise<boolean> {
  // Безпечний дефолт (ціни видимі), якщо Supabase недоступний або
  // налаштування ще не створено — сайт не має "ламатись" через це.
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

// Публічні сторінки передають locale — для EN/PL ціни завжди приховані
// (експортна/міжнародна аудиторія, роздрібні ціни в гривні їй не
// підходять), незалежно від загального перемикача. UA/RU й далі керуються
// самим перемикачем "показати/приховати ціни на сайті" в порталі.
// Портал викликає без locale — там завжди має бути справжнє значення з
// бази, щоб власниця бачила реальний стан вимикача, а не завжди "вимкнено".
export async function getPricesVisible(locale?: Locale): Promise<boolean> {
  const raw = await getRawPricesVisible();
  if (locale && locale !== "ua" && locale !== "ru") return false;
  return raw;
}
