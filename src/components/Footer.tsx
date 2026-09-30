import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Wordmark } from "./Logo";
import { CookieSettingsButton } from "./CookieConsent";
import { SocialLinks } from "./SocialLinks";

export function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Wordmark className="h-12 w-auto" />
          <p className="mt-4 text-sm text-muted">{dict.footer.tagline}</p>
          <SocialLinks className="mt-5" size="h-[18px] w-[18px]" />
        </div>
        <nav aria-label={dict.a11y.footerNav} className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm text-muted">
          <Link href={`/${lang}/insight`} className="hover:text-ink">{dict.nav.insight}</Link>
          <Link href={`/${lang}/wiki`} className="hover:text-ink">{dict.nav.wiki}</Link>
          <Link href={`/${lang}/career`} className="hover:text-ink">{dict.nav.career}</Link>
          <Link href={`/${lang}/resources`} className="hover:text-ink">{dict.nav.resources}</Link>
          <Link href={`/${lang}/tools`} className="hover:text-ink">{dict.nav.tools}</Link>
          <Link href={`/${lang}/about`} className="hover:text-ink">{dict.nav.about}</Link>
          <Link href={`/${lang}/subscribe`} className="hover:text-ink">{dict.nav.subscribe}</Link>
          <Link href={`/${lang}/faq`} className="hover:text-ink">{dict.nav.faq}</Link>
          {/* Route handler, not a page, so a plain anchor rather than next/link. */}
          <a href={lang === "en" ? "/feed.xml?lang=en" : "/feed.xml"} type="application/rss+xml" className="hover:text-ink">
            {dict.a11y.rss}
          </a>
          <Link href={`/${lang}/cookies`} className="hover:text-ink">{dict.cookies.title}</Link>
          <CookieSettingsButton label={dict.consent.settings} />
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted sm:px-6">
          <span>© {new Date().getFullYear()} BIO:ON</span>
        </div>
      </div>
    </footer>
  );
}
