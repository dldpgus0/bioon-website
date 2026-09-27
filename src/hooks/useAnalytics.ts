"use client";

// Analytics skeleton. Events go to the console for now; when a GA4 (gtag) or Mixpanel snippet
// is added to the layout, the same calls are forwarded to it with no changes at call sites.
export type AnalyticsEvent =
  | "filter_select" // topic / role chips on the archive and interview bank
  | "search" // Ask BIO.ON query
  | "subscribe_click" // a link or button that leads to the subscribe form
  | "subscribe_submit" // any subscribe form submission, with its result
  | "lead_unlock" // a gated resource or tool was unlocked
  | "resource_download";

export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (command: "event", name: string, params?: AnalyticsPayload) => void;
    mixpanel?: { track: (name: string, props?: AnalyticsPayload) => void };
  }
}

export function track(event: AnalyticsEvent, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;
  const data = { ...payload, path: window.location.pathname };
  console.log(event, data);
  window.gtag?.("event", event, data);
  window.mixpanel?.track(event, data);
}

/** `track` is a module-level function, so its identity is stable across renders. */
export function useAnalytics() {
  return { track };
}
