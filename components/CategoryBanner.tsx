"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { catalogCategorySlugs, type CatalogCategorySlug } from "@/lib/catalogCategories";

// Той самий принцип, що в CatalogFilter: категорію читаємо з URL лише на
// клієнті (useSearchParams), щоб /catalog лишався статичним і кешувався —
// сервер більше не читає searchParams.category напряму.
function CategoryBannerInner({
  locale,
  categoryLabels,
  showAllLabel,
}: {
  locale: Locale;
  categoryLabels: string[];
  showAllLabel: string;
}) {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category") as CatalogCategorySlug | null;
  const idx = categorySlug ? catalogCategorySlugs.indexOf(categorySlug) : -1;
  if (idx === -1) return null;
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
      <span className="rounded-full bg-gold/15 px-4 py-1.5 font-semibold text-gold-dim">
        {categoryLabels[idx]}
      </span>
      <Link
        href={`/${locale}/catalog`}
        className="text-navy-dim underline decoration-dotted underline-offset-4 hover:text-navy-dark"
      >
        {showAllLabel}
      </Link>
    </div>
  );
}

export default function CategoryBanner(props: { locale: Locale; categoryLabels: string[]; showAllLabel: string }) {
  return (
    <Suspense fallback={null}>
      <CategoryBannerInner {...props} />
    </Suspense>
  );
}
