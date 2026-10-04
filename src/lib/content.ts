import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import insight from "@/content/insight.json";
import insightAi from "@/content/insight-ai.json";
import interviewBank from "@/content/interview-bank.json";
import type { Locale } from "./i18n";
import type { RoleId, TopicId } from "./taxonomy";
import { entity, storiesOf, type CategoryId } from "./wiki";

// ---------- Insight (newsletter archive) ----------

type RawIssue = {
  lang: Locale;
  number: number;
  date: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
};

type IssueAnalysis = {
  topics: TopicId[];
  roles: RoleId[];
  summary: Record<Locale, string[]>;
  questions: Record<Locale, string[]>;
  keywords: string[];
};

/** An issue plus its AI analysis (src/content/insight-ai.json), localized to the issue's language. */
export type Issue = RawIssue & {
  /** Main categories of the issue's stories (src/content/wiki.json). */
  categories: CategoryId[];
  topics: TopicId[];
  roles: RoleId[];
  aiSummary: string[];
  questions: string[];
  keywords: string[];
};

const analysis = insightAi as unknown as Record<string, IssueAnalysis>;

const issues: Issue[] = (insight as RawIssue[]).map((raw) => {
  const ai = analysis[raw.slug];
  return {
    ...raw,
    categories: [...new Set(storiesOf(raw.slug, raw.lang).map((s) => s.cat))],
    topics: ai?.topics ?? [],
    roles: ai?.roles ?? [],
    aiSummary: ai?.summary[raw.lang] ?? [],
    questions: ai?.questions[raw.lang] ?? [],
    keywords: ai?.keywords ?? [],
  };
});

export function getIssues(lang: Locale) {
  // Newest first; the welcome letter (#1) shares its date with issue #2, so number breaks the tie.
  return issues.filter((i) => i.lang === lang).sort((a, b) => b.date.localeCompare(a.date) || b.number - a.number);
}

export function getIssue(lang: Locale, slug: string) {
  return issues.find((i) => i.lang === lang && i.slug === slug);
}

/** Every date that has at least one edition, in any language. */
export function getIssueSlugs() {
  return [...new Set(issues.map((i) => i.slug))];
}

// ---------- Issue sources (for <References />) ----------

export type Reference = { title: string; source: string; url: string };

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Some issues wrap links as google.com/search?q=<url> or google.com/url?q=<url>; link the article itself.
// A plain search (q=search words) stays as the Google link.
function unwrap(url: string) {
  const u = url.replace(/&amp;/g, "&");
  const m = u.match(/^https?:\/\/(?:www\.)?google\.[a-z.]+\/(?:search|url)\?q=([^&]+)/);
  const target = m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : "";
  return /^https?:\/\//.test(target) ? target : u;
}

/**
 * The "🔗 원문 링크 / Sources" list at the end of an issue's email HTML, as structured references.
 * Link text looks like "① Title (Fierce Biotech, 2026.08.24)" or "① Title — Source Name".
 */
