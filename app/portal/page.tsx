import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getPricesVisible } from "@/lib/siteSettings";
import { setPricesVisible } from "@/app/portal/actions";
import { VIEW_AS_COOKIE, isPortalRole } from "@/lib/portalRole";

const roleLabels: Record<string, string> = {
  dealer: "Дилер",
  dealer_distributor: "Дилер + роздріб + дистрибуція",
  manager: "Менеджер (тільки калькулятор)",
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
    .select("role, full_name, company_name, is_owner")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "dealer";
  const isOwner = profile?.is_owner ?? false;
  const pricesVisible = role === "staff" ? await getPricesVisible() : null;

  let viewingAs: string | null = null;
  if (isOwner) {
    const jar = await cookies();
    const cookieValue = jar.get(VIEW_AS_COOKIE)?.value;
    if (isPortalRole(cookieValue)) viewingAs = cookieValue;
  }
  const effectiveRole = viewingAs ?? role;
  const effectiveIsOwner = isOwner && !viewingAs;

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
          Роль:{" "}
          <span className="font-semibold text-navy-dark">
            {roleLabels[effectiveRole] ?? effectiveRole}
          </span>
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

        <div className="rounded-xl bg-panel p-6 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-navy-dark">Каталоги для завантаження</h2>
          <p className="mt-2 text-sm text-navy-dim">Повний каталог продукції IN WOOD у PDF.</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href="/documents/catalog-ua.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-navy-dark px-4 py-2 text-sm font-semibold text-navy-dark transition hover:bg-navy-dark hover:text-white"
            >
              UA каталог
            </a>
            <a
              href="/documents/catalog-en.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-navy-dark px-4 py-2 text-sm font-semibold text-navy-dark transition hover:bg-navy-dark hover:text-white"
            >
              EN catalogue
            </a>
          </div>
        </div>

        {effectiveRole === "staff" && (
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
        )}
        {effectiveIsOwner && (
          <Link
            href="/portal/users"
            className="rounded-xl bg-panel p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="font-serif text-lg font-bold text-navy-dark">Користувачі</h2>
            <p className="mt-2 text-sm text-navy-dim">
              Запросити нового дилера, дистриб&apos;ютора чи співробітника.
            </p>
          </Link>
        )}
      </div>

      {role === "staff" && (
        <div className="mt-8 rounded-xl bg-panel p-6 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-navy-dark">Видимість цін на сайті</h2>
          <p className="mt-2 text-sm text-navy-dim">
            {pricesVisible
              ? "Роздрібні ціни зараз показуються всім відвідувачам публічного каталогу."
              : "Ціни зараз приховані — відвідувачі бачать кнопку «Дізнатись ціну» замість суми."}
          </p>
          <form action={setPricesVisible} className="mt-4">
            <input type="hidden" name="visible" value={(!pricesVisible).toString()} />
            <button
              type="submit"
              className={`rounded-full px-6 py-3 font-semibold transition ${
                pricesVisible
                  ? "bg-red-50 text-red-700 hover:bg-red-100"
                  : "bg-navy-dark text-white hover:bg-gold hover:text-navy-dark"
              }`}
            >
              {pricesVisible ? "Приховати ціни на сайті" : "Показати ціни на сайті"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
