import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata } from "@/lib/seo";
import dealers from "@/data/dealers.json";
import DealersMap from "@/components/DealersMap";
import DealersList from "@/components/DealersList";

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  return buildMetadata({
    locale: params.locale,
    path: "/nashi-dileri",
    title: dict.nashiDileri.title,
    description: dict.nashiDileri.metaDescription,
  });
}

export default async function NashiDileriPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const t = dict.nashiDileri;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-bold text-navy-dark sm:text-4xl">{t.heading}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-navy-dim">{t.intro}</p>
      </div>

      <div className="mt-10">
        <DealersMap />
      </div>

      <div className="mt-12">
        <h2 className="font-serif text-xl font-bold text-navy-dark">
          Дилери за містами ({dealers.length})
        </h2>
        <div className="mt-6">
          <DealersList dealers={dealers} />
        </div>
      </div>
    </section>
  );
}