export function getIssueReferences(lang: Locale, slug: string): Reference[] {
  const file = path.join(process.cwd(), "public", "newsletters", lang, `${slug}.html`);
  if (!fs.existsSync(file)) return [];
  const html = fs.readFileSync(file, "utf8");
  // The section label is an uppercase heading paragraph; the links follow until the next section comment.
  const label = html.search(/text-transform: uppercase[^>]*>\s*🔗/);
  if (label < 0) return [];
  const section = html.slice(label).split("<!-- =====")[0];
  // Only web links count; this skips merge tags like Stibee's $%unsubscribe%$ if the footer gets swept in.
  const links = [...section.matchAll(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
  return links.filter(([, href]) => /^https?:\/\//.test(href)).map(([, href, inner]) => {
    const text = decode(inner).replace(/^[①-⑳]\s*/, "");
    const url = unwrap(href);
    const paren = text.match(/^(.*)\(([^()]+)\)\s*$/);
    const dash = text.match(/^(.*?)\s+—\s+([^—]+)$/);
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (paren) return { title: paren[1].trim(), source: paren[2].trim(), url };
    if (dash) return { title: dash[1].trim(), source: dash[2].trim(), url };
    return { title: text, source: host, url };
  });
}

// ---------- Related issues and the editor's takeaway ----------

/**
 * Other issues that share companies, drugs or regulators with this one (strongest link), then topics.
 * Returns up to `limit`, each with the entities it shares so the page can say why it's related.
 */
export function getRelatedIssues(issue: Issue, limit = 3) {
  const mine = new Set(storiesOf(issue.slug, issue.lang).flatMap((s) => s.entities));
  return getIssues(issue.lang)
    .filter((other) => other.slug !== issue.slug && other.slug !== "welcome")
    .map((other) => {
      const shared = [...new Set(storiesOf(other.slug, other.lang).flatMap((s) => s.entities))].filter((e) => mine.has(e));
      // A regulator (e.g. the FDA) turns up everywhere, so it counts for less than a company or drug.
      const entityScore = shared.reduce((sum, e) => sum + (entity(e, issue.lang).type === "regulator" ? 1 : 3), 0);
      const topicScore = other.topics.filter((t) => issue.topics.includes(t)).length;
      return { issue: other, shared: shared.map((e) => entity(e, issue.lang)), score: entityScore + topicScore };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.issue.date.localeCompare(a.issue.date))
    .slice(0, limit);
}

/**
 * The editor's own commentary from the issue ("💡 에디터 인사이트" / "💡 Editor's Insight"),
 * as plain text. Shown verbatim at the top of the issue page.
 */
export function getIssueTakeaway(lang: Locale, slug: string): string | null {
  const file = path.join(process.cwd(), "public", "newsletters", lang, `${slug}.html`);
  if (!fs.existsSync(file)) return null;
  const html = fs.readFileSync(file, "utf8");
  const label = html.match(/text-transform: uppercase[^>]*>\s*💡[^<]*(?:인사이트|Insight)[^<]*<\/p>/);
  if (!label || label.index === undefined) return null;
  const body = html.slice(label.index + label[0].length).split("<!-- =====")[0];
  const text = decode(body.replace(/<br\s*\/?>/gi, " "));
  return text || null;
}

// ---------- Interview question bank ----------

export type QuestionKind = "concept" | "issue" | "case";

/** A question from src/content/interview-bank.json, localized, with the issue it draws on. */
export type InterviewQuestion = {
  id: string;
  kind: QuestionKind;
  roles: RoleId[];
  q: string;
  why: string;
  points: string[];
  issue: { slug: string; number: number; title: string } | null;
  /** True when `why` and `points` were withheld behind the email gate. */
  locked?: boolean;
};

type RawQuestion = {
  id: string;
  issue: string;
  kind: QuestionKind;
  roles: RoleId[];
  q: Record<Locale, string>;
  why: Record<Locale, string>;
  points: Record<Locale, string[]>;
};

/** Questions newest issue first, so the latest news comes up first. */
export function getInterviewQuestions(lang: Locale): InterviewQuestion[] {
  return (interviewBank.questions as RawQuestion[])
    .map((raw) => {
      const issue = getIssue(lang, raw.issue);
      return {
        id: raw.id,
        kind: raw.kind,
        roles: raw.roles,
        q: raw.q[lang],
        why: raw.why[lang],
        points: raw.points[lang],
        issue: issue ? { slug: issue.slug, number: issue.number, title: issue.title } : null,
      };
    })
    .sort((a, b) => (b.issue?.slug ?? "").localeCompare(a.issue?.slug ?? ""));
}

// ---------- Career posts (markdown) ----------

export const careerCategories = ["linkedin", "resume", "interview", "industry", "ai"] as const;
export type CareerCategory = (typeof careerCategories)[number];

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: CareerCategory;
  roles: string[];
  summary: string;
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
