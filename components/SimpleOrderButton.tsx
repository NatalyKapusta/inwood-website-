"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import PhoneInput from "@/components/PhoneInput";
import { trackEvent } from "@/lib/gtag";

// Компактна версія модалки заявки з ProductCard.tsx — без конфігуратора
// моделі, просто "показати ціну/замовити" для одного рядка (фурнітура,
// погонажні вироби, накладки, плінтус).
export default function SimpleOrderButton({
  itemLabel,
  source,
  buttonLabel,
  buttonClassName,
  sendInquiryLabel,
  closeLabel,
  formSentMessage,
  nameLabel,
  phoneLabel,
  phoneManual,
  phoneChooseCountry,
  phoneInvalid,
  sendFailedRetry,
}: {
  itemLabel: string;
  source: string;
  buttonLabel: string;
  buttonClassName?: string;
  sendInquiryLabel: string;
  closeLabel: string;
  formSentMessage: string;
  nameLabel?: string;
  phoneLabel?: string;
  phoneManual?: string;
  phoneChooseCountry?: string;
  phoneInvalid?: string;
  sendFailedRetry?: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  async function sendInquiry(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(false);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client: name, phone, comment: itemLabel, source }),
      });
      const data = await res.json();
      if (data.ok) {
        setSent(true);
        trackEvent("generate_lead", { form_source: source });
      } else setError(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={buttonClassName ?? "font-semibold text-navy-dark underline decoration-dotted underline-offset-4 transition hover:text-gold-dim"}
      >
        {buttonLabel}
      </button>

      {modalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-dark/60 p-4"
            onClick={() => setModalOpen(false)}
          >
            <div className="w-full max-w-md rounded-xl bg-panel p-6" onClick={(e) => e.stopPropagation()}>
              <h4 className="font-serif text-lg font-bold text-navy-dark">{itemLabel}</h4>
              {sent ? (
                <p className="mt-4 rounded-lg bg-panel-alt px-4 py-3 text-sm text-navy-dark">{formSentMessage}</p>
              ) : (
                <form onSubmit={sendInquiry} className="mt-4 flex flex-col gap-3">
                  <input
                    type="text"
                    required
                    placeholder={nameLabel}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-lg border border-navy-dim/30 px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                  <PhoneInput
                    placeholder={phoneLabel}
                    required
                    value={phone}
                    onChange={setPhone}
                    className="w-full rounded-lg border border-navy-dim/30 px-3 py-2 text-sm outline-none focus:border-gold"
                    manualLabel={phoneManual}
                    chooseCountryLabel={phoneChooseCountry}
                    invalidLabel={phoneInvalid}
                  />
                  {error && <p className="text-xs text-red-600">{sendFailedRetry}</p>}
                  <button
                    type="submit"
                    disabled={sending}
                    className="rounded-full bg-gold px-4 py-2 text-center text-sm font-semibold text-navy-dark transition hover:bg-gold-dim disabled:opacity-60"
                  >
                    {sending ? "..." : sendInquiryLabel}
                  </button>
                </form>
              )}
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="mt-3 w-full text-center text-xs text-navy-dim underline"
              >
                {closeLabel}
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
