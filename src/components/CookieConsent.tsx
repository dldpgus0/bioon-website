"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import Link from "next/link";
import { useSyncExternalStore } from "react";

// Analytics consent. Google Analytics only loads after the visitor clicks "Accept"
// (UK/EU rules: GA sends data to Google, so it isn't covered by the UK's analytics exemption).
// The choice lives in localStorage; the footer's "Cookie settings" clears it to ask again.

type Choice = "granted" | "denied" | null;
const KEY = "bioon_analytics_consent";
const EVENT = "bioon-consent";

function read(): Choice {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function write(v: Choice) {
  try {
    if (v) localStorage.setItem(KEY, v);
    else localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

// On the server (and during hydration) render nothing: no banner flash, no GA.
const useChoice = () => useSyncExternalStore(subscribe, read, () => "pending" as const);

type Labels = { text: string; accept: string; decline: string; more: string };

export function CookieConsent({ gaId, labels, moreHref }: { gaId?: string; labels: Labels; moreHref: string }) {
  const choice = useChoice();
  if (!gaId || choice === "pending") return null;
  if (choice === "granted") return <GoogleAnalytics gaId={gaId} />;
  if (choice === "denied") return null;

  return (
    <div
      role="region"
      aria-label={labels.text}
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-2xl border border-line bg-surface p-5 shadow-2xl"
    >
      <p className="text-sm leading-relaxed text-text">
        {labels.text}{" "}
        <Link href={moreHref} className="font-semibold text-teal underline underline-offset-2">
          {labels.more}
        </Link>
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => write("granted")}
          className="rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-on-brand hover:opacity-90"
        >
          {labels.accept}
        </button>
        <button
          type="button"
          onClick={() => write("denied")}
          className="rounded-xl border border-line px-5 py-2 text-sm font-semibold text-ink hover:bg-surface-2"
        >
          {labels.decline}
        </button>
      </div>
    </div>
  );
}

/** Footer link that clears the choice so the banner asks again. Reloads if GA was already running. */
export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        const wasGranted = read() === "granted";
        write(null);
        if (wasGranted) window.location.reload();
      }}
      className="text-left hover:text-ink"
    >
      {label}
    </button>
  );
}
