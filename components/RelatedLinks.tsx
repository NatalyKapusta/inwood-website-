import Link from "next/link";

type NavItem = { label: string; href: string };

export default function RelatedLinks({
  locale,
  title,
  links,
}: {
  locale: string;
  title: string;
  links: NavItem[];
}) {
  if (links.length === 0) return null;

  return (
    <section className="mx-auto max-w-4xl px-4 pb-16 sm:pb-24">
      <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-navy-dim">
        {title}
      </h2>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {links.map((l) => (
          <Link
            key={l.href}
            href={`/${locale}${l.href}`}
            className="rounded-full border border-navy-dim/25 px-5 py-2 text-sm text-navy-dark transition hover:border-gold hover:text-gold-dim"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
