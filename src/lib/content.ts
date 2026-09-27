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
    topics: ai?.topics ?? [],
    roles: ai?.roles ?? [],
    aiSummary: ai?.summary[raw.lang] ?? [],
    questions: ai?.questions[raw.lang] ?? [],
    keywords: ai?.keywords ?? [],
  };
});

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
