"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { Komplekt, ProductModel } from "@/lib/products";
import type { Dictionary } from "@/lib/dictionary";
import AddToCartButton from "@/components/AddToCartButton";
import {
  STANDARD_WIDTHS,
  STANDARD_HEIGHTS,
  NONSTD_WIDTHS,
  NONSTD_HEIGHTS,
  NONSTD_SURCHARGE,
} from "@/lib/doorSizes";

const NONE = "__none__";

// Роздрібні ціни на послуги, що застосовуються до будь-якої моделі —
// ті самі значення, що й у B2B-калькуляторі (service_tariff_prices,
// тариф "retail"): VRIZKA_LOCK_PRICE, VRIZKA_FULL_PRICE, SHUMO_PRICE.
const VRIZKA_LOCK_PRICE = 300;
const VRIZKA_FULL_PRICE = 600;
const SHUMO_PRICE = 1200;

function fmt(n: number) {
  // Нерозривний пробіл перед ₴ — щоб гривня не "відривалась" на новий рядок
  return new Intl.NumberFormat("uk-UA").format(n) + " ₴";
}

export default function ProductCard({
  anchorId,
  collectionLabel,
  model,
  komplekt,
  t,
  pricesVisible,
  addToCartLabel,
  addedToCartLabel,
}: {
  anchorId: string;
  collectionLabel: string;
  model: ProductModel;
  komplekt: Komplekt;
  t: Dictionary["catalog"];
  pricesVisible: boolean;
  addToCartLabel: string;
  addedToCartLabel: string;
}) {
  const defaultColorIdx = Math.max(
    model.colors.findIndex((c) => c.slug === "white"),
    0
  );
  const [colorIdx, setColorIdx] = useState(defaultColorIdx);
  const cardRef = useRef<HTMLDivElement>(null);

  // Глибоке посилання виду #anchorId:colorSlug (напр. з блоку "Тренди 2026" на
  // головній) — одразу відкриває картку з потрібним кольором, а не білим за
  // замовчуванням. window.location.hash недоступний під час SSR, тому це не
  // можна визначити в useState() (гідратація зафіксує серверне значення) —
  // робимо це в ефекті вже на клієнті, і тоді ж доскролюємо до картки, бо
  // двокрапка в хеші ламає нативний скрол браузера (він шукає
  // id="anchorId:colorSlug", якого не існує).
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const [hashAnchor, slug] = hash.split(":");
    if (hashAnchor !== anchorId || !slug) return;
    const idx = model.colors.findIndex((c) => c.slug === slug);
    if (idx !== -1) setColorIdx(idx);
    cardRef.current?.scrollIntoView({ block: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasRal = typeof model.ralPrice === "number";
  const [finish, setFinish] = useState<"base" | "ral">("base");
  const [ralColor, setRalColor] = useState("");
  const [korob, setKorob] = useState(NONE);
  const [lyshtva, setLyshtva] = useState(NONE);
  const [dobir, setDobir] = useState(NONE);
  const [vrizka, setVrizka] = useState<"none" | "lock" | "full">("none");
  const [shumo, setShumo] = useState(false);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const color = model.colors[colorIdx];

  const vrizkaPrice = vrizka === "lock" ? VRIZKA_LOCK_PRICE : vrizka === "full" ? VRIZKA_FULL_PRICE : 0;
  const shumoPrice = shumo ? SHUMO_PRICE : 0;

  // Нестандартний розмір — та сама логіка й націнка +20%, що й у B2B-калькуляторі:
  // ширина чи висота понад стандартний ряд автоматично додають NONSTD_SURCHARGE.
  const sizeIsNonstd =
    (width !== "" && NONSTD_WIDTHS.includes(Number(width))) ||
    (height !== "" && NONSTD_HEIGHTS.includes(Number(height)));
  const basePanelPrice = finish === "ral" && model.ralPrice ? model.ralPrice : model.basePrice;
  const panelPrice = sizeIsNonstd ? basePanelPrice * NONSTD_SURCHARGE : basePanelPrice;

  const extra = useMemo(() => {
    const findPrice = (list: { label: string; price: number }[], value: string) =>
      value === NONE ? 0 : list.find((o) => o.label === value)?.price ?? 0;
    return (
      findPrice(komplekt.korob, korob) +
      findPrice(komplekt.lyshtva, lyshtva) +
      findPrice(komplekt.dobir, dobir) +
      vrizkaPrice +
      shumoPrice
    );
  }, [korob, lyshtva, dobir, komplekt, vrizkaPrice, shumoPrice]);

  const total = panelPrice + extra;
  const sizeLabel = width && height ? ` ${width}×${height} мм${sizeIsNonstd ? ` (${t.nonstdSuffix})` : ""}` : "";

  const configLines = [
    `${collectionLabel} — ${model.code}${sizeLabel}`,
    finish === "ral"
      ? `${t.finishRal}: ${ralColor.trim() || "-"}`
      : `${t.color}: ${color?.label ?? "-"}`,
    korob !== NONE ? `${t.korob}: ${korob}` : null,
    lyshtva !== NONE ? `${t.lyshtva}: ${lyshtva}` : null,
    dobir !== NONE ? `${t.dobir}: ${dobir}` : null,
    vrizka === "lock" ? `${t.vrizka}: ${t.vrizkaLock}` : vrizka === "full" ? `${t.vrizka}: ${t.vrizkaFull}` : null,
    shumo ? t.shumo : null,
  ].filter(Boolean) as string[];

  // Ідентифікатор рядка кошика враховує всю обрану конфігурацію — інша
  // ширина/колір/короб тощо створює окремий рядок, а повторний клік з тими
  // самими налаштуваннями просто збільшує кількість.
  const cartId = [
    "door",
    collectionLabel,
    model.code,
    finish === "ral" ? `ral:${ralColor.trim()}` : `color:${color?.slug ?? ""}`,
    width,
    height,
    korob,
    lyshtva,
    dobir,
    vrizka,
    shumo ? "shumo" : "",
  ].join("|");

  return (
    <div
      ref={cardRef}
      id={anchorId}
      className="flex scroll-mt-40 flex-col overflow-hidden rounded-xl border border-navy-dim/10 bg-panel"
    >
      <div className="relative aspect-square bg-panel-alt">
        {color && (
          <Image
            key={color.image}
            src={color.image}
            alt={`Міжкімнатні двері IN WOOD ${collectionLabel} ${model.code}, колір ${color.label}`}
            fill
            sizes="(min-width: 1280px) 300px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-4"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-navy-dim">{collectionLabel}</p>
          <h3 className="font-serif text-lg font-bold text-navy-dark">{model.code}</h3>
        </div>

        {hasRal && (
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setFinish("base")}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                finish === "base"
                  ? "border-gold bg-gold/10 text-navy-dark"
                  : "border-navy-dim/25 text-navy-dim hover:border-gold"
              }`}
            >
              {t.finishBase}
            </button>
            <button
              type="button"
              onClick={() => setFinish("ral")}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                finish === "ral"
                  ? "border-gold bg-gold/10 text-navy-dark"
                  : "border-navy-dim/25 text-navy-dim hover:border-gold"
              }`}
            >
              {t.finishRal}
            </button>
          </div>
        )}

        {finish === "ral" ? (
          <label className="block text-xs text-navy-dim">
            {t.finishRal}
            <input
              type="text"
              value={ralColor}
              onChange={(e) => setRalColor(e.target.value)}
              placeholder={t.ralPlaceholder}
              className="mt-1 w-full rounded-lg border border-navy-dim/30 bg-panel px-2 py-1.5 text-sm text-navy-dark outline-none focus:border-gold"
            />
          </label>
        ) : (
          model.colors.length > 1 && (
            <div>
              <label className="text-xs text-navy-dim">
                {t.color}: {color?.label}
              </label>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {model.colors.map((c, i) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => setColorIdx(i)}
                    title={c.label}
                    className={`relative h-6 w-6 overflow-hidden rounded-full border-2 ${
                      i === colorIdx ? "border-gold" : "border-navy-dim/20"
                    }`}
                  >
                    <Image src={c.image} alt={c.label} fill sizes="24px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )
        )}

        <div className="grid grid-cols-2 gap-2">
          <label className="block text-xs text-navy-dim">
            {t.width}
            <select
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="mt-1 w-full rounded-lg border border-navy-dim/30 bg-panel px-2 py-1.5 text-sm text-navy-dark outline-none focus:border-gold"
            >
              <option value="">{t.none}</option>
              {STANDARD_WIDTHS.map((w) => (
                <option key={w} value={w}>
                  {w} мм
                </option>
              ))}
              {NONSTD_WIDTHS.map((w) => (
                <option key={w} value={w}>
                  {w} мм ({t.nonstdSuffix})
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs text-navy-dim">
            {t.height}
            <select
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="mt-1 w-full rounded-lg border border-navy-dim/30 bg-panel px-2 py-1.5 text-sm text-navy-dark outline-none focus:border-gold"
            >
              <option value="">{t.none}</option>
              {STANDARD_HEIGHTS.map((h) => (
                <option key={h} value={h}>
                  {h} мм
                </option>
              ))}
              {NONSTD_HEIGHTS.map((h) => (
                <option key={h} value={h}>
                  {h} мм ({t.nonstdSuffix})
                </option>
              ))}
            </select>
          </label>
        </div>

        <SelectRow
          label={t.korob}
          noneLabel={t.none}
          value={korob}
          onChange={setKorob}
          options={komplekt.korob}
          pricesVisible={pricesVisible}
        />
        <SelectRow
          label={t.lyshtva}
          noneLabel={t.none}
          value={lyshtva}
          onChange={setLyshtva}
          options={komplekt.lyshtva}
          pricesVisible={pricesVisible}
        />
        {komplekt.dobir.length > 0 && (
          <SelectRow
            label={t.dobir}
            noneLabel={t.none}
            value={dobir}
            onChange={setDobir}
            options={komplekt.dobir}
            pricesVisible={pricesVisible}
          />
        )}

        <label className="block text-xs text-navy-dim">
          {t.vrizka}
          <select
            value={vrizka}
            onChange={(e) => setVrizka(e.target.value as "none" | "lock" | "full")}
            className="mt-1 w-full rounded-lg border border-navy-dim/30 bg-panel px-2 py-1.5 text-sm text-navy-dark outline-none focus:border-gold"
          >
            <option value="none">{t.vrizkaNone}</option>
            <option value="lock">
              {pricesVisible ? `${t.vrizkaLock} — ${fmt(VRIZKA_LOCK_PRICE)}` : t.vrizkaLock}
            </option>
            <option value="full">
              {pricesVisible ? `${t.vrizkaFull} — ${fmt(VRIZKA_FULL_PRICE)}` : t.vrizkaFull}
            </option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-xs text-navy-dark">
          <input
            type="checkbox"
            checked={shumo}
            onChange={(e) => setShumo(e.target.checked)}
            className="h-4 w-4 rounded border-navy-dim/30 accent-gold"
          />
          {pricesVisible ? `${t.shumo} — ${fmt(SHUMO_PRICE)}` : t.shumo}
        </label>

        <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="whitespace-nowrap font-serif text-lg font-bold text-navy-dark">
            {!pricesVisible
              ? t.findOutPrice
              : extra > 0 || sizeIsNonstd
              ? `${t.total}: ${fmt(total)}`
              : `${t.from} ${fmt(basePanelPrice)}`}
          </p>
          <AddToCartButton
            id={cartId}
            label={configLines.join("; ")}
            price={pricesVisible ? total : null}
            addLabel={addToCartLabel}
            addedLabel={addedToCartLabel}
            className="shrink-0 rounded-full bg-navy-dark px-4 py-2 text-sm font-semibold text-white transition hover:bg-gold hover:text-navy-dark"
          />
        </div>
      </div>
    </div>
  );
}

function SelectRow({
  label,
  noneLabel,
  value,
  onChange,
  options,
  pricesVisible,
}: {
  label: string;
  noneLabel: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; price: number }[];
  pricesVisible: boolean;
}) {
  return (
    <label className="block text-xs text-navy-dim">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-navy-dim/30 bg-panel px-2 py-1.5 text-sm text-navy-dark outline-none focus:border-gold"
      >
        <option value={NONE}>{noneLabel}</option>
        {options.map((o) => (
          <option key={o.label} value={o.label}>
            {pricesVisible ? `${o.label} — ${fmt(o.price)}` : o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
