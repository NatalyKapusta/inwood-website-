"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/components/CartContext";
import PhoneInput from "@/components/PhoneInput";
import { trackEvent } from "@/lib/gtag";

function fmtUah(n: number) {
  return `${new Intl.NumberFormat("uk-UA").format(n)} ₴`;
}

export default function CartDrawer({
  open,
  onClose,
  cartTitle,
  cartEmpty,
  cartTotal,
  findOutPriceLabel,
  removeLabel,
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
  open: boolean;
  onClose: () => void;
  cartTitle: string;
  cartEmpty: string;
  cartTotal: string;
  findOutPriceLabel: string;
  removeLabel: string;
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
  const { items, removeItem, setQty, clear } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const beginCheckoutTracked = useRef(false);

  const total = items.reduce((sum, i) => sum + (i.price ?? 0) * i.qty, 0);

  // "Оформлення" в цьому кошику — це саме відкриття кошика з товарами
  // (окремої сторінки чекауту немає), тож begin_checkout трекаємо тут, а
  // не по кліку в формі. Скидаємо прапорець при закритті — повторне
  // відкриття вважаємо новою спробою оформлення.
  useEffect(() => {
    if (open && items.length > 0 && !beginCheckoutTracked.current) {
      beginCheckoutTracked.current = true;
      trackEvent("begin_checkout", {
        value: total,
        items: items.map((i) => ({ item_id: i.id, item_name: i.label, price: i.price, quantity: i.qty })),
      });
    }
    if (!open) beginCheckoutTracked.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const hasUnknownPrice = items.some((i) => i.price == null);

  async function sendInquiry(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(false);
    try {
      const comment = items.map((i) => `${i.label} × ${i.qty}`).join("; ");
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client: name, phone, comment, source: "Кошик — сайт" }),
      });
      const data = await res.json();
      if (data.ok) {
        setSent(true);
        trackEvent("generate_lead", { form_source: "Кошик — сайт" });
        trackEvent("purchase", {
          transaction_id: `lead-${Date.now()}`,
          value: total,
          items: items.map((i) => ({ item_id: i.id, item_name: i.label, price: i.price, quantity: i.qty })),
        });
        clear();
      } else setError(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-dark/60 p-4" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-xl bg-panel p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="font-serif text-lg font-bold text-navy-dark">{cartTitle}</h4>

        {items.length === 0 ? (
          <p className="mt-4 text-sm text-navy-dim">{cartEmpty}</p>
        ) : (
          <>
            <ul className="mt-4 divide-y divide-navy-dim/10">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-2 py-3 text-sm">
                  <div className="flex-1">
                    <p className="text-navy-dark">{item.label}</p>
                    <p className="mt-0.5 text-xs text-navy-dim">
                      {item.price != null ? fmtUah(item.price) : findOutPriceLabel}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setQty(item.id, item.qty - 1)}
                      className="h-6 w-6 rounded-full border border-navy-dim/30 text-navy-dim hover:border-gold"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-navy-dark">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(item.id, item.qty + 1)}
                      className="h-6 w-6 rounded-full border border-navy-dim/30 text-navy-dim hover:border-gold"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="shrink-0 text-xs text-navy-dim underline hover:text-red-600"
                  >
                    {removeLabel}
                  </button>
                </li>
              ))}
            </ul>

            {!hasUnknownPrice && total > 0 && (
              <p className="mt-3 text-right font-serif text-lg font-bold text-navy-dark">
                {cartTotal}: {fmtUah(total)}
              </p>
            )}

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
          </>
        )}

        <button type="button" onClick={onClose} className="mt-3 w-full text-center text-xs text-navy-dim underline">
          {closeLabel}
        </button>
      </div>
    </div>,
    document.body
  );
}
