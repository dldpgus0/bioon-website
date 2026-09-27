import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/components/IssueCard";
import { SubscribeForm } from "@/components/SubscribeForm";
import { getPost, getPosts } from "@/lib/content";
import { getDictionary, getLocale, locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((lang) => getPosts(lang).map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/career/[slug]">): Promise<Metadata> {
  const lang = await getLocale(params);
  const result = await getPost(lang, (await params).slug);
  if (!result) return {};
  return { title: result.post.title, description: result.post.summary };
}

export default async function CareerPostPage({ params }: PageProps<"/[lang]/career/[slug]">) {
  const lang = await getLocale(params);
  const dict = await getDictionary(lang);
  const result = await getPost(lang, (await params).slug);
  if (!result) notFound();
  const { post, html } = result;

  return (
    <article className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Link href={`/${lang}/career`} className="text-sm font-medium text-muted hover:text-ink">
        ← {dict.career.back}
      </Link>
      <header className="mt-6 border-b border-line pb-8">
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
          <span className="text-teal">{dict.career.categories[post.category]}</span>
          <span className="text-muted">· {formatDate(post.date, lang)}</span>
          {post.sample && (
            <span className="rounded-full border border-line px-2 py-0.5 text-xs text-muted">{dict.career.sample}</span>
          )}
        </div>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">{post.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{post.summary}</p>
        {post.roles.length > 0 && (
          <p className="mt-4 text-sm text-muted">
            {dict.career.roles}:{" "}
            {post.roles.map((r) => (
              <span key={r} className="mr-1.5 rounded-md bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand">{r}</span>
            ))}
          </p>
        )}
      </header>

      <div className="prose-bioon mt-8 text-text" dangerouslySetInnerHTML={{ __html: html }} />

      <aside className="mt-14 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="text-xl font-bold text-ink">{dict.subscribe.title}</h2>
        <p className="mt-2 text-sm text-muted">{dict.subscribe.lede}</p>
        <div className="mt-5">
          <SubscribeForm labels={dict.subscribe} lang={lang} compact />
        </div>
      </aside>
    </article>
  );
}
