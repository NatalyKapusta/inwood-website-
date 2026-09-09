import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata } from "@/lib/seo";
import { collections } from "@/lib/products";
import ContactCta from "@/components/ContactCta";
import LineColorPreview from "@/components/LineColorPreview";
import ConstructionDiagram from "@/components/ConstructionDiagram";

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  return buildMetadata({
    locale: params.locale,
    path: "/harakterystyky",
    title: dict.harakterystyky.title,
    description: dict.harakterystyky.metaDescription,
  });
}

export default async function CharacteristicsPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { sent?: string };
}) {
  const dict = await getDictionary(params.locale);
  const t = dict.harakterystyky;
  const c = dict.common;

  return (
    <>
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-24">
        <h1 className="font-serif text-3xl font-bold text-navy-dark sm:text-4xl">{t.heading}</h1>
        <p className="mt-4 text-navy-dim">{t.subheading}</p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:pb-24">
        <div className="grid gap-6 sm:grid-cols-2">
          {t.lines.map((line) => {
            const model = collections[line.name.toLowerCase()]?.models?.[0];
            return (
              <div key={line.name} className="rounded-xl bg-panel-alt p-6">
                <h2 className="font-serif text-xl font-bold text-gold-dim">{line.name}</h2>
                <div className="mt-4 grid gap-6 sm:grid-cols-[200px_1fr]">
                  {model && <LineColorPreview code={model.code} colors={model.colors} />}
                  <ul className="space-y-2 text-sm text-navy-dark">
                    {line.params.map((p) => (
                      <li key={p}>— {p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:pb-24">
        <ConstructionDiagram
          title={t.constructionDiagram.title}
          subtitle={t.constructionDiagram.subtitle}
          layers={t.constructionDiagram.layers}
          featuresTitle={t.constructionDiagram.featuresTitle}
          features={t.constructionDiagram.features}
          dimensionsTitle={t.constructionDiagram.dimensionsTitle}
          dimensions={t.constructionDiagram.dimensions}
        />
      </section>

      <ContactCta
        title={t.ctaTitle}
        text={t.ctaText}
        nameLabel={c.formName}
        phoneLabel={c.formPhone}
        submitLabel={c.formSubmit}
        phoneManualLabel={c.phoneManual}
        phoneChooseCountryLabel={c.phoneChooseCountry}
        phoneInvalidLabel={c.phoneInvalid}
      source="Характеристики дверей"
      sent={searchParams.sent === "1"}
      />
    </>
  );
}
