"use client";

import { useState } from "react";
import type { Issue } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n";
import { roleIds, roleLabel, topicIds, topicLabel, type RoleId, type TopicId } from "@/lib/taxonomy";
import { IssueCard } from "./IssueCard";

export function IssueGrid({ issues, dict, lang }: { issues: Issue[]; dict: Dictionary; lang: string }) {
  const [topic, setTopic] = useState<TopicId | null>(null);
  const [role, setRole] = useState<RoleId | null>(null);

  const shown = issues.filter((i) => (!topic || i.topics.includes(topic)) && (!role || i.roles.includes(role)));
  // Only offer filters that match at least one issue.
  const topics = topicIds.filter((t) => issues.some((i) => i.topics.includes(t)));
  const roles = roleIds.filter((r) => issues.some((i) => i.roles.includes(r)));

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
      active ? "border-teal bg-teal text-white" : "border-line bg-white text-muted hover:border-teal hover:text-teal"
    }`;

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 w-20 text-xs font-semibold uppercase tracking-wider text-ink">{dict.insight.topicsLabel}</span>
          <button type="button" onClick={() => setTopic(null)} className={chip(topic === null)}>
            {dict.insight.all}
          </button>
          {topics.map((t) => (
            <button key={t} type="button" onClick={() => setTopic(t === topic ? null : t)} className={chip(t === topic)}>
              {topicLabel(t, lang)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 w-20 text-xs font-semibold uppercase tracking-wider text-ink">{dict.insight.rolesLabel}</span>
          <button type="button" onClick={() => setRole(null)} className={chip(role === null)}>
            {dict.insight.all}
          </button>
          {roles.map((r) => (
            <button key={r} type="button" onClick={() => setRole(r === role ? null : r)} className={chip(r === role)}>
              {roleLabel(r, lang)}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted">
        {shown.length}
        {dict.insight.count}
        {(topic || role) && (
          <button
            type="button"
            onClick={() => {
              setTopic(null);
              setRole(null);
            }}
            className="ml-3 font-semibold text-teal hover:underline"
          >
            {dict.insight.clear}
          </button>
        )}
      </p>

      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((issue) => (
          <IssueCard key={issue.slug} issue={issue} dict={dict} />
        ))}
      </div>
      {shown.length === 0 && <p className="mt-8 text-muted">{dict.insight.empty}</p>}
    </>
  );
}
