"use client";

import { useRef } from "react";
import type { Dictionary } from "@/lib/i18n";
import { tracks, type TrackId } from "@/lib/tracks";

export type TrackTab = TrackId | "all";

/** Accessible tab row (arrow keys move between tabs) for the three reader tracks plus "All". */
export function TrackTabs({
  active,
  onChange,
  dict,
  idPrefix,
}: {
  active: TrackTab;
  onChange: (tab: TrackTab) => void;
  dict: Dictionary;
  idPrefix: string;
}) {
  const t = dict.tracks;
  const tabs: TrackTab[] = ["all", ...tracks.map((tr) => tr.id)];
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (i + step + tabs.length) % tabs.length;
    refs.current[next]?.focus();
    onChange(tabs[next]);
  }

  return (
    <div role="tablist" aria-label={t.label} className="flex gap-1 overflow-x-auto border-b border-line">
      {tabs.map((tab, i) => {
        const selected = tab === active;
        return (
          <button
            key={tab}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${tab}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`-mb-px shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              selected ? "border-brand text-brand" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {tab === "all" ? t.all : t.items[tab].name}
          </button>
        );
      })}
    </div>
  );
}
