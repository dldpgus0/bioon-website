import data from "@/content/cardnews.json";

// Instagram card news (src/content/cardnews.json), written by scripts/import-cardnews.mjs.
// Card images live in public/cardnews/<slug>/. The cards are written in Korean only.

export type Card = { src: string; alt: string };
export type Cardnews = {
  slug: string;
  date: string;
  title: string;
  summary: string;
  tags: string[];
  cards: Card[];
  /** Insight slug this card news is based on, if any. */
  issue?: string;
  /** Link to the Instagram post, if known. */
  instagram?: string;
};

const all = (data as Cardnews[]).slice().sort((a, b) => b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug));

export const getCardnews = () => all;
export const getCardnewsBySlug = (slug: string) => all.find((c) => c.slug === slug);
