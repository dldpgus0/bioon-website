import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { StoryList } from "@/components/StoryList";
import { getIssues } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n";
import { allStories, categoryDesc, categoryIds, categoryLabel, entityCounts, type EntityType } from "@/lib/wiki";

export async function generateMetadata({ params }: PageProps<"/[lang]/wiki">): Promise<Metadata> {
  const dict = await getDictionary(await getLocale(params));
  return { title: dict.wiki.metaTitle, description: dict.wiki.lede };
}

const types: EntityType[] = ["company", "drug", "regulator"];

const chip =
  "inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink transition-colors hover:border-teal hover:text-teal";

// Kept deliberately short: four category cards, the handful of names that recur, the latest
// stories, and the full name index folded away.
export default async function WikiPage({ params }: PageProps<"/[lang]/wiki">) {
  const lang = await getLocale(params);
  const dict = await getDictionary(lang);
  const t = dict.wiki;
  const stories = allStories(lang);
  const counts = entityCounts(lang);
  const popular = counts.filter((e) => e.count >= 2);

  return (
    <>
      <PageHeader eyebrow="BIO:ON Wiki" title={t.title} lede={t.lede} />
      <div className="mx-auto max-w-5xl space-y-12 px-4 py-10 sm:px-6">
        <section aria-labelledby="wiki-categories">
          <h2 id="wiki-categories" className="sr-only">
            {t.categoriesTitle}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryIds.map((cat) => (
              <Link
                key={cat}
                href={`/${lang}/wiki/category/${cat}`}
                className="group rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-teal"
              >
                <p className="text-2xl font-bold text-brand">{stories.filter((s) => s.cat === cat).length}</p>
                <h3 className="mt-1 font-bold text-ink group-hover:text-teal">{categoryLabel(cat, lang)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{categoryDesc(cat, lang)}</p>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="wiki-popular">
          <h2 id="wiki-popular" className="text-lg font-bold text-ink">
            {t.popularTitle}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {popular.map((e) => (
              <li key={e.id}>
                <Link href={`/${lang}/wiki/${e.id}`} className={chip}>
                  {e.name}
                  <span className="text-xs text-muted">{e.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="wiki-recent">
          <h2 id="wiki-recent" className="mb-4 text-lg font-bold text-ink">
            {t.recentTitle}
          </h2>
          <StoryList stories={stories.slice(0, 5)} lang={lang} dict={dict} issues={getIssues(lang)} />
        </section>

        <details className="rounded-2xl border border-line bg-surface p-5">
          <summary className="cursor-pointer text-sm font-semibold text-ink">
            {t.allEntities} ({counts.length})
          </summary>
          <div className="mt-5 space-y-5">
            {types.map((type) => (
              <div key={type}>
                <h3 className="text-sm font-semibold text-muted">{t.types[type]}</h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {counts
                    .filter((e) => e.type === type)
                    .map((e) => (
                      <li key={e.id}>
                        <Link href={`/${lang}/wiki/${e.id}`} className={chip}>
                          {e.name}
                          <span className="text-xs text-muted">{e.count}</span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      </div>
    </>
  );
}
