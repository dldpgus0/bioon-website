import wikiData from "@/content/wiki.json";
import type { Locale } from "./i18n";

// Story-level knowledge index (src/content/wiki.json): each issue's three stories with a main
// category and the companies, drugs and regulators involved. Plain data, safe in client components.

export const categoryIds = ["fda", "clinical", "market", "pipeline"] as const;
export type CategoryId = (typeof categoryIds)[number];
export type EntityType = "company" | "drug" | "regulator";
export type Entity = { id: string; type: EntityType; name: string };
export type Story = { slug: string; index: number; cat: CategoryId; title: string; entities: string[] };

type RawStory = { cat: CategoryId; ko: string; en: string; entities: string[] };
type RawData = {
  categories: Record<CategoryId, { ko: string; en: string; desc: Record<Locale, string> }>;
  entities: Record<string, { type: EntityType; ko: string; en: string }>;
  stories: Record<string, RawStory[]>;
};
const data = wikiData as unknown as RawData;

export const isCategoryId = (v: string): v is CategoryId => (categoryIds as readonly string[]).includes(v);
export const categoryLabel = (id: CategoryId, lang: Locale) => data.categories[id][lang];
export const categoryDesc = (id: CategoryId, lang: Locale) => data.categories[id].desc[lang];

export const entityIds = Object.keys(data.entities);
export const isEntityId = (v: string) => v in data.entities;
export function entity(id: string, lang: Locale): Entity {
  const e = data.entities[id];
  return { id, type: e.type, name: e[lang] };
}

/** The three stories of one issue (empty for issues without news, like the welcome letter). */
export function storiesOf(slug: string, lang: Locale): Story[] {
  return (data.stories[slug] ?? []).map((s, index) => ({ slug, index, cat: s.cat, title: s[lang], entities: s.entities }));
}

/** Every story, newest issue first. */
export function allStories(lang: Locale): Story[] {
  return Object.keys(data.stories)
    .sort((a, b) => b.localeCompare(a))
    .flatMap((slug) => storiesOf(slug, lang));
}

/** How many stories mention each entity, most-mentioned first (ties by name). */
export function entityCounts(lang: Locale) {
  const counts = new Map<string, number>();
  for (const s of allStories(lang)) for (const e of s.entities) counts.set(e, (counts.get(e) ?? 0) + 1);
  return [...counts]
    .map(([id, count]) => ({ ...entity(id, lang), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
