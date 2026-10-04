import type { Metadata } from "next";
import { IssueGrid } from "@/components/IssueGrid";
import { PageHeader } from "@/components/PageHeader";
import { getIssues } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/insight">): Promise<Metadata> {
  const dict = await getDictionary(await getLocale(params));
  // The title already names BIO:ON Insight, so skip the layout's "· BIO:ON Insight" suffix.
  return { title: { absolute: dict.insight.title } };
}

export default async function InsightPage({ params }: PageProps<"/[lang]/insight">) {
  const lang = await getLocale(params);
  const dict = await getDictionary(lang);

  return (
    <>
      <PageHeader eyebrow="BIO:ON Insight" title={dict.insight.title} lede={dict.insight.lede} />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <IssueGrid issues={getIssues(lang)} dict={dict} lang={lang} />
      </div>
    </>
  );
}
