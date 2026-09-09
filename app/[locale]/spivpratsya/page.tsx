import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import Tabs from "@/components/Tabs";
import ContactCta from "@/components/ContactCta";
import Counter from "@/components/Counter";
import ProductCard from "@/components/ProductCard";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { collections } from "@/lib/products";
import { getPricesVisible } from "@/lib/siteSettings";
import { RECRUIT_CITIES, getRecruitCityDisplayName } from "@/lib/recruitCities";

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  return buildMetadata({
    locale: params.locale,
    path: "/spivpratsya",
    title: dict.spivpratsya.title,
    description: dict.spivpratsya.metaDescription,
  });
}

export default async function SpivpratsyaPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { sent?: string };
}) {
  const dict = await getDictionary(params.locale);
  const t = dict.spivpratsya;
  const c = dict.common;
  const demoModel = collections.etalon.models?.[0];
  const pricesVisible = await getPricesVisible();

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(
              [
                { name: c.breadcrumbHome, path: "" },
                { name: t.heading, path: "/spivpratsya" },
              ],
              params.locale
            )
          ),
        }}
      />
      <section className="bg-navy-dark py-16 text-center text-white sm:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-serif text-3xl font-bold sm:text-4xl">{t.heading}</h1>
          <p className="mt-4 text-white/85">{t.intro}</p>
          <p className="mt-2 text-gold">{t.lead}</p>
        </div>
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-6 px-4">
          {t.stats.map((s) => (
            <Counter key={s.label} to={s.to} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </section>

      {demoModel && (
        <section className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
          <div className="text-center">
            <p className="text-sm uppercase tracking-wide text-gold-dim">{t.calcKicker}</p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-navy-dark sm:text-3xl">
              {t.calcTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-navy-dim">{t.calcText}</p>
          </div>
          <div className="mx-auto mt-10 max-w-sm">
            <ProductCard
              collectionLabel={collections.etalon.label}
              model={demoModel}
              komplekt={collections.etalon.komplekt}
              orderEmail={c.email}
              t={dict.catalog}
              pricesVisible={pricesVisible}
              phoneManual={c.phoneManual}
              phoneChooseCountry={c.phoneChooseCountry}
              phoneInvalid={c.phoneInvalid}
            />
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-navy-dim">{t.calcCta}</p>
        </section>
      )}

      <section className="bg-panel-alt py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-navy-dark sm:text-3xl">
              {t.audienceTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-navy-dim">{t.audienceText}</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {t.audience.map((a, i) => (
              <div
                key={a}
                className="flex flex-col items-center gap-2 rounded-xl bg-panel p-5 text-center"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-dark font-serif text-sm font-bold text-gold">
                  {i + 1}
                </span>
                <span className="text-sm font-semibold text-navy-dark">{a}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <Tabs
          tabs={[
            {
              id: "dealership",
              label: t.tabs.dealership,
              content: (
                <div className="grid gap-6 sm:grid-cols-2">
                  {t.dealership.map((d, i) => (
                    <div key={d.title} className="rounded-xl bg-panel-alt p-6">
                      <span className="font-serif text-2xl font-bold text-gold-dim">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-2 font-serif text-lg font-bold text-navy-dark">
                        {d.title}
                      </h3>
                      <p className="mt-2 text-sm text-navy-dim">{d.text}</p>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              id: "export",
              label: t.tabs.export,
              content: (
                <div className="mx-auto max-w-2xl text-center">
                  <p className="font-serif text-xl font-bold text-navy-dark">{t.exportIntro}</p>
                  <p className="mt-4 text-navy-dim">{t.exportText}</p>
                  <p className="mt-4 font-semibold text-navy-dark">{t.exportCountries}</p>
                </div>
              ),
            },
          ]}
        />
      </section>

      <section className="bg-panel-alt py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-navy-dark sm:text-3xl">
              {t.toolsTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-navy-dim">{t.toolsText}</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.tools.map((tool, i) => (
              <div key={tool.title} className="rounded-xl bg-panel p-6">
                <span className="font-serif text-2xl font-bold text-gold-dim">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-serif text-lg font-bold text-navy-dark">{tool.title}</h3>
                <p className="mt-2 text-sm text-navy-dim">{tool.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold text-navy-dark sm:text-3xl">
            {t.strengthsTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-navy-dim">{t.strengthsText}</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {t.strengths.map((s, i) => (
            <div key={s.title} className="flex gap-4 rounded-xl bg-panel-alt p-6">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 font-serif text-sm font-bold text-gold-dim">
                {i + 1}
              </span>
              <div>
                <h3 className="font-serif text-base font-bold text-navy-dark">{s.title}</h3>
                <p className="mt-1 text-sm text-navy-dim">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy-dark py-16 text-white sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center font-serif text-2xl font-bold sm:text-3xl">
            {t.stepsTitle}
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.steps.map((s, i) => (
              <div key={s.title} className="text-center">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 font-serif text-lg font-bold text-gold">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-serif text-base font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-white/75">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:py-24">
        <h2 className="font-serif text-2xl font-bold text-navy-dark sm:text-3xl">
          {t.recruitCitiesTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-navy-dim">{t.recruitCitiesText}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {RECRUIT_CITIES.map((rc) => (
            <Link
              key={rc.slug}
              href={`/${params.locale}/staty-dylerom/${rc.slug}`}
              className="rounded-full border border-navy-dim/25 px-5 py-2 text-sm text-navy-dark transition hover:border-gold hover:text-gold-dim"
            >
              {getRecruitCityDisplayName(rc, params.locale)}
            </Link>
          ))}
        </div>
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
        source="Співпраця"
        sent={searchParams.sent === "1"}
        extraFields={[
          { placeholder: t.formRole, options: t.formRoleOptions },
          { placeholder: t.formEmail, type: "email", name: "email" },
          { placeholder: t.formCountry },
          { placeholder: t.formCity, name: "misto" },
          { placeholder: t.formMessage },
        ]}
      />
    </>
  );
}
