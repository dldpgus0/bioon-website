"use client";

import Link from "next/link";
import { track, type AnalyticsEvent, type AnalyticsPayload } from "@/hooks/useAnalytics";

// A next/link that records an analytics event on click, for use inside server components
// (e.g. the header and hero "Subscribe" buttons).
export function TrackedLink({
  event,
  payload,
  ...props
}: React.ComponentProps<typeof Link> & { event: AnalyticsEvent; payload?: AnalyticsPayload }) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        track(event, payload);
        props.onClick?.(e);
      }}
    />
  );
}
