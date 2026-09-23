"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { trackEvent } from "@/lib/gtag";

export default function AddToCartButton({
  id,
  label,
  price,
  category,
  addLabel,
  addedLabel,
  className,
}: {
  id: string;
  label: string;
  price: number | null;
  category?: string;
  addLabel: string;
  addedLabel: string;
  className?: string;
}) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleClick() {
    addItem({ id, label, price });
    trackEvent("add_to_cart", {
      item_id: id,
      item_name: label,
      price,
      ...(category ? { item_category: category } : {}),
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ??
        "shrink-0 rounded-full border border-gold-dim/40 px-3 py-1.5 text-xs font-semibold text-navy-dark transition hover:border-gold hover:bg-gold/10"
      }
    >
      {justAdded ? addedLabel : addLabel}
    </button>
  );
}
