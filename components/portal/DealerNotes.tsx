"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { emptyDealerNote, type DealerNote } from "@/lib/dealerNotes";

const inputCls =
  "w-full rounded-lg border border-navy-dim/20 bg-panel px-2.5 py-1.5 text-sm text-navy-dark outline-none focus:border-gold";
const labelCls = "text-[11px] font-bold uppercase tracking-wide text-navy-dim";

function csvCell(v: unknown): string {
  const s = String(v ?? "");
  return /[";\n,]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

export default function DealerNotes({ initialNotes }: { initialNotes: DealerNote[] }) {
  const supabase = createClient();
  const [notes, setNotes] = useState<DealerNote[]>(initialNotes);
  const [busy, setBusy] = useState(false);
  const [refreshedNote, setRefreshedNote] = useState("");
  const [search, setSearch] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const writeTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const pendingWrites = useRef(0);

  function toggleExpanded(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const refetch = useCallback(async () => {
    const { data } = await supabase.from("dealer_notes").select("*").order("sort_order", { ascending: true });
    if (!data) return;
    setNotes(data as DealerNote[]);
    setRefreshedNote("Оновлено " + new Date().toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" }));
  }, [supabase]);

  // Немає повноцінного realtime (це список для однієї людини) — просто
  // підтягуємо свіжі дані, коли повертаються на вкладку.
  useEffect(() => {
    function onFocus() {
      refetch();
    }
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refetch]);

  function updateField<K extends keyof DealerNote>(id: string, field: K, value: DealerNote[K]) {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, [field]: value } : n)));
    setSaveStatus("saving");
    clearTimeout(writeTimers.current[id + ":" + field]);
    writeTimers.current[id + ":" + field] = setTimeout(() => {
      pendingWrites.current += 1;
      supabase
        .from("dealer_notes")
        .update({ [field]: value })
        .eq("id", id)
        .then(() => {
          pendingWrites.current -= 1;
          if (pendingWrites.current <= 0) setSaveStatus("saved");
        });
    }, 500);
  }

  async function addNote() {
    setBusy(true);
    const { data, error } = await supabase
      .from("dealer_notes")
      .insert({ ...emptyDealerNote, sort_order: notes.length + 1 })
      .select()
      .single();
    setBusy(false);
    if (!error && data) {
      setNotes((prev) => [...prev, data as DealerNote]);
      setExpanded((prev) => ({ ...prev, [(data as DealerNote).id]: true }));
    }
  }

  async function removeNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    await supabase.from("dealer_notes").delete().eq("id", id);
  }

  function downloadCsv() {
    const header = [
      "Дилер",
      "ФОП",
      "Адреса",
      "Телефон",
      "Менеджер",
      "Форма договору",
      "Моделі",
      "Останній контакт",
      "Email",
      "Коментар",
      "Логін",
      "Пароль",
    ];
    const lines = [header.map(csvCell).join(";")];
    notes.forEach((n) => {
      lines.push(
        [
          n.dealer_name,
          n.company_name,
          n.address,
          n.phone,
          n.manager,
          n.contract_form,
          n.models_discussed,
          n.last_contact_date ?? "",
          n.email,
          n.comment,
          n.portal_login,
          n.portal_password,
        ]
          .map(csvCell)
          .join(";")
      );
    });
    const csv = "﻿" + lines.join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dilery-" + new Date().toISOString().slice(0, 10) + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  const filtered = notes.filter((n) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return [n.dealer_name, n.company_name, n.address, n.phone, n.manager, n.email, n.comment].some((v) =>
      v.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-4 mb-4 flex items-center justify-end gap-1.5 bg-panel-alt px-4 py-1.5 text-xs font-semibold">
        {saveStatus === "saving" && <span className="text-navy-dim">Зберігаю...</span>}
        {saveStatus === "saved" && <span className="text-green-700">✓ Збережено</span>}
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gold-dim">IN WOOD · приватно, тільки ви</p>
          <h1 className="font-serif text-2xl font-bold text-navy-dark sm:text-3xl">Дилери</h1>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Пошук за назвою, телефоном, email..."
          className="w-full max-w-xs rounded-lg border border-navy-dim/20 bg-panel px-3 py-2 text-sm text-navy-dark outline-none focus:border-gold"
        />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {filtered.map((n) => {
          const isOpen = !!expanded[n.id];
          return (
          <div key={n.id} className="overflow-hidden rounded-2xl bg-panel shadow-sm">
            <div className="flex flex-wrap items-start gap-3 border-b border-navy-dim/10 bg-panel-alt px-5 py-4">
              <button
                type="button"
                onClick={() => toggleExpanded(n.id)}
                title={isOpen ? "Згорнути" : "Розгорнути"}
                className="mt-1 shrink-0 text-navy-dim hover:text-gold-dim"
              >
                {isOpen ? "▾" : "▸"}
              </button>
              <div className="min-w-[200px] flex-1">
                <input
                  value={n.dealer_name}
                  onChange={(e) => updateField(n.id, "dealer_name", e.target.value)}
                  onFocus={() => !isOpen && toggleExpanded(n.id)}
                  placeholder="Назва дилера"
                  className="w-full border-none bg-transparent font-serif text-lg font-bold text-navy-dark outline-none"
                />
                {isOpen ? (
                  <input
                    value={n.company_name}
                    onChange={(e) => updateField(n.id, "company_name", e.target.value)}
                    placeholder="ФОП / ТОВ"
                    className="w-full border-none bg-transparent text-xs text-navy-dim outline-none"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleExpanded(n.id)}
                    className="block w-full truncate text-left text-xs text-navy-dim"
                  >
                    {[n.company_name, n.phone, n.manager].filter(Boolean).join(" · ") || "натисніть, щоб розгорнути"}
                  </button>
                )}
              </div>
              <button
                onClick={() => removeNote(n.id)}
                title="Видалити"
                className="rounded-lg p-1.5 text-navy-dim hover:bg-red-50 hover:text-red-600"
              >
                ✕
              </button>
            </div>

            {isOpen && (
            <>
            <div className="grid grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-2 lg:grid-cols-3">
              <label className="flex flex-col gap-1">
                <span className={labelCls}>Адреса</span>
                <input value={n.address} onChange={(e) => updateField(n.id, "address", e.target.value)} className={inputCls} />
              </label>
              <label className="flex flex-col gap-1">
                <span className={labelCls}>Телефон</span>
                <input value={n.phone} onChange={(e) => updateField(n.id, "phone", e.target.value)} className={inputCls} />
              </label>
              <label className="flex flex-col gap-1">
                <span className={labelCls}>Email</span>
                <input value={n.email} onChange={(e) => updateField(n.id, "email", e.target.value)} className={inputCls} />
              </label>
              <label className="flex flex-col gap-1">
                <span className={labelCls}>Менеджер</span>
                <input value={n.manager} onChange={(e) => updateField(n.id, "manager", e.target.value)} className={inputCls} />
              </label>
              <label className="flex flex-col gap-1">
                <span className={labelCls}>Форма договору</span>
                <input
                  value={n.contract_form}
                  onChange={(e) => updateField(n.id, "contract_form", e.target.value)}
                  className={inputCls}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className={labelCls}>Останній контакт</span>
                <input
                  type="date"
                  value={n.last_contact_date ?? ""}
                  onChange={(e) => updateField(n.id, "last_contact_date", e.target.value || null)}
                  className={inputCls}
                />
              </label>
              <label className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3">
                <span className={labelCls}>Моделі / що обговорювали</span>
                <input
                  value={n.models_discussed}
                  onChange={(e) => updateField(n.id, "models_discussed", e.target.value)}
                  className={inputCls}
                />
              </label>
              <label className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3">
                <span className={labelCls}>Коментар</span>
                <input value={n.comment} onChange={(e) => updateField(n.id, "comment", e.target.value)} className={inputCls} />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 border-t border-navy-dim/10 bg-panel-alt/60 px-5 py-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className={labelCls}>Логін у кабінеті (якщо створено)</span>
                <input
                  value={n.portal_login}
                  onChange={(e) => updateField(n.id, "portal_login", e.target.value)}
                  placeholder="email для входу"
                  autoComplete="off"
                  data-lpignore="true"
                  data-1p-ignore
                  className={inputCls}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className={labelCls}>Пароль</span>
                <div className="flex items-center gap-2">
                  <input
                    type={visiblePasswords[n.id] ? "text" : "password"}
                    value={n.portal_password}
                    onChange={(e) => updateField(n.id, "portal_password", e.target.value)}
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-1p-ignore
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={() => setVisiblePasswords((prev) => ({ ...prev, [n.id]: !prev[n.id] }))}
                    className="shrink-0 rounded-lg border border-navy-dim/20 px-2 py-1.5 text-xs font-semibold text-navy-dim hover:border-gold hover:text-gold-dim"
                  >
                    {visiblePasswords[n.id] ? "Сховати" : "Показати"}
                  </button>
                </div>
              </label>
            </div>
            </>
            )}
          </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="rounded-2xl bg-panel px-5 py-6 text-center text-sm text-navy-dim shadow-sm">
            {notes.length === 0 ? "Поки що порожньо — додайте першого дилера." : "Нічого не знайдено за пошуком."}
          </p>
        )}
      </div>

      <button
        onClick={addNote}
        disabled={busy}
        className="mt-5 w-full rounded-2xl border-2 border-dashed border-navy-dim/25 bg-panel py-3.5 text-sm font-bold text-gold-dim hover:border-gold hover:bg-panel-alt"
      >
        + Додати дилера
      </button>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button onClick={refetch} className="rounded-full border border-navy-dim/30 px-4 py-2 text-xs font-semibold text-navy-dim hover:border-gold hover:text-gold-dim">
          Оновити дані
        </button>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-navy-dim">{refreshedNote || "Зберігається автоматично — бачите тільки ви"}</span>
          <button onClick={downloadCsv} className="rounded-full bg-navy-dark px-4 py-2 text-xs font-semibold text-white hover:bg-gold hover:text-navy-dark">
            Скачати .csv
          </button>
        </div>
      </div>
    </div>
  );
}
