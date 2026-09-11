import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata } from "@/lib/seo";
import { blogPosts, getBlogPost } from "@/data/blog";
import ContactCta from "@/components/ContactCta";

export function generateStaticParams() {
  return blogPosts.ua.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const post = getBlogPost(params.locale, params.slug);
  if (!post) return {};
  return buildMetadata({
    locale: params.locale,
    path: `/blog/${params.slug}`,
    title: post.title,
    description: post.excerpt,
  });
}

export default async function BlogPostPage({
  params,
  searchParams,
}: {
  params: { locale: Locale; slug: string };
  searchParams: { sent?: string };
}) {
  const post = getBlogPost(params.locale, params.slug);
  if (!post) notFound();

  const dict = await getDictionary(params.locale);
  const t = dict.blog;
  const c = dict.common;
  const relatedPosts = blogPosts[params.locale]
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <Link href={`/${params.locale}/blog`} className="text-sm text-navy-dim hover:text-gold-dim">
          {t.back}
        </Link>

        <h1 className="mt-4 font-serif text-3xl font-bold text-navy-dark sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-10 space-y-5">
          {post.blocks.map((block, i) => {
            if (block.type === "h2") {
              return (
                <h2 key={i} className="pt-4 font-serif text-2xl font-bold text-navy-dark">
                  {block.text}
                </h2>
              );
            }
            if (block.type === "h3") {
              return (
                <h3 key={i} className="pt-2 font-serif text-lg font-bold text-navy-dark">
                  {block.text}
                </h3>
              );
            }
            if (block.type === "ul") {
              return (
                <ul key={i} className="list-disc space-y-1.5 pl-5 text-navy-dim">
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            }
            if (block.type === "link") {
              return (
                <p key={i}>
                  <Link href={`/${params.locale}${block.href}`} className="font-semibold text-gold-dim hover:text-navy-dark">
                    {block.text} →
                  </Link>
                </p>
              );
            }
            return (
              <p key={i} className="text-navy-dim">
                {block.text}
              </p>
            );
          })}
        </div>

        <div className="mt-14 border-t border-navy-dim/15 pt-8">
          <Link
            href={`/${params.locale}/catalog`}
            className="inline-block rounded-full bg-navy-dark px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold hover:text-navy-dark"
          >
            {t.browseCatalog} →
          </Link>
        </div>

        {relatedPosts.length > 0 && (
          <div className="mt-10 border-t border-navy-dim/15 pt-8">
            <h2 className="font-serif text-lg font-bold text-navy-dark">{t.relatedPostsTitle}</h2>
            <ul className="mt-4 space-y-2">
              {relatedPosts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/${params.locale}/blog/${p.slug}`}
                    className="text-navy-dim hover:text-gold-dim"
                  >
                    {p.title} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>

      <ContactCta
        title={c.ctaTitle}
        text={c.ctaText}
        nameLabel={c.formName}
        phoneLabel={c.formPhone}
        submitLabel={c.formSubmit}
        sentLabel={c.formSentMessage}
        phoneManualLabel={c.phoneManual}
        phoneChooseCountryLabel={c.phoneChooseCountry}
        phoneInvalidLabel={c.phoneInvalid}
        source={`Блог — ${post.title}`}
        sent={searchParams.sent === "1"}
      />
    </>
  );
}
