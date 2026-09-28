import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EmailFrame } from "@/components/EmailFrame";
import { formatDate } from "@/components/IssueCard";
import { icons } from "@/components/Icons";
import { SubscribeForm } from "@/components/SubscribeForm";
import { References } from "@/components/References";
import { getIssue, getIssueReferences, getIssueSlugs } from "@/lib/content";
import { getDictionary, getLocale, locales } from "@/lib/i18n";
import { roleLabel, topicLabel } from "@/lib/taxonomy";

export function generateStaticParams() {
  return locales.flatMap((lang) => getIssueSlugs().map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/insight/[slug]">): Promise<Metadata> {
  const lang = await getLocale(params);
  const issue = getIssue(lang, (await params).slug);
  if (!issue) return {};
  // Article metadata for link previews (LinkedIn reads og:*); the image comes from opengraph-image.tsx.
  const title = `#${issue.number} ${issue.title}`;
  return {
    title: issue.title,
    description: issue.summary,
    alternates: { canonical: `/${lang}/insight/${issue.slug}` },
    openGraph: {
      type: "article",
      title,
      description: issue.summary,
      url: `/${lang}/insight/${issue.slug}`,
      siteName: "BIO:ON Insight",
      locale: lang === "ko" ? "ko_KR" : "en_GB",
      publishedTime: issue.date,
      authors: [lang === "ko" ? "이예현" : "Yaehyun Lee"],
      tags: issue.tags,
    },
    twitter: { card: "summary_large_image", title, description: issue.summary },
  };
}

export default async function IssuePage({ params }: PageProps<"/[lang]/insight/[slug]">) {
  const lang = await getLocale(params);
  const { slug } = await params;
  const dict = await getDictionary(lang);
  const other = lang === "ko" ? "en" : "ko";
  const issue = getIssue(lang, slug);
  const otherIssue = getIssue(other, slug);

  // No edition in this language: show a note linking to the one that exists.
  if (!issue) {
    if (!otherIssue) notFound();
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <p className="text-lg text-muted">{dict.insight.noOtherLang}</p>
        <Link href={`/${other}/insight/${slug}`} className="mt-6 inline-block font-semibold text-teal hover:underline">
          {otherIssue.title}<span aria-hidden> →</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href={`/${lang}/insight`} className="text-sm font-medium text-muted hover:text-ink">
        <span aria-hidden>← </span>{dict.insight.back}
      </Link>

      <header className="mt-6">
        <p className="text-sm font-semibold text-teal">
          BIO:ON Insight #{issue.number} · {formatDate(issue.date, lang)}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">{issue.title}</h1>
        <p className="mt-4 leading-relaxed text-muted">{issue.summary}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {issue.topics.map((t) => (
            <span key={t} className="rounded-full bg-teal-soft px-2.5 py-1 text-xs font-medium text-teal">
              {topicLabel(t, lang)}
            </span>
          ))}
          <span className="ml-auto text-sm">
            {otherIssue ? (
              <Link href={`/${other}/insight/${slug}`} hrefLang={other} className="font-semibold text-brand hover:underline">
                {dict.insight.otherLang}<span aria-hidden> →</span>
              </Link>
            ) : (
              lang === "ko" && <span className="text-muted">{dict.insight.noOtherLang}</span>
            )}
          </span>
        </div>
      </header>

      {issue.aiSummary.length > 0 && (
        <section className="mt-8 rounded-2xl border border-teal/30 bg-teal-soft/50 p-6">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 text-teal">{icons.ai}</span>
            <h2 className="text-sm font-bold text-ink">{dict.insight.aiSummary}</h2>
          </div>
          <ol className="mt-3 space-y-2">
            {issue.aiSummary.map((line, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-text">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                {line}
              </li>
            ))}
          </ol>
          {issue.roles.length > 0 && (
            <p className="mt-4 flex flex-wrap items-center gap-1.5 text-sm text-muted">
              <span className="mr-1 font-semibold text-ink">{dict.insight.rolesLabel}</span>
              {issue.roles.map((r) => (
                <span key={r} className="rounded-md bg-surface px-2 py-0.5 text-xs font-medium text-brand">
                  {roleLabel(r, lang)}
                </span>
              ))}
            </p>
          )}
          <p className="mt-3 text-xs text-muted">{dict.insight.aiNote}</p>
        </section>
      )}

      <div className="mt-8">
        <EmailFrame src={`/newsletters/${lang}/${slug}.html`} title={issue.title} />
      </div>

      <div className="mt-8">
        <References items={getIssueReferences(lang, slug)} title={dict.insight.references} newTab={dict.a11y.newTab} />
      </div>

      <aside className="mt-12 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-xl font-bold text-ink">{dict.subscribe.title}</h2>
        <p className="mt-2 text-sm text-muted">{dict.subscribe.lede}</p>
        <div className="mt-5">
          <SubscribeForm labels={dict.subscribe} lang={lang} compact />
        </div>
      </aside>
    </article>
  );
}
