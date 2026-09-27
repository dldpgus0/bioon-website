"use client";

import { useState } from "react";

type Labels = {
  email: string;
  name: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
};

export function SubscribeForm({ labels, lang, compact = false }: { labels: Labels; lang: string; compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), name: form.get("name") ?? "", lang }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className="rounded-xl bg-teal-soft px-4 py-3 text-sm font-medium text-teal">{labels.success}</p>;
  }

  const input =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink placeholder:text-muted focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20";

  return (
    <form onSubmit={onSubmit} className={compact ? "flex flex-col gap-2 sm:flex-row" : "flex flex-col gap-3"}>
      <input
        name="name"
        type="text"
        required
        maxLength={50}
        placeholder={labels.name}
        autoComplete="name"
        className={compact ? `${input} sm:w-40 sm:shrink-0` : input}
      />
      <input name="email" type="email" required placeholder={labels.email} autoComplete="email" className={input} />
      <button
        type="submit"
        disabled={status === "loading"}
        className="shrink-0 rounded-xl bg-brand px-6 py-3 text-[15px] font-semibold text-on-brand transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "loading" ? labels.submitting : labels.submit}
      </button>
      {status === "error" && <p className="text-sm text-red-500">{labels.error}</p>}
    </form>
  );
}
