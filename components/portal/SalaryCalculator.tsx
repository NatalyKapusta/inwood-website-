"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  salaryModeLabels,
  salesTotal,
  newOldSums,
  planIsMet,
  commissionOf,
  fmtMoney,
  fmtPct,
  type SalaryMode,
  type SalaryOrder,
  type SalaryPerson,
} from "@/lib/salary";

const MODES: SalaryMode[] = ["percent", "split", "plan", "manual"];
const inputCls =
  "rounded-lg border border-navy-dim/20 bg-panel px-2 py-1.5 text-sm text-navy-dark outline-none focus:border-gold";

function csvCell(v: unknown): string {
  const s = String(v ?? "");
  return /[";\n,]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
function csvNum(n: number): string {
  return (Math.round((Number(n) || 0) * 100) / 100).toString().replace(".", ",");
}

export default function SalaryCalculator({ initialPeople }: { initialPeople: SalaryPerson[] }) {
  const supabase = createClient();
  const [people, setPeople] = useState<SalaryPerson[]>(initialPeople);
  const [period, setPeriod] = useState(initialPeople[0]?.period ?? "");
  const [busy, setBusy] = useState(false);
  const [refreshedNote, setRefreshedNote] = useState("");
  const writeTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const refetch = useCallback(async () => {
    const { data: peopleRows } = await supabase
      .from("salary_people")
      .select("*")
      .order("sort_order", { ascending: true });
    const { data: orderRows } = await supabase
      .from("salary_orders")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!peopleRows) return;
    const next: SalaryPerson[] = peopleRows.map((p) => ({
      ...p,
      orders: (orderRows ?? []).filter((o) => o.person_id === p.id),
    })) as SalaryPerson[];
    setPeople(next);
    if (next[0]) setPeriod(next[0].period);
    setRefreshedNote("Оновлено " + new Date().toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" }));
  }, [supabase]);

  // Немає повноцінного realtime (це не потрібно для 1-2 людей) — просто
  // підтягуємо свіжі дані, коли повертаються на вкладку, щоб побачити
  // зміни колеги без ручного оновлення сторінки.
  useEffect(() => {
    function onFocus() {
      refetch();
    }
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refetch]);

  function scheduleWrite(key: string, fn: () => void, delay = 500) {
    clearTimeout(writeTimers.current[key]);
    writeTimers.current[key] = setTimeout(fn, delay);
  }

  function updatePersonField<K extends keyof SalaryPerson>(id: string, field: K, value: SalaryPerson[K]) {
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    scheduleWrite("person:" + id, () => {
      supabase
        .from("salary_people")
        .update({ [field]: value })
        .eq("id", id)
        .then();
    });
  }

  function updateOrderField<K extends keyof SalaryOrder>(personId: string, orderId: string, field: K, value: SalaryOrder[K]) {
    setPeople((prev) =>
      prev.map((p) =>
        p.id !== personId
          ? p
          : { ...p, orders: p.orders.map((o) => (o.id === orderId ? { ...o, [field]: value } : o)) }
      )
    );
    scheduleWrite("order:" + orderId, () => {
      supabase
        .from("salary_orders")
        .update({ [field]: value })
        .eq("id", orderId)
        .then();
    });
  }

  async function addPerson() {
    setBusy(true);
    const { data, error } = await supabase
      .from("salary_people")
      .insert({ period, name: "Новий менеджер", mode: "plan", rate: 2.5, sort_order: people.length + 1 })
      .select()
      .single();
    setBusy(false);
    if (!error && data) setPeople((prev) => [...prev, { ...data, orders: [] } as SalaryPerson]);
  }

  async function removePerson(id: string) {
    setPeople((prev) => prev.filter((p) => p.id !== id));
    await supabase.from("salary_people").delete().eq("id", id);
  }

  async function addOrder(personId: string) {
    const person = people.find((p) => p.id === personId);
    const { data, error } = await supabase
      .from("salary_orders")
      .insert({ person_id: personId, comment: "", amount: 0, kind: "new", sort_order: (person?.orders.length ?? 0) + 1 })
      .select()
      .single();
    if (!error && data) {
      setPeople((prev) => prev.map((p) => (p.id === personId ? { ...p, orders: [...p.orders, data as SalaryOrder] } : p)));
    }
  }

  async function removeOrder(personId: string, orderId: string) {
    setPeople((prev) =>
      prev.map((p) => (p.id === personId ? { ...p, orders: p.orders.filter((o) => o.id !== orderId) } : p))
    );
    await supabase.from("salary_orders").delete().eq("id", orderId);
  }

  function onPeriodBlur() {
    people.forEach((p) => {
      if (p.period !== period) {
        supabase.from("salary_people").update({ period }).eq("id", p.id).then();
      }
    });
    setPeople((prev) => prev.map((p) => ({ ...p, period })));
  }

  const totalPayout = people.reduce((s, p) => s + commissionOf(p), 0);
  const totalSales = people.reduce((s, p) => s + salesTotal(p), 0);

  function downloadCsv() {
    const lines: string[] = [];
    lines.push([`Комісійні IN WOOD — період: ${period || "не вказано"}`].map(csvCell).join(";"));
    lines.push("");
    lines.push(["ЗВЕДЕННЯ"].map(csvCell).join(";"));
    lines.push(["Менеджер", "Примітка", "Нарахування", "Оборот, грн", "Комісія, грн"].map(csvCell).join(";"));
    people.forEach((p) => {
      const modeText =
        p.mode === "percent"
          ? "Відсоток " + fmtPct(p.rate)
          : p.mode === "split"
          ? "Нові " + fmtPct(p.rate_new) + " / старі " + fmtPct(p.rate_old)
          : p.mode === "plan"
          ? planIsMet(p)
            ? "План, " + fmtPct(p.rate)
            : "План не виконано, вручну"
          : "Вручну";
      lines.push(
        [p.name, p.note, modeText, csvNum(salesTotal(p)), csvNum(commissionOf(p))].map(csvCell).join(";")
      );
    });
    lines.push(["РАЗОМ", "", "", csvNum(totalSales), csvNum(totalPayout)].map(csvCell).join(";"));
    lines.push("");
    lines.push(["ДЕТАЛІЗАЦІЯ ЗАМОВЛЕНЬ"].map(csvCell).join(";"));
    lines.push(["Менеджер", "Дата", "Замовлення / клієнт", "Сума, грн", "Тип"].map(csvCell).join(";"));
    people.forEach((p) => {
      p.orders.forEach((o) => {
        lines.push(
          [p.name, o.order_date ?? "", o.comment, csvNum(o.amount), p.mode === "split" ? (o.kind === "old" ? "старе" : "нове") : ""]
            .map(csvCell)
            .join(";")
        );
      });
    });
    const csv = "﻿" + lines.join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "komisiyni-" + (period || "period").toLowerCase().replace(/[^a-z0-9а-яіїєґ]+/gi, "-") + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  return (
    <div className="print:bg-white">
      <div className="flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gold-dim">IN WOOD · відділ продажів</p>
          <h1 className="font-serif text-2xl font-bold text-navy-dark sm:text-3xl">Комісійні менеджерів</h1>
        </div>
        <label className="flex items-center gap-2 rounded-lg border border-navy-dim/20 bg-panel px-3 py-2 text-sm shadow-sm">
          <span className="text-navy-dim">Період</span>
          <input
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            onBlur={onPeriodBlur}
            placeholder="напр. вересень 2026"
            className="w-40 border-none bg-transparent font-semibold text-navy-dark outline-none"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-navy-dim/15 bg-navy-dim/15 shadow-sm sm:grid-cols-3 print:border-navy-dim/30">
        <div className="bg-navy-dark p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-gold-dim">До виплати всього</p>
          <p className="mt-1.5 font-mono text-2xl font-bold tabular-nums text-white">{fmtMoney(totalPayout)}</p>
        </div>
        <div className="bg-panel p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-navy-dim">Загальний оборот</p>
          <p className="mt-1.5 font-mono text-2xl font-bold tabular-nums text-navy-dark">{fmtMoney(totalSales)}</p>
        </div>
        <div className="bg-panel p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-navy-dim">Менеджерів</p>
          <p className="mt-1.5 font-mono text-2xl font-bold tabular-nums text-navy-dark">{people.length}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-5">
        {people.map((p) => {
          const total = salesTotal(p);
          const comm = commissionOf(p);
          const met = planIsMet(p);
          const showManual = p.mode === "manual" || (p.mode === "plan" && !met);
          return (
            <div key={p.id} className="overflow-hidden rounded-2xl bg-panel shadow-sm print:break-inside-avoid print:border print:border-navy-dim/30">
              <div className="flex flex-wrap items-center gap-3 border-b border-navy-dim/10 bg-panel-alt px-5 py-4">
                <div className="min-w-[160px] flex-1">
                  <input
                    value={p.name}
                    onChange={(e) => updatePersonField(p.id, "name", e.target.value)}
                    placeholder="Ім'я"
                    className="w-full border-none bg-transparent font-serif text-lg font-bold text-navy-dark outline-none"
                  />
                  <input
                    value={p.note}
                    onChange={(e) => updatePersonField(p.id, "note", e.target.value)}
                    placeholder="примітка"
                    className="w-full border-none bg-transparent text-xs text-navy-dim outline-none"
                  />
                </div>
                <select
                  value={p.mode}
                  onChange={(e) => updatePersonField(p.id, "mode", e.target.value as SalaryMode)}
                  className={inputCls}
                >
                  {MODES.map((m) => (
                    <option key={m} value={m}>
                      {salaryModeLabels[m]}
                    </option>
                  ))}
                </select>
                {p.mode === "percent" || p.mode === "plan" ? (
                  <span className="flex items-center gap-1.5 text-sm text-navy-dim">
                    ставка
                    <input
                      type="number"
                      step="0.1"
                      value={p.rate}
                      onChange={(e) => updatePersonField(p.id, "rate", Number(e.target.value))}
                      className={inputCls + " w-16 text-right"}
                    />
                    %
                  </span>
                ) : p.mode === "split" ? (
                  <>
                    <span className="flex items-center gap-1.5 text-sm text-navy-dim">
                      нові
                      <input
                        type="number"
                        step="0.1"
                        value={p.rate_new}
                        onChange={(e) => updatePersonField(p.id, "rate_new", Number(e.target.value))}
                        className={inputCls + " w-16 text-right"}
                      />
                      %
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-navy-dim">
                      старі
                      <input
                        type="number"
                        step="0.1"
                        value={p.rate_old}
                        onChange={(e) => updatePersonField(p.id, "rate_old", Number(e.target.value))}
                        className={inputCls + " w-16 text-right"}
                      />
                      %
                    </span>
                  </>
                ) : null}
                <div className="ml-auto text-right">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-navy-dim">Комісійні</p>
                  <p className="font-mono text-xl font-bold tabular-nums text-gold-dim">{fmtMoney(comm)}</p>
                </div>
                <button
                  onClick={() => removePerson(p.id)}
                  title="Видалити менеджера"
                  className="rounded-lg p-1.5 text-navy-dim hover:bg-red-50 hover:text-red-600 print:hidden"
                >
                  ✕
                </button>
              </div>

              {p.mode === "plan" && (
                <div className="flex flex-wrap items-center gap-3 border-b border-navy-dim/10 bg-panel-alt/60 px-5 py-3 text-sm">
                  <label className="flex items-center gap-2 text-navy-dim">
                    Ціль по сумі, ₴
                    <input
                      type="number"
                      value={p.plan_target || ""}
                      placeholder="не задано"
                      onChange={(e) => updatePersonField(p.id, "plan_target", Number(e.target.value))}
                      className={inputCls + " w-28 text-right"}
                    />
                  </label>
                  {Number(p.plan_target) > 0 ? (
                    <span
                      className={
                        "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide " +
                        (met ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700")
                      }
                    >
                      {met ? "План виконано" : "План не виконано"}
                    </span>
                  ) : (
                    <button
                      onClick={() => updatePersonField(p.id, "plan_met", !p.plan_met)}
                      className={
                        "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold print:hidden " +
                        (p.plan_met ? "border-transparent bg-green-50 text-green-700" : "border-transparent bg-orange-50 text-orange-700")
                      }
                    >
                      <span className={"h-2 w-2 rounded-full " + (p.plan_met ? "bg-green-600" : "bg-orange-600")} />
                      {p.plan_met ? "План виконано" : "План не виконано"}
                    </button>
                  )}
                </div>
              )}

              {p.orders.length > 0 && (
                <div className="px-5 py-3">
                  <div
                    className={
                      "grid gap-2 pb-1 text-[11px] font-bold uppercase tracking-wide text-navy-dim " +
                      (p.mode === "split" ? "grid-cols-[100px_1fr_120px_90px_28px]" : "grid-cols-[100px_1fr_120px_28px]")
                    }
                  >
                    <span>Дата</span>
                    <span>Замовлення / клієнт</span>
                    <span className="text-right">Сума</span>
                    {p.mode === "split" && <span>Тип</span>}
                    <span />
                  </div>
                  {p.orders.map((o) => (
                    <div
                      key={o.id}
                      className={
                        "grid items-center gap-2 border-t border-navy-dim/10 py-1.5 " +
                        (p.mode === "split" ? "grid-cols-[100px_1fr_120px_90px_28px]" : "grid-cols-[100px_1fr_120px_28px]")
                      }
                    >
                      <input
                        type="date"
                        value={o.order_date ?? ""}
                        onChange={(e) => updateOrderField(p.id, o.id, "order_date", e.target.value)}
                        className="w-full rounded border-none bg-transparent text-xs text-navy-dim outline-none focus:bg-panel-alt"
                      />
                      <input
                        value={o.comment}
                        onChange={(e) => updateOrderField(p.id, o.id, "comment", e.target.value)}
                        placeholder="№ замовлення / клієнт"
                        className="w-full rounded border-none bg-transparent text-sm text-navy-dark outline-none focus:bg-panel-alt"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={o.amount}
                        onChange={(e) => updateOrderField(p.id, o.id, "amount", Number(e.target.value))}
                        className="w-full rounded border-none bg-transparent text-right font-mono text-sm tabular-nums text-navy-dark outline-none focus:bg-panel-alt"
                      />
                      {p.mode === "split" && (
                        <select
                          value={o.kind}
                          onChange={(e) => updateOrderField(p.id, o.id, "kind", e.target.value as "new" | "old")}
                          className={
                            "rounded border px-1.5 py-1 text-xs font-semibold " +
                            (o.kind === "old" ? "border-orange-200 text-orange-700" : "border-green-200 text-green-700")
                          }
                        >
                          <option value="new">нове</option>
                          <option value="old">старе</option>
                        </select>
                      )}
                      <button
                        onClick={() => removeOrder(p.id, o.id)}
                        className="justify-self-end text-navy-dim hover:text-red-600 print:hidden"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addOrder(p.id)}
                    className="mt-2 rounded-lg border border-dashed border-navy-dim/30 px-3 py-1.5 text-xs font-semibold text-navy-dim hover:border-gold hover:text-gold-dim print:hidden"
                  >
                    + Додати замовлення
                  </button>
                </div>
              )}

              {showManual && (
                <div className="border-t border-navy-dim/10 px-5 py-3">
                  <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-navy-dim">
                    Сума виплати вручну
                    <input
                      type="number"
                      step="0.01"
                      value={p.manual_amount || ""}
                      onChange={(e) => updatePersonField(p.id, "manual_amount", Number(e.target.value))}
                      className={inputCls + " w-44 font-mono text-base tabular-nums"}
                    />
                  </label>
                </div>
              )}

              <div className="flex flex-wrap justify-between gap-2 border-t border-navy-dim/10 bg-panel-alt px-5 py-3 text-sm text-navy-dim">
                <span>
                  Оборот: <b className="font-mono tabular-nums text-navy-dark">{fmtMoney(total)}</b>
                </span>
                <span>
                  {p.mode === "split" ? (
                    <>
                      нові {fmtMoney(newOldSums(p).newSum)} × {fmtPct(p.rate_new)} + старі {fmtMoney(newOldSums(p).oldSum)} ×{" "}
                      {fmtPct(p.rate_old)}
                    </>
                  ) : p.mode === "percent" ? (
                    <>
                      {fmtMoney(total)} × {fmtPct(p.rate)}
                    </>
                  ) : p.mode === "plan" ? (
                    met ? (
                      <>
                        {fmtMoney(total)} × {fmtPct(p.rate)}
                      </>
                    ) : (
                      "сума введена вручну"
                    )
                  ) : null}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={addPerson}
        disabled={busy}
        className="mt-5 w-full rounded-2xl border-2 border-dashed border-navy-dim/25 bg-panel py-3.5 text-sm font-bold text-gold-dim hover:border-gold hover:bg-panel-alt print:hidden"
      >
        + Додати менеджера
      </button>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button onClick={refetch} className="rounded-full border border-navy-dim/30 px-4 py-2 text-xs font-semibold text-navy-dim hover:border-gold hover:text-gold-dim">
          Оновити дані
        </button>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-navy-dim">{refreshedNote || "Зберігається автоматично для всіх з доступом"}</span>
          <button onClick={() => window.print()} className="rounded-full border border-navy-dim/30 px-4 py-2 text-xs font-semibold text-navy-dim hover:border-gold hover:text-gold-dim">
            Друк / PDF
          </button>
          <button onClick={downloadCsv} className="rounded-full bg-navy-dark px-4 py-2 text-xs font-semibold text-white hover:bg-gold hover:text-navy-dark">
            Таблиця з цифрами (.csv)
          </button>
        </div>
      </div>
    </div>
  );
}
