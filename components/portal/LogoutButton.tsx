"use client";

import { logout } from "@/app/portal/actions";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button type="submit" className="text-white/85 hover:text-gold">
        Вийти
      </button>
    </form>
  );
}
