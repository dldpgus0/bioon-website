"use client";

import { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLead } from "@/hooks/useLead";
import type { Dictionary } from "@/lib/i18n";
import { SubscribeForm } from "./SubscribeForm";

// Resources behind the email gate: free items open after a sign-up (the subscribe API sets
// the unlock cookie, and /api/resources/[id] checks it); paid items are still "coming soon".
// `ids` limits and orders the list (a reader track); without it every item is shown.
export function ResourceList({ dict, lang, ids }: { dict: Dictionary; lang: string; ids?: string[] }) {
  const t = dict.resources;
  const { unlocked, unlock } = useLead();
  const { track } = useAnalytics();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {(ids ? ids.map((id) => t.items.find((i) => i.id === id)).filter((i) => !!i) : t.items).map((item) => {
        const free = item.type === "free";
        const headingId = `resource-${item.id}`;
        // Excel downloads straight away; web pages (and the CV page with its Word file) open in a new tab.
        const isFile = item.format === "xlsx";
        return (
          <article key={item.id} id={item.id} aria-labelledby={headingId} className="flex flex-col rounded-2xl border border-line bg-surface p-6">
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${free ? "bg-teal-soft text-teal" : "bg-brand-soft text-brand"}`}>
                {free ? t.free : t.paid}
              </span>
              {!free && <span className="text-xs font-medium text-muted">{t.comingSoon}</span>}
              {free && unlocked && <span className="text-xs font-medium text-teal">✓ {t.unlocked}</span>}
            </div>
            <h2 id={headingId} className="mt-4 text-lg font-bold text-ink">
              {item.title}
            </h2>
            <p className="mt-1 text-xs font-medium text-muted">{t.formats[item.format as keyof typeof t.formats]}</p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{item.body}</p>

            {!free ? (
              <p className="mt-5 rounded-xl border border-line py-2.5 text-center text-sm font-semibold text-muted">{t.comingSoon}</p>
            ) : unlocked ? (
              <a
                href={`/api/resources/${item.id}?lang=${lang}`}
                {...(isFile ? { download: "" } : { target: "_blank", rel: "noopener" })}
                onClick={() => track("resource_download", { resource: item.id, lang })}
                className="mt-5 rounded-xl bg-brand py-2.5 text-center text-sm font-semibold text-white hover:opacity-90"
              >
                {isFile ? t.downloadFile : t.download}
                {!isFile && <span className="sr-only"> ({dict.a11y.newTab})</span>}
              </a>
            ) : open === item.id ? (
              <div className="mt-5">
                <p className="mb-2 text-sm font-semibold text-ink">{t.unlockTitle}</p>
                <SubscribeForm
                  labels={{ ...dict.subscribe, submit: t.getFree }}
                  lang={lang}
                  source={`resource:${item.id}`}
                  note={t.consent}
                  onSuccess={() => {
                    unlock();
                    track("lead_unlock", { source: `resource:${item.id}`, lang });
                  }}
                />
                <button type="button" onClick={() => setOpen(null)} className="mt-2 text-xs font-semibold text-muted hover:text-ink">
                  {t.cancel}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setOpen(item.id)}
                className="mt-5 rounded-xl border border-brand py-2.5 text-center text-sm font-semibold text-brand hover:bg-brand-soft"
              >
                {t.getFree}
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}
