import waitlistData from "@/content/waitlist.json";
import type { Locale } from "./i18n";

// Items that aren't built yet (src/content/waitlist.json), shown as "Waitlist open" cards.
// Plain data, safe to import from client components.

export type WaitlistItem = { id: string; kind: "guide" | "tool" | "resource"; title: string; body: string };

type Raw = Record<string, { kind: WaitlistItem["kind"] } & Record<Locale, { title: string; body: string }>>;
const items = waitlistData.items as Raw;

export function waitlistItem(id: string, lang: Locale): WaitlistItem {
  const w = items[id];
  return { id, kind: w.kind, ...w[lang] };
}

/** Everything on the resources page: all items except the AI tools, which live on the tools page. */
export function resourceWaitlist(lang: Locale): WaitlistItem[] {
  return Object.keys(items)
    .filter((id) => !id.startsWith("ai-"))
    .map((id) => waitlistItem(id, lang));
}
