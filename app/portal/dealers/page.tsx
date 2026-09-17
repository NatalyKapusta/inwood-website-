import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DealerNotes from "@/components/portal/DealerNotes";
import type { DealerNote } from "@/lib/dealerNotes";

export const metadata = {
  title: "Дилери — Партнерський портал IN WOOD",
  robots: { index: false, follow: false },
};

export default async function DealersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: myProfile } = await supabase.from("profiles").select("is_owner").eq("id", user.id).single();
  if (!myProfile?.is_owner) redirect("/portal");

  const { data: rows } = await supabase.from("dealer_notes").select("*").order("sort_order", { ascending: true });

  return (
    <div>
      <DealerNotes initialNotes={(rows ?? []) as DealerNote[]} />
    </div>
  );
}
