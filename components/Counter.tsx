"use client";

import { useEffect, useRef, useState } from "react";

// Стан ініціалізується вже готовим числом (to), а не 0 — React рендерить
// це значення на сервері, тож у статичному HTML, який читає пошуковий
// робот без виконання JS, завжди стоїть справжня цифра (SEO-аудит
// 23.09.2026, задача 1). Рахунок 0 → to запускається лише в браузері
// після гідратації, коли блок з'являється у в'юпорті — для живого
// відвідувача це виглядає як звична анімація лічильника.
export default function Counter({
  to,
  suffix = "",
  label,
}: {
  to: number;
  suffix?: string;
  label: string;
}) {
  const [value, setValue] = useState(to);
  const ref = useRef<HTMLParagraphElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animated.current) return;
        animated.current = true;

        const duration = 1200;
        const start = performance.now();

        const step = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          setValue(Math.round(to * progress));
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            setValue(to);
          }
        };

        setValue(0);
        requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to]);

  return (
    <div className="text-center">
      <p ref={ref} className="font-serif text-4xl font-bold text-gold sm:text-5xl">
        {value}
        {suffix}
      </p>
      <p className="mt-2 text-sm uppercase tracking-wide text-white/80">{label}</p>
    </div>
  );
}
