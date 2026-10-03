"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type TouchEvent } from "react";

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

const AUTOPLAY_MS_DESKTOP = 3200;
const AUTOPLAY_MS_MOBILE = 2400;

export default function HeroDoorCarousel({ eyebrow, doors }: { eyebrow: string; doors: HeroDoor[] }) {
  const n = doors.length;
  const [current, setCurrent] = useState(0);
  const [wide, setWide] = useState(false);
  // "Зменшити рух" на пристрої вимикає лише плавний перехід (щоб не
  // смикало екран великою анімацією), але не саму зміну кольорів — це
  // вітрина товару, вона має продовжувати крутитись, просто без
  // плавного ковзання.
  const [reducedMotion, setReducedMotion] = useState(false);
  const paused = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Відлік від останньої ручної дії (свайп) — щоб автопрокрутка не
  // перебивала вибір миттєво після того, як людина сама гортонула.
  const lastInteraction = useRef(0);
  // На телефоні — трохи швидше за десктоп (не різко, просто бадьоріше).
  const autoplayMs = wide ? AUTOPLAY_MS_DESKTOP : AUTOPLAY_MS_MOBILE;

  useEffect(() => {
    const id = setInterval(() => {
      if (paused.current) return;
      if (Date.now() - lastInteraction.current < autoplayMs) return;
      setCurrent((c) => (c + 1) % n);
    }, autoplayMs);
    return () => clearInterval(id);
  }, [n, autoplayMs]);

  // Свайп пальцем на телефоні — вперед/назад по дверях. Рахуємо зсув
  // лише на touchend (а не під час руху), щоб не заважати звичайному
  // вертикальному скролу сторінки.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const SWIPE_THRESHOLD = 40;

  function onTouchStart(e: TouchEvent<HTMLDivElement>) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }

  function onTouchEnd(e: TouchEvent<HTMLDivElement>) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    lastInteraction.current = Date.now();
    setCurrent((c) => (dx < 0 ? (c + 1) % n : (c - 1 + n) % n));
  }

  const slots = wide ? SLOTS_WIDE : SLOTS_COMPACT;

  // Пауза при наведенні — лише для пристроїв зі справжньою мишею
  // (hover: hover). Без цієї перевірки дотик на телефоні теж спрацьовує
  // як "mouseenter", але відповідний "mouseleave" після скролу пальцем
  // далі не приходить — карусель назавжди лишалась на паузі й на
  // телефоні виглядала так, ніби взагалі не крутиться.
  const canHover = useRef(false);
  useEffect(() => {
    canHover.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

  return (
    <div
      onMouseEnter={() => {
        if (canHover.current) paused.current = true;
      }}
      onMouseLeave={() => {
        if (canHover.current) paused.current = false;
      }}
    >
      <div
        className="relative h-[212px] touch-pan-y"
        style={{ perspective: 1200 }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {doors.map((door, i) => {
          const offset = (i - current + n) % n;
          const s = slots[offset];
          return (
            <div
              key={door.src}
              className="absolute left-1/2 top-1/2 h-[204px] w-[100px] -ml-[50px] -mt-[102px] transition-[transform,opacity] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
              style={{
                transform: `translateX(${s.x}px) scale(${s.scale}) rotateY(${s.rotate}deg)`,
                opacity: s.opacity,
                zIndex: s.z,
                filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.4))",
                transitionDuration: reducedMotion ? "0ms" : "1150ms",
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
