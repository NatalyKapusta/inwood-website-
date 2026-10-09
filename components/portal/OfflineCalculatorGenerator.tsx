"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PanelRow, AddonRow, ServiceRow, HardwareRow } from "@/lib/quote";

// Фурнітура — 485 позицій × 6 тарифів (2910 рядків) перевищує стандартний
// ліміт рядків на один запит у Supabase — підвантажуємо сторінками, як і в
// самому калькуляторі (components/portal/QuoteBuilder.tsx).
async function fetchAllHardwareRows(supabase: ReturnType<typeof createClient>): Promise<HardwareRow[]> {
  const pageSize = 1000;
  const all: HardwareRow[] = [];
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabase
      .from("hardware_tariff_prices")
      .select("brand, category, article, name, material, tariff, price, photo")
      .range(offset, offset + pageSize - 1);
    if (error || !data || data.length === 0) break;
    all.push(
      ...(data as Array<Omit<HardwareRow, "photo"> & { photo?: string | null }>).map((r) => ({
        ...r,
        photo: r.photo ?? null,
      }))
    );
    if (data.length < pageSize) break;
  }
  return all;
}

export default function OfflineCalculatorGenerator() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [counts, setCounts] = useState<{ panels: number; addons: number; services: number; hardware: number } | null>(
    null
  );

  async function handleGenerate() {
    setStatus("loading");
    setErrorMsg("");
    try {
      const supabase = createClient();
      const [panels, addons, services, hardware] = await Promise.all([
        supabase.from("product_tariff_prices").select("product_code, tariff, price"),
        supabase.from("line_addon_prices").select("collection, addon_type, item_label, tariff, price"),
        supabase.from("service_tariff_prices").select("service_key, tariff, price"),
        fetchAllHardwareRows(supabase),
      ]);
      if (panels.error || addons.error || services.error) {
        throw new Error(
          panels.error?.message || addons.error?.message || services.error?.message || "Помилка завантаження цін"
        );
      }

      const offlineData = {
        panels: (panels.data ?? []) as PanelRow[],
        addons: (addons.data ?? []) as AddonRow[],
        services: (services.data ?? []) as ServiceRow[],
        hardware,
        generatedAt: new Date().toLocaleString("uk-UA"),
      };
      setCounts({
        panels: offlineData.panels.length,
        addons: offlineData.addons.length,
        services: offlineData.services.length,
        hardware: offlineData.hardware.length,
      });

      const templateRes = await fetch("/portal/documents/offline-calculator-template");
      if (!templateRes.ok) throw new Error("Не вдалося завантажити шаблон офлайн-калькулятора");
      const template = await templateRes.text();

      const dataScript = `<script>window.__OFFLINE_DATA__=${JSON.stringify(offlineData)};<\/script>`;
      const marker = '<script type="module" crossorigin>';
      if (!template.includes(marker)) {
        throw new Error("Шаблон офлайн-калькулятора пошкоджено (не знайдено точку вставки даних)");
      }
      const finalHtml = template.replace(marker, dataScript + marker);

      const blob = new Blob([finalHtml], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const stamp = new Date().toISOString().slice(0, 10);
      const a = document.createElement("a");
      a.href = url;
      a.download = `IN-WOOD-офлайн-калькулятор-${stamp}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setStatus("done");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Невідома помилка");
      setStatus("error");
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleGenerate}
        disabled={status === "loading"}
        className="rounded-full bg-navy-dark px-6 py-3 font-semibold text-white transition hover:bg-gold hover:text-navy-dark disabled:opacity-50"
      >
        {status === "loading" ? "Збираю файл…" : "Завантажити офлайн-калькулятор"}
      </button>

      {status === "done" && counts && (
        <p className="mt-3 text-sm text-navy-dim">
          Готово — файл завантажено. Вшито: {counts.panels} позицій полотен, {counts.addons} короб/лиштва/добір,{" "}
          {counts.services} послуг, {counts.hardware} позицій фурнітури.
        </p>
      )}
      {status === "error" && <p className="mt-3 text-sm text-red-600">Помилка: {errorMsg}</p>}
    </div>
  );
}
