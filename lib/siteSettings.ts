import { createPublicReadClient } from "@/lib/supabase/publicRead";
import type { Locale } from "@/lib/i18n";

async function getRawPricesVisible(): Promise<boolean> {
  // Безпечний дефолт (ціни видимі), якщо Supabase недоступний або
  // налаштування ще не створено — сайт не має "ламатись" через це.
  // Публічний клієнт (не чіпає cookies()) — site_settings читається
  // анонімно (RLS: select for all), а cookies()-клієнт зривав ISR-сторінки
  // (catalog, spivpratsya тощо) у "Dynamic server usage", який try/catch
  // тут перехоплював як звичайну помилку — переключач міг тихо не діяти
  // на статично згенерованих сторінках.
  try {
    const supabase = createPublicReadClient();
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
