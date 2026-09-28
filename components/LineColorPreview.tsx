"use client";

import { useState } from "react";
import Image from "next/image";
import type { ColorOption } from "@/lib/products";
import type { Locale } from "@/lib/i18n";

export default function LineColorPreview({
  code,
  colors,
  locale,
}: {
  code: string;
  colors: ColorOption[];
  locale: Locale;
}) {
  const colorLabel = (c: ColorOption) =>
    (locale === "ru" && c.labelRu) || (locale === "en" && c.labelEn) || (locale === "pl" && c.labelPl) || c.label;
  const defaultIdx = Math.max(
    0,
    colors.findIndex((c) => c.slug === "white")
  );
  const [idx, setIdx] = useState(defaultIdx === -1 ? 0 : defaultIdx);
  const color = colors[idx];

  if (!color) return null;

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg bg-panel">
        <Image key={color.image} src={color.image} alt={`${code} — ${colorLabel(color)}`} fill className="object-contain p-4" />
      </div>
      {colors.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {colors.slice(0, 12).map((c, i) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setIdx(i)}
              title={colorLabel(c)}
              className={`relative h-6 w-6 overflow-hidden rounded-full border-2 ${i === idx ? "border-gold" : "border-navy-dim/20"}`}
            >
              <Image src={c.image} alt={colorLabel(c)} fill sizes="24px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
