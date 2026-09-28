"use client";

import { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { Dictionary, Locale } from "@/lib/i18n";
import { tracks, waitlistFor } from "@/lib/tracks";
import { ResourceList } from "./ResourceList";
import { TrackTabs, type TrackTab } from "./TrackTabs";
import { WaitlistCard } from "./Waitlist";

/** Resources page body: reader-track tabs over the gated downloads, then the items on the waitlist. */
export function ResourceHub({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  const [tab, setTab] = useState<TrackTab>("all");
  const { track } = useAnalytics();
  const current = tab === "all" ? null : tracks.find((tr) => tr.id === tab)!;

  return (
    <>
      <TrackTabs
        active={tab}
        dict={dict}
        idPrefix="resources"
        onChange={(next) => {
          setTab(next);
          track("filter_select", { page: "resources", type: "track", value: next, lang });
        }}
      />
      <div role="tabpanel" id="resources-panel" aria-labelledby={`resources-tab-${tab}`} className="pt-6">
        {current && <p className="mb-6 max-w-2xl text-[15px] text-muted">{dict.tracks.items[current.id].lede}</p>}
        <ResourceList dict={dict} lang={lang} ids={current?.resources} />

        <h2 className="mt-12 text-sm font-bold text-ink">{dict.tracks.waitlistHeading}</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {waitlistFor(tab, lang).map((w) => (
            <WaitlistCard key={w.id} item={w} dict={dict} lang={lang} />
          ))}
        </div>
      </div>
    </>
  );
}
