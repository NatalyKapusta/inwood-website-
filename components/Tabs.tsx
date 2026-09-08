"use client";

import { useState, type ReactNode } from "react";

export default function Tabs({
  tabs,
}: {
  tabs: { id: string; label: string; content: ReactNode }[];
}) {
  const [active, setActive] = useState(tabs[0]?.id);

  return (
    <div>
      <div className="flex justify-center gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={`rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-wide transition ${
              active === t.id
                ? "bg-navy-dark text-white"
                : "bg-panel-alt text-navy-dim hover:bg-navy-dark/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-10">{tabs.find((t) => t.id === active)?.content}</div>
    </div>
  );
}
