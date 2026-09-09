"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Komplekt, ProductModel } from "@/lib/products";
import type { Dictionary } from "@/lib/dictionary";
import PhoneInput from "@/components/PhoneInput";

const NONE = "__none__";

function fmt(n: number) {
  return new Intl.NumberFormat("uk-UA").format(n) + " ₴";
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
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const color = model.colors[colorIdx];

  const extra = useMemo(() => {
    const findPrice = (list: { label: string; price: number }[], value: string) =>
      value === NONE ? 0 : list.find((o) => o.label === value)?.price ?? 0;
    return (
      findPrice(komplekt.korob, korob) +
      findPrice(komplekt.lyshtva, lyshtva) +
      findPrice(komplekt.dobir, dobir)
    );
  }, [korob, lyshtva, dobir, komplekt]);

  const total = model.basePrice + extra;

  const configLines = [
    `${collectionLabel} — ${model.code}`,
    `${t.color}: ${color?.label ?? "-"}`,
    korob !== NONE ? `${t.korob}: ${korob}` : null,
    lyshtva !== NONE ? `${t.lyshtva}: ${lyshtva}` : null,
    dobir !== NONE ? `${t.dobir}: ${dobir}` : null,
    // Ціну лишаємо в листі менеджеру завжди — це приватна заявка, не публічний показ.
    `${t.total}: ${fmt(total)}`,
  ].filter(Boolean) as string[];
  const displayLines = pricesVisible ? configLines : configLines.slice(0, -1);

  const mailHref = `mailto:${orderEmail}?subject=${encodeURIComponent(
    `${collectionLabel} ${model.code}`
  )}&body=${encodeURIComponent(
    `${configLines.join("\n")}\n\n${name}\n${phone}`
  )}`;

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

        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="font-serif text-lg font-bold text-navy-dark">
            {!pricesVisible
              ? t.findOutPrice
              : extra > 0
              ? `${t.total}: ${fmt(total)}`
              : `${t.from} ${fmt(model.basePrice)}`}
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-full bg-navy-dark px-4 py-2 text-sm font-semibold text-white transition hover:bg-gold hover:text-navy-dark"
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
            <form className="mt-4 flex flex-col gap-3">
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
              <a
                href={mailHref}
                className="rounded-full bg-gold px-4 py-2 text-center text-sm font-semibold text-navy-dark transition hover:bg-gold-dim"
              >
                {t.sendInquiry}
              </a>
            </form>
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
