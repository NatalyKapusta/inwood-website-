import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata } from "@/lib/seo";
import { galleryCollections } from "@/data/interiorGallery";
import GalleryFilter from "@/components/GalleryFilter";

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  return buildMetadata({
    locale: params.locale,
    path: "/galereya",
    title: dict.galereya.title,
    description: dict.galereya.metaDescription,
  });
}

export default async function GaleryaPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const t = dict.galereya;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-bold text-navy-dark sm:text-4xl">{t.heading}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-navy-dim">{t.intro}</p>
      </div>

      <div className="mt-12">
        <GalleryFilter collections={galleryCollections} t={t} />
      </div>
    </div>
  );
}
