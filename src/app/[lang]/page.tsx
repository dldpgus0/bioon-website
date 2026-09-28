import Image from "next/image";
import Link from "next/link";
import { icons } from "@/components/Icons";
import { IssueCard } from "@/components/IssueCard";
import { SectionTitle } from "@/components/SectionTitle";
import { SocialLinks } from "@/components/SocialLinks";
import { SubscribeForm } from "@/components/SubscribeForm";
import { getIssueSlugs, getIssues } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n";
import { TrackedLink } from "@/components/TrackedLink";

const pillarIcons = [icons.newsletter, icons.career, icons.ai, icons.resources];

export default async function Home({ params }: PageProps<"/[lang]">) {
  const lang = await getLocale(params);
  const dict = await getDictionary(lang);
  const t = dict.home;
  const latest = getIssues(lang).slice(0, 3);
  // Korean and English editions are the same newsletter, so count issues once.
  const issueCount = getIssueSlugs().length;

  return (
    <>
      {/* Hero — portfolio-style intro */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-24 pt-12 sm:px-6 md:grid-cols-[1.25fr_1fr] md:pb-32 md:pt-20">
        <div className="order-2 md:order-1">
          <p className="flex items-center gap-3 text-[15px] font-semibold text-teal">
            {t.hello}
            <span className="h-px w-8 bg-teal" />
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.2] tracking-tight text-ink sm:text-5xl">
            {t.title1}
            <br />
            <span className="text-brand">{t.title2}</span>
          </h1>
          <p className="mt-6 max-w-lg text-[15px] leading-[1.9] text-muted sm:text-base">{t.heroLede}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <TrackedLink
              href={`/${lang}/subscribe`}
              event="subscribe_click"
              payload={{ location: "home_hero", lang }}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(26,86,136,0.6)] transition-transform hover:-translate-y-0.5"
            >
              <span className="h-4 w-4">{icons.newsletter}</span>
              {t.ctaSubscribe}
            </TrackedLink>
            <Link
              href={`/${lang}/insight`}
              className="inline-flex items-center rounded-full border border-brand px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand-soft"
            >
              {t.ctaArchive}
            </Link>
          </div>
          <SocialLinks className="mt-8" />
        </div>

        {/* Round portrait (kept by request) with a plain credentials panel instead of floating badges */}
        <div className="order-1 flex flex-col items-center md:order-2">
          <Image
            src="/brand/profile.jpg"
            alt={dict.about.name}
            width={320}
            height={320}
            preload
            className="h-52 w-52 rounded-full object-cover ring-1 ring-line sm:h-64 sm:w-64"
          />
          <dl className="mt-8 w-full max-w-sm divide-y divide-line rounded-xl border border-line bg-surface text-sm">
            {dict.about.education.map((e) => (
              <div key={e.degree} className="px-5 py-3">
                <dt className="font-semibold text-ink">{e.degree}</dt>
                <dd className="mt-0.5 text-xs text-muted">
                  {e.school} · {e.note}
                </dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between px-5 py-3">
              <dt className="text-xs text-muted">{t.badgeIssues}</dt>
              <dd className="font-semibold text-ink">
                {issueCount} <span className="text-xs font-medium text-muted">· KO / EN</span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Wave into the brand-blue band with the latest issues */}
      {latest.length > 0 && (
        <section className="relative bg-brand">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="absolute -top-px left-0 h-16 w-full sm:h-28"
            aria-hidden
          >
            <path d="M0 0h1440v28c-190 70-420 92-700 40C420 10 190 18 0 58z" fill="var(--bg)" />
          </svg>
          <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 sm:pt-40">
            <SectionTitle title={t.latest} subtitle={t.latestSub} onBrand />
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {latest.map((issue) => (
                <IssueCard key={issue.slug} issue={issue} dict={dict} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href={`/${lang}/insight`}
                className="inline-flex items-center gap-2 rounded-full border border-white/60 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-brand"
              >
                {t.viewAll}
                <span className="h-4 w-4">{icons.arrow}</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Inline sign-up straight after the latest issues, on its own tinted band */}
      <section aria-labelledby="inline-subscribe" className="border-y border-teal/20 bg-teal-soft">
        <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-12 sm:px-6 md:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 id="inline-subscribe" className="text-xl font-bold text-ink">
              {t.inlineTitle}
            </h2>
            <p className="mt-2 text-sm text-muted">{t.inlineBody}</p>
          </div>
          <SubscribeForm labels={dict.subscribe} lang={lang} compact source="home_inline" />
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6">
        <SectionTitle title={t.pillarsTitle} subtitle={t.pillarsSub} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.pillars.map((p, i) => (
            <Link
              key={p.href}
              href={`/${lang}${p.href}`}
              className="group rounded-2xl border border-line bg-surface p-7 text-center transition-all hover:-translate-y-1 hover:border-transparent hover:shadow-[0_16px_40px_-16px_rgba(19,42,76,0.3)]"
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft p-3.5 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                {pillarIcons[i]}
              </span>
              <h3 className="mt-5 text-lg font-bold text-ink">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Journey timeline */}
      <section className="mx-auto max-w-4xl px-4 pt-28 sm:px-6">
        <SectionTitle title={t.journeyTitle} subtitle={t.journeySub} />
        <ol className="relative mt-14">
          <span className="absolute bottom-2 left-4 top-2 w-0.5 bg-line md:left-1/2 md:-translate-x-1/2" aria-hidden />
          {t.journey.map((step, i) => {
            const right = i % 2 === 1;
            return (
              <li key={step.title} className="relative mb-10 pl-12 last:mb-0 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
                <span
                  className={`absolute left-4 top-6 h-4 w-4 -translate-x-1/2 rounded-full md:left-1/2 ${
                    step.upcoming ? "border-2 border-dashed border-teal bg-surface" : "border-4 border-bg bg-brand shadow-[0_0_0_2px_var(--line)]"
                  }`}
                  aria-hidden
                />
                <div className={right ? "md:col-start-2" : "md:text-right"}>
                  <div
                    className={`rounded-2xl bg-surface p-6 ${
                      step.upcoming ? "border border-dashed border-teal/50" : "border border-line shadow-[0_10px_30px_-18px_rgba(19,42,76,0.35)]"
                    }`}
                  >
                    <p className="text-xs font-semibold tracking-wider text-teal">{step.date}</p>
                    <h3 className="mt-1.5 text-lg font-bold text-ink">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.body}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Career call-to-action */}
      <section className="mx-auto max-w-6xl px-4 pt-28 sm:px-6">
        <div className="flex flex-col items-start gap-8 rounded-3xl bg-surface-2 px-6 py-12 sm:px-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal">BIO:ON Career</p>
            <h2 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">{t.careerTitle}</h2>
            <p className="mt-3 leading-relaxed text-muted">{t.careerBody}</p>
          </div>
          <Link
            href={`/${lang}/career`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            {t.careerCta}
            <span className="h-4 w-4">{icons.arrow}</span>
          </Link>
        </div>
      </section>
    </>
  );
}
