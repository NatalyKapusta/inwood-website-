"use client";

import { useState } from "react";
import Image from "next/image";
import type { ColorOption } from "@/lib/products";

export default function LineColorPreview({
  code,
  colors,
}: {
  code: string;
  colors: ColorOption[];
}) {
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
        <Image key={color.image} src={color.image} alt={`${code} — ${color.label}`} fill className="object-contain p-4" />
      </div>
      {colors.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {colors.slice(0, 12).map((c, i) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setIdx(i)}
              title={c.label}
              className={`h-6 w-6 rounded-full border-2 ${i === idx ? "border-gold" : "border-navy-dim/20"}`}
              style={{ backgroundImage: `url(${c.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
