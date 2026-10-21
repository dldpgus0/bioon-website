import data from "@/content/cardnews.json";
import type { Locale } from "./i18n";

// Instagram card news (src/content/cardnews.json), written by scripts/import-cardnews.mjs.
// Card images live in public/cardnews/<slug>/. Each episode has Korean cards; `en` adds an English
// title/summary and, when the owner made English cards, English images too.

export type Card = { src: string; alt: string };
type Text = { title: string; summary: string; tags: string[] };
type Raw = Text & {
  slug: string;
  date: string;
  cards: Card[];
  /** Insight slug this card news is based on, if any. */
  issue?: string;
  /** Link to the Instagram post, if known. */
  instagram?: string;
  en?: Partial<Text> & { cards?: Card[] };
  /** The cards themselves carry both languages (e.g. the terms series). */
  bilingual?: boolean;
};

export type Cardnews = Text & {
  slug: string;
  date: string;
  cards: Card[];
  issue?: string;
  instagram?: string;
  /** True when the English page shows the Korean cards because there are no English ones. */
  koreanCards: boolean;
  /** JPEG copy of the cover for link previews (some sites don't read WebP). */
  og: string;
};

// Stable sort keeps the order episodes were added in when they share a date.
const all = (data as Raw[]).slice().sort((a, b) => b.date.localeCompare(a.date));

function localize(c: Raw, lang: Locale): Cardnews {
  const en = lang === "en" ? c.en : undefined;
  return {
    slug: c.slug,
    date: c.date,
    issue: c.issue,
    instagram: c.instagram,
    title: en?.title ?? c.title,
    summary: en?.summary ?? c.summary,
    tags: en?.tags ?? c.tags,
    cards: en?.cards ?? c.cards,
    koreanCards: lang === "en" && !en?.cards && !c.bilingual,
    og: `/cardnews/${c.slug}/${en?.cards ? "en-" : ""}og.jpg`,
  };
}

export const getCardnews = (lang: Locale) => all.map((c) => localize(c, lang));
export function getCardnewsBySlug(slug: string, lang: Locale) {
  const c = all.find((x) => x.slug === slug);
  return c && localize(c, lang);
}
