import "server-only";
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import acronyms from "@/content/acronyms.json";
import glossary from "@/content/glossary.json";
import competency from "@/content/interview-competency.json";
import { getInterviewQuestions, getIssue } from "./content";
import type { Locale } from "./i18n";
import { roleIds, roleLabel, type RoleId } from "./taxonomy";

// Printable documents behind the lead-magnet gate (served by /api/resources/[id]).
// Built from the same data as the site, so they never go stale. Readers save them as PDF
// from the browser's print dialog.

export const downloadIds = [
  "acronyms",
  "interview-questions",
  "trial-data-guide",
  "pipeline-tracker",
  "cv-template",
  "cv-template-file",
  "glossary",
] as const;
export type DownloadId = (typeof downloadIds)[number];
export const isDownloadId = (id: string): id is DownloadId => (downloadIds as readonly string[]).includes(id);

// Office files built by scripts/build-downloads.py. Served as attachments; everything else is HTML.
// Next.js traces src/content/downloads into the route bundle (see next.config.ts).
const DOWNLOAD_DIR = path.join(process.cwd(), "src", "content", "downloads");
const files: Partial<Record<DownloadId, { file: string; type: string; name: string }>> = {
  "pipeline-tracker": {
    file: "pipeline-deal-tracker.xlsx",
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    name: "BIOON_Pipeline_Deal_Tracker.xlsx",
  },
  "cv-template-file": {
    file: "cv-template.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    name: "BIOON_English_CV_Template.docx",
  },
};

/** The file to send for an Office-format download, or null for an HTML document. */
export function downloadFile(id: DownloadId) {
  const f = files[id];
  return f ? { body: fs.readFileSync(path.join(DOWNLOAD_DIR, f.file)), type: f.type, name: f.name } : null;
}

const readMarkdown = (name: string, lang: Locale) =>
  marked.parse(fs.readFileSync(path.join(DOWNLOAD_DIR, `${name}.${lang}.md`), "utf8"), { async: false }) as string;

