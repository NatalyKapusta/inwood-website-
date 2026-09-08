import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// АДМІН-клієнт — використовує secret key, обходить RLS повністю.
// ТІЛЬКИ для довірених серверних операцій (наприклад, коли ВИ створюєте
// новий обліковий запис дилеру). НІКОЛИ не імпортувати в клієнтський код
// чи в звичайні сторінки — лише в захищені server actions / API routes.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
