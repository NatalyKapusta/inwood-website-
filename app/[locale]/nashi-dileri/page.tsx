import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata } from "@/lib/seo";
import dealers from "@/data/dealers.json";
import DealersMap from "@/components/DealersMap";

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
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dealers.map((d, i) => (
            <div key={`${d.name}-${i}`} className="rounded-lg bg-panel-alt p-4">
              <p className="font-serif font-bold text-navy-dark">{d.name}</p>
              <p className="mt-1 text-sm text-navy-dim">{d.address}</p>
              <div className="mt-2 flex flex-col gap-0.5 text-sm">
                {d.phones.map((phone, j) => (
                  <a
                    key={phone}
                    href={`tel:${d.phonesTel[j]}`}
                    className="text-navy hover:text-gold-dim"
                  >
                    {phone}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
