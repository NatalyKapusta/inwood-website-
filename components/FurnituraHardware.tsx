"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { PublicHardwareItem } from "@/lib/publicShop";
import type { HardwareCategory } from "@/lib/quote";
import AddToCartButton from "@/components/AddToCartButton";
import { trackEvent } from "@/lib/gtag";

function fmtUah(n: number) {
  return `${new Intl.NumberFormat("uk-UA").format(n)} ₴`;
}

function toGa4Item(item: PublicHardwareItem) {
  return {
    item_id: `hw-${item.brand}-${item.article}`,
    item_name: item.name,
    price: item.price,
    item_category: item.category,
  };
}

export default function FurnituraHardware({
  items,
  brandLabels,
  brandOrder,
  categoryLabels,
  categoryOrder,
  allLabel,
  noPhotoLabel,
  addToCartLabel,
  addedToCartLabel,
}: {
  items: PublicHardwareItem[];
  brandLabels: Record<string, string>;
  brandOrder: string[];
  categoryLabels: Record<HardwareCategory, string>;
  categoryOrder: HardwareCategory[];
  allLabel: string;
  noPhotoLabel: string;
  addToCartLabel: string;
  addedToCartLabel: string;
}) {
  const [active, setActive] = useState<HardwareCategory | "all">("all");
  const availableCategories = categoryOrder.filter((cat) => items.some((i) => i.category === cat));

  const rootRef = useRef<HTMLDivElement>(null);
  const tracked = useRef(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || items.length === 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked.current) {
          tracked.current = true;
          trackEvent("view_item_list", {
            item_list_name: "furnitura_page",
            items: items.map(toGa4Item),
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const byBrand = brandOrder
    .map((brand) => ({
      brand,
      label: brandLabels[brand] ?? brand,
      items: items.filter((i) => i.brand === brand && (active === "all" || i.category === active)),
    }))
    .filter((b) => b.items.length > 0);

  return (
    <div ref={rootRef}>
      <div className="flex flex-wrap justify-center gap-2">
        <FilterButton active={active === "all"} onClick={() => setActive("all")}>
          {allLabel}
        </FilterButton>
        {availableCategories.map((cat) => (
          <FilterButton key={cat} active={active === cat} onClick={() => setActive(cat)}>
            {categoryLabels[cat]}
          </FilterButton>
        ))}
      </div>

      <div className="mt-8 space-y-12">
        {byBrand.map((brandGroup) => (
          <div key={brandGroup.brand}>
            <h3 className="font-serif text-xl font-bold text-navy-dark">{brandGroup.label}</h3>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {brandGroup.items.map((item) => (
                <div
                  key={`${item.brand}-${item.article}`}
                  onClick={() =>
                    trackEvent("select_item", {
                      item_list_name: "furnitura_page",
                      items: [toGa4Item(item)],
                    })
                  }
                  className="overflow-hidden rounded-xl border border-navy-dim/10 bg-panel"
                >
                  <div className="flex items-center justify-center bg-panel-alt p-4">
                    {item.photo ? (
                      <div className="relative aspect-square w-full max-w-[110px]">
                        <Image
                          src={item.photo}
                          alt={`${item.name} ${item.article}, ${brandGroup.label}`}
                          fill
                          sizes="110px"
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <span className="aspect-square w-full max-w-[110px] px-2 text-center text-xs text-navy-dim/60">
                        {noPhotoLabel}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-navy-dark">{item.name}</p>
                    <p className="mt-0.5 text-xs text-navy-dim">
                      {item.article}
                      {item.material ? ` · ${item.material}` : ""}
                    </p>
                    <p className="mt-2 font-serif text-base font-bold text-navy-dark">{fmtUah(item.price)}</p>
                    <div onClick={(e) => e.stopPropagation()}>
                      <AddToCartButton
                        id={`hw-${item.brand}-${item.article}`}
                        label={`${item.name} (${item.article}${item.material ? `, ${item.material}` : ""})`}
                        price={item.price}
                        category={item.category}
                        addLabel={addToCartLabel}
                        addedLabel={addedToCartLabel}
                        className="mt-2 w-full rounded-full border border-gold-dim/40 px-3 py-1.5 text-xs font-semibold text-navy-dark transition hover:border-gold hover:bg-gold/10"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
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
