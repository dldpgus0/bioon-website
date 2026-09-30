import Link from "next/link";
import type { Issue } from "@/lib/content";
import type { Dictionary, Locale } from "@/lib/i18n";
import { categoryLabel, entity, type Story } from "@/lib/wiki";
import { formatDate } from "./IssueCard";

const catStyle: Record<Story["cat"], string> = {
  fda: "bg-brand-soft text-brand",
  clinical: "bg-teal-soft text-teal",
  market: "bg-surface-2 text-ink",
  pipeline: "bg-surface-2 text-muted",
};

/** Category chip that links to the category's wiki page. */
export function CategoryChip({ cat, lang }: { cat: Story["cat"]; lang: Locale }) {
  return (
    <Link href={`/${lang}/wiki/category/${cat}`} className={`rounded-md px-2 py-0.5 text-xs font-semibold hover:underline ${catStyle[cat]}`}>
      {categoryLabel(cat, lang)}
    </Link>
  );
}

/**
 * Stories as wiki rows: category, title, the companies/drugs involved (each linking to its wiki
 * page), and — when `issues` is given — which issue it came from.
 */
export function StoryList({
  stories,
  lang,
  dict,
  issues,
  hideEntity,
}: {
  stories: Story[];
  lang: Locale;
  dict: Dictionary;
  issues?: Issue[];
  hideEntity?: string;
}) {
  return (
    <ol className="divide-y divide-line rounded-2xl border border-line bg-surface">
      {stories.map((s) => {
        const issue = issues?.find((i) => i.slug === s.slug);
        return (
          <li key={`${s.slug}-${s.index}`} className="p-5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <CategoryChip cat={s.cat} lang={lang} />
              {issue && (
                <Link href={`/${lang}/insight/${s.slug}`} className="font-medium text-muted hover:text-teal">
                  {dict.wiki.issueRef.replace("{n}", String(issue.number))} · {formatDate(issue.date, lang)}
                </Link>
              )}
            </div>
            <p className="mt-2 font-semibold leading-snug text-ink">
              {issue ? (
                <Link href={`/${lang}/insight/${s.slug}`} className="hover:text-teal">
                  {s.title}
                </Link>
              ) : (
                s.title
              )}
            </p>
            {s.entities.some((e) => e !== hideEntity) && (
              <p className="mt-2 flex flex-wrap gap-1.5">
                {s.entities
                  .filter((e) => e !== hideEntity)
                  .map((e) => (
                    <Link
                      key={e}
                      href={`/${lang}/wiki/${e}`}
                      className="rounded-full border border-line px-2 py-0.5 text-xs text-muted transition-colors hover:border-teal hover:text-teal"
                    >
                      {entity(e, lang).name}
                    </Link>
                  ))}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
