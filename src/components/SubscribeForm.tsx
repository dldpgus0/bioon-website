"use client";

import { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";

type Labels = {
  email: string;
  name: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
};

/**
 * Newsletter sign-up. Also used as the lead-magnet gate: pass `source` (e.g. "resource:glossary"),
 * a consent `note`, and `onSuccess` to unlock the gated content instead of showing the thank-you.
 */
export function SubscribeForm({
  labels,
  lang,
  compact = false,
  source = "subscribe",
  note,
  onSuccess,
}: {
  labels: Labels;
  lang: string;
  compact?: boolean;
  source?: string;
  note?: string;
  onSuccess?: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const { track } = useAnalytics();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    let ok = false;
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), name: form.get("name") ?? "", lang, source }),
      });
      ok = res.ok;
    } catch {}
    track("subscribe_submit", { source, lang, status: ok ? "success" : "error" });
    setStatus(ok ? "done" : "error");
    if (ok) onSuccess?.();
  }

  if (status === "done" && !onSuccess) {
    return (
      <p role="status" className="rounded-xl bg-teal-soft px-4 py-3 text-sm font-medium text-teal">
        {labels.success}
      </p>
    );
  }

  const input =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink placeholder:text-muted focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20";

  return (
    <form onSubmit={onSubmit}>
      <div className={compact ? "flex flex-col gap-2 sm:flex-row" : "flex flex-col gap-3"}>
        {/* The placeholders are the only visible labels, so each input carries an aria-label. */}
        <input
          name="name"
          type="text"
          required
          maxLength={50}
          placeholder={labels.name}
          aria-label={labels.name}
          autoComplete="name"
          className={compact ? `${input} sm:w-40 sm:shrink-0` : input}
        />
        <input name="email" type="email" required placeholder={labels.email} aria-label={labels.email} autoComplete="email" className={input} />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-xl bg-brand px-6 py-3 text-[15px] font-semibold text-on-brand transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === "loading" ? labels.submitting : labels.submit}
        </button>
      </div>
      {note && <p className="mt-2 text-xs leading-relaxed text-muted">{note}</p>}
      {status === "error" && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {labels.error}
        </p>
      )}
    </form>
  );
}
