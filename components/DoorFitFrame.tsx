"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

// Інструмент door-fit підтримує лише uk/en. Українська й російська версії
// сайту показують інструмент українською (аудиторія ru — здебільшого з
// України), англійська й польська — англійською.
function toolLang(locale: Locale) {
  return locale === "ua" || locale === "ru" ? "uk" : "en";
}

export default function DoorFitFrame({ locale, title }: { locale: Locale; title: string }) {
  const [src, setSrc] = useState("/tools/door-fit/door-fit.html");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("lang", toolLang(locale));
    // "base" — щоб кнопка "Скопіювати посилання" всередині інструмента
    // копіювала адресу цієї сторінки сайту (з конфігурацією дверей у
    // параметрах), а не прямий шлях до door-fit.html у iframe.
    params.set("base", window.location.origin + window.location.pathname);
    setSrc(`/tools/door-fit/door-fit.html?${params.toString()}`);
  }, [locale]);

  return (
    <iframe
      src={src}
      title={title}
      className="h-[850px] w-full"
      style={{ border: 0 }}
      loading="lazy"
      allow="clipboard-write"
    />
  );
}
