import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import QuoteBuilder from "@/components/portal/QuoteBuilder";
import { VIEW_AS_COOKIE, isPortalRole, TARIFFS_BY_ROLE, type Tariff, type PortalRole } from "@/lib/portalRole";

export default async function PortalQuotePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, company_name, role, is_owner")
    .eq("id", user.id)
    .single();

  let viewingAs: PortalRole | null = null;
  if (profile?.is_owner) {
    const jar = await cookies();
    const cookieValue = jar.get(VIEW_AS_COOKIE)?.value;
    if (isPortalRole(cookieValue)) viewingAs = cookieValue;
  }
  const effectiveRole = viewingAs ?? profile?.role;
  const allowedTariffs = viewingAs ? TARIFFS_BY_ROLE[viewingAs] : "all";

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-navy-dark">
        Формування комерційної пропозиції
      </h1>
      <p className="mt-2 text-sm text-navy-dim">
        Додайте позиції, вкажіть клієнта — і збережіть готовий документ для друку чи PDF.
      </p>
      <QuoteBuilder
        consultantDefault={profile?.full_name ?? user.email ?? ""}
        canOverride={effectiveRole === "staff" || effectiveRole === "manager"}
        allowedTariffs={allowedTariffs === "all" ? undefined : (allowedTariffs as Tariff[])}
      />
    </div>
  );
}
