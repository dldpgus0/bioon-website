import tracksData from "@/content/tracks.json";
import type { Locale } from "./i18n";

// Reader tracks (students · job seekers · professionals) shared by the Career and Resources pages.
// Plain data, safe to import from client components.

export type TrackId = "students" | "seekers" | "pros";
export type Track = { id: TrackId; posts: string[]; resources: string[]; waitlist: string[] };
export type WaitlistItem = { id: string; kind: "guide" | "tool" | "resource"; title: string; body: string };

type RawWaitlist = Record<string, { kind: WaitlistItem["kind"] } & Record<Locale, { title: string; body: string }>>;

export const tracks = tracksData.tracks as Track[];
const waitlistData = tracksData.waitlist as RawWaitlist;

export function waitlistItem(id: string, lang: Locale): WaitlistItem {
  const w = waitlistData[id];
  return { id, kind: w.kind, ...w[lang] };
}

/** Waitlist items for one track, or every one (in track order, no repeats) for "all". */
export function waitlistFor(track: TrackId | "all", lang: Locale): WaitlistItem[] {
  const ids = track === "all" ? tracks.flatMap((t) => t.waitlist) : tracks.find((t) => t.id === track)!.waitlist;
  return [...new Set(ids)].map((id) => waitlistItem(id, lang));
}
