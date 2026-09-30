import type { Issue } from "./content";
import { roleLabel, topicLabel } from "./taxonomy";

// "Ask BIO.ON": ranks issues against a free-text question using the AI analysis
// (keywords, answerable questions, 3-line summaries) plus title and topic/role labels.
// Plain text matching, so it runs in the browser with no API calls.

export type SearchHit = { issue: Issue; score: number; line: string | null };

// Common Korean particles/endings, stripped so "췌장암은" still matches "췌장암".
const PARTICLE_RE = /(은|는|이|가|을|를|의|에|에서|으로|로|와|과|도|만|이란|란|이랑|랑|에게|한테|까지|부터|요|인가요|나요|있나요)$/;

// Question words that would otherwise match almost every issue.
const STOPWORDS = new Set(
  "the a an is are was were be been do does did of in on at to for and or with about from by what which who whom why how when where this that these those it its there any some me my i you your can could will would should has have had tell show give find issue issues news 관련 어떤 무엇 뭐야 뭔가요 어떻게 알려줘 알려주세요 궁금해 궁금해요 있어 있나요 대해 대한 뉴스".split(" "),
);

export function tokenize(query: string): string[] {
  const tokens = query
    .toLowerCase()
    .split(/[\s,.?!·/()"'“”‘’:;]+/)
    .map((t) => (t.length > 2 ? t.replace(PARTICLE_RE, "") : t))
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
  return [...new Set(tokens)];
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Latin words must start a word ("drug" matches "drugs", "ra" doesn't match "Xaira"); Korean matches anywhere. */
function contains(text: string, needle: string) {
  const lower = text.toLowerCase();
  const n = needle.toLowerCase();
  if (!/^[a-z0-9]/.test(n)) return lower.includes(n);
  return new RegExp(`(^|[^a-z0-9])${escape(n)}`).test(lower);
}

function countHits(text: string, tokens: string[]) {
  return tokens.filter((t) => contains(text, t)).length;
}

export function searchIssues(issues: Issue[], query: string, lang: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  const tokens = tokenize(query);
  if (!tokens.length) return [];

  const hits: SearchHit[] = [];
  for (const issue of issues) {
    let score = 0;

    // A keyword appearing anywhere in the query is the strongest signal (handles particles and spacing).
    for (const k of issue.keywords) {
      if (contains(q, k)) score += 5;
      else if (tokens.some((t) => contains(k, t))) score += 3;
    }
    score += countHits(issue.title, tokens) * 3;
    score += countHits(issue.questions.join(" "), tokens) * 2;
    score += countHits(issue.aiSummary.join(" "), tokens) * 2;
    score += countHits(issue.summary, tokens);
    const labels = [...issue.topics.map((t) => topicLabel(t, lang)), ...issue.roles.map((r) => roleLabel(r, lang))];
    score += countHits(labels.join(" "), tokens) * 2;

    if (score === 0) continue;

    // Show the summary line (or answerable question) that best matches, as the "answer".
    let line: string | null = null;
    let best = 0;
    for (const l of [...issue.aiSummary, ...issue.questions]) {
      const n = countHits(l, tokens) + issue.keywords.filter((k) => contains(l, k) && contains(q, k)).length;
      if (n > best) {
        best = n;
        line = l;
      }
    }
    hits.push({ issue, score, line });
  }

  // Drop the long tail of issues that only share a word or two with the question.
  const top = Math.max(0, ...hits.map((h) => h.score));
  return hits
    .filter((h) => h.score >= top * 0.3)
    .sort((a, b) => b.score - a.score || b.issue.date.localeCompare(a.issue.date));
}