// Pharmacovigilance isn't one of the site's role filters, but the cheatsheet tags terms with it.
const roleName = (r: string, lang: Locale) =>
  r === "pv" ? (lang === "ko" ? "약물감시(PV)" : "Pharmacovigilance") : roleLabel(r as RoleId, lang);

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
    acronyms: {
      title: "바이오·제약 실무 약어장",
      lede: "학교에선 안 배우지만 기사와 실무에 매일 나오는 약어 143개를 7개 분야로 정리했어요. 약어마다 관련 직무를 표시했어요.",
    },
    "trial-data-guide": {
      title: "임상·허가 정보 검색 가이드",
      lede: "ClinicalTrials.gov, Drugs@FDA, EMA EPAR, 의약품안전나라에서 임상 결과와 허가 문서를 직접 찾아 읽는 방법이에요.",
    },
    "cv-template": {
      title: "영문 CV 템플릿 & 링크드인 체크리스트",
      lede: "외국계·글로벌 바이오 지원용 ATS 친화 영문 CV 템플릿(.docx)과 제출 전·링크드인 체크리스트예요.",
    },
    toc: "목차",
    fullForm: "풀네임",
    categorySources: "이 분야의 출처",
    editorNote: "이 분야의 정의는 업계에서 통용되는 뜻을 에디터가 정리한 거예요.",
    definitionsNote: "약어의 풀네임은 표준 표기이고, 설명은 각 분야 끝에 적은 공식 자료를 바탕으로 에디터가 요약했어요.",
    downloadDocx: "영문 CV 템플릿 받기 (.docx)",
    newsQuestions: "1부. 뉴스로 만든 면접 질문",
    competencyTitle: "2부. 직무별 역량·상황 질문",
    competencyNote: "실제 기출 목록이 아니라, 직무별로 자주 나오는 질문 유형을 에디터가 정리한 거예요. 각 직무가 보는 역량은 아래 출처의 직무 소개를 따랐어요.",
    skills: "이 직무가 보는 역량",
    skillsEditor: "(에디터 정리)",
    kinds: { competency: "역량", scenario: "상황" } as Record<string, string>,
    sources: "출처",
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
    acronyms: {
      title: "Biotech & Pharma Acronym Cheatsheet",
      lede: "143 acronyms you won't learn at university but will meet in every article and on the job, in seven areas, each tagged with the roles that use it.",
    },
    "trial-data-guide": {
      title: "Clinical Trial & Approval Data Guide",
      lede: "How to find and read trial results and approval documents yourself on ClinicalTrials.gov, Drugs@FDA, EMA EPARs and Korea's Drug Safety Nara.",
    },
    "cv-template": {
      title: "English CV Template & LinkedIn Checklist",
      lede: "An ATS-friendly English CV template (.docx) for multinational and global biotech roles, with pre-submission and LinkedIn checklists.",
    },
    toc: "Contents",
    fullForm: "Full form",
    categorySources: "Sources for this area",
    editorNote: "Definitions in this area summarise common industry usage, compiled by the editor.",
    definitionsNote: "Full forms are standard; the explanations are editor summaries based on the official sources listed at the end of each area.",
    downloadDocx: "Download the English CV template (.docx)",
    newsQuestions: "Part 1. Questions built from the news",
    competencyTitle: "Part 2. Competency and scenario questions by role",
    competencyNote: "Not a record of real past questions — these are common question types compiled by the editor. The skills each role looks for follow the role profiles in the sources below.",
    skills: "Skills this role looks for",
    skillsEditor: "(editor's summary)",
    kinds: { competency: "Competency", scenario: "Scenario" } as Record<string, string>,
    sources: "Sources",
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
  .full { font-weight:400; color:var(--muted); font-size:14px; }
  .chip { display:inline-block; font-size:11px; color:var(--brand); background:#eef3f8; padding:1px 7px; margin:4px 4px 0 0; }
  .toc { columns:2; font-size:13px; margin:0; padding-left:18px; }
  .note { font-size:12px; color:var(--muted); background:#f4f6f9; padding:10px 12px; margin:10px 0 0; }
  .src { font-size:12px; color:var(--muted); margin-top:10px; }
  .src a, .md a { color:var(--brand); }
  .btn { display:inline-block; background:var(--brand); color:#fff; text-decoration:none; padding:10px 16px; font-weight:600; font-size:14px; }
  .box { border:1px solid var(--line); padding:14px 16px; margin:10px 0; }
  .md h2 { margin-top:30px; }
  .md h3 { font-size:15px; margin:18px 0 6px; }
  .md p { margin:8px 0; }
  .md ul, .md ol { padding-left:22px; margin:6px 0; }
  .md li { margin:3px 0; }
  .md code { background:#f4f6f9; padding:0 4px; font-size:13px; }
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
  const part1 = `<h2>${esc(t.newsQuestions)}</h2><h2>${esc(t.roleIndex)}</h2><table>${index}</table>\n<h2>Q&amp;A</h2>\n${items}`;
  return page(lang, c.title, c.lede, `${part1}\n${competencyPart(lang)}`, siteUrl);
}

function sourceList(sources: { label: string; url: string }[]) {
  return sources.map((s) => `<a href="${esc(s.url)}">${esc(s.label)}</a>`).join(" · ");
}

function competencyPart(lang: Locale) {
  const t = copy[lang];
  const star = competency.star[lang];
  const steps = star.steps.map(([k, v]) => `<li><strong>${esc(k)}</strong> — ${esc(v)}</li>`).join("");
  const roles = competency.roles
    .map((r) => {
      const qs = r.questions.map((q) => `<li><span class="chip">${esc(t.kinds[q.kind])}</span> ${esc(q[lang])}</li>`).join("");
      const src = competency.sources[r.source];
      return `<section class="item">
  <p class="q">${esc(r.label[lang])}</p>
  <p class="meta">${esc(t.skills)}: ${esc(r.skills[lang])} ${r.skillsFromSource ? "" : esc(t.skillsEditor)} — <a href="${esc(src.url)}">${esc(src.label)}</a></p>
  <ol>${qs}</ol>
</section>`;
    })
    .join("\n");
  return `<h2>${esc(t.competencyTitle)}</h2>
<p class="note">${esc(t.competencyNote)}</p>
<div class="box"><p class="q">${esc(star.title)}</p><p>${esc(star.lede)}</p><ol>${steps}</ol><p class="meta" style="margin-top:8px">${esc(star.tip)}</p>
<p class="src">${esc(t.sources)}: ${sourceList(competency.starSources)}</p></div>
${roles}
<p class="src">${esc(t.sources)}: ${sourceList(competency.sources)}</p>`;
}

function acronymsDoc(lang: Locale, siteUrl: string) {
  const t = copy[lang];
  const cats = Object.entries(acronyms.categories) as [string, (typeof acronyms.categories)[keyof typeof acronyms.categories]][];
  const toc = cats.map(([id, c]) => `<li><a href="#${id}">${esc(c[lang])}</a></li>`).join("");
  const sections = cats
    .map(([id, c]) => {
      const terms = acronyms.terms
        .filter((a) => a.c === id)
        .sort((a, b) => a.t.localeCompare(b.t))
        .map(
          (a) => `<section class="item">
  <p class="q">${esc(a.t)} <span class="full">— ${esc(a.f)}</span></p>
  <p>${esc(lang === "ko" ? a.ko : a.en)}</p>
  <p>${a.r.map((r) => `<span class="chip">${esc(roleName(r, lang))}</span>`).join("")}</p>
</section>`,
        )
        .join("\n");
      const src = c.sources.length ? `<p class="src">${esc(t.categorySources)}: ${sourceList(c.sources)}</p>` : "";
      const note = "editorNote" in c && c.editorNote ? `<p class="note">${esc(t.editorNote)}</p>` : "";
      return `<h2 id="${id}">${esc(c[lang])}</h2>${note}\n${terms}\n${src}`;
    })
    .join("\n");
  const a = t.acronyms;
  return page(lang, a.title, a.lede, `<h2>${esc(t.toc)}</h2><ul class="toc">${toc}</ul><p class="note">${esc(t.definitionsNote)}</p>\n${sections}`, siteUrl);
}

function markdownDoc(id: "trial-data-guide" | "cv-template", lang: Locale, siteUrl: string) {
  const t = copy[lang];
  const d = t[id];
  const intro =
    id === "cv-template"
      ? `<p><a class="btn" href="/api/resources/cv-template-file?lang=${lang}">${esc(t.downloadDocx)}</a></p>`
      : "";
  const body = readMarkdown(id === "cv-template" ? "cv-checklist" : id, lang);
  return page(lang, d.title, d.lede, `${intro}<div class="md">${body}</div>`, siteUrl);
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

/** The HTML document for a download id (Office-format ids are handled by downloadFile). */
export function renderDownload(id: DownloadId, lang: Locale, siteUrl: string) {
  switch (id) {
    case "glossary":
      return glossaryDoc(lang, siteUrl);
    case "acronyms":
      return acronymsDoc(lang, siteUrl);
    case "trial-data-guide":
    case "cv-template":
      return markdownDoc(id, lang, siteUrl);
    default:
      return interviewDoc(lang, siteUrl);
  }
}
