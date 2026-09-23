"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/gtag";

// Один делегований обробник кліків на document — ловить дзвінки (tel:) і
// месенджер (Telegram, t.me/...) БУДЬ-ДЕ на сайті, без ручного трекання
// кожного посилання окремо. Working: клік по будь-якому <a href="tel:...">
// чи <a href="...t.me/...">, включно з майбутніми, автоматично шле подію
// в GA4 як ключову дію (задача 1.6 з ТЗ конверсії).
export default function ClickTracking() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const link = (e.target as HTMLElement)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) {
        trackEvent("phone_click", { page_path: window.location.pathname });
      } else if (href.includes("t.me/")) {
        trackEvent("messenger_click", { page_path: window.location.pathname });
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
