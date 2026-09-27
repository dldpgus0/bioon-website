"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Swaps the leading /ko or /en segment, keeping the rest of the path.
export function LangSwitch({ lang, label }: { lang: "ko" | "en"; label: string }) {
  const pathname = usePathname();
  const other = lang === "ko" ? "en" : "ko";
  const href = pathname.replace(/^\/(ko|en)(?=\/|$)/, `/${other}`);

  return (
    <Link
      href={href}
      hrefLang={other}
      className="text-[13px] font-medium tracking-wide text-muted transition-colors hover:text-teal"
    >
      {label}
    </Link>
  );
}
