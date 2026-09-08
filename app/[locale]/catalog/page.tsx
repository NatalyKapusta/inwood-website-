import type { Locale } from "@/lib/i18n";
import { collections, collectionOrder } from "@/lib/products";
import CatalogFilter from "@/components/CatalogFilter";
import ua from "@/dictionaries/ua.json";

export const metadata = {
  title: "Ціни на міжкімнатні двері IN WOOD",
};

export default function CatalogPage({ params }: { params: { locale: Locale } }) {
  const sections = collectionOrder
    .filter((id) => collections[id])
    .map((id) => ({ id, data: collections[id] }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
      <div className="text-center">
        <p className="text-sm uppercase tracking-wide text-gold-dim">IN WOOD · роздрібні ціни</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-navy-dark sm:text-4xl">
          Магазин міжкімнатних дверей
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-navy-dim">
          Оберіть колір, короб, лиштву та добір прямо в картці — ціна порахується одразу. Точний
          розрахунок під ваш проєм — за заявкою.
        </p>
      </div>

      <div className="mt-12">
        <CatalogFilter sections={sections} orderEmail={ua.common.email} />
      </div>
    </div>
  );
}
