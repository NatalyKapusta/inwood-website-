"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";
import type { Collection } from "@/lib/products";
import type { Dictionary } from "@/lib/dictionary";

const ADDON_TYPES = ["korob", "lishtva", "dobir"] as const;
type AddonType = (typeof ADDON_TYPES)[number];
type AddonFilter = AddonType | "nakladka_plintus" | "all";

// SEO-аудит 23.09.2026: /catalog віддавав 971 зображення в розмітці одразу —
// DOM такого розміру зривав LCP (2,8с при порозі Google 2,5с), хоча вага
// файлів (14 КБ початкового трафіку) до цього стосунку не мала. Рішення —
// показувати першою порцією 20-30 моделей (тільки у вкладці "Усі", кожна
// окрема колекція й так невелика), решту довантажувати по кнопці.
const INITIAL_MODEL_LIMIT = 24;
const MODEL_BATCH = 24;

function fmtUah(n: number) {
  return `${new Intl.NumberFormat("uk-UA").format(n)} ₴`;
}

export default function CatalogFilter({
  sections,
  t,
  pricesVisible,
  nakladkaLabel,
  plintusLabel,
  addToCartLabel,
  addedToCartLabel,
}: {
  sections: { id: string; data: Collection }[];
  t: Dictionary["catalog"];
  pricesVisible: boolean;
  nakladkaLabel: string;
  plintusLabel: string;
  addToCartLabel: string;
  addedToCartLabel: string;
}) {
  const [active, setActive] = useState<string>("all");
  const [addonType, setAddonType] = useState<AddonFilter>("all");
  const [modelLimit, setModelLimit] = useState(INITIAL_MODEL_LIMIT);
  const addonTypeLabel: Partial<Record<AddonType | "nakladka" | "plintus", string>> = {
    korob: t.korob,
    lishtva: t.lyshtva,
    dobir: t.dobir,
  };

  const totalModelCount = useMemo(
    () => sections.reduce((sum, s) => sum + (s.data.models?.length ?? 0), 0),
    [sections]
  );
  // Скільки моделей показувати з кожної секції у вкладці "Усі" — розподіляємо
  // загальний ліміт по секціях у їхньому порядку, не чіпаючи інші вкладки
  // (там і так, максимум, одна колекція — 17 моделей, це не проблема).
  const perSectionVisible = useMemo(() => {
    let remaining = modelLimit;
    return sections.map((s) => {
      const total = s.data.models?.length ?? 0;
      const show = Math.max(0, Math.min(total, remaining));
      remaining -= show;
      return show;
    });
  }, [sections, modelLimit]);

  // Глибокі посилання на конкретну модель (напр. блок "Тренди 2026" на
  // головній, #etalon-ET-06:colorSlug) можуть вести на модель, яка ще не
  // потрапила в початкову порцію — тоді одразу розкриваємо досить моделей,
  // щоб потрібна опинилась у розмітці.
  useEffect(() => {
    const anchorId = window.location.hash.slice(1).split(":")[0];
    if (!anchorId) return;
    let cumulative = 0;
    for (const s of sections) {
      const models = s.data.models ?? [];
      const idx = models.findIndex((m) => `${s.id}-${m.code}` === anchorId);
      if (idx !== -1) {
        setModelLimit((prev) => Math.max(prev, cumulative + idx + 1));
        return;
      }
      cumulative += models.length;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {sections.map((s, sectionIdx) => (
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
                {(active === "all" ? s.data.models.slice(0, perSectionVisible[sectionIdx]) : s.data.models).map(
                  (m) => (
                    <ProductCard
                      key={m.code}
                      anchorId={`${s.id}-${m.code}`}
                      collectionLabel={s.data.label}
                      model={m}
                      komplekt={s.data.komplekt!}
                      t={t}
                      pricesVisible={pricesVisible}
                      addToCartLabel={addToCartLabel}
                      addedToCartLabel={addedToCartLabel}
                    />
                  )
                )}
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
                  <SubFilterButton
                    active={addonType === "nakladka_plintus"}
                    onClick={() => setAddonType("nakladka_plintus")}
                  >
                    {nakladkaLabel} / {plintusLabel}
                  </SubFilterButton>
                </div>

                <div className="mt-6 space-y-8">
                  {Array.from(new Set(s.data.addons.map((a) => a.collectionLabel))).map((collectionLabel) => {
                    const items = s.data.addons!.filter((a) => {
                      if (a.collectionLabel !== collectionLabel) return false;
                      if (addonType === "all") return true;
                      if (addonType === "nakladka_plintus") return a.addon_type === "nakladka" || a.addon_type === "plintus";
                      return a.addon_type === addonType;
                    });
                    if (items.length === 0) return null;
                    return (
                      <div key={collectionLabel}>
                        <h3 className="font-serif text-lg font-bold text-navy-dark">{collectionLabel}</h3>
                        <ul className="mt-3 divide-y divide-navy-dim/10 rounded-xl border border-navy-dim/10 bg-panel">
                          {items.map((item) => {
                            const typePrefix = addonTypeLabel[item.addon_type];
                            const priceLabel = pricesVisible
                              ? `${fmtUah(item.price)}${item.unitSuffix ? ` ${item.unitSuffix}` : ""}`
                              : t.findOutPrice;
                            return (
                              <li
                                key={`${item.addon_type}-${item.item_label}`}
                                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
                              >
                                <div>
                                  <span className="text-navy-dark">
                                    {typePrefix ? `${typePrefix}: ` : ""}
                                    {item.item_label}
                                  </span>
                                  <p className="mt-0.5 text-xs text-navy-dim">{priceLabel}</p>
                                </div>
                                <AddToCartButton
                                  id={`pog-${item.addon_type}-${item.item_label}`}
                                  label={`${collectionLabel} — ${typePrefix ? `${typePrefix}: ` : ""}${item.item_label}${item.unitSuffix ? ` (${item.unitSuffix})` : ""}`}
                                  price={pricesVisible ? item.price : null}
                                  addLabel={addToCartLabel}
                                  addedLabel={addedToCartLabel}
                                />
                              </li>
                            );
                          })}
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

      {active === "all" && modelLimit < totalModelCount && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setModelLimit((n) => n + MODEL_BATCH)}
            className="rounded-full border border-navy-dim/25 px-6 py-2.5 text-sm font-semibold text-navy-dark transition hover:border-gold hover:text-gold-dim"
          >
            {t.showMore}
          </button>
        </div>
      )}

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
