import "server-only";
import glossary from "@/content/glossary.json";
import { getInterviewQuestions, getIssue } from "./content";
import type { Locale } from "./i18n";
import { roleIds, roleLabel } from "./taxonomy";

// Printable documents behind the lead-magnet gate (served by /api/resources/[id]).
// Built from the same data as the site, so they never go stale. Readers save them as PDF
// from the browser's print dialog.

export const downloadIds = ["interview-questions", "glossary"] as const;
export type DownloadId = (typeof downloadIds)[number];
export const isDownloadId = (id: string): id is DownloadId => (downloadIds as readonly string[]).includes(id);

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const copy = {
  ko: {
    "interview-questions": {
      title: "바이오 직무 면접 질문 모음",
      lede: "BIO:ON Insight에서 다룬 실제 업계 뉴스로 만든 면접 질문과 답변 포인트예요. 먼저 스스로 답해 본 뒤 포인트와 비교해 보세요.",
    },
    glossary: {
      title: "바이오 산업 용어집",
      lede: "BIO:ON Insight '이번 주의 단어'를 모았어요. 정의와 비유로 한 번에 이해해 보세요.",
    },
    print: "PDF로 저장 / 인쇄",
    subscriberOnly: "BIO:ON Insight 구독자 전용 자료",
    roleIndex: "직무별 질문 번호",
    why: "면접관이 보는 것",
    points: "답변 포인트",
    source: "근거",
    analogy: "비유로 이해하기",
    issue: (n: number) => `#${n}호`,
  },
  en: {
    "interview-questions": {
      title: "Biotech Interview Question Pack",
      lede: "Interview questions and answer points built from the real industry news covered in BIO:ON Insight. Answer each one yourself first, then compare with the points.",
    },
    glossary: {
      title: "Biotech Industry Glossary",
      lede: "Every Word of the Week from BIO:ON Insight, with a definition and an analogy for each.",
    },
    print: "Save as PDF / Print",
    subscriberOnly: "For BIO:ON Insight subscribers",
    roleIndex: "Questions by role",
    why: "What the interviewer is looking for",
    points: "Answer points",
    source: "Based on",
    analogy: "Analogy",
    issue: (n: number) => `Issue #${n}`,
  },
};

function page(lang: Locale, title: string, lede: string, body: string, siteUrl: string) {
  const t = copy[lang];
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(title)} · BIO:ON</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<style>
  :root { --ink:#132a4c; --muted:#5b6b82; --brand:#1a5688; --teal:#197f83; --line:#dfe5ec; }
  * { box-sizing:border-box; }
  body { margin:0; background:#f4f6f9; color:var(--ink); font-family:'Pretendard Variable',Pretendard,-apple-system,'Apple SD Gothic Neo','Malgun Gothic',sans-serif; line-height:1.65; }
  .doc { max-width:820px; margin:0 auto; background:#fff; padding:48px 56px; border-left:1px solid var(--line); border-right:1px solid var(--line); }
  header { border-bottom:2px solid var(--ink); padding-bottom:20px; margin-bottom:28px; }
  .eyebrow { font-size:11px; letter-spacing:.2em; text-transform:uppercase; color:var(--teal); font-weight:700; margin:0; }
  h1 { font-size:28px; margin:8px 0 10px; letter-spacing:-.01em; }
  .lede { color:var(--muted); margin:0; }
  .print { position:fixed; right:20px; bottom:20px; background:var(--brand); color:#fff; border:0; padding:12px 18px; font:600 14px inherit; cursor:pointer; }
  h2 { font-size:13px; letter-spacing:.12em; text-transform:uppercase; color:var(--teal); margin:32px 0 10px; }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  td, th { border:1px solid var(--line); padding:6px 10px; text-align:left; vertical-align:top; }
  th { background:#f4f6f9; width:34%; }
  .item { border-top:1px solid var(--line); padding:18px 0; break-inside:avoid; }
  .meta { font-size:12px; color:var(--muted); margin:0 0 4px; }
  .q { font-size:17px; font-weight:700; margin:0 0 8px; }
  .label { font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); margin:10px 0 2px; }
  ol { margin:4px 0 0; padding-left:20px; }
  p { margin:0; }
  footer { margin-top:36px; padding-top:14px; border-top:1px solid var(--line); font-size:12px; color:var(--muted); display:flex; justify-content:space-between; gap:12px; }
  @media print { body { background:#fff; } .doc { border:0; padding:0; max-width:none; } .print { display:none; } }
  @media (max-width:640px) { .doc { padding:28px 18px; } }
</style>
</head>
<body>
<main class="doc">
<header>
  <p class="eyebrow">${esc(t.subscriberOnly)}</p>
  <h1>${esc(title)}</h1>
  <p class="lede">${esc(lede)}</p>
</header>
${body}
<footer><span>© ${new Date().getFullYear()} BIO:ON Insight</span><span>${esc(siteUrl.replace(/^https?:\/\//, ""))}/${lang}</span></footer>
</main>
<button class="print" type="button" onclick="window.print()">${esc(t.print)}</button>
</body>
</html>`;
}

function interviewDoc(lang: Locale, siteUrl: string) {
  const t = copy[lang];
  const questions = getInterviewQuestions(lang);
  const index = roleIds
    .map((r) => {
      const nums = questions.flatMap((q, i) => (q.roles.includes(r) ? [`Q${i + 1}`] : []));
      return nums.length ? `<tr><th>${esc(roleLabel(r, lang))}</th><td>${nums.join(", ")}</td></tr>` : "";
    })
    .join("");
  const items = questions
    .map((q, i) => {
      const src = q.issue ? ` · ${esc(t.source)}: ${esc(t.issue(q.issue.number))} ${esc(q.issue.title)}` : "";
      return `<section class="item">
  <p class="meta">Q${i + 1} · ${q.roles.map((r) => esc(roleLabel(r, lang))).join(", ")}${src}</p>
  <p class="q">${esc(q.q)}</p>
  <p class="label">${esc(t.why)}</p><p>${esc(q.why)}</p>
  <p class="label">${esc(t.points)}</p><ol>${q.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ol>
</section>`;
    })
    .join("\n");
  const c = t["interview-questions"];
  return page(lang, c.title, c.lede, `<h2>${esc(t.roleIndex)}</h2><table>${index}</table>\n<h2>Q&amp;A</h2>\n${items}`, siteUrl);
}

function glossaryDoc(lang: Locale, siteUrl: string) {
  const t = copy[lang];
  const terms = [...glossary.terms].sort((a, b) => a.term[lang].localeCompare(b.term[lang], lang));
  const items = terms
    .map((g) => {
      const issue = getIssue(lang, g.issue);
      return `<section class="item">
  <p class="q">${esc(g.term[lang])}</p>
  <p>${esc(g.definition[lang])}</p>
  <p class="label">${esc(t.analogy)}</p><p>${esc(g.analogy[lang])}</p>
  ${issue ? `<p class="meta" style="margin-top:8px">${esc(t.source)}: ${esc(t.issue(issue.number))} ${esc(issue.title)}</p>` : ""}
</section>`;
    })
    .join("\n");
  const c = t.glossary;
  return page(lang, c.title, c.lede, items, siteUrl);
}

export function renderDownload(id: DownloadId, lang: Locale, siteUrl: string) {
  return id === "glossary" ? glossaryDoc(lang, siteUrl) : interviewDoc(lang, siteUrl);
}
