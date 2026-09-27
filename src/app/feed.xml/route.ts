import { getIssues } from "@/lib/content";
import { topicLabel } from "@/lib/taxonomy";

// RSS 2.0 feed of the latest 10 issues, for Feedly, Slack's RSS app and similar readers.
//   /feed.xml          Korean edition
//   /feed.xml?lang=en  English edition
// The proxy skips paths with a file extension, so this isn't redirected to /ko/feed.xml.
const LIMIT = 10;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const channel = {
  ko: {
    title: "BIO:ON Insight — 바이오·제약 뉴스레터",
    description: "매주 화요일 아침, 지난주 글로벌 바이오·제약 핵심 뉴스 3개를 국내 시사점과 커리어 관점으로 정리해요.",
  },
  en: {
    title: "BIO:ON Insight — biotech & pharma newsletter",
    description: "Every Tuesday morning: last week's three biggest biotech and pharma stories, with the Korean market angle and what they mean for your career.",
  },
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lang = url.searchParams.get("lang") === "en" ? "en" : "ko";
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? url.origin;
  const self = `${site}/feed.xml${lang === "en" ? "?lang=en" : ""}`;
  const issues = getIssues(lang).slice(0, LIMIT);
  // Issues go out on Tuesday mornings, Korean time.
  const pubDate = (date: string) => new Date(`${date}T08:00:00+09:00`).toUTCString();

  const items = issues
    .map((issue) => {
      const link = `${site}/${lang}/insight/${issue.slug}`;
      const summary = issue.aiSummary.length ? issue.aiSummary : [issue.summary];
      const description = `<p>${esc(issue.summary)}</p><ul>${summary.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>`;
      return `    <item>
      <title>${esc(`#${issue.number} ${issue.title}`)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate(issue.date)}</pubDate>
${issue.topics.map((t) => `      <category>${esc(topicLabel(t, lang))}</category>`).join("\n")}
      <description><![CDATA[${description}]]></description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(channel[lang].title)}</title>
    <link>${site}/${lang}/insight</link>
    <description>${esc(channel[lang].description)}</description>
    <language>${lang === "en" ? "en" : "ko-KR"}</language>
    <atom:link href="${esc(self)}" rel="self" type="application/rss+xml" />
    ${issues[0] ? `<lastBuildDate>${pubDate(issues[0].date)}</lastBuildDate>` : ""}
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
