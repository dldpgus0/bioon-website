import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EmailFrame } from "@/components/EmailFrame";
import { formatDate } from "@/components/IssueCard";
import { SubscribeForm } from "@/components/SubscribeForm";
import { getIssue, getIssueSlugs } from "@/lib/content";
import { getDictionary, getLocale, locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((lang) => getIssueSlugs().map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/insight/[slug]">): Promise<Metadata> {
  const lang = await getLocale(params);
  const issue = getIssue(lang, (await params).slug);
  if (!issue) return {};
  return { title: issue.title, description: issue.summary };
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
          {otherIssue.title} →
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href={`/${lang}/insight`} className="text-sm font-medium text-muted hover:text-ink">
        ← {dict.insight.back}
      </Link>

      <header className="mt-6">
        <p className="text-sm font-semibold text-teal">
          BIO:ON Insight #{issue.number} · {formatDate(issue.date, lang)}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">{issue.title}</h1>
        <p className="mt-4 leading-relaxed text-muted">{issue.summary}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {issue.tags.map((t) => (
            <span key={t} className="rounded-full bg-teal-soft px-2.5 py-1 text-xs font-medium text-teal">{t}</span>
          ))}
          <span className="ml-auto text-sm">
            {otherIssue ? (
              <Link href={`/${other}/insight/${slug}`} hrefLang={other} className="font-semibold text-brand hover:underline">
                {dict.insight.otherLang} →
              </Link>
            ) : (
              lang === "ko" && <span className="text-muted">{dict.insight.noOtherLang}</span>
            )}
          </span>
        </div>
      </header>

      <div className="mt-8">
        <EmailFrame src={`/newsletters/${lang}/${slug}.html`} title={issue.title} />
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
