import Link from "next/link";
import type { Issue } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n";

export function formatDate(date: string, lang: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function IssueCard({ issue, dict }: { issue: Issue; dict: Dictionary }) {
  return (
    <Link
      href={`/${issue.lang}/insight/${issue.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-teal hover:shadow-[0_8px_30px_-12px_rgba(25,127,131,0.35)]"
    >
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-teal">
          {issue.lang === "ko" ? `#${issue.number}${dict.insight.issue}` : `${dict.insight.issue} #${issue.number}`}
        </span>
        <time className="text-muted" dateTime={issue.date}>{formatDate(issue.date, issue.lang)}</time>
      </div>
      <h3 className="mt-3 text-lg font-bold leading-snug text-ink group-hover:text-brand">{issue.title}</h3>
      {/* line-clamp breaks if the clamped element itself stretches, so the wrapper takes flex-1 */}
      <div className="flex-1">
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{issue.summary}</p>
      </div>
      {issue.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {issue.tags.map((t) => (
            <span key={t} className="rounded-full bg-teal-soft px-2.5 py-1 text-xs font-medium text-teal">
              {t}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
