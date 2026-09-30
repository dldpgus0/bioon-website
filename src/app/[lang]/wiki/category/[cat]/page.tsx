import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { StoryList } from "@/components/StoryList";
import { getIssues } from "@/lib/content";
import { getDictionary, getLocale, locales } from "@/lib/i18n";
import { allStories, categoryDesc, categoryIds, categoryLabel, isCategoryId } from "@/lib/wiki";

export function generateStaticParams() {
  return locales.flatMap((lang) => categoryIds.map((cat) => ({ lang, cat })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/wiki/category/[cat]">): Promise<Metadata> {
  const lang = await getLocale(params);
  const { cat } = await params;
  if (!isCategoryId(cat)) return {};
  return { title: categoryLabel(cat, lang), description: categoryDesc(cat, lang) };
}

export default async function CategoryPage({ params }: PageProps<"/[lang]/wiki/category/[cat]">) {
  const lang = await getLocale(params);
  const { cat } = await params;
  if (!isCategoryId(cat)) notFound();
  const dict = await getDictionary(lang);
  const stories = allStories(lang).filter((s) => s.cat === cat);

  return (
    <>
      <PageHeader eyebrow={dict.wiki.title} title={categoryLabel(cat, lang)} lede={categoryDesc(cat, lang)} />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <nav aria-label={dict.wiki.categoriesTitle} className="mb-6 flex flex-wrap gap-2">
          {categoryIds.map((c) => (
            <Link
              key={c}
              href={`/${lang}/wiki/category/${c}`}
              aria-current={c === cat ? "page" : undefined}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                c === cat ? "border-teal bg-teal text-on-brand" : "border-line bg-surface text-muted hover:border-teal hover:text-teal"
              }`}
            >
              {categoryLabel(c, lang)}
            </Link>
          ))}
        </nav>
        <p className="mb-3 text-sm text-muted">
          {stories.length} {dict.wiki.storyCount}
        </p>
        <StoryList stories={stories} lang={lang} dict={dict} issues={getIssues(lang)} />
        <Link href={`/${lang}/wiki`} className="mt-8 inline-block text-sm font-semibold text-teal hover:underline">
          <span aria-hidden>← </span>
          {dict.wiki.back}
        </Link>
      </div>
    </>
  );
}
