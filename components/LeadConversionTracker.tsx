"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/gtag";

// Рендериться лише коли форма успішно відправлена (sent=1 в URL після
// редіректу з submitLead) — фіксує це як конверсію "generate_lead" в GA4,
// щоб було видно, яка сторінка/форма реально приносить заявки, а не
// тільки трафік.
export default function LeadConversionTracker({ source }: { source: string }) {
  useEffect(() => {
    trackEvent("generate_lead", { form_source: source });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
