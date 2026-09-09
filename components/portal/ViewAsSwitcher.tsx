"use client";

import { useRef } from "react";
import { setViewAsRole } from "@/app/portal/actions";
import { PORTAL_ROLES, roleLabels } from "@/lib/portalRole";

export default function ViewAsSwitcher({
  current,
  returnTo,
}: {
  current: string;
  returnTo: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={setViewAsRole} className="flex items-center gap-2">
      <input type="hidden" name="return_to" value={returnTo} />
      <select
        name="role"
        defaultValue={current}
        onChange={() => formRef.current?.requestSubmit()}
        className="rounded-lg border border-white/20 bg-navy-dark px-2 py-1.5 text-xs text-white outline-none focus:border-gold"
      >
        <option value="">Переглянути як…</option>
        {PORTAL_ROLES.map((r) => (
          <option key={r} value={r}>
            {roleLabels[r]}
          </option>
        ))}
      </select>
    </form>
  );
}
