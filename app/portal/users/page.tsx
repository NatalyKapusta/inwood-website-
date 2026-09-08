import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { inviteUser } from "@/app/portal/actions";

const roleLabels: Record<string, string> = {
  dealer: "Дилер",
  dealer_distributor: "Дилер + роздріб + дистрибуція",
  staff: "Співробітник IN WOOD",
};

export default async function PortalUsersPage({
  searchParams,
}: {
  searchParams: { error?: string; invited?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "staff") redirect("/portal");

  const { data: allProfiles } = await supabase
    .from("profiles")
    .select("id, email, full_name, company_name, role, created_at")
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
            </tr>
          </thead>
          <tbody>
            {(allProfiles ?? []).map((p) => (
              <tr key={p.id} className="border-t border-navy-dim/10">
                <td className="px-4 py-3 text-navy-dark">{p.email}</td>
                <td className="px-4 py-3 text-navy-dark">{p.full_name ?? "—"}</td>
                <td className="px-4 py-3 text-navy-dim">{p.company_name ?? "—"}</td>
                <td className="px-4 py-3 text-navy-dark">{roleLabels[p.role] ?? p.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
