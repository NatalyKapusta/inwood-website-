"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";

export default function CartIcon({
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
  className,
}: {
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
  className?: string;
}) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={cartTitle}
        className={
          className ??
          "relative flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white hover:border-gold hover:text-gold"
        }
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 4h2l1.4 10.6a2 2 0 0 0 2 1.7h8.4a2 2 0 0 0 2-1.6L20.2 7H6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9.5" cy="20" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="17" cy="20" r="1.4" fill="currentColor" stroke="none" />
        </svg>
        {count > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-navy-dark">
            {count}
          </span>
        )}
      </button>

      <CartDrawer
        open={open}
        onClose={() => setOpen(false)}
        cartTitle={cartTitle}
        cartEmpty={cartEmpty}
        cartTotal={cartTotal}
        findOutPriceLabel={findOutPriceLabel}
        removeLabel={removeLabel}
        sendInquiryLabel={sendInquiryLabel}
        closeLabel={closeLabel}
        formSentMessage={formSentMessage}
        nameLabel={nameLabel}
        phoneLabel={phoneLabel}
        phoneManual={phoneManual}
        phoneChooseCountry={phoneChooseCountry}
        phoneInvalid={phoneInvalid}
        sendFailedRetry={sendFailedRetry}
      />
    </>
  );
}
