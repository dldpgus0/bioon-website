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

export default async function WikiPage({ params }: PageProps<"/[lang]/wiki">) {
  const lang = await getLocale(params);
  const dict = await getDictionary(lang);
  const t = dict.wiki;
  const stories = allStories(lang);
  const issues = getIssues(lang);
  const counts = entityCounts(lang);

  return (
    <>
      <PageHeader eyebrow="BIO:ON Wiki" title={t.title} lede={t.lede} />
      <div className="mx-auto max-w-6xl space-y-14 px-4 py-10 sm:px-6">
        <section aria-labelledby="wiki-categories">
          <h2 id="wiki-categories" className="text-lg font-bold text-ink">
            {t.categoriesTitle}
          </h2>
          <div className="mt-5 grid gap-6 lg:grid-cols-2">
            {categoryIds.map((cat) => {
              const inCat = stories.filter((s) => s.cat === cat);
              return (
                <div key={cat}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-bold text-ink">
                      <Link href={`/${lang}/wiki/category/${cat}`} className="hover:text-teal">
                        {categoryLabel(cat, lang)}
                      </Link>
                      <span className="ml-2 text-sm font-medium text-muted">
                        {inCat.length} {t.storyCount}
                      </span>
                    </h3>
                    <Link href={`/${lang}/wiki/category/${cat}`} className="shrink-0 text-sm font-semibold text-teal hover:underline">
                      {t.seeAll}
                      <span aria-hidden> →</span>
                    </Link>
                  </div>
                  <p className="mb-3 mt-1 text-sm text-muted">{categoryDesc(cat, lang)}</p>
                  <StoryList stories={inCat.slice(0, 3)} lang={lang} dict={dict} issues={issues} />
                </div>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="wiki-entities">
          <h2 id="wiki-entities" className="text-lg font-bold text-ink">
            {t.entitiesTitle}
          </h2>
          <div className="mt-5 space-y-6">
            {types.map((type) => (
              <div key={type}>
                <h3 className="text-sm font-semibold text-muted">{t.types[type]}</h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {counts
                    .filter((e) => e.type === type)
                    .map((e) => (
                      <li key={e.id}>
                        <Link
                          href={`/${lang}/wiki/${e.id}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink transition-colors hover:border-teal hover:text-teal"
                        >
                          {e.name}
                          <span className="text-xs text-muted">{e.count}</span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
