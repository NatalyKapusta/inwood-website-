import Image from "next/image";
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
    <>
      <section className="bg-navy-dark text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-wide text-gold-dim">{t.heroKicker}</p>
            <h1 className="mt-2 font-serif text-3xl font-bold leading-tight sm:text-4xl">
              {t.heroTitle}
            </h1>
            <p className="mt-4 max-w-lg text-white/80">{t.heroText}</p>
            <ul className="mt-6 space-y-2">
              {t.heroPoints.map((p: string) => (
                <li key={p} className="flex items-start gap-2 text-sm text-white/85">
                  <span className="mt-0.5 text-gold">✔</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl">
            <Image
              src="/photos/interiors/nominal-nl-01-white.jpg"
              alt={t.heroTitle}
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

    <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
      <div className="text-center">
        <h2 className="font-serif text-3xl font-bold text-navy-dark sm:text-4xl">{t.heading}</h2>
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
    </>
  );
}
