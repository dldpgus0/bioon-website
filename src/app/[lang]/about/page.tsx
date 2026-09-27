import type { Metadata } from "next";
import Image from "next/image";
import { VerticalLogo } from "@/components/Logo";
import { SocialLinks } from "@/components/SocialLinks";
import { getIssues } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n";
// Static import so next/image knows the size and generates the blur placeholder at build time.
import profilePhoto from "../../../../public/brand/profile.jpg";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const dict = await getDictionary(await getLocale(params));
  return { title: dict.about.title };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const lang = await getLocale(params);
  const dict = await getDictionary(lang);
  const t = dict.about;
  const issueCount = getIssues("ko").length + getIssues("en").length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      {/* Profile: strict 3:4 portrait in a plain, sharp-edged frame. */}
      <header className="grid gap-8 border-y border-ink/80 py-10 sm:grid-cols-[220px_1fr] sm:gap-12">
        <figure className="w-44 sm:w-full">
          <div className="border border-ink/20 bg-white p-1.5">
            <Image
              src={profilePhoto}
              alt={dict.a11y.profile}
              placeholder="blur"
              preload
              sizes="(min-width: 640px) 220px, 176px"
              className="aspect-[3/4] w-full object-cover"
            />
          </div>
          <figcaption className="mt-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted">Editor · BIO:ON Insight</figcaption>
        </figure>
        <div className="sm:pt-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted">{t.title}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">{t.name}</h1>
          <p className="mt-1 text-sm text-muted">{t.role}</p>
          <hr className="my-6 w-12 border-t-2 border-brand" />
          <p className="max-w-xl leading-relaxed text-text">{t.bio}</p>
          <SocialLinks className="mt-6" />
        </div>
      </header>

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
          {lang === "ko" ? `발행한 뉴스레터 ${issueCount}편 (한/영)` : `${issueCount} issues published (KO/EN)`}
        </p>
      </section>
    </div>
  );
}
