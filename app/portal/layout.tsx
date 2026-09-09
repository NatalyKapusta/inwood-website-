import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import "@/app/globals.css";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/portal/LogoutButton";

export const metadata = {
  title: "Партнерський портал — IN WOOD",
  robots: { index: false, follow: false },
};

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;
  let isOwner = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, blocked, is_owner")
      .eq("id", user.id)
      .single();
    if (profile?.blocked) {
      await supabase.auth.signOut();
      redirect("/portal/login?error=" + encodeURIComponent("Доступ заблоковано. Зверніться до вашого менеджера IN WOOD"));
    }
    role = profile?.role ?? null;
    isOwner = profile?.is_owner ?? false;
  }

  return (
    <html lang="uk">
      <body className="min-h-screen bg-panel-alt">
        <header className="bg-navy-dark text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
            <Link href="/portal" className="flex items-center gap-3">
              <Image src="/logo/inwood-logo-gold.svg" alt="IN WOOD" width={90} height={62} priority />
              <span className="font-serif text-lg font-bold text-gold">Партнерський портал</span>
            </Link>
            {user && (
              <nav className="flex items-center gap-6 text-sm uppercase tracking-wide">
                <Link href="/portal" className="text-white/85 hover:text-gold">
                  Кабінет
                </Link>
                <Link href="/portal/prices" className="text-white/85 hover:text-gold">
                  Ціни
                </Link>
                <Link href="/portal/quote" className="text-white/85 hover:text-gold">
                  Комерційна пропозиція
                </Link>
                {role === "staff" && (
                  <Link href="/portal/overrides" className="text-white/85 hover:text-gold">
                    Перевизначення
                  </Link>
                )}
                {isOwner && (
                  <Link href="/portal/users" className="text-white/85 hover:text-gold">
                    Користувачі
                  </Link>
                )}
                <LogoutButton />
              </nav>
            )}
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-12">{children}</main>
      </body>
    </html>
  );
}
