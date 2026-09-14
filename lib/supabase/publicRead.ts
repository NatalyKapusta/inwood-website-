import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Клієнт для публічних анонімних читань (фурнітура/аксесуари, prices_visible
// тощо) — той самий publishable key, що й у браузерного клієнта, підпорядкований
// RLS так само. На відміну від lib/supabase/server.ts НЕ чіпає cookies(), тому
// не зриває ISR-сторінки (revalidate) у режим "Dynamic server usage": Next.js
// перехоплював цей внутрішній сигнал як звичайну помилку в try/catch і
// сторінка застигала з порожніми даними з моменту збірки.
export function createPublicReadClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
