import Link from "next/link";
import type { Locale } from "@/lib/i18n";

export default function DoorFit3dBanner({
  locale,
  kicker,
  title,
  cta,
}: {
  locale: Locale;
  kicker: string;
  title: string;
  cta: string;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <Link
        href={`/${locale}/3d-prymirka-dverei`}
        className="group flex flex-col items-center justify-between gap-4 rounded-xl border border-gold/30 bg-panel-alt p-6 text-center transition hover:border-gold sm:flex-row sm:text-left"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gold-dim">{kicker}</p>
          <p className="mt-1 font-serif text-lg font-bold text-navy-dark">{title}</p>
        </div>
        <span className="shrink-0 rounded-full bg-navy-dark px-5 py-2.5 text-sm font-semibold text-white transition group-hover:bg-gold">
          {cta}
        </span>
      </Link>
    </div>
  );
}
