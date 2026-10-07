import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getPricesVisible } from "@/lib/siteSettings";
import { setPricesVisible } from "@/app/portal/actions";
import { VIEW_AS_COOKIE, isPortalRole, roleLabels } from "@/lib/portalRole";
import ChangePasswordForm from "@/components/portal/ChangePasswordForm";

export default async function PortalDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, full_name, company_name, is_owner")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return (
      <div className="mx-auto max-w-sm rounded-xl bg-red-50 p-6 text-sm text-red-700">
        Не вдалося завантажити профіль ({profileError?.message ?? "невідома помилка"}). Оновіть
        сторінку; якщо не допомогло — можливо, потрібно виконати останню SQL-міграцію в Supabase.
      </div>
    );
  }

  const role = profile.role ?? "dealer";
  const isOwner = profile?.is_owner ?? false;
  const pricesVisible = isOwner ? await getPricesVisible() : null;

  let viewingAs: string | null = null;
  if (isOwner) {
    const jar = await cookies();
    const cookieValue = jar.get(VIEW_AS_COOKIE)?.value;
    if (isPortalRole(cookieValue)) viewingAs = cookieValue;
  }
  const effectiveRole = viewingAs ?? role;
  const effectiveIsOwner = isOwner && !viewingAs;
  const en = effectiveRole === "export";
  const canSeePriceLists =
    effectiveIsOwner ||
    ["dealer", "dealer_distributor", "manager", "staff"].includes(effectiveRole as string);

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-navy-dark">
        {en ? "Welcome" : "Вітаємо"}
        {profile?.full_name ? `, ${profile.full_name}` : ""}
      </h1>
      <div className="mt-4 rounded-xl bg-panel p-6 shadow-sm">
        <p className="text-sm text-navy-dim">
          Email: <span className="text-navy-dark">{user.email}</span>
        </p>
        {profile?.company_name && (
          <p className="mt-1 text-sm text-navy-dim">
            {en ? "Company" : "Компанія"}: <span className="text-navy-dark">{profile.company_name}</span>
          </p>
        )}
        <p className="mt-1 text-sm text-navy-dim">
          {en ? "Role" : "Роль"}:{" "}
          <span className="font-semibold text-navy-dark">
            {en ? "Export" : roleLabels[effectiveRole as keyof typeof roleLabels] ?? effectiveRole}
          </span>
        </p>
        <div className="mt-4">
          <ChangePasswordForm en={en} />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-panel p-6 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-navy-dark">
            {en ? "Catalogues to download" : "Каталоги для завантаження"}
          </h2>
          <p className="mt-2 text-sm text-navy-dim">
            {en ? "The full IN WOOD product catalogue as a PDF." : "Повний каталог продукції IN WOOD у PDF."}
          </p>
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

        <div className="rounded-xl bg-panel p-6 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-navy-dark">
            {en ? "Training materials" : "Навчальні матеріали"}
          </h2>
          <p className="mt-2 text-sm text-navy-dim">
            {en
              ? "IN WOOD line-up reference — colours, frame/trim/casing and terminology, to better understand the product."
              : "Довідник по лінійках IN WOOD: кольори, короб/лиштва/добір і терміни — щоб краще розуміти продукт."}
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href={en ? "/documents/dovidnyk-spivrobitnykiv-en.html" : "/documents/dovidnyk-spivrobitnykiv.html"}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-navy-dark px-4 py-2 text-sm font-semibold text-navy-dark transition hover:bg-navy-dark hover:text-white"
            >
              {en ? "IN WOOD Line-Up Reference" : "Довідник по лінійках IN WOOD"}
            </a>
            {effectiveRole === "export" ? (
              <a
                href="/documents/instruktsiya-kalkuliator-en.html"
                target="_blank"
                rel="noopener noreferrer"
                className="relative rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
              >
                Calculator Guide
                <span className="absolute -top-2.5 -right-2.5 rounded-full bg-navy-dark px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold">
                  Required
                </span>
              </a>
            ) : (
              <a
                href="/documents/instruktsiya-kalkuliator.html"
                target="_blank"
                rel="noopener noreferrer"
                className="relative rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
              >
                Інструкція до калькулятора КП
                <span className="absolute -top-2.5 -right-2.5 rounded-full bg-navy-dark px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold">
                  Обов&apos;язково
                </span>
              </a>
            )}
          </div>
        </div>

        {canSeePriceLists && (
          <div className="rounded-xl bg-panel p-6 shadow-sm sm:col-span-2">
            <h2 className="font-serif text-lg font-bold text-navy-dark">Прайс-листи IN WOOD</h2>
            <p className="mt-2 text-sm text-navy-dim">
              Моделі, кольори, короб/лиштва/добір і ціни по кожній лінійці. Скачуйте той, що вам
              потрібен.
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <div className="flex items-center gap-2 rounded-full border border-navy-dark pl-4 pr-1.5 py-1.5">
                <a
                  href="/documents/prays-dilerska.html?v=2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-navy-dark hover:text-gold"
                >
                  Прайс-лист — дилерська та роздрібна ціна
                </a>
                <a
                  href="/documents/prays-dilerska.html?v=2"
                  download="Прайс-лист IN WOOD — дилерська та роздрібна ціна.html"
                  className="rounded-full bg-navy-dark px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-gold hover:text-navy-dark"
                >
                  Скачати
                </a>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-navy-dark pl-4 pr-1.5 py-1.5">
                <a
                  href="/documents/prays-rozdrib.html?v=2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-navy-dark hover:text-gold"
                >
                  Прайс-лист — тільки роздрібні ціни
                </a>
                <a
                  href="/documents/prays-rozdrib.html?v=2"
                  download="Прайс-лист IN WOOD — роздрібні ціни.html"
                  className="rounded-full bg-navy-dark px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-gold hover:text-navy-dark"
                >
                  Скачати
                </a>
              </div>
            </div>
          </div>
        )}

        {effectiveIsOwner && (
          <Link
            href="/portal/offline-calculator"
            className="rounded-xl bg-panel p-6 shadow-sm transition hover:shadow-md"
          >
            <h2 className="font-serif text-lg font-bold text-navy-dark">Офлайн-калькулятор</h2>
            <p className="mt-2 text-sm text-navy-dim">
              Один файл, що рахує КП без інтернету — аварійний резерв на випадок відключень.
            </p>
          </Link>
        )}

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

      {effectiveIsOwner && (
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
