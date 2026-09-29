import type { MetadataRoute } from "next";
import { getIssues, getPosts } from "@/lib/content";
import { locales } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";
import { categoryIds, entityIds } from "@/lib/wiki";

// Every public page in both languages, so Google and Naver can find the archive, wiki and
// career posts. Each entry links its other-language version.

type Entry = { path: string; lastModified?: string; changeFrequency?: "weekly" | "monthly"; priority?: number };

const pages: Entry[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/insight", changeFrequency: "weekly", priority: 0.9 },
  { path: "/wiki", changeFrequency: "weekly", priority: 0.7 },
  { path: "/career", changeFrequency: "weekly", priority: 0.8 },
  { path: "/career/interview", changeFrequency: "weekly", priority: 0.6 },
  { path: "/resources", changeFrequency: "monthly", priority: 0.7 },
  { path: "/tools", changeFrequency: "monthly", priority: 0.6 },
  { path: "/tools/flashcards", changeFrequency: "monthly", priority: 0.5 },
  { path: "/tools/pomodoro", changeFrequency: "monthly", priority: 0.4 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/subscribe", changeFrequency: "monthly", priority: 0.6 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.4 },
  { path: "/cookies", changeFrequency: "monthly", priority: 0.1 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];
  const add = (lang: string, e: Entry, other: string[]) =>
    out.push({
      url: `${siteUrl}/${lang}${e.path}`,
      lastModified: e.lastModified,
      changeFrequency: e.changeFrequency,
      priority: e.priority,
      alternates: { languages: Object.fromEntries(other.map((l) => [l, `${siteUrl}/${l}${e.path}`])) },
    });

  for (const lang of locales) {
    for (const p of pages) add(lang, p, [...locales]);
    for (const c of categoryIds) add(lang, { path: `/wiki/category/${c}`, changeFrequency: "weekly", priority: 0.5 }, [...locales]);
    for (const id of entityIds) add(lang, { path: `/wiki/${id}`, changeFrequency: "weekly", priority: 0.4 }, [...locales]);
  }

  // Issues and career posts exist per language; link the other edition only where it exists.
  const issueLangs = new Map<string, string[]>();
  for (const lang of locales) for (const i of getIssues(lang)) issueLangs.set(i.slug, [...(issueLangs.get(i.slug) ?? []), lang]);
  for (const lang of locales) {
    for (const i of getIssues(lang)) {
      add(lang, { path: `/insight/${i.slug}`, lastModified: i.date, changeFrequency: "monthly", priority: 0.8 }, issueLangs.get(i.slug)!);
    }
  }
  const postLangs = new Map<string, string[]>();
  for (const lang of locales) for (const p of getPosts(lang)) postLangs.set(p.slug, [...(postLangs.get(p.slug) ?? []), lang]);
  for (const lang of locales) {
    for (const p of getPosts(lang)) {
      add(lang, { path: `/career/${p.slug}`, lastModified: p.date, changeFrequency: "monthly", priority: 0.7 }, postLangs.get(p.slug)!);
    }
  }
  return out;
}
