import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SalaryCalculator from "@/components/portal/SalaryCalculator";
import type { SalaryOrder, SalaryPerson } from "@/lib/salary";

export const metadata = {
  title: "Зарплата — Партнерський портал IN WOOD",
  robots: { index: false, follow: false },
};

export default async function SalaryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("salary_access, is_owner")
    .eq("id", user.id)
    .single();
  if (!myProfile?.salary_access && !myProfile?.is_owner) redirect("/portal");

  const { data: peopleRows } = await supabase
    .from("salary_people")
    .select("*")
    .order("sort_order", { ascending: true });
  const { data: orderRows } = await supabase
    .from("salary_orders")
    .select("*")
    .order("sort_order", { ascending: true });

  const people: SalaryPerson[] = (peopleRows ?? []).map((p) => ({
    ...p,
    orders: ((orderRows ?? []) as SalaryOrder[]).filter((o) => (o as unknown as { person_id: string }).person_id === p.id),
  })) as SalaryPerson[];

  return (
    <div>
      <SalaryCalculator initialPeople={people} />
    </div>
  );
}
