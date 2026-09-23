import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { buildMetadata, articleJsonLd } from "@/lib/seo";
import { blogPosts, getBlogPost, type BlogBlock } from "@/data/blog";
import ContactCta from "@/components/ContactCta";

type RenderBlock =
  | BlogBlock
  | {
      type: "feature";
      text: string;
      image: { src: string; alt: string };
      link?: { text: string; href: string };
    };

// Групує "текст → фото → (посилання)" в один блок "text ліворуч, фото праворуч"
// — так фото трендів у статтях виглядають компактніше, ніж на всю ширину.
function groupBlocks(blocks: BlogBlock[]): RenderBlock[] {
  const result: RenderBlock[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const next = blocks[i + 1];
    if (block.type === "p" && next?.type === "image") {
      const afterImage = blocks[i + 2];
      const link = afterImage?.type === "link" ? { text: afterImage.text, href: afterImage.href } : undefined;
      result.push({ type: "feature", text: block.text, image: { src: next.src, alt: next.alt }, link });
      i += link ? 2 : 1;
      continue;
    }
    result.push(block);
  }
  return result;
}

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
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              locale: params.locale,
              path: `/blog/${params.slug}`,
              title: post.title,
              description: post.excerpt,
            })
          ),
        }}
      />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <Link href={`/${params.locale}/blog`} className="text-sm text-navy-dim hover:text-gold-dim">
          {t.back}
        </Link>

        <h1 className="mt-4 font-serif text-3xl font-bold text-navy-dark sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-10 space-y-5">
          {groupBlocks(post.blocks).map((block, i) => {
            if (block.type === "feature") {
              return (
                <div key={i} className="grid gap-5 sm:grid-cols-2 sm:items-center">
                  <div>
                    <p className="text-navy-dim">{block.text}</p>
                    {block.link && (
                      <Link
                        href={`/${params.locale}${block.link.href}`}
                        className="mt-3 inline-block font-semibold text-gold-dim hover:text-navy-dark"
                      >
                        {block.link.text} →
                      </Link>
                    )}
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <Image
                      src={block.image.src}
                      alt={block.image.alt}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              );
            }
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
            if (block.type === "image") {
              return (
                <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image
                    src={block.src}
                    alt={block.alt}
                    fill
                    sizes="(min-width: 768px) 768px, 100vw"
                    className="object-cover"
                  />
                </div>
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
        title={dict.poltava.ctaTitle}
        text={dict.poltava.ctaText}
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
