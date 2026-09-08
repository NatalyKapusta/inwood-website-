import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Клієнт для серверних компонентів — читає сесію користувача з cookies,
// підпорядковується RLS-політикам (бачить лише те, що дозволено роллю користувача).
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll викликається з Server Component — ігноруємо,
            // сесія оновиться через middleware.
          }
        },
      },
    }
  );
}
