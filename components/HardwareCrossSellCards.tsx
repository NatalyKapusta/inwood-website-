"use client";

import { useEffect, useRef } from "react";
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

// IntersectionObserver, а не cookies()/headers() — компонент лишається
// суто клієнтським для трекінгу, і не змушує сторінку-батька (серверний
// HardwareCrossSell) рендеритись динамічно.
export default function HardwareCrossSellCards({
  items,
  cardLabels,
  noPhotoLabel,
  addToCartLabel,
  addedToCartLabel,
}: {
  items: PublicHardwareItem[];
  cardLabels: Partial<Record<HardwareCategory, string>>;
  noPhotoLabel: string;
  addToCartLabel: string;
  addedToCartLabel: string;
}) {
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
            item_list_name: "cross_sell_collection",
            items: items.map(toGa4Item),
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [items]);

  return (
    <div ref={rootRef} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={`${item.brand}-${item.article}`}
          onClick={() =>
            trackEvent("select_item", {
              item_list_name: "cross_sell_collection",
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
                  alt={`${item.name} ${item.article}`}
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
            <p className="text-xs uppercase tracking-wide text-gold-dim">{cardLabels[item.category]}</p>
            <p className="mt-1 text-sm font-semibold text-navy-dark">{item.name}</p>
            <p className="mt-0.5 text-xs text-navy-dim">{item.article}</p>
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
  );
}
