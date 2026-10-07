import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OfflineCalculatorGenerator from "@/components/portal/OfflineCalculatorGenerator";

export default async function PortalOfflineCalculatorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const { data: profile } = await supabase.from("profiles").select("is_owner").eq("id", user.id).single();
  if (!profile?.is_owner) redirect("/portal");

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-navy-dark">Офлайн-калькулятор</h1>
      <p className="mt-2 text-sm text-navy-dim">
        Один файл, який рахує комерційні пропозиції без інтернету — на випадок, якщо сайт
        недоступний (відключення світла/зв&apos;язку). Усі тарифи вшиті всередину на момент
        натискання кнопки; пізніші зміни цін на сайті в цей файл вже не потраплять — перегенеруйте,
        коли зміните прайс.
      </p>
      <div className="mt-6 rounded-xl bg-panel p-6 shadow-sm">
        <OfflineCalculatorGenerator />
      </div>
    </div>
  );
}
