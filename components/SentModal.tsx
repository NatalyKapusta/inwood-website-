"use client";

import { useState, type ReactNode } from "react";

// Спливаюче вікно "Дякуємо за заявку" з хрестиком — форма лишається на
// сторінці позаду і видно її знову одразу після закриття, без потреби
// відкривати сторінку заново по чистому посиланню.
export default function SentModal({
  message,
  children,
  closeLabel = "Закрити",
}: {
  message?: string;
  children?: ReactNode;
  closeLabel?: string;
}) {
  const [closed, setClosed] = useState(false);
  if (closed) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={() => setClosed(true)}
    >
      <div
        className="relative max-w-sm rounded-xl bg-white p-8 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setClosed(true)}
          aria-label={closeLabel}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-lg text-navy-dim hover:bg-panel-alt hover:text-navy-dark"
        >
          ✕
        </button>
        {children ?? <p className="mt-2 text-navy-dark">{message}</p>}
      </div>
    </div>
  );
}
