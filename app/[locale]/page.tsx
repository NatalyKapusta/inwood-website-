import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import Counter from "@/components/Counter";
import ua from "@/dictionaries/ua.json";
import { buildMetadata } from "@/lib/seo";
import PhoneInput from "@/components/PhoneInput";
import { submitLead } from "@/app/actions/lead";
import LeadConversionTracker from "@/components/LeadConversionTracker";

async function getDict(locale: Locale) {
  try {
    const dict = await import(`@/dictionaries/${locale}.json`);
    return dict.default;
  } catch {
    return ua;
  }
}

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const dict = await getDict(params.locale);
  return buildMetadata({
    locale: params.locale,
    path: "",
    title: dict.home.title,
    description: dict.home.metaDescription,
  });
}

const collectionImages: Record<string, string> = {
  ETALON: "/photos/etalon/et-01-white.png",
  NOMINAL: "/photos/nominal/nl-01-dub-shato.png",
  FREZZATTI: "/photos/frezzatti/fz-01-dub-shato.png",
  PERFETTO: "/photos/perfetto/pf-01.png",
};

export default async function HomePage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { sent?: string };
}) {
  const dict = await getDict(params.locale);
  const t = dict.home;
  const c = dict.common;
  const locale = params.locale;
  const sent = searchParams.sent === "1";

  return (
    <>
      {/* HERO */}
      <section className="bg-navy-dark text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {t.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-white/85">{t.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/catalog`}
                className="rounded-full bg-gold px-7 py-3 font-semibold text-navy-dark transition hover:bg-gold-dim"
              >
                {t.heroCta}
              </Link>
              <Link
                href={`/${locale}/spivpratsya`}
                className="rounded-full border border-white/40 px-7 py-3 font-semibold text-white transition hover:border-gold hover:text-gold"
              >
                {c.ctaButton}
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {t.categories.map((cat: string) => (
                <span
                  key={cat}
                  className="rounded-full border border-white/20 px-4 py-1.5 text-xs uppercase tracking-wide text-white/70"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Анімовані лічильники — "вау"-ефект без шкоди швидкодії (лише CSS/IntersectionObserver) */}
          <div className="grid grid-cols-2 gap-8 rounded-2xl border border-white/10 bg-white/5 p-8 sm:grid-cols-4 lg:grid-cols-2">
            {t.counters.map((cnt: { to: number; suffix: string; label: string }) => (
              <Counter key={cnt.label} to={cnt.to} suffix={cnt.suffix} label={cnt.label} />
            ))}
          </div>
        </div>
      </section>

      {/* ЯКІСТЬ ГАРАНТОВАНА */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="grid gap-10 overflow-hidden rounded-2xl bg-panel-alt lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[3/2]">
            <Image
              src="/photos/interiors/etalon-et-01-zriz-kameniu.jpg"
              alt={t.qualityBanner.imageAlt}
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="p-8 sm:p-12">
            <p className="text-sm uppercase tracking-wide text-gold-dim">{t.qualityBanner.kicker}</p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-navy-dark sm:text-3xl">
              {t.qualityBanner.title}
            </h2>
            <p className="mt-4 text-navy-dim">{t.qualityBanner.text}</p>
            <ul className="mt-6 space-y-2">
              {t.qualityBanner.points.map((p: string) => (
                <li key={p} className="flex items-start gap-2 text-sm text-navy-dark">
                  <span className="mt-0.5 text-gold">✔</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* СИЛЬНІ СТОРОНИ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <h2 className="font-serif text-2xl font-bold text-navy-dark sm:text-3xl">
          {t.strengthsTitle}
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {t.strengths.map((s: { title: string; text: string }, i: number) => (
            <div key={s.title} className="rounded-xl bg-panel-alt p-6">
              <span className="font-serif text-3xl font-bold text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-serif text-lg font-bold text-navy-dark">{s.title}</h3>
              <p className="mt-2 text-sm text-navy-dim">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* МОНТАЖ */}
      <section className="bg-panel-alt py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-serif text-2xl font-bold text-navy-dark sm:text-3xl">
            {t.installTitle}
          </h2>
          <p className="mt-6 text-navy-dim">{t.installText}</p>
          <p className="mt-4 font-semibold text-navy-dark">{t.installResult}</p>
        </div>
      </section>

      {/* ПРО КОМПАНІЮ */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-24">
        <p className="text-navy-dim">{t.aboutText}</p>
      </section>

      {/* З КИМ МИ ПРАЦЮЄМО */}
      <section className="bg-panel-alt py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center font-serif text-2xl font-bold text-navy-dark sm:text-3xl">
            {t.audienceTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-navy-dim">{t.audienceText}</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.audience.map((a: { title: string; text: string }) => (
              <div key={a.title} className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-navy-dark">{a.title}</h3>
                <p className="mt-2 text-sm text-navy-dim">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* КОМЕРЦІЙНІ ОБ'ЄКТИ */}
      <section className="bg-navy-dark py-16 text-white sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">{t.commercialTitle}</h2>
          <p className="mt-6 text-white/80">{t.commercialText}</p>
          <Link
            href={`/${locale}/spivpratsya`}
            className="mt-8 inline-block rounded-full bg-gold px-7 py-3 font-semibold text-navy-dark transition hover:bg-gold-dim"
          >
            {c.ctaButton}
          </Link>
        </div>
      </section>

      {/* КОЛЕКЦІЇ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <h2 className="text-center font-serif text-2xl font-bold text-navy-dark sm:text-3xl">
          {t.collectionsTitle}
        </h2>
        <p className="mt-3 text-center text-navy-dim">{t.collectionsSubtitle}</p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {t.collections.map((col: { name: string; text: string }) => (
            <Link
              key={col.name}
              href={`/${locale}/catalog#${col.name.toLowerCase()}`}
              className="group overflow-hidden rounded-xl bg-panel-alt transition hover:shadow-xl"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-white">
                {collectionImages[col.name] && (
                  <Image
                    src={collectionImages[col.name]}
                    alt={col.name}
                    fill
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-6 transition duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-bold text-navy-dark">{col.name}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-navy-dim">{col.text}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-xl bg-navy-dark p-8 text-white sm:p-10">
          <h3 className="font-serif text-xl font-bold text-gold">{t.hiddenDoorsTitle}</h3>
          <p className="mt-3 max-w-2xl text-white/80">{t.hiddenDoorsText}</p>
        </div>
      </section>

      {/* ТЕХНОЛОГІЯ */}
      <section className="bg-panel-alt py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-serif text-2xl font-bold text-navy-dark sm:text-3xl">
            {t.techTitle}
          </h2>
          <p className="mt-6 text-navy-dim">{t.techText}</p>
        </div>
      </section>

      {/* ВІДЕО */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-24">
        <h2 className="font-serif text-2xl font-bold text-navy-dark sm:text-3xl">
          {t.videoSection.title}
        </h2>
        <p className="mt-4 text-navy-dim">{t.videoSection.text}</p>
        <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl bg-navy-dark shadow-lg">
          <iframe
            src="https://www.youtube.com/embed/D1vzqflg0u8"
            title={t.videoSection.title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>

      {/* CTA ФОРМА */}
      <section className="mx-auto max-w-2xl px-4 py-16 text-center sm:py-24">
        <h2 className="font-serif text-2xl font-bold text-navy-dark sm:text-3xl">
          {c.ctaTitle}
        </h2>
        <p className="mt-4 text-navy-dim">{c.ctaText}</p>
        {sent ? (
          <>
            <LeadConversionTracker source="Головна сторінка" />
            <p className="mx-auto mt-8 max-w-md rounded-lg bg-panel-alt px-6 py-4 text-navy-dark">
              {c.formSentMessage}
            </p>
          </>
        ) : (
          <form action={submitLead} className="mx-auto mt-8 flex max-w-md flex-col gap-4">
            <input type="hidden" name="source" value="Головна сторінка" />
            <input
              type="text"
              name="name"
              placeholder={c.formName}
              required
              className="rounded-lg border border-navy-dim/30 px-4 py-3 outline-none focus:border-gold"
            />
            <PhoneInput
              placeholder={c.formPhone}
              required
              className="w-full rounded-lg border border-navy-dim/30 px-4 py-3 outline-none focus:border-gold"
              manualLabel={c.phoneManual}
              chooseCountryLabel={c.phoneChooseCountry}
              invalidLabel={c.phoneInvalid}
            />
            <button
              type="submit"
              className="rounded-full bg-navy-dark px-7 py-3 font-semibold text-white transition hover:bg-gold hover:text-navy-dark"
            >
              {c.formSubmit}
            </button>
          </form>
        )}
      </section>
    </>
  );
}
