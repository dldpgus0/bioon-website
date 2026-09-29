import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { WaitlistCard } from "@/components/Waitlist";
import { getDictionary, getLocale } from "@/lib/i18n";
import { waitlistByKind } from "@/lib/waitlist";

export async function generateMetadata({ params }: PageProps<"/[lang]/tools">): Promise<Metadata> {
  const dict = await getDictionary(await getLocale(params));
  return { title: dict.tools.title, description: dict.tools.lede };
}

// Tools hub: study tools, career tools (live + waitlist) and the market page.
export default async function ToolsPage({ params }: PageProps<"/[lang]/tools">) {
  const lang = await getLocale(params);
  const dict = await getDictionary(lang);
  const t = dict.tools;

  const card = (href: string, c: { icon: string; title: string; body: string }) => (
    <Link
      key={href}
      href={`/${lang}${href}`}
      className="group flex flex-col rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-teal"
    >
      <span className="text-3xl" aria-hidden>
        {c.icon}
      </span>
      <h3 className="mt-3 text-lg font-bold text-ink group-hover:text-teal">{c.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{c.body}</p>
      <span className="mt-4 text-sm font-semibold text-teal">
        {t.open}
        <span aria-hidden> →</span>
      </span>
    </Link>
  );

  return (
    <>
      <PageHeader eyebrow="Tools" title={t.title} lede={t.lede} />
      <div className="mx-auto max-w-5xl space-y-12 px-4 py-10 sm:px-6">
        <section aria-labelledby="tools-study">
          <h2 id="tools-study" className="text-lg font-bold text-ink">
            {t.studyTitle}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {card("/tools/flashcards", t.cards.flashcards)}
            {card("/tools/pomodoro", t.cards.pomodoro)}
          </div>
        </section>

        <section aria-labelledby="tools-career">
          <h2 id="tools-career" className="text-lg font-bold text-ink">
            {t.careerTitle}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {card("/career/interview", t.cards.interview)}
            {waitlistByKind(lang, ["tool"]).map((w) => (
              <WaitlistCard key={w.id} item={w} dict={dict} lang={lang} />
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
