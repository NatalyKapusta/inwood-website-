"use client";

import { logout } from "@/app/portal/actions";

export default function LogoutButton({ label = "Вийти" }: { label?: string }) {
  return (
    <form action={logout}>
      <button type="submit" className="text-white/85 hover:text-gold">
        {label}
      </button>
    </form>
  );
}
