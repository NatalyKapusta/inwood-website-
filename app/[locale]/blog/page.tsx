import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata } from "@/lib/seo";
import { blogPosts } from "@/data/blog";

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
  const posts = blogPosts[params.locale];

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-bold text-navy-dark sm:text-4xl">{t.heading}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-navy-dim">{t.intro}</p>
      </div>

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
    </section>
  );
}
