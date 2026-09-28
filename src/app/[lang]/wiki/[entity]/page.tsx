import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { StoryList } from "@/components/StoryList";
import { getIssues } from "@/lib/content";
import { getDictionary, getLocale, locales } from "@/lib/i18n";
import { allStories, entity, entityIds, isEntityId } from "@/lib/wiki";

export function generateStaticParams() {
  return locales.flatMap((lang) => entityIds.map((id) => ({ lang, entity: id })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/wiki/[entity]">): Promise<Metadata> {
  const lang = await getLocale(params);
  const { entity: id } = await params;
  if (!isEntityId(id)) return {};
  const dict = await getDictionary(lang);
  const e = entity(id, lang);
  const n = allStories(lang).filter((s) => s.entities.includes(id)).length;
  return { title: e.name, description: dict.wiki.entityLede.replace("{name}", e.name).replace("{n}", String(n)) };
}

export default async function EntityPage({ params }: PageProps<"/[lang]/wiki/[entity]">) {
  const lang = await getLocale(params);
  const { entity: id } = await params;
  if (!isEntityId(id)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.wiki;
  const e = entity(id, lang);
  const stories = allStories(lang).filter((s) => s.entities.includes(id));

  // Companies and drugs that appear in the same stories, most frequent first.
  const co = new Map<string, number>();
  for (const s of stories) for (const other of s.entities) if (other !== id) co.set(other, (co.get(other) ?? 0) + 1);
  const coMentioned = [...co].sort((a, b) => b[1] - a[1]).map(([other]) => entity(other, lang));

  return (
    <>
      <PageHeader
        eyebrow={`${t.title} · ${t.types[e.type]}`}
        title={e.name}
        lede={t.entityLede.replace("{name}", e.name).replace("{n}", String(stories.length))}
      />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h2 className="mb-3 text-sm font-bold text-ink">{t.timeline}</h2>
        <StoryList stories={stories} lang={lang} dict={dict} issues={getIssues(lang)} hideEntity={id} />

        {coMentioned.length > 0 && (
          <>
            <h2 className="mb-3 mt-10 text-sm font-bold text-ink">{t.coMentioned}</h2>
            <ul className="flex flex-wrap gap-2">
              {coMentioned.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/${lang}/wiki/${o.id}`}
                    className="inline-block rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink transition-colors hover:border-teal hover:text-teal"
                  >
                    {o.name}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <Link href={`/${lang}/wiki`} className="mt-10 inline-block text-sm font-semibold text-teal hover:underline">
          <span aria-hidden>← </span>
          {t.back}
        </Link>
      </div>
    </>
  );
}
