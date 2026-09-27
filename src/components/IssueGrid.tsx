"use client";

import { useMemo, useState } from "react";
import type { Issue } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n";
import { IssueCard } from "./IssueCard";

export function IssueGrid({ issues, dict }: { issues: Issue[]; dict: Dictionary }) {
  const [tag, setTag] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const tags = useMemo(() => [...new Set(issues.flatMap((i) => i.tags))], [issues]);
  // Tags are free-form per issue for now (AI normalization comes in phase 3), so collapse the long tail.
  const visibleTags = expanded ? tags : tags.slice(0, 10);
  const shown = tag ? issues.filter((i) => i.tags.includes(tag)) : issues;

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
      active ? "border-teal bg-teal text-on-brand" : "border-line bg-surface text-muted hover:border-teal hover:text-teal"
    }`;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setTag(null)} className={chip(tag === null)}>
          {dict.insight.all} <span className="opacity-70">{issues.length}</span>
        </button>
        {visibleTags.map((t) => (
          <button key={t} type="button" onClick={() => setTag(t === tag ? null : t)} className={chip(t === tag)}>
            {t}
          </button>
        ))}
        {tags.length > 10 && (
          <button type="button" onClick={() => setExpanded((e) => !e)} className="px-2 py-1.5 text-sm font-semibold text-teal hover:underline">
            {expanded ? dict.insight.lessTags : `${dict.insight.moreTags} +${tags.length - 10}`}
          </button>
        )}
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((issue) => (
          <IssueCard key={issue.slug} issue={issue} dict={dict} />
        ))}
      </div>
      {shown.length === 0 && <p className="mt-8 text-muted">{dict.insight.empty}</p>}
    </>
  );
}
