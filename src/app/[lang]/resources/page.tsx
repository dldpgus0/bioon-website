import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ResourceHub } from "@/components/ResourceHub";
import { getDictionary, getLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/resources">): Promise<Metadata> {
  const dict = await getDictionary(await getLocale(params));
  return { title: dict.resources.title };
}

export default async function ResourcesPage({ params }: PageProps<"/[lang]/resources">) {
  const lang = await getLocale(params);
  const dict = await getDictionary(lang);

  return (
    <>
      <PageHeader eyebrow="Resources" title={dict.resources.title} lede={dict.resources.lede} />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <ResourceHub dict={dict} lang={lang} />
      </div>
    </>
  );
}
