import type { Metadata } from "next";
import Link from "next/link";
import { InterviewBank } from "@/components/InterviewBank";
import { PageHeader } from "@/components/PageHeader";
import { getInterviewQuestions } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n";

// Answer points shown to everyone; the rest unlock via the email gate (/api/interview-points).
const FREE_QUESTIONS = 3;

export async function generateMetadata({ params }: PageProps<"/[lang]/career/interview">): Promise<Metadata> {
  const dict = await getDictionary(await getLocale(params));
  return { title: dict.career.interview.title, description: dict.career.interview.lede };
}

export default async function InterviewPage({ params }: PageProps<"/[lang]/career/interview">) {
  const lang = await getLocale(params);
  const dict = await getDictionary(lang);
  // Gated answers are left out of the page entirely, so they can't be read from the HTML.
  const questions = getInterviewQuestions(lang).map((q, i) =>
    i < FREE_QUESTIONS ? q : { ...q, why: "", points: [], locked: true },
  );

  return (
    <>
      <PageHeader eyebrow="BIO:ON Career" title={dict.career.interview.title} lede={dict.career.interview.lede} />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link href={`/${lang}/career`} className="text-sm font-medium text-muted hover:text-ink">
          <span aria-hidden>← </span>{dict.career.back}
        </Link>
        <div className="mt-6">
          <InterviewBank questions={questions} dict={dict} lang={lang} />
        </div>
      </div>
    </>
  );
}
