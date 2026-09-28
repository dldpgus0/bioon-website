"use client";

import { useEffect, useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { Issue } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n";
import { searchIssues } from "@/lib/search";
import { roleIds, roleLabel, topicIds, topicLabel, type RoleId, type TopicId } from "@/lib/taxonomy";
import { categoryIds, categoryLabel, type CategoryId } from "@/lib/wiki";
import type { Locale } from "@/lib/i18n";
import { IssueCard } from "./IssueCard";

export function IssueGrid({ issues, dict, lang }: { issues: Issue[]; dict: Dictionary; lang: string }) {
  const [cat, setCat] = useState<CategoryId | null>(null);
  const [topic, setTopic] = useState<TopicId | null>(null);
  const [role, setRole] = useState<RoleId | null>(null);
  const [query, setQuery] = useState("");
  const { track } = useAnalytics();

  // ?q= makes a search shareable. Read after mount so the archive itself stays prerendered.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL is only known in the browser
    if (q) setQuery(q);
  }, []);
  const ask = (q: string) => {
    setQuery(q);
    const url = new URL(window.location.href);
    if (q.trim()) url.searchParams.set("q", q);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
  };

  const filtered = issues.filter(
    (i) => (!cat || i.categories.includes(cat)) && (!topic || i.topics.includes(topic)) && (!role || i.roles.includes(role)),
  );
  const searching = query.trim().length > 0;
  const hits = searching ? searchIssues(filtered, query, lang) : filtered.map((issue) => ({ issue, line: null }));
  const shown = hits.map((h) => h.issue);
  // Example questions from the three latest issues.
  const suggestions = issues.slice(0, 3).flatMap((i) => i.questions.slice(0, 1));
  // Only offer filters that match at least one issue.
  const topics = topicIds.filter((t) => issues.some((i) => i.topics.includes(t)));
  const roles = roleIds.filter((r) => issues.some((i) => i.roles.includes(r)));

  const pickCat = (c: CategoryId | null) => {
    setCat(c);
    track("filter_select", { page: "insight", type: "category", value: c ?? "all", label: c ? categoryLabel(c, lang as Locale) : "all", lang });
  };
  const pickTopic = (t: TopicId | null) => {
    setTopic(t);
    track("filter_select", { page: "insight", type: "topic", value: t ?? "all", label: t ? topicLabel(t, lang) : "all", lang });
  };
  const pickRole = (r: RoleId | null) => {
    setRole(r);
    track("filter_select", { page: "insight", type: "role", value: r ?? "all", label: r ? roleLabel(r, lang) : "all", lang });
  };

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
      active ? "border-teal bg-teal text-white" : "border-line bg-surface text-muted hover:border-teal hover:text-teal"
    }`;

  return (
    <>
      <section role="search" aria-label={dict.insight.askTitle} className="mb-10 rounded-2xl border border-teal/30 bg-teal-soft/50 p-6">
        <h2 className="text-lg font-bold text-ink">{dict.insight.askTitle}</h2>
        <p className="mt-1 text-sm text-muted">{dict.insight.askLede}</p>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const q = String(new FormData(e.currentTarget).get("q") ?? "");
            ask(q);
            if (q.trim()) track("search", { query: q, results: searchIssues(filtered, q, lang).length, lang });
          }}
        >
          <input
            name="q"
            type="text"
            enterKeyHint="search"
            value={query}
            onChange={(e) => ask(e.target.value)}
            placeholder={dict.insight.askPlaceholder}
            aria-label={dict.insight.askTitle}
            className="min-w-0 flex-1 rounded-full border border-line bg-surface px-4 py-2.5 text-[15px] text-ink outline-none focus:border-teal"
          />
          {searching && (
            <button type="button" onClick={() => ask("")} className="shrink-0 text-sm font-semibold text-teal hover:underline">
              {dict.insight.askClear}
            </button>
          )}
        </form>
        {!searching && suggestions.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted">{dict.insight.askTry}</span>
            {suggestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  ask(q);
                  track("search", { query: q, suggested: true, lang });
                }}
                className="rounded-full border border-line bg-surface px-3 py-1 text-left text-ink transition-colors hover:border-teal hover:text-teal"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </section>

      <aside aria-label={dict.insight.filtersLabel} className="space-y-4">
        <div role="group" aria-labelledby="filter-cats" className="flex flex-wrap items-center gap-2">
          <span id="filter-cats" className="mr-1 w-20 text-xs font-semibold uppercase tracking-wider text-ink">
            {dict.wiki.categoryFilter}
          </span>
          <button type="button" onClick={() => pickCat(null)} aria-pressed={cat === null} className={chip(cat === null)}>
            {dict.insight.all}
          </button>
          {categoryIds.map((c) => (
            <button key={c} type="button" onClick={() => pickCat(c === cat ? null : c)} aria-pressed={c === cat} className={chip(c === cat)}>
              {categoryLabel(c, lang as Locale)}
            </button>
          ))}
        </div>
        <div role="group" aria-labelledby="filter-topics" className="flex flex-wrap items-center gap-2">
          <span id="filter-topics" className="mr-1 w-20 text-xs font-semibold uppercase tracking-wider text-ink">
            {dict.insight.topicsLabel}
          </span>
          <button type="button" onClick={() => pickTopic(null)} aria-pressed={topic === null} className={chip(topic === null)}>
            {dict.insight.all}
          </button>
          {topics.map((t) => (
            <button key={t} type="button" onClick={() => pickTopic(t === topic ? null : t)} aria-pressed={t === topic} className={chip(t === topic)}>
              {topicLabel(t, lang)}
            </button>
          ))}
        </div>
        <div role="group" aria-labelledby="filter-roles" className="flex flex-wrap items-center gap-2">
          <span id="filter-roles" className="mr-1 w-20 text-xs font-semibold uppercase tracking-wider text-ink">
            {dict.insight.rolesLabel}
          </span>
          <button type="button" onClick={() => pickRole(null)} aria-pressed={role === null} className={chip(role === null)}>
            {dict.insight.all}
          </button>
          {roles.map((r) => (
            <button key={r} type="button" onClick={() => pickRole(r === role ? null : r)} aria-pressed={r === role} className={chip(r === role)}>
              {roleLabel(r, lang)}
            </button>
          ))}
        </div>
      </aside>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        {shown.length}
        {searching ? dict.insight.askResults : dict.insight.count}
        {(cat || topic || role) && (
          <button
            type="button"
            onClick={() => {
              setCat(null);
              setTopic(null);
              setRole(null);
            }}
            className="ml-3 font-semibold text-teal hover:underline"
          >
            {dict.insight.clear}
          </button>
        )}
      </p>

      <section aria-label={dict.insight.resultsLabel} className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {hits.map(({ issue, line }) => (
          <IssueCard key={issue.slug} issue={issue} dict={dict} match={line} />
        ))}
      </section>
      {shown.length === 0 && <p className="mt-8 text-muted">{searching ? dict.insight.askEmpty : dict.insight.empty}</p>}
    </>
  );
}
