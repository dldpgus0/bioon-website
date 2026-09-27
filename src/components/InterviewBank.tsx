"use client";

import Link from "next/link";
import { useState } from "react";
import type { InterviewQuestion } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n";
import { roleIds, roleLabel, type RoleId } from "@/lib/taxonomy";

const PRACTICE_SIZE = 5;

function pickRandom<T>(items: T[], n: number) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

export function InterviewBank({ questions, dict, lang }: { questions: InterviewQuestion[]; dict: Dictionary; lang: string }) {
  const t = dict.career.interview;
  const [role, setRole] = useState<RoleId | null>(null);
  // Question ids picked for practice mode; null shows the whole (filtered) bank.
  const [practice, setPractice] = useState<string[] | null>(null);

  const forRole = questions.filter((q) => !role || q.roles.includes(role));
  const shown = practice ? practice.map((id) => questions.find((q) => q.id === id)!) : forRole;
  const roles = roleIds.filter((r) => questions.some((q) => q.roles.includes(r)));

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
      active ? "border-teal bg-teal text-white" : "border-line bg-white text-muted hover:border-teal hover:text-teal"
    }`;
  const selectRole = (r: RoleId | null) => {
    setRole(r);
    setPractice(null);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-ink">{t.rolesLabel}</span>
        <button type="button" onClick={() => selectRole(null)} className={chip(role === null)}>
          {t.allRoles}
        </button>
        {roles.map((r) => (
          <button key={r} type="button" onClick={() => selectRole(r === role ? null : r)} className={chip(r === role)}>
            {roleLabel(r, lang)}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {shown.length}
          {t.count}
        </p>
        <div className="flex gap-2">
          {practice && (
            <button type="button" onClick={() => setPractice(null)} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-teal">
              {t.practiceAll}
            </button>
          )}
          <button
            type="button"
            onClick={() => setPractice(pickRandom(forRole, PRACTICE_SIZE).map((q) => q.id))}
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
          >
            {t.practice}
          </button>
        </div>
      </div>
      {practice && <p className="mt-4 rounded-xl bg-teal-soft px-4 py-3 text-sm text-ink">{t.practiceOn}</p>}

      <ol className="mt-6 space-y-4">
        {shown.map((q, i) => (
          <li key={q.id} className="rounded-2xl border border-line bg-surface p-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="text-teal">Q{i + 1}</span>
              <span className="rounded-full bg-teal-soft px-2.5 py-1 text-teal">{t.kinds[q.kind]}</span>
              {q.roles.map((r) => (
                <span key={r} className="rounded-md bg-white px-2 py-0.5 font-medium text-brand">
                  {roleLabel(r, lang)}
                </span>
              ))}
            </div>
            <h2 className="mt-3 text-lg font-bold leading-snug text-ink">{q.q}</h2>
            <details className="group mt-4">
              <summary className="cursor-pointer list-none text-sm font-semibold text-teal hover:underline">
                <span className="group-open:hidden">▸ </span>
                <span className="hidden group-open:inline">▾ </span>
                {t.show}
              </summary>
              <div className="mt-4 space-y-4 border-l-2 border-teal pl-4 text-[15px] leading-relaxed text-text">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">{t.why}</p>
                  <p className="mt-1">{q.why}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">{t.points}</p>
                  <ol className="mt-1 list-decimal space-y-1 pl-5">
                    {q.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ol>
                </div>
                {q.issue && (
                  <p className="text-sm text-muted">
                    {t.source}:{" "}
                    <Link href={`/${lang}/insight/${q.issue.slug}`} className="font-semibold text-brand hover:underline">
                      {lang === "ko" ? `#${q.issue.number}${t.issue}` : `${t.issue} #${q.issue.number}`} · {q.issue.title} →
                    </Link>
                  </p>
                )}
              </div>
            </details>
          </li>
        ))}
      </ol>
      <p className="mt-8 text-xs text-muted">{t.note}</p>
    </>
  );
}
