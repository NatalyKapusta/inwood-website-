import Link from "next/link";
import type { Locale } from "@/lib/i18n";

// Мінімальний markdown-lite для прози на сторінках колекцій: **жирний**
// та [текст](/шлях) для внутрішніх посилань прямо всередині речення.
// Навмисно без повноцінного markdown-парсера — тут рівно два патерни.
const TOKEN_RE = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;

function renderParagraph(text: string, locale: Locale, key: number) {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      nodes.push(<strong key={`b${i}`}>{match[1]}</strong>);
    } else {
      const href = match[3].startsWith("/") ? `/${locale}${match[3]}` : match[3];
      nodes.push(
        <Link
          key={`l${i}`}
          href={href}
          className="text-gold-dim underline decoration-dotted underline-offset-4 hover:text-gold"
        >
          {match[2]}
        </Link>
      );
    }
    lastIndex = TOKEN_RE.lastIndex;
    i += 1;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return <p key={key}>{nodes}</p>;
}

export default function RichText({
  paragraphs,
  locale,
}: {
  paragraphs: string[];
  locale: Locale;
}) {
  return (
    <div className="space-y-4 text-navy-dim [&_strong]:text-navy-dark">
      {paragraphs.map((p, i) => renderParagraph(p, locale, i))}
    </div>
  );
}
