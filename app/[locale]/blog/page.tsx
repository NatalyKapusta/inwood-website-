import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata } from "@/lib/seo";
import { blogPosts } from "@/data/blog";
import { COLLECTION_PAGE_SLUGS } from "@/lib/collectionPages";
import RichText from "@/components/RichText";

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  return buildMetadata({
    locale: params.locale,
    path: "/blog",
    title: dict.blog.title,
    description: dict.blog.metaDescription,
  });
}

export default async function BlogIndexPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const t = dict.blog;
  const cp = dict.collectionPages;
  const posts = blogPosts[params.locale];

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-bold text-navy-dark sm:text-4xl">{t.heading}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-navy-dim">{t.intro}</p>
      </div>

      {t.sections && t.sections.length > 0 && (
        <div className="mx-auto mt-8 max-w-2xl">
          {t.sections.map((s, i) => (
            <RichText key={i} paragraphs={s.body} locale={params.locale} />
          ))}
        </div>
      )}

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/${params.locale}/blog/${post.slug}`}
            className="flex flex-col rounded-xl bg-panel-alt p-6 transition hover:shadow-lg"
          >
            <h2 className="font-serif text-lg font-bold text-navy-dark">{post.title}</h2>
            <p className="mt-3 flex-1 text-sm text-navy-dim">{post.excerpt}</p>
            <span className="mt-4 text-sm font-semibold text-gold-dim">{t.readMore} →</span>
          </Link>
        ))}
      </div>

      <div className="mt-14 flex flex-wrap items-center justify-center gap-3 border-t border-navy-dim/15 pt-10 text-sm">
        {COLLECTION_PAGE_SLUGS.map((slug) => (
          <Link
            key={slug}
            href={`/${params.locale}/catalog/${slug}`}
            className="rounded-full border border-navy-dim/25 px-5 py-2 text-navy-dark transition hover:border-gold hover:text-gold-dim"
          >
            {cp.items[slug].breadcrumbName}
          </Link>
        ))}
      </div>
    </section>
  );
}
