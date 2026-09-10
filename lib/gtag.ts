"use client";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

// Пушимо подію прямо в dataLayer (те саме, що робить сам gtag() під
// капотом), а не викликаємо window.gtag напряму — бо next/script з
// afterInteractive не гарантує, що GA-скрипт уже встиг виконатись до
// того, як компонент, що трекає подію, змонтувався й відпрацював свій
// useEffect. dataLayer існує одразу (масив), а gtag.js/наш inline-скрипт
// однаково розбере чергу, коли завантажиться, незалежно від порядку.
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(["event", name, params]);
}
