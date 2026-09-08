import { createBrowserClient } from "@supabase/ssr";

// Клієнт для браузера — використовує publishable key (безпечний, з ним працює RLS).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
