"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ready" | "invalid">("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setStatus(data.session ? "ready" : "invalid");
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Пароль має містити щонайменше 6 символів");
      return;
    }
    if (password !== confirm) {
      setError("Паролі не збігаються");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push("/portal");
  }

  if (status === "checking") {
    return (
      <div className="mx-auto max-w-sm">
        <p className="text-navy-dim">Перевіряємо посилання...</p>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="mx-auto max-w-sm">
        <h1 className="font-serif text-2xl font-bold text-navy-dark">Посилання недійсне</h1>
        <p className="mt-2 text-sm text-navy-dim">
          Посилання із запрошенням застаріло або вже було використано. Зверніться до вашого
          менеджера IN WOOD, щоб надіслати запрошення повторно.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-serif text-2xl font-bold text-navy-dark">Створіть пароль</h1>
      <p className="mt-2 text-sm text-navy-dim">
        Задайте пароль для входу у партнерський портал IN WOOD.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
        <div className="relative">
          <input
            type={visible ? "text" : "password"}
            placeholder="Новий пароль"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 pr-11 outline-none focus:border-gold"
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            tabIndex={-1}
            aria-label={visible ? "Приховати пароль" : "Показати пароль"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-dim hover:text-navy-dark"
          >
            {visible ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        <input
          type={visible ? "text" : "password"}
          placeholder="Повторіть пароль"
          required
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="rounded-lg border border-navy-dim/30 bg-panel px-4 py-3 outline-none focus:border-gold"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-navy-dark px-7 py-3 font-semibold text-white transition hover:bg-gold hover:text-navy-dark disabled:opacity-60"
        >
          {saving ? "Зберігаємо..." : "Зберегти та увійти"}
        </button>
      </form>
    </div>
  );
}
