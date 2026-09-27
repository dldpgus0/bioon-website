import type { Metadata } from "next";
import Link from "next/link";
import { InterviewBank } from "@/components/InterviewBank";
import { PageHeader } from "@/components/PageHeader";
import { getInterviewQuestions } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/career/interview">): Promise<Metadata> {
  const dict = await getDictionary(await getLocale(params));
  return { title: dict.career.interview.title, description: dict.career.interview.lede };
}

export default async function InterviewPage({ params }: PageProps<"/[lang]/career/interview">) {
  const lang = await getLocale(params);
  const dict = await getDictionary(lang);

  return (
    <>
      <PageHeader eyebrow="BIO:ON Career" title={dict.career.interview.title} lede={dict.career.interview.lede} />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link href={`/${lang}/career`} className="text-sm font-medium text-muted hover:text-ink">
          ← {dict.career.back}
        </Link>
        <div className="mt-6">
          <InterviewBank questions={getInterviewQuestions(lang)} dict={dict} lang={lang} />
        </div>
      </div>
    </>
  );
}
