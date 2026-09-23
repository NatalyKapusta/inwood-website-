"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LeadConversionTracker from "@/components/LeadConversionTracker";
import SentModal from "@/components/SentModal";

// Виносимо ?sent=1 у клієнтський компонент, а не читаємо searchParams на
// сервері (як робили раніше в кожній сторінці) — читання searchParams у
// серверному компоненті примусово переводить весь маршрут у динамічний
// рендер, і саме тому жодна публічна сторінка не кешувалась на Vercel/CDN.
// useSearchParams() тут не чіпає рендер сторінки-батька: тільки цей
// маленький клієнтський вузол читає URL вже після гідратації.
function SentNoticeInner({ source, sentLabel }: { source: string; sentLabel?: string }) {
  const searchParams = useSearchParams();
  if (searchParams.get("sent") !== "1") return null;
  return (
    <>
      <LeadConversionTracker source={source} />
      <SentModal message={sentLabel ?? "Дякуємо! Заявку надіслано, ми скоро з вами зв'яжемось."} />
    </>
  );
}

// useSearchParams() вимагає Suspense-межу навколо себе — інакше Next
// не зможе статично згенерувати сторінку-батька.
export default function SentNotice(props: { source: string; sentLabel?: string }) {
  return (
    <Suspense fallback={null}>
      <SentNoticeInner {...props} />
    </Suspense>
  );
}
