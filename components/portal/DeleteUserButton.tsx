"use client";

import { deleteUserAccount } from "@/app/portal/actions";

export default function DeleteUserButton({ userId, email }: { userId: string; email: string }) {
  return (
    <form
      action={deleteUserAccount}
      onSubmit={(e) => {
        if (!window.confirm(`Видалити користувача ${email}? Цю дію не можна скасувати.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="user_id" value={userId} />
      <button
        type="submit"
        className="rounded-full border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50"
      >
        Видалити
      </button>
    </form>
  );
}
