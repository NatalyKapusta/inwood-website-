"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { PublicHardwareItem } from "@/lib/publicShop";
import type { HardwareCategory } from "@/lib/quote";
import AddToCartButton from "@/components/AddToCartButton";
import { trackEvent } from "@/lib/gtag";

// SEO-аудит 23.09.2026: /furnitura віддавала 1,6 МБ розмітки і 434
// зображення одним екраном — те саме, що вирішили пагінацією в каталозі
// (задача 5). На відміну від каталогу, тут навіть окрема категорія
// ("Ручки" — under a сотню позицій) може бути завеликою, тож ліміт діє в
// будь-якій вкладці, не лише "Усі".
const INITIAL_LIMIT = 24;
const BATCH = 24;

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
  showMoreLabel,
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
  showMoreLabel: string;
}) {
  const [active, setActive] = useState<HardwareCategory | "all">("all");
  const [visibleLimit, setVisibleLimit] = useState(INITIAL_LIMIT);
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

  // Перемикання вкладки категорії рахуємо як новий перегляд — ліміт
  // повертаємо до початкового, а не лишаємо розкритим із попередньої вкладки.
  useEffect(() => {
    setVisibleLimit(INITIAL_LIMIT);
  }, [active]);

  const filteredItems = items.filter((i) => active === "all" || i.category === active);
  const totalCount = filteredItems.length;

  // Розподіляємо загальний ліміт по групах бренду в їхньому порядку — той
  // самий принцип, що вже є в CatalogFilter.tsx.
  const byBrand = useMemo(() => {
    let remaining = visibleLimit;
    return brandOrder
      .map((brand) => {
        const brandItems = filteredItems.filter((i) => i.brand === brand);
        const show = Math.max(0, Math.min(brandItems.length, remaining));
        remaining -= show;
        return {
          brand,
          label: brandLabels[brand] ?? brand,
          items: brandItems.slice(0, show),
        };
      })
      .filter((b) => b.items.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredItems, visibleLimit, brandOrder, brandLabels]);

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

      {visibleLimit < totalCount && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setVisibleLimit((n) => n + BATCH)}
            className="rounded-full border border-navy-dim/25 px-6 py-2.5 text-sm font-semibold text-navy-dark transition hover:border-gold hover:text-gold-dim"
          >
            {showMoreLabel}
          </button>
        </div>
      )}
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
