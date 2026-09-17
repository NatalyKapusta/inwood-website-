import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StaffNotes from "@/components/portal/StaffNotes";
import type { StaffNote } from "@/lib/staffNotes";

export const metadata = {
  title: "Співробітники — Партнерський портал IN WOOD",
  robots: { index: false, follow: false },
};

export default async function StaffNotesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: myProfile } = await supabase.from("profiles").select("is_owner").eq("id", user.id).single();
  if (!myProfile?.is_owner) redirect("/portal");

  const { data: rows } = await supabase.from("staff_notes").select("*").order("sort_order", { ascending: true });

  return (
    <div>
      <StaffNotes initialNotes={(rows ?? []) as StaffNote[]} />
    </div>
  );
}
