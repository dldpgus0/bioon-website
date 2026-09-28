"use client";

import Link from "next/link";
import { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { Post } from "@/lib/content";
import type { Dictionary, Locale } from "@/lib/i18n";
import { tracks, waitlistFor } from "@/lib/tracks";
import { CareerList } from "./CareerList";
import { TrackTabs, type TrackTab } from "./TrackTabs";
import { WaitlistCard } from "./Waitlist";

/** Career page body: reader-track tabs over the post list, with each track's resources and upcoming items. */
export function CareerHub({ posts, dict, lang }: { posts: Post[]; dict: Dictionary; lang: Locale }) {
  const [tab, setTab] = useState<TrackTab>("all");
  const { track } = useAnalytics();
  const t = dict.tracks;
  const current = tab === "all" ? null : tracks.find((tr) => tr.id === tab)!;
  const shown = current ? current.posts.map((slug) => posts.find((p) => p.slug === slug)).filter((p): p is Post => !!p) : posts;
  const resources = current ? dict.resources.items.filter((r) => current.resources.includes(r.id)) : [];

  return (
    <>
      <TrackTabs
        active={tab}
        dict={dict}
        idPrefix="career"
        onChange={(next) => {
          setTab(next);
          track("filter_select", { page: "career", type: "track", value: next, lang });
        }}
      />
      <div role="tabpanel" id="career-panel" aria-labelledby={`career-tab-${tab}`} className="pt-6">
        {current && <p className="mb-6 max-w-2xl text-[15px] text-muted">{t.items[current.id].lede}</p>}

        {/* Remount per tab so the category filter resets */}
        <CareerList key={tab} posts={shown} dict={dict} lang={lang} />

        {current && (
          <>
            <h2 className="mt-10 text-sm font-bold text-ink">{t.resourcesHeading}</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {resources.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/${lang}/resources#${r.id}`}
                    className="inline-block rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink transition-colors hover:border-teal hover:text-teal"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-sm font-bold text-ink">{t.waitlistHeading}</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {waitlistFor(current.id, lang).map((w) => (
                <WaitlistCard key={w.id} item={w} dict={dict} lang={lang} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
