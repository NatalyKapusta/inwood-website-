import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { inviteUser, toggleUserAccess, updateUserRole } from "@/app/portal/actions";
import DeleteUserButton from "@/components/portal/DeleteUserButton";

const roleLabels: Record<string, string> = {
  dealer: "Дилер",
  dealer_distributor: "Дилер + роздріб + дистрибуція",
  manager: "Менеджер (тільки калькулятор)",
  staff: "Співробітник IN WOOD",
};

export default async function PortalUsersPage({
  searchParams,
}: {
  searchParams: {
    error?: string;
    invited?: string;
    blocked?: string;
    unblocked?: string;
    deleted?: string;
    roleUpdated?: string;
  };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: profile } = await supabase.from("profiles").select("is_owner").eq("id", user.id).single();
  if (!profile?.is_owner) redirect("/portal");

  const { data: allProfiles } = await supabase
    .from("profiles")
    .select("id, email, full_name, company_name, role, blocked, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-navy-dark">Користувачі порталу</h1>
      <p className="mt-2 text-sm text-navy-dim">
        Запрошення надсилається на email — людина сама встановить пароль за посиланням.
      </p>

      {searchParams.error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {searchParams.error}
        </p>
      )}
      {searchParams.invited && (
        <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Запрошення надіслано на {searchParams.invited}
        </p>
      )}
      {searchParams.blocked && (
        <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Доступ заблоковано
        </p>
      )}
      {searchParams.unblocked && (
        <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Доступ відновлено
        </p>
      )}
      {searchParams.deleted && (
        <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Користувача видалено. Цей email можна запросити знову.
        </p>
      )}
      {searchParams.roleUpdated && (
        <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Роль оновлено
        </p>
      )}

      <form action={inviteUser} className="mt-6 grid gap-3 rounded-xl bg-panel p-6 shadow-sm sm:grid-cols-2">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 outline-none focus:border-gold"
        />
        <input
          type="text"
          name="full_name"
          placeholder="Імʼя"
          className="rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 outline-none focus:border-gold"
        />
        <input
          type="text"
          name="company_name"
          placeholder="Компанія"
          className="rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 outline-none focus:border-gold"
        />
        <select
          name="role"
          defaultValue="dealer"
          className="rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 outline-none focus:border-gold"
        >
          <option value="dealer">Дилер</option>
          <option value="dealer_distributor">Дилер + роздріб + дистрибуція</option>
          <option value="manager">Менеджер (тільки калькулятор)</option>
          <option value="staff">Співробітник IN WOOD</option>
        </select>
        <button
          type="submit"
          className="rounded-full bg-navy-dark px-7 py-3 font-semibold text-white transition hover:bg-gold hover:text-navy-dark sm:col-span-2"
        >
          Запросити
        </button>
      </form>

      <div className="mt-8 overflow-x-auto rounded-xl bg-panel shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-dark text-white">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Імʼя</th>
              <th className="px-4 py-3">Компанія</th>
              <th className="px-4 py-3">Роль</th>
              <th className="px-4 py-3">Доступ</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(allProfiles ?? []).map((p) => (
              <tr key={p.id} className="border-t border-navy-dim/10">
                <td className="px-4 py-3 text-navy-dark">{p.email}</td>
                <td className="px-4 py-3 text-navy-dark">{p.full_name ?? "—"}</td>
                <td className="px-4 py-3 text-navy-dim">{p.company_name ?? "—"}</td>
                <td className="px-4 py-3 text-navy-dark">
                  {p.id === user.id ? (
                    roleLabels[p.role] ?? p.role
                  ) : (
                    <form action={updateUserRole} className="flex items-center gap-2">
                      <input type="hidden" name="user_id" value={p.id} />
                      <select
                        name="role"
                        defaultValue={p.role}
                        className="rounded-lg border border-navy-dim/30 bg-panel px-2 py-1.5 text-xs outline-none focus:border-gold"
                      >
                        <option value="dealer">Дилер</option>
                        <option value="dealer_distributor">Дилер + роздріб + дистрибуція</option>
                        <option value="manager">Менеджер (тільки калькулятор)</option>
                        <option value="staff">Співробітник IN WOOD</option>
                      </select>
                      <button
                        type="submit"
                        className="rounded-full border border-navy-dim/30 px-3 py-1.5 text-xs font-semibold text-navy-dark transition hover:border-gold hover:text-gold-dim"
                      >
                        Зберегти
                      </button>
                    </form>
                  )}
                </td>
                <td className="px-4 py-3">
                  {p.blocked ? (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                      Заблоковано
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      Активний
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {p.id === user.id ? (
                    <span className="text-xs text-navy-dim">Це ви</span>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <form action={toggleUserAccess}>
                        <input type="hidden" name="user_id" value={p.id} />
                        <input type="hidden" name="block" value={p.blocked ? "0" : "1"} />
                        <button
                          type="submit"
                          className={
                            p.blocked
                              ? "rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
                              : "rounded-full border border-red-200 bg-white px-4 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                          }
                        >
                          {p.blocked ? "Розблокувати" : "Заблокувати доступ"}
                        </button>
                      </form>
                      <DeleteUserButton userId={p.id} email={p.email ?? ""} />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
