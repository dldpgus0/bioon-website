import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import { EmailButton } from "@/components/EmailButton";
import { VerticalLogo } from "@/components/Logo";
import { SocialLinks } from "@/components/SocialLinks";
import { getIssues } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n";
import { socials } from "@/lib/site";

// CV PDFs for the recruiter section's download button (Korean page gets the Korean CV).
// The button only shows when the file exists in public/cv.
const cvPath = (lang: string) => (lang === "ko" ? "/cv/Yaehyun-Lee-CV-ko.pdf" : "/cv/Yaehyun-Lee-CV.pdf");
const hasCv = (p: string) => fs.existsSync(path.join(process.cwd(), "public", p));
const linkedin = socials.find((s) => s.id === "linkedin")!.href;
const email = socials.find((s) => s.id === "email")!.href.replace("mailto:", "");

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const dict = await getDictionary(await getLocale(params));
  return { title: dict.about.title };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const lang = await getLocale(params);
  const dict = await getDictionary(lang);
  const t = dict.about;
  const cv = cvPath(lang);
  // Weekly issues, counted once for both languages; the welcome letter is not counted.
  const issueCount = getIssues("ko").filter((i) => i.slug !== "welcome").length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      <section className="flex flex-col gap-8 sm:flex-row sm:items-center">
        <Image
          src="/brand/profile.jpg"
          alt={t.name}
          width={144}
          height={144}
          className="h-32 w-32 shrink-0 rounded-full border-4 border-surface object-cover shadow-md sm:h-36 sm:w-36"
        />
        <div>
          <p className="text-sm font-semibold text-teal">{t.title}</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink">{t.name}</h1>
          <p className="mt-1 font-medium text-muted">{t.role}</p>
          <p className="mt-4 leading-relaxed text-text">{t.bio}</p>
          <SocialLinks className="mt-5" />
        </div>
      </section>

      <section aria-labelledby="recruit" className="mt-16 rounded-3xl border border-teal/30 bg-teal-soft/40 p-6 sm:p-10">
        <h2 id="recruit" className="text-sm font-semibold uppercase tracking-[0.25em] text-teal">
          {t.recruit.title}
        </h2>
        <p className="mt-3 text-lg font-bold text-ink sm:text-xl">{t.recruit.lede}</p>
        <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {t.recruit.facts.map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs font-semibold text-muted">{k}</dt>
              <dd className="mt-0.5 text-sm font-medium text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <h3 className="mt-8 text-xs font-semibold text-muted">{t.recruit.highlightsTitle}</h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-text">
          {t.recruit.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-on-brand hover:opacity-90"
          >
            {t.recruit.linkedin}
          </a>
          <EmailButton
            email={email}
            label={`${t.recruit.email} · ${email}`}
            copiedLabel={t.recruit.emailCopied}
            className="rounded-full border border-brand px-5 py-2.5 text-sm font-semibold text-brand hover:bg-brand hover:text-on-brand"
          />
          {hasCv(cv) && (
            <a href={cv} download className="rounded-full border border-brand px-5 py-2.5 text-sm font-semibold text-brand hover:bg-brand hover:text-on-brand">
              {t.recruit.cv}
            </a>
          )}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-teal">{t.educationTitle}</h2>
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {t.education.map((e) => (
            <li key={e.degree} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8">
              <span className="w-40 shrink-0 text-sm font-semibold text-muted">{e.date}</span>
              <div className="flex-1">
                <p className="font-bold text-ink">{e.degree}</p>
                {e.school && <p className="mt-0.5 text-sm text-muted">{e.school}</p>}
              </div>
              <span className="self-start rounded-full bg-teal-soft px-2.5 py-1 text-xs font-semibold text-teal">{e.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20">
        <div className="flex flex-col gap-8 rounded-3xl bg-surface-2 p-8 sm:flex-row sm:items-center sm:p-10">
          <VerticalLogo className="h-36 w-auto shrink-0 self-center" />
          <div>
            <h2 className="text-2xl font-bold text-ink">{t.aiTitle}</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">{t.aiLede}</p>
          </div>
        </div>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2">
          {t.aiSteps.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-line bg-surface p-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal to-brand text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-muted">
          {lang === "ko" ? `발행한 뉴스레터 ${issueCount}호 (한/영)` : `${issueCount} issues published (KO/EN)`}
        </p>
      </section>
    </div>
  );
}
