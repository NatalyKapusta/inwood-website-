"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { collections, collectionOrder } from "@/lib/products";
import modelVariantsData from "@/data/model-variants.json";
import { translateForPrint, PRINT_EN_STATIC, PRINT_EN_TIERS } from "@/lib/printEn";
import { addonPhotoFor } from "@/lib/addonPhotos";
import {
  STANDARD_WIDTHS,
  STANDARD_HEIGHTS,
  NONSTD_WIDTHS,
  NONSTD_HEIGHTS,
  NONSTD_SURCHARGE,
} from "@/lib/doorSizes";
import {
  tariffLabels,
  positionTotal,
  isAluEdgeVariant,
  isAddonCompatible,
  hardwareCategoryLabels,
  type Tariff,
  type PanelRow,
  type AddonRow,
  type ServiceRow,
  type HardwareRow,
  type HardwareCategory,
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

// Форматування як скрізь на сайті: розділювач тисяч, кома для копійок,
// нерозривний пробіл перед ₴ — щоб не було "5176.50" замість "5 176,50 ₴".
function fmtNum(n: number) {
  return new Intl.NumberFormat("uk-UA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}
function fmtUah(n: number) {
  return `${fmtNum(n)} ₴`;
}

const VRIZKA_OPTIONS = [
  { value: "none", label: "Без врізки" },
  { value: "lock", label: "Врізка під замок" },
  { value: "full", label: "Повна врізка фурнітури" },
] as const;

// Погонажні вироби — короб/лиштва/добір продаються окремо, без дверного полотна.
// Ціни ті самі, що й у комплекті до дверей (line_addon_prices), лише обираються без моделі.
const POGONAZHNI_KEY = "pogonazhni";
const POGONAZHNI_LABEL = "Погонажні вироби (короб/лиштва/добір окремо)";
const POGONAZHNI_TYPE_OPTIONS = [
  { value: "korob", label: "Короб" },
  { value: "lishtva", label: "Лиштва" },
  { value: "dobir", label: "Добір" },
] as const;
type PogonazhniType = (typeof POGONAZHNI_TYPE_OPTIONS)[number]["value"];

// Плінтус і дверна накладка — прості "плоскі" позиції без моделі/кольору/короба,
// ціни лежать у product_tariff_prices з відповідним префіксом у product_code.
const FLAT_LINE_CATEGORIES = [
  { key: "plintus", label: "Плінтус", prefix: "PLINTUS — " },
  { key: "nakladka", label: "Дверна накладка (метал. двері, 10 мм)", prefix: "NAKLADKA — " },
] as const;

// Фурнітура (ручки/накладки/завіси/упори/механізми/циліндри/розсувні системи/
// аксесуари) — окрема позиція без прив'язки до моделі дверей, ціни лежать
// у hardware_tariff_prices. Джерело: прайс-лист МВМ (MVM/ABUS/AGB/Buonelle).
const HARDWARE_KEY = "hardware";
const HARDWARE_LABEL = "Фурнітура (ручки, завіси, механізми тощо)";
const HARDWARE_CATEGORY_ORDER: HardwareCategory[] = [
  "ruchky",
  "nakladky",
  "zavisy",
  "upory",
  "mekhanizmy",
  "tsylindry",
  "rozsuvna",
  "aksesuary",
  "inshe",
];

// Розміри полотна за каталогом IN WOOD — однакові для всіх ліній (ETALON/NOMINAL/
// FREZZATTI/PERFETTO/двері під фарбування). Ширина/висота понад стандарт доступні
// прямо у списку, але автоматично додають +20% (той самий NONSTD_SURCHARGE) —
// спільні з публічним каталогом (lib/doorSizes.ts), тримати синхронізованим.

export default function QuoteBuilder({
  consultantDefault,
  canOverride,
  allowedTariffs,
}: {
  consultantDefault: string;
  canOverride: boolean;
  // Задається лише під час прев'ю власником "чужими очима" — звужує список
  // тарифів у селекті до того, що бачила б обрана роль. Дані самі по собі
  // не звужуються (RLS вже й так дає власнику доступ до всього).
  allowedTariffs?: Tariff[];
}) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [panelRows, setPanelRows] = useState<PanelRow[]>([]);
  const [addonRows, setAddonRows] = useState<AddonRow[]>([]);
  const [serviceRows, setServiceRows] = useState<ServiceRow[]>([]);
  const [hardwareRows, setHardwareRows] = useState<HardwareRow[]>([]);

  const [tariff, setTariff] = useState<Tariff | "">("");
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [consultantName, setConsultantName] = useState(consultantDefault);
  const [consultantPhone, setConsultantPhone] = useState("");
  const [comment, setComment] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "amount">("percent");
  const [discountValue, setDiscountValue] = useState(0);
  const [currency, setCurrency] = useState<"none" | "EUR" | "USD">("none");
  const [exchangeRate, setExchangeRate] = useState(0);
  const [translateEn, setTranslateEn] = useState(false);

  const [collectionKey, setCollectionKey] = useState(collectionOrder[0]);
  const [pogLine, setPogLine] = useState(collectionOrder[0]);
  const [pogType, setPogType] = useState<PogonazhniType>("korob");
  const [pogItem, setPogItem] = useState("");
  const [flatItemCode, setFlatItemCode] = useState("");
  const [hardwareCategory, setHardwareCategory] = useState<HardwareCategory>("ruchky");
  const [hardwareArticle, setHardwareArticle] = useState("");
  const [modelCode, setModelCode] = useState("");
  const [variantCode, setVariantCode] = useState("");
  const [colorLabel, setColorLabel] = useState("");
  const [korob, setKorob] = useState("");
  const [lishtvaFront, setLishtvaFront] = useState("");
  const [lishtvaBack, setLishtvaBack] = useState("");
  const [dobir, setDobir] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [vrizka, setVrizka] = useState<"none" | "lock" | "full">("none");
  const [shumo, setShumo] = useState(false);
  const [alumPaint, setAlumPaint] = useState(false);
  const [paintKorobRal, setPaintKorobRal] = useState(false);

  // Ручне перевизначення — доступне staff і manager, як і в оригінальному калькуляторі.
  // Це НЕ автоматичні +20% — консультант вручну вписує розмір і кінцеву ціну повністю
  // самостійно (заміняє прайсову ціну, а не домножує її).
  const [nonstdSize, setNonstdSize] = useState(false);
  const [manualWidth, setManualWidth] = useState("");
  const [manualHeight, setManualHeight] = useState("");
  const [manualPolotnoPrice, setManualPolotnoPrice] = useState(0);
  const [korobManual, setKorobManual] = useState(false);
  const [korobManualWidth, setKorobManualWidth] = useState("");
  const [korobManualPrice, setKorobManualPrice] = useState(0);
  const [dobirManual, setDobirManual] = useState(false);
  const [dobirManualWidth, setDobirManualWidth] = useState("");
  const [dobirManualHeight, setDobirManualHeight] = useState("");
  const [dobirManualPrice, setDobirManualPrice] = useState(0);
  const [qty, setQty] = useState(1);

  const [positions, setPositions] = useState<QuotePosition[]>([]);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const [panels, addons, services, hardware] = await Promise.all([
        supabase.from("product_tariff_prices").select("product_code, tariff, price"),
        supabase.from("line_addon_prices").select("collection, addon_type, item_label, tariff, price"),
        supabase.from("service_tariff_prices").select("service_key, tariff, price"),
        supabase.from("hardware_tariff_prices").select("brand, category, article, name, material, tariff, price"),
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
      // Фурнітура необов'язкова — якщо таблиця ще не створена (0015/0016 не виконані),
      // просто не показуємо розділ, а не ламаємо весь конструктор КП.
      if (!hardware.error) setHardwareRows((hardware.data ?? []) as HardwareRow[]);
      let tariffsAvailable = Array.from(new Set((panels.data ?? []).map((r) => r.tariff))) as Tariff[];
      if (allowedTariffs) tariffsAvailable = tariffsAvailable.filter((t) => allowedTariffs.includes(t));
      if (tariffsAvailable.length > 0) setTariff(tariffsAvailable[0]);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const availableTariffs = useMemo(() => {
    const all = Array.from(new Set(panelRows.map((r) => r.tariff))) as Tariff[];
    return allowedTariffs ? all.filter((t) => allowedTariffs.includes(t)) : all;
  }, [panelRows, allowedTariffs]);

  const isPogonazhni = collectionKey === POGONAZHNI_KEY;
  const flatLine = FLAT_LINE_CATEGORIES.find((c) => c.key === collectionKey);
  const isFlatLine = !!flatLine;
  const isHardwareLine = collectionKey === HARDWARE_KEY;
  const isSpecialLine = isPogonazhni || isFlatLine || isHardwareLine;
  const isHiddenDoors = collectionKey === "hidden-doors";
  const models = collections[collectionKey]?.models ?? [];
  const currentModel = models.find((m) => m.code === modelCode);
  const hiddenVariants = collections["hidden-doors"]?.variants ?? [];
  const previewPhoto = isSpecialLine
    ? undefined
    : isHiddenDoors
    ? hiddenVariants.find((v) => hiddenDoorCode(v.image) === modelCode)?.image
    : currentModel?.colors.find((c) => c.label === colorLabel)?.image ?? currentModel?.colors[0]?.image;

  // Варіанти конкретної моделі (база/алюм. крайка/INSIDE/RAL) — для hidden-doors
  // кожен пункт списку вже сам по собі окремий покупний варіант.
  const variantOptions: ModelVariant[] = isHiddenDoors
    ? []
    : variantsData.variantsByBaseCode[modelCode] ?? [{ code: modelCode, variantType: "base", label: "База" }];
  const effectiveVariantCode = isHiddenDoors ? modelCode : variantCode || modelCode;

  // Один список "Модель" з усіма варіантами разом (як в оригінальному калькуляторі) —
  // порядок база → алюм. крайка INSIDE → алюм. крайка / RAL, той самий, що дає
  // сортування рядків у калькуляторі ("ET-01 (алюм. крайка INSIDE)" < "ET-01 (алюм. крайка)").
  const VARIANT_SORT_PRIORITY: Record<VariantType, number> = { base: 0, "alu-inside": 1, alu: 2, ral: 1 };
  const combinedModelOptions = isHiddenDoors
    ? []
    : models.flatMap((m) => {
        const variants = variantsData.variantsByBaseCode[m.code] ?? [
          { code: m.code, variantType: "base" as VariantType, label: "База" },
        ];
        return [...variants]
          .sort((a, b) => VARIANT_SORT_PRIORITY[a.variantType] - VARIANT_SORT_PRIORITY[b.variantType])
          .map((v) => ({
            code: v.code,
            baseCode: m.code,
            label: v.variantType === "base" ? m.code : `${m.code} (${v.label})`,
          }));
      });
  const variantType: VariantType = variantsData.variantTypeByCode[effectiveVariantCode] ?? "base";
  const isAluEdge = isAluEdgeVariant(variantType);

  const korobOptionsAll = addonRows.filter((r) => r.collection === collectionKey && r.addon_type === "korob" && r.tariff === tariff);
  const lishtvaOptionsAll = addonRows.filter((r) => r.collection === collectionKey && r.addon_type === "lishtva" && r.tariff === tariff);
  const dobirOptionsAll = addonRows.filter((r) => r.collection === collectionKey && r.addon_type === "dobir" && r.tariff === tariff);

  const korobOptions = korobOptionsAll.filter((r) => isAddonCompatible(collectionKey, variantType, r.item_label));
  const lishtvaOptions = lishtvaOptionsAll.filter((r) => isAddonCompatible(collectionKey, variantType, r.item_label));
  const dobirOptions = dobirOptionsAll.filter((r) => isAddonCompatible(collectionKey, variantType, r.item_label));

  const pogItemOptions = addonRows.filter(
    (r) => r.collection === pogLine && r.addon_type === pogType && r.tariff === tariff
  );
  const pogTypeLabel = POGONAZHNI_TYPE_OPTIONS.find((o) => o.value === pogType)?.label ?? pogType;

  const flatItemOptions = flatLine
    ? panelRows.filter((r) => r.product_code.startsWith(flatLine.prefix) && r.tariff === tariff)
    : [];

  const hardwareItemOptions = hardwareRows.filter(
    (r) => r.category === hardwareCategory && r.tariff === tariff
  );
  const selectedHardware = hardwareItemOptions.find((r) => r.article === hardwareArticle);

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
    if (isPogonazhni) {
      if (!pogItem || !tariff) return [];
      const price = pogItemOptions.find((r) => r.item_label === pogItem)?.price ?? 0;
      return [{ label: `${pogTypeLabel}: ${pogItem}`, unitPrice: price }];
    }
    if (isFlatLine) {
      if (!flatItemCode || !tariff) return [];
      const row = flatItemOptions.find((r) => r.product_code === flatItemCode);
      if (!row) return [];
      return [{ label: row.product_code.slice(flatLine!.prefix.length), unitPrice: row.price }];
    }
    if (isHardwareLine) {
      if (!hardwareArticle || !tariff || !selectedHardware) return [];
      const label = `${selectedHardware.article} — ${selectedHardware.name}${
        selectedHardware.material ? ` (${selectedHardware.material})` : ""
      }`;
      return [{ label, unitPrice: selectedHardware.price }];
    }
    if (!modelCode || !tariff) return [];
    const rows: { label: string; unitPrice: number; photo?: string }[] = [];
    const variantLabel = variantOptions.find((v) => v.code === effectiveVariantCode)?.label;
    const panelBase = panelPrice();
    const isManualSize = canOverride && nonstdSize;
    const sizeIsNonstd =
      !isManualSize &&
      ((width !== "" && NONSTD_WIDTHS.includes(Number(width))) ||
        (height !== "" && NONSTD_HEIGHTS.includes(Number(height))));
    const sizeLabel = isManualSize
      ? manualWidth && manualHeight
        ? ` ${manualWidth}×${manualHeight} мм`
        : ""
      : width && height
      ? ` ${width}×${height} мм`
      : "";
    rows.push({
      label: `Полотно, ${modelCode}${variantLabel && variantLabel !== "База" ? ` (${variantLabel})` : ""}${sizeLabel}${
        isManualSize ? " — нестандарт (вручну)" : sizeIsNonstd ? " — нестандарт*" : ""
      }`,
      unitPrice: isManualSize ? manualPolotnoPrice : sizeIsNonstd ? panelBase * NONSTD_SURCHARGE : panelBase,
    });
    if (canOverride && korobManual) {
      rows.push({
        label: `Короб, нестандарт${korobManualWidth ? `, ${korobManualWidth} мм (глибина)` : ""} (вручну)`,
        unitPrice: korobManualPrice,
      });
    } else if (korob) {
      rows.push({ label: korob, unitPrice: priceOf(korobOptions, korob), photo: addonPhotoFor("korob", korob) });
    }
    if (lishtvaFront)
      rows.push({
        label: `${lishtvaFront} (лицьова)`,
        unitPrice: priceOf(lishtvaOptions, lishtvaFront),
        photo: addonPhotoFor("lishtva", lishtvaFront),
      });
    if (lishtvaBack)
      rows.push({
        label: `${lishtvaBack} (тильна)`,
        unitPrice: priceOf(lishtvaOptions, lishtvaBack),
        photo: addonPhotoFor("lishtva", lishtvaBack),
      });
    if (canOverride && dobirManual) {
      rows.push({
        label: `Добір, нестандарт${
          dobirManualWidth && dobirManualHeight ? `, ${dobirManualWidth}×${dobirManualHeight} мм` : ""
        } (вручну)`,
        unitPrice: dobirManualPrice,
        photo: addonPhotoFor("dobir", dobir),
      });
    } else if (dobir) {
      rows.push({ label: dobir, unitPrice: priceOf(dobirOptions, dobir), photo: addonPhotoFor("dobir", dobir) });
    }
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
    isPogonazhni,
    pogItem,
    pogType,
    pogLine,
    isFlatLine,
    flatItemCode,
    flatItemOptions,
    isHardwareLine,
    hardwareArticle,
    selectedHardware,
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
    nonstdSize,
    manualWidth,
    manualHeight,
    manualPolotnoPrice,
    width,
    height,
    korobManual,
    korobManualWidth,
    korobManualPrice,
    dobirManual,
    dobirManualWidth,
    dobirManualHeight,
    dobirManualPrice,
    addonRows,
    serviceRows,
    panelRows,
  ]);

  const previewTotal = previewRows.reduce((s, r) => s + r.unitPrice, 0) * qty;

  function addPosition() {
    if (isPogonazhni) {
      if (!pogItem || previewRows.length === 0) return;
      const position: QuotePosition = {
        id: crypto.randomUUID(),
        collectionLabel: POGONAZHNI_LABEL,
        modelCode: `${collections[pogLine]?.label ?? pogLine} — ${pogTypeLabel}`,
        colorLabel: "",
        photo: undefined,
        qty,
        rows: previewRows.map((r) => ({ label: r.label, unitPrice: r.unitPrice, qty, amount: r.unitPrice * qty, photo: r.photo })),
      };
      setPositions((prev) => [...prev, position]);
      setPogItem("");
      setQty(1);
      return;
    }
    if (isFlatLine) {
      if (!flatItemCode || previewRows.length === 0) return;
      const position: QuotePosition = {
        id: crypto.randomUUID(),
        collectionLabel: flatLine!.label,
        modelCode: previewRows[0].label,
        colorLabel: "",
        photo: undefined,
        qty,
        rows: previewRows.map((r) => ({ label: r.label, unitPrice: r.unitPrice, qty, amount: r.unitPrice * qty, photo: r.photo })),
      };
      setPositions((prev) => [...prev, position]);
      setFlatItemCode("");
      setQty(1);
      return;
    }
    if (isHardwareLine) {
      if (!hardwareArticle || previewRows.length === 0) return;
      const position: QuotePosition = {
        id: crypto.randomUUID(),
        collectionLabel: HARDWARE_LABEL,
        modelCode: hardwareCategoryLabels[hardwareCategory],
        colorLabel: "",
        photo: undefined,
        qty,
        rows: previewRows.map((r) => ({ label: r.label, unitPrice: r.unitPrice, qty, amount: r.unitPrice * qty, photo: r.photo })),
      };
      setPositions((prev) => [...prev, position]);
      setHardwareArticle("");
      setQty(1);
      return;
    }
    if (!modelCode || previewRows.length === 0) return;
    const position: QuotePosition = {
      id: crypto.randomUUID(),
      collectionLabel: collections[collectionKey].label,
      modelCode,
      colorLabel,
      photo: previewPhoto,
      qty,
      rows: previewRows.map((r) => ({ label: r.label, unitPrice: r.unitPrice, qty, amount: r.unitPrice * qty, photo: r.photo })),
    };
    setPositions((prev) => [...prev, position]);
    setVariantCode(modelCode);
    setWidth("");
    setHeight("");
    setKorob("");
    setLishtvaFront("");
    setLishtvaBack("");
    setDobir("");
    setVrizka("none");
    setShumo(false);
    setAlumPaint(false);
    setPaintKorobRal(false);
    setNonstdSize(false);
    setManualWidth("");
    setManualHeight("");
    setManualPolotnoPrice(0);
    setKorobManual(false);
    setKorobManualWidth("");
    setKorobManualPrice(0);
    setDobirManual(false);
    setDobirManualWidth("");
    setDobirManualHeight("");
    setDobirManualPrice(0);
    setQty(1);
  }

  function removePosition(id: string) {
    setPositions((prev) => prev.filter((p) => p.id !== id));
  }

  const subtotal = positions.reduce((s, p) => s + positionTotal(p), 0);
  const discountAmount = discountType === "percent" ? (subtotal * discountValue) / 100 : discountValue;
  const total = Math.max(0, subtotal - discountAmount);
  const currencySymbol = currency === "EUR" ? "€" : currency === "USD" ? "$" : "";
  const hasRate = currency !== "none" && exchangeRate > 0;
  function fmtForeign(uah: number) {
    return `${fmtNum(uah / exchangeRate)} ${currencySymbol}`;
  }
  function moneyDisplay(uah: number) {
    return hasRate ? fmtForeign(uah) : fmtUah(uah);
  }

  const tariffLabelsEn: Record<Tariff, string> = {
    retail: "Retail",
    dealer: "Dealers",
    distributor: "Distributor",
    builder: "Builder",
    epicenter: "Epicenter",
    export: "Export",
  };

  function buildDocumentHtml() {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const tt = (uk: string) => (translateEn ? PRINT_EN_STATIC[uk] ?? uk : uk);
    const tc = (uk: string) => (translateEn ? translateForPrint(uk) : uk);

    const rowsHtml = positions
      .map((p) => {
        const modelLine = `${p.collectionLabel} — ${p.modelCode}`;
        const subRows = p.rows
          .map(
            (r, idx) => `
        <tr>
          ${idx === 0 ? `<td rowspan="${p.rows.length}" style="text-align:center;">${p.photo ? `<img src="${origin}${p.photo}" alt="" style="width:64px;height:auto;border-radius:6px;" />` : ""}</td>` : ""}
          ${idx === 0 ? `<td rowspan="${p.rows.length}"><strong>${modelLine}</strong><br/><span style="color:#8A90A6;font-size:12px;">${tc(p.colorLabel || "")}</span></td>` : ""}
          <td>${r.photo ? `<img class="addon-photo" src="${origin}${r.photo}" alt="" />` : ""}${tc(r.label)}</td>
          <td style="text-align:center;">${r.qty}</td>
          <td style="text-align:right;">${fmtUah(r.unitPrice)}</td>
          <td style="text-align:right;">${fmtUah(r.amount)}</td>
        </tr>`
          )
          .join("");
        return subRows;
      })
      .join("");

    const discountRow =
      discountValue > 0
        ? `<div style="text-align:right;color:#8A90A6;text-decoration:line-through;">${tt("Було")}: ${moneyDisplay(subtotal)}</div>
           <div style="text-align:right;font-size:13px;color:#8A90A6;">${tt("Знижка")}: ${moneyDisplay(discountAmount)}</div>`
        : "";

    const rateRow = hasRate
      ? `<div style="text-align:right;font-size:12px;color:#8A90A6;margin-top:4px;">${tt("Курс")}: ${fmtNum(exchangeRate)} ₴ ${translateEn ? "per" : "за"} 1 ${currencySymbol}</div>`
      : "";

    const heading = tt("Комерційна пропозиція");
    const greeting = translateEn ? `Dear ${clientName || "Client"},` : `Шановний(а) ${clientName || "клієнте"},`;
    const introText = tt(
      "Компанія IN WOOD рада запропонувати Вам комерційну пропозицію в напрямку виробництва та реалізації міжкімнатних дверей. Ми впевнені, що наша співпраця стане вигідною, тривалою та приємною."
    );
    const closingText = tt(
      "Сподіваємось побачити Вас в числі наших партнерів і впевнені, що співпраця з IN WOOD буде вигідною, тривалою та приємною!"
    );

    return `<!doctype html>
<html lang="${translateEn ? "en" : "uk"}"><head><meta charset="utf-8" />
<title>${heading} — IN WOOD</title>
<style>
  body { font-family: Arial, Helvetica, sans-serif; color: #333958; margin: 0; padding: 0; }
  .header { background: #333958; color: #fff; padding: 24px 32px; display: flex; justify-content: space-between; border-bottom: 4px solid #E3CCA1; }
  .header h1 { margin: 0; font-size: 22px; }
  .header p { margin: 4px 0 0; color: #E3CCA1; font-size: 12px; text-transform: uppercase; }
  .content { padding: 24px 32px; }
  .boxes { display: flex; gap: 16px; margin: 20px 0; }
  .box { flex: 1; min-width: 0; overflow-wrap: break-word; background: #F7F6F2; border-radius: 8px; padding: 14px 16px; }
  .box .title { color: #B7935A; font-size: 11px; text-transform: uppercase; font-weight: bold; }
  .table-wrap { overflow-x: auto; margin-top: 12px; -webkit-overflow-scrolling: touch; }
  table { width: 100%; min-width: 620px; border-collapse: collapse; }
  th { text-align: left; border-bottom: 2px solid #E3CCA1; padding: 8px 6px; font-size: 12px; text-transform: uppercase; color: #333958; white-space: nowrap; }
  td { padding: 8px 6px; border-bottom: 1px solid #eee; font-size: 13px; vertical-align: top; }
  td:nth-child(4), td:nth-child(5), td:nth-child(6) { white-space: nowrap; }
  .addon-photo { width: 28px; height: 20px; object-fit: contain; vertical-align: middle; margin-right: 6px; border-radius: 3px; background: #F7F6F2; }
  .totals { text-align: right; margin-top: 16px; font-size: 20px; font-weight: bold; color: #333958; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #8A90A6; text-align: center; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .table-wrap { overflow-x: visible; } table { min-width: 0; } }
</style>
</head><body>
  <div class="header">
    <div>
      <h1>${heading}</h1>
      <p>IN WOOD · ${translateEn ? "Interior Doors & Hardware" : "Двері та фурнітура"}</p>
    </div>
    <div style="text-align:right;font-size:12px;">
      <div>${tt("Дата:")} ${new Date().toLocaleDateString(translateEn ? "en-GB" : "uk-UA")}</div>
      <div>${tt("Категорія:")} ${translateEn ? tariffLabelsEn[tariff as Tariff] : tariffLabels[tariff as Tariff] ?? tariff}</div>
    </div>
  </div>
  <div class="content">
    <p><strong>${greeting}</strong></p>
    <p>${introText}</p>
    <div class="boxes">
      <div class="box"><div class="title">${tt("Клієнт / Замовник")}</div><div>${clientName || "—"}</div><div>${clientContact || ""}</div></div>
      <div class="box"><div class="title">${tt("Консультант IN WOOD")}</div><div>${consultantName || "—"}</div><div>${consultantPhone || ""}</div></div>
    </div>
    ${comment ? `<p style="color:#8A90A6;font-size:13px;">${tt("Коментар:")} ${tc(comment)}</p>` : ""}
    <div class="table-wrap">
    <table>
      <thead><tr><th>${tt("Фото")}</th><th>${tt("Модель")}</th><th>${tt("Позиція")}</th><th>${tt("К-сть")}</th><th>${tt("Ціна за од.")}</th><th>${tt("Сума")}</th></tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table>
    </div>
    <div class="totals">
      ${discountRow}
      <div>${tt("Разом")}: ${moneyDisplay(total)}</div>
      ${rateRow}
    </div>
    <div class="footer">
      ${closingText}<br/>
      ${tt("Документ згенеровано автоматично, не є фіскальним чеком")}
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
      consultant_contact: consultantPhone || null,
      comment: comment || null,
      tariff,
      discount_type: discountValue > 0 ? discountType : null,
      discount_value: discountValue > 0 ? discountValue : null,
      currency: currency === "none" ? "UAH" : currency,
      exchange_rate: hasRate ? exchangeRate : null,
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
              placeholder="Ім'я консультанта"
              className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
            />
            <input
              value={consultantPhone}
              onChange={(e) => setConsultantPhone(e.target.value)}
              placeholder="Телефон консультанта"
              className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
            />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Коментар (необов'язково)"
              rows={2}
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
                setPogItem("");
                setFlatItemCode("");
                setHardwareArticle("");
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
              <option value={POGONAZHNI_KEY}>{POGONAZHNI_LABEL}</option>
              {FLAT_LINE_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
              {hardwareRows.length > 0 && <option value={HARDWARE_KEY}>{HARDWARE_LABEL}</option>}
            </select>

            {isFlatLine && (
              <select
                value={flatItemCode}
                onChange={(e) => setFlatItemCode(e.target.value)}
                className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
              >
                <option value="">Позиція...</option>
                {flatItemOptions.map((r) => (
                  <option key={r.product_code} value={r.product_code}>
                    {r.product_code.slice(flatLine!.prefix.length)}
                  </option>
                ))}
              </select>
            )}

            {isPogonazhni && (
              <>
                <select
                  value={pogLine}
                  onChange={(e) => {
                    setPogLine(e.target.value);
                    setPogItem("");
                  }}
                  className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
                >
                  {collectionOrder
                    .filter((k) => collections[k]?.models?.length)
                    .map((k) => (
                      <option key={k} value={k}>
                        Лінія: {collections[k].label}
                      </option>
                    ))}
                </select>
                <select
                  value={pogType}
                  onChange={(e) => {
                    setPogType(e.target.value as PogonazhniType);
                    setPogItem("");
                  }}
                  className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
                >
                  {POGONAZHNI_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <select
                  value={pogItem}
                  onChange={(e) => setPogItem(e.target.value)}
                  className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
                >
                  <option value="">Позиція...</option>
                  {pogItemOptions.map((r) => (
                    <option key={r.item_label} value={r.item_label}>
                      {r.item_label}
                    </option>
                  ))}
                </select>
              </>
            )}

            {isHardwareLine && (
              <>
                <select
                  value={hardwareCategory}
                  onChange={(e) => {
                    setHardwareCategory(e.target.value as HardwareCategory);
                    setHardwareArticle("");
                  }}
                  className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
                >
                  {HARDWARE_CATEGORY_ORDER.map((c) => (
                    <option key={c} value={c}>
                      {hardwareCategoryLabels[c]}
                    </option>
                  ))}
                </select>
                <select
                  value={hardwareArticle}
                  onChange={(e) => setHardwareArticle(e.target.value)}
                  className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
                >
                  <option value="">Позиція...</option>
                  {hardwareItemOptions.map((r) => (
                    <option key={r.article} value={r.article}>
                      {r.article} — {r.name}
                    </option>
                  ))}
                </select>
                {selectedHardware?.material && (
                  <p className="text-xs text-navy-dim">{selectedHardware.material}</p>
                )}
              </>
            )}

            {!isSpecialLine && (
            <select
              value={isHiddenDoors ? modelCode : variantCode || modelCode}
              onChange={(e) => {
                if (isHiddenDoors) {
                  setModelCode(e.target.value);
                  setVariantCode(e.target.value);
                } else {
                  const opt = combinedModelOptions.find((o) => o.code === e.target.value);
                  setModelCode(opt?.baseCode ?? e.target.value);
                  setVariantCode(e.target.value);
                }
                setColorLabel("");
                setWidth("");
                setHeight("");
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
                : combinedModelOptions.map((o) => (
                    <option key={o.code} value={o.code}>
                      {o.label}
                    </option>
                  ))}
            </select>
            )}

            {!isSpecialLine && currentModel && (
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

            {!isSpecialLine && canOverride && (
              <label className="flex items-center gap-2 text-sm text-navy-dark">
                <input type="checkbox" checked={nonstdSize} onChange={(e) => setNonstdSize(e.target.checked)} />
                Нестандартний розмір (вручну)
              </label>
            )}

            {!isSpecialLine && !(canOverride && nonstdSize) && (
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
                >
                  <option value="">Ширина, мм...</option>
                  {STANDARD_WIDTHS.map((w) => (
                    <option key={w} value={w}>
                      {w} мм
                    </option>
                  ))}
                  {NONSTD_WIDTHS.map((w) => (
                    <option key={w} value={w}>
                      {w} мм (нестандарт +20%)
                    </option>
                  ))}
                </select>
                <select
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
                >
                  <option value="">Висота, мм...</option>
                  {STANDARD_HEIGHTS.map((h) => (
                    <option key={h} value={h}>
                      {h} мм
                    </option>
                  ))}
                  {NONSTD_HEIGHTS.map((h) => (
                    <option key={h} value={h}>
                      {h} мм (нестандарт +20%)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!isSpecialLine && canOverride && nonstdSize && (
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min={1}
                  value={manualWidth}
                  onChange={(e) => setManualWidth(e.target.value)}
                  placeholder="Ширина, мм (вручну), напр. 1050"
                  className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
                />
                <input
                  type="number"
                  min={1}
                  value={manualHeight}
                  onChange={(e) => setManualHeight(e.target.value)}
                  placeholder="Висота, мм (вручну), напр. 2350"
                  className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
                />
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={manualPolotnoPrice || ""}
                  onChange={(e) => setManualPolotnoPrice(Math.max(0, Number(e.target.value)))}
                  placeholder="Ціна полотна, ₴ (вручну), напр. 12000"
                  className="col-span-2 rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </div>
            )}

            {!isSpecialLine && (
            <>
            {canOverride && (
              <label className="flex items-center gap-2 text-sm text-navy-dark">
                <input type="checkbox" checked={korobManual} onChange={(e) => setKorobManual(e.target.checked)} />
                Короб — нестандарт (вручну)
              </label>
            )}
            {canOverride && korobManual ? (
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min={1}
                  value={korobManualWidth}
                  onChange={(e) => setKorobManualWidth(e.target.value)}
                  placeholder="Глибина короба, мм, напр. 130"
                  className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
                />
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={korobManualPrice || ""}
                  onChange={(e) => setKorobManualPrice(Math.max(0, Number(e.target.value)))}
                  placeholder="Ціна короба, ₴"
                  className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </div>
            ) : (
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
            )}
            <AddonRefPhoto src={addonPhotoFor("korob", korob)} />

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
            <AddonRefPhoto src={addonPhotoFor("lishtva", lishtvaFront)} />

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
            <AddonRefPhoto src={addonPhotoFor("lishtva", lishtvaBack)} />

            {canOverride && (
              <label className="flex items-center gap-2 text-sm text-navy-dark">
                <input type="checkbox" checked={dobirManual} onChange={(e) => setDobirManual(e.target.checked)} />
                Добір — нестандарт (вручну)
              </label>
            )}
            {canOverride && dobirManual ? (
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  min={1}
                  value={dobirManualWidth}
                  onChange={(e) => setDobirManualWidth(e.target.value)}
                  placeholder="Ширина добору, мм, напр. 220"
                  className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
                />
                <input
                  type="number"
                  min={1}
                  value={dobirManualHeight}
                  onChange={(e) => setDobirManualHeight(e.target.value)}
                  placeholder="Висота добору, мм, напр. 2050"
                  className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
                />
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={dobirManualPrice || ""}
                  onChange={(e) => setDobirManualPrice(Math.max(0, Number(e.target.value)))}
                  placeholder="Ціна добору, ₴"
                  className="col-span-2 rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </div>
            ) : (
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
            )}
            <AddonRefPhoto src={addonPhotoFor("dobir", dobir)} />

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
            </>
            )}

            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
            />

            {previewPhoto && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewPhoto}
                alt={modelCode}
                className="h-40 w-full rounded-lg border border-navy-dim/10 bg-panel-alt object-contain p-2"
              />
            )}

            {previewRows.length > 0 && (
              <div className="rounded-lg bg-panel-alt p-3 text-xs text-navy-dim">
                {previewRows.map((r) => (
                  <div key={r.label} className="flex justify-between">
                    <span>{r.label}</span>
                    <span>{fmtUah(r.unitPrice)}</span>
                  </div>
                ))}
                <div className="mt-1 flex justify-between font-semibold text-navy-dark">
                  <span>Разом за {qty} шт.</span>
                  <span>{fmtUah(previewTotal)}</span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={addPosition}
              disabled={
                isPogonazhni ? !pogItem : isFlatLine ? !flatItemCode : isHardwareLine ? !hardwareArticle : !modelCode
              }
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
                      <td className="px-3 py-3 text-navy-dark">
                        <div className="flex items-center gap-2">
                          {r.photo && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={r.photo} alt="" className="h-5 w-7 rounded object-contain bg-panel-alt" />
                          )}
                          {r.label}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-navy-dark">{r.qty}</td>
                      <td className="px-3 py-3 text-navy-dark">{fmtUah(r.unitPrice)}</td>
                      <td className="px-3 py-3 text-navy-dark">{fmtUah(r.amount)}</td>
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
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as "none" | "EUR" | "USD")}
                className="rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
              >
                <option value="none">Без валюти</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
              {currency !== "none" && (
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder={`Курс, ₴ за 1 ${currencySymbol}`}
                  value={exchangeRate || ""}
                  onChange={(e) => setExchangeRate(Math.max(0, Number(e.target.value)))}
                  className="w-36 rounded-lg border border-navy-dim/30 bg-panel px-3 py-2 text-sm outline-none focus:border-gold"
                />
              )}
            </div>

            <label className="mt-3 flex items-center gap-2 text-sm text-navy-dark">
              <input type="checkbox" checked={translateEn} onChange={(e) => setTranslateEn(e.target.checked)} />
              Переклад бланку на англійську (лише для друку/файлу)
            </label>

            <div className="mt-4 text-right">
              {discountValue > 0 && (
                <div className="text-sm text-navy-dim line-through">
                  Було: {fmtUah(subtotal)}{hasRate ? ` (${fmtForeign(subtotal)})` : ""}
                </div>
              )}
              <div className="font-serif text-2xl font-bold text-navy-dark">
                Разом: {fmtUah(total)}{hasRate ? ` (${fmtForeign(total)})` : ""}
              </div>
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

function AddonRefPhoto({ src }: { src?: string }) {
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="h-14 w-20 -mt-2 rounded-md border border-navy-dim/10 object-contain bg-panel-alt p-1" />
  );
}
