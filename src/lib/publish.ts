// Scheduled publishing. Content can be added to the site ahead of its send or post time: lists,
// the home page and the sitemap leave it out until that time, then show it on their next
// regeneration (`export const revalidate` on those routes, at most 10 minutes late).
// Detail pages are prerendered from the start, so they work the moment a list links to them.

/** Milliseconds since the epoch at hh:mm on `date` (YYYY-MM-DD) in `timeZone`. */
export function wallClock(date: string, time: string, timeZone: string) {
  const guess = Date.parse(`${date}T${time}:00Z`);
  // Read that instant back in the zone; the difference is the zone's UTC offset on that day.
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
      .formatToParts(guess)
      .map((p) => [p.type, p.value]),
  );
  const local = Date.parse(`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:00Z`);
  return guess - (local - guess);
}

/** True once `at` (ms since the epoch, or an ISO string with an offset) has passed. */
export function isLive(at: number | string | undefined) {
  if (at === undefined) return true;
  const t = typeof at === "number" ? at : Date.parse(at);
  return Number.isNaN(t) || t <= Date.now();
}
