"use client";

import Link from "next/link";
import { useState } from "react";
import type { Post } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n";
import { formatDate } from "./IssueCard";

type Category = keyof Dictionary["career"]["categories"];

export function CareerList({ posts, dict, lang }: { posts: Post[]; dict: Dictionary; lang: string }) {
  const [cat, setCat] = useState<Category>("all");
  const cats = Object.keys(dict.career.categories) as Category[];
  const shown = cat === "all" ? posts : posts.filter((p) => p.category === cat);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              c === cat ? "border-teal bg-teal text-on-brand" : "border-line bg-surface text-muted hover:border-teal hover:text-teal"
            }`}
          >
            {dict.career.categories[c]}
          </button>
        ))}
      </div>

      <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-surface">
        {shown.map((p) => (
          <Link key={p.slug} href={`/${lang}/career/${p.slug}`} className="group block p-6 transition-colors hover:bg-surface-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="text-teal">{dict.career.categories[p.category]}</span>
              <span className="text-muted">· {formatDate(p.date, lang)}</span>
              {p.sample && (
                <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-muted">{dict.career.sample}</span>
              )}
            </div>
            <h3 className="mt-2 text-lg font-bold text-ink group-hover:text-brand">{p.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.summary}</p>
            {p.roles.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.roles.map((r) => (
                  <span key={r} className="rounded-md bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand">{r}</span>
                ))}
              </div>
            )}
          </Link>
        ))}
        {shown.length === 0 && <p className="p-6 text-muted">{dict.career.empty}</p>}
      </div>
    </>
  );
}
