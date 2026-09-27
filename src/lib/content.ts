import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import insight from "@/content/insight.json";
import type { Locale } from "./i18n";

// ---------- Insight (newsletter archive) ----------

export type Issue = {
  lang: Locale;
  number: number;
  date: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
};

const issues = insight as Issue[];

export function getIssues(lang: Locale) {
  return issues.filter((i) => i.lang === lang).sort((a, b) => b.date.localeCompare(a.date));
}

export function getIssue(lang: Locale, slug: string) {
  return issues.find((i) => i.lang === lang && i.slug === slug);
}

/** Every date that has at least one edition, in any language. */
export function getIssueSlugs() {
  return [...new Set(issues.map((i) => i.slug))];
}

// ---------- Career posts (markdown) ----------

export const careerCategories = ["linkedin", "resume", "interview", "industry"] as const;
export type CareerCategory = (typeof careerCategories)[number];

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: CareerCategory;
  roles: string[];
  summary: string;
  sample: boolean;
};

const careerDir = (lang: Locale) => path.join(process.cwd(), "src", "content", "career", lang);

function readPost(lang: Locale, file: string) {
  const raw = fs.readFileSync(path.join(careerDir(lang), file), "utf8");
  const { data, content } = matter(raw);
  const post: Post = {
    slug: file.replace(/\.md$/, ""),
    title: data.title,
    date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date),
    category: data.category,
    roles: data.roles ?? [],
    summary: data.summary ?? "",
    sample: Boolean(data.sample),
  };
  return { post, content };
}

export function getPosts(lang: Locale): Post[] {
  const dir = careerDir(lang);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => readPost(lang, f).post)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(lang: Locale, slug: string) {
  const file = `${slug}.md`;
  if (!fs.existsSync(path.join(careerDir(lang), file))) return null;
  const { post, content } = readPost(lang, file);
  return { post, html: await marked.parse(content) };
}
