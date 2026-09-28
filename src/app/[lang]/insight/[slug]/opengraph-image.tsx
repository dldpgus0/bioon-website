import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getIssue } from "@/lib/content";
import { hasLocale } from "@/lib/i18n";

// Share card for LinkedIn and other link previews: issue number, date, title and summary on the brand blue.
export const alt = "BIO:ON Insight";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Pretendard (OFL) from the npm package, so Korean titles render instead of empty boxes.
const fontDir = join(process.cwd(), "node_modules/pretendard/dist/public/static");

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const issue = hasLocale(lang) ? getIssue(lang, slug) : undefined;
  const [bold, regular] = await Promise.all([
    readFile(join(fontDir, "Pretendard-Bold.otf")),
    readFile(join(fontDir, "Pretendard-Regular.otf")),
  ]);
  const title = issue?.title ?? "BIO:ON Insight";
  const summary = issue?.summary ?? "";
  const meta = issue ? `BIO:ON Insight #${issue.number} · ${issue.date.replaceAll("-", ".")}` : "BIO:ON Insight";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1A5688",
          padding: "64px 72px",
          fontFamily: "Pretendard",
          color: "#ffffff",
          wordBreak: "keep-all",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: "#7FD2D5", letterSpacing: 2 }}>{meta}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: title.length > 40 ? 52 : 62, fontWeight: 700, lineHeight: 1.25 }}>{title}</div>
          {summary && (
            <div style={{ display: "flex", marginTop: 24, fontSize: 26, lineHeight: 1.5, color: "#BFE3E4" }}>
              {summary.length > 110 ? `${summary.slice(0, 110)}…` : summary}
            </div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#BFE3E4" }}>
          <span>{lang === "en" ? "Biotech & pharma news, turned into career insight" : "바이오·제약 뉴스를 커리어 인사이트로"}</span>
          <span style={{ fontWeight: 700, color: "#ffffff" }}>BIO:ON</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pretendard", data: bold, weight: 700, style: "normal" },
        { name: "Pretendard", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
