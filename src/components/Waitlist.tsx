"use client";

import { useRef } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { Dictionary } from "@/lib/i18n";
import type { WaitlistItem } from "@/lib/waitlist";
import { SubscribeForm } from "./SubscribeForm";

type Props = { item: Pick<WaitlistItem, "id" | "title">; dict: Dictionary; lang: string; className?: string };

/**
 * "Waitlist open" button that opens an email-capture modal. Sign-ups go through the normal
 * subscribe API with source "waitlist:<id>", so they land in Stibee and show up in analytics.
 * Uses the native <dialog>: focus trapping and Esc-to-close come from the browser.
 */
export function WaitlistButton({ item, dict, lang, className }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const { track } = useAnalytics();
  const t = dict.waitlist;
  const titleId = `waitlist-${item.id}`;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          ref.current?.showModal();
          track("waitlist_open", { item: item.id, lang });
        }}
        className={
          className ??
          "inline-flex items-center gap-1.5 rounded-full border border-teal bg-teal-soft px-3 py-1 text-xs font-bold text-teal transition-colors hover:bg-teal hover:text-on-brand"
        }
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
        {t.badge}
        <span className="sr-only"> — {item.title}</span>
      </button>

      <dialog
        ref={ref}
        aria-labelledby={titleId}
        // Clicking the backdrop (the dialog element itself, outside the panel) closes it.
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-line bg-surface p-0 text-text shadow-2xl backdrop:bg-black/50"
      >
        <div className="p-6">
          <p className="text-xs font-bold tracking-wide text-teal">{t.badge}</p>
          <h2 id={titleId} className="mt-2 text-lg font-bold text-ink">
            {item.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{t.lede}</p>
          <div className="mt-5">
            <SubscribeForm
              labels={{ ...dict.subscribe, submit: t.join, success: t.success }}
              lang={lang}
              source={`waitlist:${item.id}`}
            />
          </div>
          <button type="button" onClick={() => ref.current?.close()} className="mt-4 text-sm font-semibold text-muted hover:text-ink">
            {t.close}
          </button>
        </div>
      </dialog>
    </>
  );
}

/** A card for something not built yet: kind label, title, description and the waitlist button. */
export function WaitlistCard({ item, dict, lang }: { item: WaitlistItem; dict: Dictionary; lang: string }) {
  return (
    <article className="flex flex-col rounded-2xl border border-dashed border-line bg-surface-2 p-6">
      <p className="text-xs font-semibold text-muted">{dict.waitlist.kinds[item.kind]}</p>
      <h3 className="mt-2 font-bold text-ink">{item.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{item.body}</p>
      <div className="mt-4">
        <WaitlistButton item={item} dict={dict} lang={lang} />
      </div>
    </article>
  );
}
