"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Пряма зміна пароля для вже залогіненого користувача — без листа й без
// одноразового посилання. Додано тому, що листи для скидання паролю іноді
// "згорають" самі (поштовий сервіс сам відкриває посилання, перевіряючи
// його на безпечність, ще до того, як людина встигає клацнути) — а зміна
// пароля з уже активної сесії цю проблему повністю обходить.
export default function ChangePasswordForm() {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Пароль має бути не менше 6 символів");
      return;
    }
    if (password !== confirm) {
      setError("Паролі не збігаються");
      return;
    }
    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDone(true);
    setPassword("");
    setConfirm("");
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-navy-dim underline decoration-dotted hover:text-gold-dim"
      >
        Змінити пароль
      </button>
    );
  }

  if (done) {
    return (
      <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
        Пароль змінено. Використовуйте його при наступному вході.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-3">
      <input
        type="password"
        required
        placeholder="Новий пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="rounded-lg border border-navy-dim/30 bg-panel px-4 py-2.5 text-sm outline-none focus:border-gold"
      />
      <input
        type="password"
        required
        placeholder="Повторіть новий пароль"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="rounded-lg border border-navy-dim/30 bg-panel px-4 py-2.5 text-sm outline-none focus:border-gold"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-navy-dark px-5 py-2 text-sm font-semibold text-white transition hover:bg-gold hover:text-navy-dark disabled:opacity-60"
        >
          {saving ? "..." : "Зберегти"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full border border-navy-dim/30 px-5 py-2 text-sm font-semibold text-navy-dim hover:border-gold hover:text-gold-dim"
        >
          Скасувати
        </button>
      </div>
    </form>
  );
}
