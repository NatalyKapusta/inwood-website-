"use client";

import { useState } from "react";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import SimpleOrderButton from "@/components/SimpleOrderButton";
import type { Collection } from "@/lib/products";
import type { Dictionary } from "@/lib/dictionary";

const ADDON_TYPES = ["korob", "lishtva", "dobir"] as const;
type AddonType = (typeof ADDON_TYPES)[number];

function fmtUah(n: number) {
  return `${new Intl.NumberFormat("uk-UA").format(n)} ₴`;
}

export default function CatalogFilter({
  sections,
  orderEmail,
  t,
  pricesVisible,
  phoneManual,
  phoneChooseCountry,
  phoneInvalid,
  sendFailedRetry,
  nameLabel,
  phoneLabel,
  formSentMessage,
}: {
  sections: { id: string; data: Collection }[];
  orderEmail: string;
  t: Dictionary["catalog"];
  pricesVisible: boolean;
  phoneManual?: string;
  phoneChooseCountry?: string;
  phoneInvalid?: string;
  sendFailedRetry?: string;
  nameLabel?: string;
  phoneLabel?: string;
  formSentMessage?: string;
}) {
  const [active, setActive] = useState<string>("all");
  const [addonType, setAddonType] = useState<AddonType | "all">("all");
  const addonTypeLabel: Record<AddonType, string> = { korob: t.korob, lishtva: t.lyshtva, dobir: t.dobir };

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        <FilterButton active={active === "all"} onClick={() => setActive("all")}>
          {t.all}
        </FilterButton>
        {sections.map((s) => (
          <FilterButton key={s.id} active={active === s.id} onClick={() => setActive(s.id)}>
            {s.data.label}
          </FilterButton>
        ))}
      </div>

      <div className="mt-10 space-y-16">
        {sections.map((s) => (
          <section key={s.id} id={s.id} hidden={active !== "all" && active !== s.id}>
            <h2 className="font-serif text-2xl font-bold text-navy-dark">{s.data.label}</h2>
            {s.data.thickness && (
              <p className="mt-1 text-sm text-navy-dim">
                {t.thickness}: {s.data.thickness}
                {s.data.extra ? ` · ${s.data.extra}` : ""}
              </p>
            )}

            {s.data.variants && (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {s.data.variants.map((v) => (
                  <div
                    key={v.label}
                    className="overflow-hidden rounded-xl border border-navy-dim/10 bg-panel"
                  >
                    <div className="relative aspect-square bg-panel-alt">
                      <Image
                        src={v.image}
                        alt={`Міжкімнатні двері IN WOOD ${s.data.label}, ${v.label}`}
                        fill
                        sizes="(min-width: 1280px) 300px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-contain p-4"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-navy-dark">{v.label}</p>
                      <p className="mt-2 font-serif text-lg font-bold text-navy-dark">
                        {pricesVisible
                          ? `${t.from} ${new Intl.NumberFormat("uk-UA").format(v.price)} ₴`
                          : t.findOutPrice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {s.data.models && (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {s.data.models.map((m) => (
                  <ProductCard
                    key={m.code}
                    collectionLabel={s.data.label}
                    model={m}
                    komplekt={s.data.komplekt!}
                    orderEmail={orderEmail}
                    t={t}
                    pricesVisible={pricesVisible}
                    phoneManual={phoneManual}
                    phoneChooseCountry={phoneChooseCountry}
                    phoneInvalid={phoneInvalid}
                    sendFailedRetry={sendFailedRetry}
                    nameLabel={nameLabel}
                    phoneLabel={phoneLabel}
                    formSentMessage={formSentMessage}
                  />
                ))}
              </div>
            )}

            {s.data.addons && (
              <div className="mt-6">
                <div className="flex flex-wrap justify-center gap-2">
                  <SubFilterButton active={addonType === "all"} onClick={() => setAddonType("all")}>
                    {t.all}
                  </SubFilterButton>
                  {ADDON_TYPES.map((type) => (
                    <SubFilterButton key={type} active={addonType === type} onClick={() => setAddonType(type)}>
                      {addonTypeLabel[type]}
                    </SubFilterButton>
                  ))}
                </div>

                <div className="mt-6 space-y-8">
                  {Array.from(new Set(s.data.addons.map((a) => a.collectionLabel))).map((collectionLabel) => {
                    const items = s.data.addons!.filter(
                      (a) => a.collectionLabel === collectionLabel && (addonType === "all" || a.addon_type === addonType)
                    );
                    if (items.length === 0) return null;
                    return (
                      <div key={collectionLabel}>
                        <h3 className="font-serif text-lg font-bold text-navy-dark">{collectionLabel}</h3>
                        <ul className="mt-3 divide-y divide-navy-dim/10 rounded-xl border border-navy-dim/10 bg-panel">
                          {items.map((item) => (
                            <li
                              key={`${item.addon_type}-${item.item_label}`}
                              className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
                            >
                              <span className="text-navy-dark">
                                {addonTypeLabel[item.addon_type]}: {item.item_label}
                              </span>
                              <SimpleOrderButton
                                itemLabel={`${collectionLabel} — ${addonTypeLabel[item.addon_type]}: ${item.item_label}`}
                                source="Каталог — Погонажні вироби"
                                buttonLabel={pricesVisible ? fmtUah(item.price) : t.findOutPrice}
                                sendInquiryLabel={t.sendInquiry}
                                closeLabel={t.close}
                                formSentMessage={formSentMessage ?? ""}
                                nameLabel={nameLabel}
                                phoneLabel={phoneLabel}
                                phoneManual={phoneManual}
                                phoneChooseCountry={phoneChooseCountry}
                                phoneInvalid={phoneInvalid}
                                sendFailedRetry={sendFailedRetry}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        ))}
      </div>

      <p className="mt-12 text-center text-sm text-navy-dim">{t.footnote}</p>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-wide transition ${
        active ? "bg-navy-dark text-white" : "bg-panel-alt text-navy-dim hover:bg-navy-dark/10"
      }`}
    >
      {children}
    </button>
  );
}

function SubFilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
        active
          ? "border-gold-dim bg-gold/15 text-gold-dim"
          : "border-navy-dim/20 text-navy-dim hover:border-gold-dim hover:text-gold-dim"
      }`}
    >
      {children}
    </button>
  );
}
