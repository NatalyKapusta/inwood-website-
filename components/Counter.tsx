"use client";

import { useEffect, useRef, useState } from "react";

export default function Counter({
  to,
  suffix = "",
  label,
}: {
  to: number;
  suffix?: string;
  label: string;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const duration = 1200;
          const start = performance.now();

          let last = -1;
          function tick(now: number) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const next = Math.round(eased * to);
            // setValue на кожному кадрі (до 60 разів/с) змушує React
            // перерендерювати компонент навіть коли видиме число не
            // змінилось — зайве навантаження на головний потік саме в
            // момент першого завантаження сторінки. Оновлюємо стан лише
            // коли ціле число справді нове.
            if (next !== last) {
              last = next;
              setValue(next);
            }
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-serif text-4xl font-bold text-gold sm:text-5xl">
        {value}
        {suffix}
      </p>
      <p className="mt-2 text-sm uppercase tracking-wide text-white/80">{label}</p>
    </div>
  );
}
