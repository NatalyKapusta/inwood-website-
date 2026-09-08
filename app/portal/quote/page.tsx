import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import QuoteBuilder from "@/components/portal/QuoteBuilder";

export default async function PortalQuotePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, company_name, role")
    .eq("id", user.id)
    .single();

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
        isStaff={profile?.role === "staff"}
      />
    </div>
  );
}
