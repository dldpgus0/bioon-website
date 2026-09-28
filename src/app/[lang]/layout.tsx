import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getDictionary, getLocale, locales } from "@/lib/i18n";
import "../globals.css";

// Absolute base for canonical and og:* URLs (link previews need full URLs). Vercel provides the
// production domain at build time; NEXT_PUBLIC_SITE_URL overrides it (e.g. a custom domain).
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const lang = await getLocale(params);
  const dict = await getDictionary(lang);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: dict.meta.title, template: "%s · BIO:ON" },
    description: dict.meta.description,
    alternates: {
      languages: { ko: "/ko", en: "/en" },
      types: { "application/rss+xml": [{ url: lang === "en" ? "/feed.xml?lang=en" : "/feed.xml", title: "BIO:ON Insight" }] },
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const lang = await getLocale(params);
  const dict = await getDictionary(lang);

  return (
    // suppressHydrationWarning: next-themes sets the theme class on <html> before hydration.
    <html lang={lang} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          {dict.a11y.skip}
        </a>
        <Header lang={lang} dict={dict} />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer lang={lang} dict={dict} />
        </ThemeProvider>
      </body>
      {/* GA4 turns on once NEXT_PUBLIC_GA_ID (e.g. G-XXXXXXX) is set in Vercel; useAnalytics events then flow into it via gtag. */}
      {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
    </html>
  );
}
