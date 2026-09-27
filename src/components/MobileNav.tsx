"use client";

import Link from "next/link";
import { useState } from "react";
import { track } from "@/hooks/useAnalytics";

export function MobileNav({ label, links }: { label: string; links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={label}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <nav id="mobile-nav" aria-label={label} className="absolute inset-x-0 top-16 border-b border-line bg-bg px-4 pb-4 shadow-lg">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => {
                setOpen(false);
                if (l.href.endsWith("/subscribe")) track("subscribe_click", { location: "mobile_nav" });
              }}
              className="block border-b border-line py-3.5 text-base font-medium text-ink last:border-0"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
