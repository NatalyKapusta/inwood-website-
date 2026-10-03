"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type HeroDoor = { src: string; label: string };

// Позиції дверей у "каруселі": 0 — центр, 1–2 — праворуч, 3 — схована
// позаду центру, 4–5 — ліворуч. SLOTS_WIDE розтягує розклад на всю
// ширину картки з лічильниками під каруселлю (видно на lg-екранах,
// де hero переходить у дві колонки — той самий брейкпоінт, що й
// `lg:grid-cols-2` у app/[locale]/page.tsx).
const SLOTS_COMPACT = [
  { x: 0, scale: 1, z: 60, opacity: 1, rotate: 0 },
  { x: 88, scale: 0.72, z: 40, opacity: 0.85, rotate: -16 },
  { x: 144, scale: 0.5, z: 20, opacity: 0.35, rotate: -24 },
  { x: 0, scale: 0.3, z: 0, opacity: 0, rotate: 0 },
  { x: -144, scale: 0.5, z: 20, opacity: 0.35, rotate: 24 },
  { x: -88, scale: 0.72, z: 40, opacity: 0.85, rotate: 16 },
] as const;

const SLOTS_WIDE = [
  { x: 0, scale: 1, z: 60, opacity: 1, rotate: 0 },
  { x: 141, scale: 0.72, z: 40, opacity: 0.85, rotate: -16 },
  { x: 231, scale: 0.5, z: 20, opacity: 0.35, rotate: -24 },
  { x: 0, scale: 0.3, z: 0, opacity: 0, rotate: 0 },
  { x: -231, scale: 0.5, z: 20, opacity: 0.35, rotate: 24 },
  { x: -141, scale: 0.72, z: 40, opacity: 0.85, rotate: 16 },
] as const;

const AUTOPLAY_MS = 3200;

export default function HeroDoorCarousel({ eyebrow, doors }: { eyebrow: string; doors: HeroDoor[] }) {
  const n = doors.length;
  const [current, setCurrent] = useState(0);
  const [wide, setWide] = useState(false);
  const paused = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!paused.current) setCurrent((c) => (c + 1) % n);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [n]);

  const slots = wide ? SLOTS_WIDE : SLOTS_COMPACT;

  return (
    <div
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div className="relative h-[212px]" style={{ perspective: 1200 }}>
        {doors.map((door, i) => {
          const offset = (i - current + n) % n;
          const s = slots[offset];
          return (
            <div
              key={door.src}
              className="absolute left-1/2 top-1/2 h-[204px] w-[100px] -ml-[50px] -mt-[102px] transition-[transform,opacity] duration-[1150ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
              style={{
                transform: `translateX(${s.x}px) scale(${s.scale}) rotateY(${s.rotate}deg)`,
                opacity: s.opacity,
                zIndex: s.z,
                filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.4))",
              }}
            >
              <Image src={door.src} alt={door.label} fill sizes="200px" className="object-contain" />
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex justify-center gap-1.5">
        {doors.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
              i === current ? "scale-125 bg-gold" : "bg-white/25"
            }`}
          />
        ))}
      </div>

      <div className="mt-1.5 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50">{eyebrow}</p>
        <p className="font-serif text-base font-semibold text-white">{doors[current].label}</p>
      </div>
    </div>
  );
}
