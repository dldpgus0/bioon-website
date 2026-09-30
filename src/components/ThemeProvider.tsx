"use client";

import { ThemeProvider as NextThemes } from "next-themes";

// Light by default (matches the newsletter); the header toggle switches to dark for night reading.
// next-themes stores the choice and sets class="dark" on <html> before paint, so there's no flash.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
    </NextThemes>
  );
}
