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
            return (
              <p key={i} className="text-navy-dim">
                {block.text}
              </p>
            );
          })}
        </div>
      </article>

      <ContactCta
        title={c.ctaTitle}
        text={c.ctaText}
        nameLabel={c.formName}
        phoneLabel={c.formPhone}
        submitLabel={c.formSubmit}
        phoneManualLabel={c.phoneManual}
        phoneChooseCountryLabel={c.phoneChooseCountry}
        phoneInvalidLabel={c.phoneInvalid}
        source={`Блог — ${post.title}`}
        sent={searchParams.sent === "1"}
      />
    </>
  );
}
