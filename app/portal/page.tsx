import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const roleLabels: Record<string, string> = {
  dealer: "Дилер",
  dealer_distributor: "Дилер + роздріб + дистрибуція",
  staff: "Співробітник IN WOOD",
};

export default async function PortalDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, company_name")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "dealer";

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-navy-dark">
        Вітаємо{profile?.full_name ? `, ${profile.full_name}` : ""}
      </h1>
      <div className="mt-4 rounded-xl bg-panel p-6 shadow-sm">
        <p className="text-sm text-navy-dim">
          Email: <span className="text-navy-dark">{user.email}</span>
        </p>
        {profile?.company_name && (
          <p className="mt-1 text-sm text-navy-dim">
            Компанія: <span className="text-navy-dark">{profile.company_name}</span>
          </p>
        )}
        <p className="mt-1 text-sm text-navy-dim">
          Роль: <span className="font-semibold text-navy-dark">{roleLabels[role] ?? role}</span>
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/portal/prices"
          className="rounded-xl bg-navy-dark p-6 text-white transition hover:bg-gold hover:text-navy-dark"
        >
          <h2 className="font-serif text-lg font-bold">Ціни за вашим тарифом</h2>
          <p className="mt-2 text-sm opacity-80">
            Актуальні ціни на всі моделі дверей для вашої ролі.
          </p>
        </Link>

        {role === "staff" && (
          <>
            <Link
              href="/portal/overrides"
              className="rounded-xl bg-panel p-6 shadow-sm transition hover:shadow-md"
            >
              <h2 className="font-serif text-lg font-bold text-navy-dark">
                Ручне перевизначення ціни/розміру
              </h2>
              <p className="mt-2 text-sm text-navy-dim">
                Для нестандартних замовлень — індивідуальна ціна та розмір.
              </p>
            </Link>
            <Link
              href="/portal/users"
              className="rounded-xl bg-panel p-6 shadow-sm transition hover:shadow-md"
            >
              <h2 className="font-serif text-lg font-bold text-navy-dark">Користувачі</h2>
              <p className="mt-2 text-sm text-navy-dim">
                Запросити нового дилера, дистриб&apos;ютора чи співробітника.
              </p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
