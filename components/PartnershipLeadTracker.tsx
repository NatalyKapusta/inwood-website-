"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/gtag";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// Рендериться лише коли форма на /partnership успішно відправлена — фіксує
// це як конверсію "Lead" в Meta Pixel і "generate_lead" в GA4. До цього
// пиксель тут фіксував лише PageView, тож рекламний кабінет не бачив, хто
// саме залишив заявку, а не просто зайшов на сторінку.
export default function PartnershipLeadTracker({ formType }: { formType: "partner" | "catalog" }) {
  useEffect(() => {
    window.fbq?.("track", "Lead", { content_name: formType });
    trackEvent("generate_lead", { form_source: `partnership-${formType}` });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
