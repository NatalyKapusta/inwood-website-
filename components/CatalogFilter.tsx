"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Collection } from "@/lib/products";
import type { Dictionary } from "@/lib/dictionary";

export default function CatalogFilter({
  sections,
  orderEmail,
  t,
}: {
  sections: { id: string; data: Collection }[];
  orderEmail: string;
  t: Dictionary["catalog"];
}) {
  const [active, setActive] = useState<string>("all");

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
            <p className="mt-1 text-sm text-navy-dim">
              {t.thickness}: {s.data.thickness}
              {s.data.extra ? ` · ${s.data.extra}` : ""}
            </p>

            {s.data.models && (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {s.data.models.map((m) => (
                  <ProductCard
                    key={m.code}
                    collectionLabel={s.data.label}
                    model={m}
                    komplekt={s.data.komplekt}
                    orderEmail={orderEmail}
                    t={t}
                  />
                ))}
              </div>
            )}

            {s.data.variants && (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {s.data.variants.map((v) => (
                  <div
                    key={v.label}
                    className="overflow-hidden rounded-xl border border-navy-dim/10 bg-panel"
                  >
                    <div className="relative aspect-square bg-panel-alt">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={v.image}
                        alt={v.label}
                        className="h-full w-full object-contain p-4"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-navy-dark">{v.label}</p>
                      <p className="mt-2 font-serif text-lg font-bold text-navy-dark">
                        {t.from} {new Intl.NumberFormat("uk-UA").format(v.price)} ₴
                      </p>
                    </div>
                  </div>
                ))}
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
