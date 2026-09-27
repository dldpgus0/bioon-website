import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { Wordmark } from "./Logo";
import { LangSwitch } from "./LangSwitch";
import { MobileNav } from "./MobileNav";

export function Header({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const links = [
    { href: `/${lang}/insight`, label: dict.nav.insight },
    { href: `/${lang}/career`, label: dict.nav.career },
    { href: `/${lang}/resources`, label: dict.nav.resources },
    { href: `/${lang}/about`, label: dict.nav.about },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href={`/${lang}`} aria-label="BIO:ON home">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-10 text-[13px] font-medium uppercase tracking-[0.18em] text-ink/80 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-teal">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LangSwitch lang={lang} label={dict.nav.switchLang} />
          <Link
            href={`/${lang}/subscribe`}
            className="hidden rounded-full border border-brand px-4 py-1.5 text-sm font-medium text-brand transition-colors hover:bg-brand hover:text-white sm:inline-block"
          >
            {dict.nav.subscribe}
          </Link>
          <MobileNav links={[...links, { href: `/${lang}/subscribe`, label: dict.nav.subscribe }]} />
        </div>
      </div>
    </header>
  );
}
