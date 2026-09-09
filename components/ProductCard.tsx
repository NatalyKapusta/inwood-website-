"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Komplekt, ProductModel } from "@/lib/products";
import type { Dictionary } from "@/lib/dictionary";
import PhoneInput from "@/components/PhoneInput";

const NONE = "__none__";

// Роздрібні ціни на послуги, що застосовуються до будь-якої моделі —
// ті самі значення, що й у B2B-калькуляторі (service_tariff_prices,
// тариф "retail"): VRIZKA_LOCK_PRICE, VRIZKA_FULL_PRICE, SHUMO_PRICE.
const VRIZKA_LOCK_PRICE = 300;
const VRIZKA_FULL_PRICE = 600;
const SHUMO_PRICE = 1200;

function fmt(n: number) {
  // Нерозривний пробіл перед ₴ — щоб гривня не "відривалась" на новий рядок
  return new Intl.NumberFormat("uk-UA").format(n) + " ₴";
}

export default function ProductCard({
  collectionLabel,
  model,
  komplekt,
  orderEmail,
  t,
  pricesVisible,
}: {
  collectionLabel: string;
  model: ProductModel;
  komplekt: Komplekt;
  orderEmail: string;
  t: Dictionary["catalog"];
  pricesVisible: boolean;
}) {
  const [colorIdx, setColorIdx] = useState(0);
  const [korob, setKorob] = useState(NONE);
  const [lyshtva, setLyshtva] = useState(NONE);
  const [dobir, setDobir] = useState(NONE);
  const [vrizka, setVrizka] = useState<"none" | "lock" | "full">("none");
  const [shumo, setShumo] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const color = model.colors[colorIdx];

  const vrizkaPrice = vrizka === "lock" ? VRIZKA_LOCK_PRICE : vrizka === "full" ? VRIZKA_FULL_PRICE : 0;
  const shumoPrice = shumo ? SHUMO_PRICE : 0;

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

  const total = model.basePrice + extra;

  const configLines = [
    `${collectionLabel} — ${model.code}`,
    `${t.color}: ${color?.label ?? "-"}`,
    korob !== NONE ? `${t.korob}: ${korob}` : null,
    lyshtva !== NONE ? `${t.lyshtva}: ${lyshtva}` : null,
    dobir !== NONE ? `${t.dobir}: ${dobir}` : null,
    vrizka === "lock" ? `${t.vrizka}: ${t.vrizkaLock}` : vrizka === "full" ? `${t.vrizka}: ${t.vrizkaFull}` : null,
    shumo ? t.shumo : null,
    // Ціну лишаємо в листі менеджеру завжди — це приватна заявка, не публічний показ.
    `${t.total}: ${fmt(total)}`,
  ].filter(Boolean) as string[];
  const displayLines = pricesVisible ? configLines : configLines.slice(0, -1);

  async function sendInquiry(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(false);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: name,
          phone,
          comment: configLines.join("; "),
          source: `Каталог — ${collectionLabel} ${model.code}`,
        }),
      });
      const data = await res.json();
      if (data.ok) setSent(true);
      else setError(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-navy-dim/10 bg-panel">
      <div className="relative aspect-square bg-panel-alt">
        {color && (
          <Image
            key={color.image}
            src={color.image}
            alt={`${model.code} — ${color.label}`}
            fill
            className="object-contain p-4"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-navy-dim">{collectionLabel}</p>
          <h3 className="font-serif text-lg font-bold text-navy-dark">{model.code}</h3>
        </div>

        {model.colors.length > 1 && (
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
                  className={`h-6 w-6 rounded-full border-2 ${
                    i === colorIdx ? "border-gold" : "border-navy-dim/20"
                  }`}
                  style={{
                    backgroundImage: `url(${c.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              ))}
            </div>
          </div>
        )}

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
              : extra > 0
              ? `${t.total}: ${fmt(total)}`
              : `${t.from} ${fmt(model.basePrice)}`}
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="shrink-0 rounded-full bg-navy-dark px-4 py-2 text-sm font-semibold text-white transition hover:bg-gold hover:text-navy-dark"
          >
            {t.findOutPrice}
          </button>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-dark/60 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-panel p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-serif text-lg font-bold text-navy-dark">
              {collectionLabel} — {model.code}
            </h4>
            <p className="mt-2 whitespace-pre-line text-sm text-navy-dim">
              {displayLines.slice(1).join("\n")}
            </p>
            {sent ? (
              <p className="mt-4 rounded-lg bg-panel-alt px-4 py-3 text-sm text-navy-dark">
                Дякуємо! Заявку надіслано, ми скоро з вами зв&apos;яжемось.
              </p>
            ) : (
              <form onSubmit={sendInquiry} className="mt-4 flex flex-col gap-3">
                <input
                  type="text"
                  required
                  placeholder="Ім'я / Имя / Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-lg border border-navy-dim/30 px-3 py-2 text-sm outline-none focus:border-gold"
                />
                <PhoneInput
                  placeholder="Телефон / Phone"
                  required
                  value={phone}
                  onChange={setPhone}
                  className="w-full rounded-lg border border-navy-dim/30 px-3 py-2 text-sm outline-none focus:border-gold"
                />
                {error && (
                  <p className="text-xs text-red-600">Не вдалося надіслати. Спробуйте ще раз.</p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-full bg-gold px-4 py-2 text-center text-sm font-semibold text-navy-dark transition hover:bg-gold-dim disabled:opacity-60"
                >
                  {sending ? "..." : t.sendInquiry}
                </button>
              </form>
            )}
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="mt-3 w-full text-center text-xs text-navy-dim underline"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
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
