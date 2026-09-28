"use client";

import { useTheme } from "next-themes";
import { useAnalytics } from "@/hooks/useAnalytics";

// Both icons are rendered and CSS picks one from the .dark class, so the server HTML
// matches the client whatever theme is stored — no mounted-state check needed.
export function ThemeToggle({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const { track } = useAnalytics();

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => {
        const next = resolvedTheme === "dark" ? "light" : "dark";
        setTheme(next);
        track("theme_toggle", { theme: next });
      }}
      className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px] dark:hidden" aria-hidden>
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="hidden h-[18px] w-[18px] dark:block" aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
      </svg>
    </button>
  );
}
