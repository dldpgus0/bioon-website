import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CardCarousel } from "@/components/CardCarousel";
import { formatDate } from "@/components/IssueCard";
import { getCardnews, getCardnewsBySlug } from "@/lib/cardnews";
import { getIssue } from "@/lib/content";
import { getDictionary, getLocale, locales } from "@/lib/i18n";

// Every page is built ahead of time; unknown slugs 404 without running a server render.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => getCardnews(lang).map((c) => ({ lang, slug: c.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/cardnews/[slug]">): Promise<Metadata> {
  const lang = await getLocale(params);
  const c = getCardnewsBySlug((await params).slug, lang);
  if (!c) return {};
  return {
    title: c.title,
    description: c.summary,
    alternates: { canonical: `/${lang}/cardnews/${c.slug}` },
    openGraph: {
      type: "article",
      title: c.title,
      description: c.summary,
      url: `/${lang}/cardnews/${c.slug}`,
      siteName: "BIO:ON Insight",
      publishedTime: c.date,
      images: [{ url: c.og, width: 1080, height: 1350 }],
    },
  };
}

export default async function CardnewsDetail({ params }: PageProps<"/[lang]/cardnews/[slug]">) {
  const lang = await getLocale(params);
  const dict = await getDictionary(lang);
  const t = dict.cardnews;
  const c = getCardnewsBySlug((await params).slug, lang);
  if (!c) notFound();
  const issue = c.issue ? getIssue(lang, c.issue) : undefined;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link href={`/${lang}/cardnews`} className="text-sm text-muted hover:text-teal">
        <span aria-hidden>← </span>
        {t.back}
      </Link>
      <p className="mt-6 text-xs text-muted">
        <time dateTime={c.date}>{formatDate(c.date, lang)}</time>
        {c.tags.length > 0 && <> · {c.tags.join(" · ")}</>}
      </p>
      <h1 className="mt-1 text-2xl font-extrabold leading-snug tracking-tight text-ink sm:text-3xl">{c.title}</h1>
      {c.summary && <p className="mt-3 leading-relaxed text-muted">{c.summary}</p>}
      {c.koreanCards && <p className="mt-2 text-sm text-muted">{t.koOnly}</p>}

      <div className="mt-8">
        <CardCarousel cards={c.cards} labels={{ prev: t.prev, next: t.next, goTo: t.goTo }} />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {c.instagram && (
          <a href={c.instagram} target="_blank" rel="noopener noreferrer" className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-on-brand hover:opacity-90">
            {t.instagram}<span aria-hidden> ↗</span>
          </a>
        )}
        {issue && (
          <Link href={`/${lang}/insight/${issue.slug}`} className="rounded-full border border-brand px-5 py-2 text-sm font-semibold text-brand hover:bg-brand hover:text-on-brand">
            {t.issue}<span aria-hidden> →</span>
          </Link>
        )}
      </div>

      <details className="mt-10 rounded-2xl border border-line bg-surface p-5">
        <summary className="cursor-pointer text-sm font-semibold text-ink">{t.transcript}</summary>
        <ol className="mt-4 space-y-4 text-sm leading-relaxed text-muted">
          {c.cards.map((card, i) => (
            <li key={card.src} className="whitespace-pre-line">
              <span className="font-semibold text-ink">{i + 1}. </span>
              {card.alt}
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
