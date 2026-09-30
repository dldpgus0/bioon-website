"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLead } from "@/hooks/useLead";
import type { InterviewQuestion } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n";
import { roleIds, roleLabel, type RoleId } from "@/lib/taxonomy";
import { SubscribeForm } from "./SubscribeForm";

const PRACTICE_SIZE = 5;

type Answer = { why: string; points: string[] };

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
  const { track } = useAnalytics();
  const { unlocked, unlock } = useLead();
  const [role, setRole] = useState<RoleId | null>(null);
  // Question ids picked for practice mode; null shows the whole (filtered) bank.
  const [practice, setPractice] = useState<string[] | null>(null);
  // Answers for the gated questions, fetched once the reader has unlocked.
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  useEffect(() => {
    if (!unlocked) return;
    fetch(`/api/interview-points?lang=${lang}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setAnswers(d.points))
      .catch(() => {});
  }, [unlocked, lang]);

  const forRole = questions.filter((q) => !role || q.roles.includes(role));
  const shown = practice ? practice.map((id) => questions.find((q) => q.id === id)!) : forRole;
  const roles = roleIds.filter((r) => questions.some((q) => q.roles.includes(r)));

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
      active ? "border-teal bg-teal text-white" : "border-line bg-surface text-muted hover:border-teal hover:text-teal"
    }`;
  const selectRole = (r: RoleId | null) => {
    setRole(r);
    setPractice(null);
    track("filter_select", { page: "interview", type: "role", value: r ?? "all", label: r ? roleLabel(r, lang) : "all", lang });
  };

  return (
    <>
      <aside aria-label={t.filtersLabel}>
        <div role="group" aria-labelledby="interview-role-label" className="flex flex-wrap items-center gap-2">
          <span id="interview-role-label" className="mr-1 text-xs font-semibold uppercase tracking-wider text-ink">
            {t.rolesLabel}
          </span>
          <button type="button" onClick={() => selectRole(null)} aria-pressed={role === null} className={chip(role === null)}>
            {t.allRoles}
          </button>
          {roles.map((r) => (
            <button key={r} type="button" onClick={() => selectRole(r === role ? null : r)} aria-pressed={r === role} className={chip(r === role)}>
              {roleLabel(r, lang)}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted" aria-live="polite">
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
              onClick={() => {
                setPractice(pickRandom(forRole, PRACTICE_SIZE).map((q) => q.id));
                track("filter_select", { page: "interview", type: "practice", value: role ?? "all" });
              }}
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90"
            >
              {t.practice}
            </button>
          </div>
        </div>
        {practice && <p className="mt-4 rounded-xl bg-teal-soft px-4 py-3 text-sm text-ink">{t.practiceOn}</p>}
        <p className="mt-4 text-xs text-muted">
          {unlocked ? (
            <a href={`/api/resources/interview-questions?lang=${lang}`} target="_blank" rel="noopener" className="font-semibold text-brand hover:underline">
              {t.download}<span aria-hidden> →</span><span className="sr-only"> ({dict.a11y.newTab})</span>
            </a>
          ) : (
            t.freeNote
          )}
        </p>
      </aside>

      <ol className="mt-6 space-y-4">
        {shown.map((q, i) => {
          const answer: Answer | undefined = q.locked ? answers[q.id] : { why: q.why, points: q.points };
          return (
            <li key={q.id}>
              <article aria-labelledby={`q-${q.id}`} className="rounded-2xl border border-line bg-surface p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="text-teal">Q{i + 1}</span>
                  <span className="rounded-full bg-teal-soft px-2.5 py-1 text-teal">{t.kinds[q.kind]}</span>
                  {q.roles.map((r) => (
                    <span key={r} className="rounded-md bg-surface px-2 py-0.5 font-medium text-brand">
                      {roleLabel(r, lang)}
                    </span>
                  ))}
                </div>
                <h2 id={`q-${q.id}`} className="mt-3 text-lg font-bold leading-snug text-ink">
                  {q.q}
                </h2>
                <details className="group mt-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-teal hover:underline">
                    <span aria-hidden className="group-open:hidden">▸ </span>
                    <span aria-hidden className="hidden group-open:inline">▾ </span>
                    {answer ? t.show : t.lockedShow}
                  </summary>
                  {answer ? (
                    <div className="mt-4 space-y-4 border-l-2 border-teal pl-4 text-[15px] leading-relaxed text-text">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wide text-muted">{t.why}</h3>
                        <p className="mt-1">{answer.why}</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wide text-muted">{t.points}</h3>
                        <ol className="mt-1 list-decimal space-y-1 pl-5">
                          {answer.points.map((p) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ol>
                      </div>
                      {q.issue && (
                        <p className="text-sm text-muted">
                          {t.source}:{" "}
                          <Link href={`/${lang}/insight/${q.issue.slug}`} className="font-semibold text-brand hover:underline">
                            {lang === "ko" ? `#${q.issue.number}${t.issue}` : `${t.issue} #${q.issue.number}`} · {q.issue.title}
                            <span aria-hidden> →</span>
                          </Link>
                        </p>
                      )}
                    </div>
                  ) : unlocked ? (
                    <p className="mt-4 text-sm text-muted" aria-live="polite">…</p>
                  ) : (
                    <div className="mt-4 rounded-xl border border-line bg-surface p-4">
                      <p className="text-sm font-semibold text-ink">{t.lockedTitle}</p>
                      <p className="mb-3 mt-1 text-sm text-muted">{t.lockedBody}</p>
                      <SubscribeForm
                        labels={{ ...dict.subscribe, submit: t.lockedShow.replace("🔒 ", "") }}
                        lang={lang}
                        compact
                        source="tool:interview-bank"
                        note={dict.resources.consent}
                        onSuccess={() => {
                          unlock();
                          track("lead_unlock", { source: "tool:interview-bank", lang });
                        }}
                      />
                    </div>
                  )}
                </details>
              </article>
            </li>
          );
        })}
      </ol>
      <p className="mt-8 text-xs text-muted">{t.note}</p>
    </>
  );
}
