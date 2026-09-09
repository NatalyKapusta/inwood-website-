"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryCollection, GalleryModel } from "@/data/interiorGallery";
import type { Dictionary } from "@/lib/dictionary";

export default function GalleryFilter({
  collections,
  t,
}: {
  collections: GalleryCollection[];
  t: Dictionary["galereya"];
}) {
  const [active, setActive] = useState<string>("all");

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        <FilterButton active={active === "all"} onClick={() => setActive("all")}>
          {t.all}
        </FilterButton>
        {collections.map((c) => (
          <FilterButton key={c.key} active={active === c.key} onClick={() => setActive(c.key)}>
            {c.label}
          </FilterButton>
        ))}
      </div>

      <div className="mt-10 space-y-16">
        {collections.map((c) => (
          <section key={c.key} id={c.key} hidden={active !== "all" && active !== c.key}>
            <h2 className="font-serif text-2xl font-bold text-navy-dark">{c.label}</h2>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {c.models.map((m) => (
                <GalleryModelCard key={m.code} model={m} colorLabel={t.color} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function GalleryModelCard({ model, colorLabel }: { model: GalleryModel; colorLabel: string }) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const photo = model.photos[photoIdx];

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-navy-dim/10 bg-panel">
      <div className="relative aspect-[3/2] bg-panel-alt">
        <Image
          key={photo.src}
          src={photo.src}
          alt={photo.colorLabel ? `${model.code} — ${photo.colorLabel}` : model.code}
          fill
          sizes="(min-width: 1280px) 300px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="font-serif text-lg font-bold text-navy-dark">{model.code}</h3>

        {model.photos.length > 1 && (
          <div>
            <label className="text-xs text-navy-dim">
              {colorLabel}: {photo.colorLabel}
            </label>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {model.photos.map((p, i) => (
                <button
                  key={p.colorSlug ?? i}
                  type="button"
                  onClick={() => setPhotoIdx(i)}
                  title={p.colorLabel ?? undefined}
                  className={`h-6 w-6 rounded-full border-2 ${
                    i === photoIdx ? "border-gold" : "border-navy-dim/20"
                  }`}
                  style={
                    p.swatchImage
                      ? {
                          backgroundImage: `url(${p.swatchImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-navy-dark text-white"
          : "bg-panel-alt text-navy-dim hover:bg-navy-dark/10"
      }`}
    >
      {children}
    </button>
  );
}
