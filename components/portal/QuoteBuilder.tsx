"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { collections, collectionOrder } from "@/lib/products";
import modelVariantsData from "@/data/model-variants.json";
import {
  tariffLabels,
  positionTotal,
  isAluEdgeVariant,
  isAddonCompatible,
  type Tariff,
  type PanelRow,
  type AddonRow,
  type ServiceRow,
  type QuotePosition,
  type ModelVariant,
  type ModelVariantsData,
  type VariantType,
} from "@/lib/quote";

const variantsData = modelVariantsData as unknown as ModelVariantsData;

function hiddenDoorCode(image: string) {
  const file = image.split("/").pop() ?? "";
  return file.replace(/\.\w+$/, "");
}

const VRIZKA_OPTIONS = [
  { value: "none", label: "Без врізки" },
  { value: "lock", label: "Врізка під замок" },
  { value: "full", label: "Повна врізка фурнітури" },
] as const;

export default function QuoteBuilder({ consultantDefault }: { consultantDefault: string }) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [panelRows, setPanelRows] = useState<PanelRow[]>([]);
  const [addonRows, setAddonRows] = useState<AddonRow[]>([]);
  const [serviceRows, setServiceRows] = useState<ServiceRow[]>([]);

  const [tariff, setTariff] = useState<Tariff | "">("");
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [consultantName, setConsultantName] = useState(consultantDefault);
  const [discountType, setDiscountType] = useState<"percent" | "amount">("percent");
  const [discountValue, setDiscountValue] = useState(0);

  const [collectionKey, setCollectionKey] = useState(collectionOrder[0]);
  const [modelCode, setModelCode] = useState("");
  const [variantCode, setVariantCode] = useState("");
  const [colorLabel, setColorLabel] = useState("");
  const [korob, setKorob] = useState("");
  const [lishtvaFront, setLishtvaFront] = useState("");
  const [lishtvaBack, setLishtvaBack] = useState("");
  const [dobir, setDobir] = useState("");
  const [vrizka, setVrizka] = useState<"none" | "lock" | "full">("none");
  const [shumo, setShumo] = useState(false);
  const [alumPaint, setAlumPaint] = useState(false);
  const [paintKorobRal, setPaintKorobRal] = useState(false);
  const [qty, setQty] = useState(1);

  const [positions, setPositions] = useState<QuotePosition[]>([]);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const [panels, addons, services] = await Promise.all([
        supabase.from("product_tariff_prices").select("product_code, tariff, price"),
        supabase.from("line_addon_prices").select("collection, addon_type, item_label, tariff, price"),
        supabase.from("service_tariff_prices").select("service_key, tariff, price"),
      ]);
      if (panels.error || addons.error || services.error) {
        setLoadError(
          panels.error?.message || addons.error?.message || services.error?.message || "Помилка завантаження цін"
        );
        setLoading(false);
        return;
      }
      setPanelRows((panels.data ?? []) as PanelRow[]);
      setAddonRows((addons.data ?? []) as AddonRow[]);
      setServiceRows((services.data ?? []) as ServiceRow[]);
      const tariffsAvailable = Array.from(new Set((panels.data ?? []).map((r) => r.tariff))) as Tariff[];
      if (tariffsAvailable.length > 0) setTariff(tariffsAvailable[0]);
      setLoading(false);
    })();
  }, []);

  const availableTariffs = useMemo(
    () => Array.from(new Set(panelRows.map((r) => r.tariff))) as Tariff[],
    [panelRows]
  );

  const isHiddenDoors = collectionKey === "hidden-doors";
  const models = collections[collectionKey]?.models ?? [];
  const currentModel = models.find((m) => m.code === modelCode);
  const hiddenVariants = collections["hidden-doors"]?.variants ?? [];

  // Варіанти конкретної моделі (база/алюм. крайка/INSIDE/RAL) — для hidden-doors
  // кожен пункт списку вже сам по собі окремий покупний варіант.
  const variantOptions: ModelVariant[] = isHiddenDoors
    ? []
    : variantsData.variantsByBaseCode[modelCode] ?? [{ code: modelCode, variantType: "base", label: "База" }];
  const effectiveVariantCode = isHiddenDoors ? modelCode : variantCode || modelCode;
  const variantType: VariantType = variantsData.variantTypeByCode[effectiveVariantCode] ?? "base";
  const isAluEdge = isAluEdgeVariant(variantType);

  const korobOptionsAll = addonRows.filter((r) => r.collection === collectionKey && r.addon_type === "korob" && r.tariff === tariff);
  const lishtvaOptionsAll = addonRows.filter((r) => r.collection === collectionKey && r.addon_type === "lishtva" && r.tariff === tariff);
  const dobirOptionsAll = addonRows.filter((r) => r.collection === collectionKey && r.addon_type === "dobir" && r.tariff === tariff);

  const korobOptions = korobOptionsAll.filter((r) => isAddonCompatible(collectionKey, variantType, r.item_label));
  const lishtvaOptions = lishtvaOptionsAll.filter((r) => isAddonCompatible(collectionKey, variantType, r.item_label));
  const dobirOptions = dobirOptionsAll.filter((r) => isAddonCompatible(collectionKey, variantType, r.item_label));

  function priceOf(list: AddonRow[], label: string) {
    return list.find((r) => r.item_label === label)?.price ?? 0;
  }
  function serviceePrice(key: string) {
    return serviceRows.find((r) => r.service_key === key && r.tariff === tariff)?.price ?? 0;
  }
  function panelPrice() {
    return panelRows.find((r) => r.product_code === effectiveVariantCode && r.tariff === tariff)?.price ?? 0;
  }

  const previewRows = useMemo(() => {
    if (!modelCode || !tariff) return [];
    const rows: { label: string; unitPrice: number }[] = [];
    const variantLabel = variantOptions.find((v) => v.code === effectiveVariantCode)?.label;
    rows.push({
      label: `Полотно, ${modelCode}${variantLabel && variantLabel !== "База" ? ` (${variantLabel})` : ""}`,
      unitPrice: panelPrice(),
    });
    if (korob) rows.push({ label: korob, unitPrice: priceOf(korobOptions, korob) });
    if (lishtvaFront) rows.push({ label: `${lishtvaFront} (лицьова)`, unitPrice: priceOf(lishtvaOptions, lishtvaFront) });
    if (lishtvaBack) rows.push({ label: `${lishtvaBack} (тильна)`, unitPrice: priceOf(lishtvaOptions, lishtvaBack) });
    if (dobir) rows.push({ label: dobir, unitPrice: priceOf(dobirOptions, dobir) });
    if (vrizka === "lock")
      rows.push({
        label: "Врізка під замок",
        unitPrice: serviceePrice(isAluEdge ? "VRIZKA_LOCK_PRICE_ALU" : "VRIZKA_LOCK_PRICE"),
      });
    if (vrizka === "full")
      rows.push({
        label: "Повна врізка фурнітури",
        unitPrice: serviceePrice(isAluEdge ? "VRIZKA_FULL_PRICE_ALU" : "VRIZKA_FULL_PRICE"),
      });
    if (shumo) rows.push({ label: "Шумоізоляція", unitPrice: serviceePrice("SHUMO_PRICE") });
    if (alumPaint) rows.push({ label: "Фарбування алюм. крайки", unitPrice: serviceePrice("ALUM_PAINT_PRICE") });
    if (paintKorobRal)
      rows.push({ label: "Фарбування коробки прих. монтажу по RAL", unitPrice: serviceePrice("PAINT_KOROB_RAL_PRICE") });
    return rows;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    modelCode,
    effectiveVariantCode,
    tariff,
    korob,
    lishtvaFront,
    lishtvaBack,
    dobir,
    vrizka,
    shumo,
    alumPaint,
    paintKorobRal,
    addonRows,
    serviceRows,
    panelRows,
  ]);

  const previewTotal = previewRows.reduce((s, r) => s + r.unitPrice, 0) * qty;

  function addPosition() {
    if (!modelCode || previewRows.length === 0) return;
    const position: QuotePosition = {
      id: crypto.randomUUID(),
      collectionLabel: collections[collectionKey].label,
      modelCode,
      colorLabel,
      photo: isHiddenDoors
        ? hiddenVariants.find((v) => hiddenDoorCode(v.image) === modelCode)?.image
        : currentModel?.colors.find((c) => c.label === colorLabel)?.image ?? currentModel?.colors[0]?.image,
      qty,
      rows: previewRows.map((r) => ({ label: r.label, unitPrice: r.unitPrice, qty, amount: r.unitPrice * qty })),
    };
    setPositions((prev) => [...prev, position]);
    setVariantCode(modelCode);
    setKorob("");
    setLishtvaFront("");
    setLishtvaBack("");
    setDobir("");
    setVrizka("none");
    setShumo(false);
    setAlumPaint(false);
    setPaintKorobRal(false);
    setQty(1);
  }

  function removePosition(id: string) {
    setPositions((prev) => prev.filter((p) => p.id !== id));
  }

  const subtotal = positions.reduce((s, p) => s + positionTotal(p), 0);
  const discountAmount = discountType === "percent" ? (subtotal * discountValue) / 100 : discountValue;
  const total = Math.max(0, subtotal - discountAmount);

  function buildDocumentHtml() {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const rowsHtml = positions
      .map((p) => {
        const subRows = p.rows
          .map(
            (r, idx) => `
        <tr>
          ${idx === 0 ? `<td rowspan="${p.rows.length}" style="text-align:center;"><img src="${origin}${p.photo ?? ""}" alt="" style="width:64px;height:auto;border-radius:6px;" /></td>` : ""}
          ${idx === 0 ? `<td rowspan="${p.rows.length}"><strong>${p.collectionLabel} — ${p.modelCode}</strong><br/><span style="color:#8A90A6;font-size:12px;">${p.colorLabel || ""}</span></td>` : ""}
          <td>${r.label}</td>
          <td style="text-align:center;">${r.qty}</td>
          <td style="text-align:right;">${r.unitPrice.toFixed(2)} ₴</td>
          <td style="text-align:right;">${r.amount.toFixed(2)} ₴</td>
        </tr>`
          )
          .join("");
        return subRows;
      })
      .join("");

    const discountRow =
      discountValue > 0
        ? `<div style="text-align:right;color:#8A90A6;text-decoration:line-through;">Було: ${subtotal.toFixed(2)} ₴</div>
           <div style="text-align:right;font-size:13px;color:#8A90A6;">Знижка: ${discountAmount.toFixed(2)} ₴</div>`
        : "";

    return `<!doctype html>
<html lang="uk"><head><meta charset="utf-8" />
<title>Комерційна пропозиція — IN WOOD</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; color: #333958; margin: 0; padding: 0; }
  .header { background: #333958; color: #fff; padding: 24px 32px; display: flex; justify-content: space-between; border-bottom: 4px solid #E3CCA1; }
  .header h1 { margin: 0; font-size: 22px; }
  .header p { margin: 4px 0 0; color: #E3CCA1; font-size: 12px; text-transform: uppercase; }
  .content { padding: 24px 32px; }
  .boxes { display: flex; gap: 16px; margin: 20px 0; }
  .box { flex: 1; background: #F7F6F2; border-radius: 8px; padding: 14px 16px; }
  .box .title { color: #B7935A; font-size: 11px; text-transform: uppercase; font-weight: bold; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th { text-align: left; border-bottom: 2px solid #E3CCA1; padding: 8px 6px; font-size: 12px; text-transform: uppercase; color: #333958; }
  td { padding: 8px 6px; border-bottom: 1px solid #eee; font-size: 13px; vertical-align: top; }
  .totals { text-align: right; margin-top: 16px; font-size: 20px; font-weight: bold; color: #333958; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #8A90A6; text-align: center; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head><body>
  <div class="header">
    <div>
      <h1>Комерційна пропозиція</h1>
      <p>IN WOOD · Двері та фурнітура</p>
    </div>
    <div style="text-align:right;font-size:12px;">
      <div>Дата: ${new Date().toLocaleDateString("uk-UA")}</div>
      <div>Тариф: ${tariffLabels[tariff as Tariff] ?? tariff}</div>
    </div>
  </div>
  <div class="content">
    <p><strong>Шановний(а) ${clientName || "клієнте"},</strong></p>
    <p>IN WOOD раді запропонувати вам цю комерційну пропозицію на виготовлення та постачання міжкімнатних дверей.</p>
    <div class="boxes">
      <div class="box"><div class="title">Клієнт</div><div>${clientName || "—"}</div><div>${clientContact || ""}</div></div>
      <div class="box"><div class="title">Консультант IN WOOD</div><div>${consultantName || "—"}</div></div>
    </div>
    <table>
      <thead><tr><th>Фото</th><th>Модель</th><th>Позиція</th><th>К-сть</th><th>Ціна за од.</th><th>Сума</th></tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table>
    <div class="totals">
      ${discountRow}
      <div>Разом: ${total.toFixed(2)} ₴</div>
    </div>
    <div class="footer">
      Дякуємо за співпрацю з IN WOOD!<br/>
      Документ згенеровано автоматично і не є фіскальним чеком.
    </div>
  </div>
</body></html>`;
  }

  function downloadDocument() {
    const html = buildDocumentHtml();
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "");
    a.href = url;
    a.download = `komertsiyna_propozytsiya_${stamp}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function printDocument() {
    const html = buildDocumentHtml();
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  }

  async function saveToHistory() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user || !tariff) return;
    const { error } = await supabase.from("quotes").insert({
      client_name: clientName || null,
      client_contact: clientContact || null,
      consultant_name: consultantName || null,
      tariff,
      discount_type: discountValue > 0 ? discountType : null,
      discount_value: discountValue > 0 ? discountValue : null,
      items: positions,
      subtotal,
      total,
      created_by: user.id,
    });
    setSaveMessage(error ? `Помилка збереження: ${error.message}` : "Збережено в історію КП");
  }

  if (loading) return <p className="mt-6 text-navy-dim">Завантаження цін...</p>;
  if (loadError) return <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</p>;
  if (availableTariffs.length === 0)
    return (
      <p className="mt-6 rounded-lg bg-panel p-6 text-navy-dim">
        Тарифні ціни ще не завантажені у систему — конструктор КП поки недоступний.
      </p>
    );

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[380px_1fr]">
      <div className="space-y-6">
        <div className="rounded-xl bg-panel p-5 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-navy-dark">Клієнт і тариф</h2>
          <div className="mt-3 flex flex-col gap-3">
            {availableTariffs.length > 1 && (
              <select
                value={tariff}
                onChange={(e) => setTariff(e.target.value as Tariff)}
                className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
              >
                {availableTariffs.map((t) => (
                  <option key={t} value={t}>
                    {tariffLabels[t]}
                  </option>
                ))}
              </select>
            )}
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ім'я клієнта"
              className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
            />
            <input
              value={clientContact}
              onChange={(e) => setClientContact(e.target.value)}
              placeholder="Телефон / email клієнта"
              className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
            />
            <input
              value={consultantName}
              onChange={(e) => setConsultantName(e.target.value)}
              placeholder="Консультант IN WOOD"
              className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
            />
          </div>
        </div>

        <div className="rounded-xl bg-panel p-5 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-navy-dark">Додати позицію</h2>
          <div className="mt-3 flex flex-col gap-3">
            <select
              value={collectionKey}
              onChange={(e) => {
                setCollectionKey(e.target.value);
                setModelCode("");
                setVariantCode("");
                setColorLabel("");
              }}
              className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
            >
              {collectionOrder
                .filter((k) => collections[k]?.models?.length || collections[k]?.variants?.length)
                .map((k) => (
                  <option key={k} value={k}>
                    {collections[k].label}
                  </option>
                ))}
            </select>

            <select
              value={modelCode}
              onChange={(e) => {
                setModelCode(e.target.value);
                setVariantCode(e.target.value);
                setColorLabel("");
              }}
              className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
            >
              <option value="">Модель...</option>
              {isHiddenDoors
                ? hiddenVariants.map((v) => (
                    <option key={v.image} value={hiddenDoorCode(v.image)}>
                      {v.label}
                    </option>
                  ))
                : models.map((m) => (
                    <option key={m.code} value={m.code}>
                      {m.code}
                    </option>
                  ))}
            </select>

            {!isHiddenDoors && modelCode && variantOptions.length > 1 && (
              <select
                value={variantCode}
                onChange={(e) => setVariantCode(e.target.value)}
                className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
              >
                {variantOptions.map((v) => (
                  <option key={v.code} value={v.code}>
                    {v.label}
                  </option>
                ))}
              </select>
            )}

            {currentModel && (
              <select
                value={colorLabel}
                onChange={(e) => setColorLabel(e.target.value)}
                className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
              >
                <option value="">Колір...</option>
                {currentModel.colors.map((c) => (
                  <option key={c.slug} value={c.label}>
                    {c.label}
                  </option>
                ))}
              </select>
            )}

            <select
              value={korob}
              onChange={(e) => setKorob(e.target.value)}
              className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
            >
              <option value="">Короб — не обрано</option>
              {korobOptions.map((r) => (
                <option key={r.item_label} value={r.item_label}>
                  {r.item_label}
                </option>
              ))}
            </select>

            <select
              value={lishtvaFront}
              onChange={(e) => setLishtvaFront(e.target.value)}
              className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
            >
              <option value="">Лиштва лицьова — не обрано</option>
              {lishtvaOptions.map((r) => (
                <option key={r.item_label} value={r.item_label}>
                  {r.item_label}
                </option>
              ))}
            </select>

            <select
              value={lishtvaBack}
              onChange={(e) => setLishtvaBack(e.target.value)}
              className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
            >
              <option value="">Лиштва тильна — не обрано</option>
              {lishtvaOptions.map((r) => (
                <option key={r.item_label} value={r.item_label}>
                  {r.item_label}
                </option>
              ))}
            </select>

            <select
              value={dobir}
              onChange={(e) => setDobir(e.target.value)}
              className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
            >
              <option value="">Добір — не обрано</option>
              {dobirOptions.map((r) => (
                <option key={r.item_label} value={r.item_label}>
                  {r.item_label}
                </option>
              ))}
            </select>

            <select
              value={vrizka}
              onChange={(e) => setVrizka(e.target.value as "none" | "lock" | "full")}
              className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
            >
              {VRIZKA_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            {collectionKey === "etalon" && (
              <label className="flex items-center gap-2 text-sm text-navy-dark">
                <input type="checkbox" checked={shumo} onChange={(e) => setShumo(e.target.checked)} />
                Шумоізоляція
              </label>
            )}

            {(collectionKey === "etalon" || isHiddenDoors) && (
              <label className="flex items-center gap-2 text-sm text-navy-dark">
                <input type="checkbox" checked={alumPaint} onChange={(e) => setAlumPaint(e.target.checked)} />
                Фарбування алюм. крайки
              </label>
            )}

            {isHiddenDoors && (
              <label className="flex items-center gap-2 text-sm text-navy-dark">
                <input
                  type="checkbox"
                  checked={paintKorobRal}
                  onChange={(e) => setPaintKorobRal(e.target.checked)}
                />
                Фарбування коробки прих. монтажу по RAL
              </label>
            )}

            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
            />

            {previewRows.length > 0 && (
              <div className="rounded-lg bg-panel-alt p-3 text-xs text-navy-dim">
                {previewRows.map((r) => (
                  <div key={r.label} className="flex justify-between">
                    <span>{r.label}</span>
                    <span>{r.unitPrice.toFixed(2)} ₴</span>
                  </div>
                ))}
                <div className="mt-1 flex justify-between font-semibold text-navy-dark">
                  <span>Разом за {qty} шт.</span>
                  <span>{previewTotal.toFixed(2)} ₴</span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={addPosition}
              disabled={!modelCode}
              className="rounded-full bg-navy-dark px-6 py-3 font-semibold text-white transition hover:bg-gold hover:text-navy-dark disabled:opacity-40"
            >
              Додати позицію
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="overflow-x-auto rounded-xl bg-panel shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-dark text-white">
              <tr>
                <th className="px-3 py-3">Модель</th>
                <th className="px-3 py-3">Позиція</th>
                <th className="px-3 py-3">К-сть</th>
                <th className="px-3 py-3">Ціна</th>
                <th className="px-3 py-3">Сума</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {positions.map((p) => (
                <Fragment key={p.id}>
                  {p.rows.map((r, idx) => (
                    <tr key={`${p.id}-${idx}`} className="border-t border-navy-dim/10">
                      {idx === 0 && (
                        <td className="px-3 py-3 font-medium text-navy-dark" rowSpan={p.rows.length}>
                          {p.collectionLabel} — {p.modelCode}
                          <div className="text-xs font-normal text-navy-dim">{p.colorLabel}</div>
                        </td>
                      )}
                      <td className="px-3 py-3 text-navy-dark">{r.label}</td>
                      <td className="px-3 py-3 text-navy-dark">{r.qty}</td>
                      <td className="px-3 py-3 text-navy-dark">{r.unitPrice.toFixed(2)} ₴</td>
                      <td className="px-3 py-3 text-navy-dark">{r.amount.toFixed(2)} ₴</td>
                      {idx === 0 && (
                        <td className="px-3 py-3" rowSpan={p.rows.length}>
                          <button
                            type="button"
                            onClick={() => removePosition(p.id)}
                            className="text-red-600 hover:underline"
                          >
                            Видалити
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </Fragment>
              ))}
              {positions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-navy-dim">
                    Ще немає жодної позиції
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {positions.length > 0 && (
          <div className="mt-6 rounded-xl bg-panel p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as "percent" | "amount")}
                className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
              >
                <option value="percent">Знижка, %</option>
                <option value="amount">Знижка, грн</option>
              </select>
              <input
                type="number"
                min={0}
                value={discountValue}
                onChange={(e) => setDiscountValue(Math.max(0, Number(e.target.value)))}
                className="w-32 rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
              />
            </div>

            <div className="mt-4 text-right">
              {discountValue > 0 && (
                <div className="text-sm text-navy-dim line-through">Було: {subtotal.toFixed(2)} ₴</div>
              )}
              <div className="font-serif text-2xl font-bold text-navy-dark">Разом: {total.toFixed(2)} ₴</div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={downloadDocument}
                className="rounded-full bg-navy-dark px-6 py-3 font-semibold text-white transition hover:bg-gold hover:text-navy-dark"
              >
                Зберегти файл
              </button>
              <button
                type="button"
                onClick={printDocument}
                className="rounded-full border border-navy-dark px-6 py-3 font-semibold text-navy-dark transition hover:bg-navy-dark hover:text-white"
              >
                Друкувати / PDF
              </button>
              <button
                type="button"
                onClick={saveToHistory}
                className="rounded-full border border-navy-dim/30 px-6 py-3 font-semibold text-navy-dim transition hover:border-gold hover:text-navy-dark"
              >
                Зберегти в історію
              </button>
            </div>
            {saveMessage && <p className="mt-2 text-sm text-navy-dim">{saveMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
