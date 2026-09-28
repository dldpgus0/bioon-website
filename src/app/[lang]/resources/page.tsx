import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ResourceList } from "@/components/ResourceList";
import { WaitlistCard } from "@/components/Waitlist";
import { resourceWaitlist } from "@/lib/waitlist";
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
        <ResourceList dict={dict} lang={lang} />

        <h2 className="mt-14 text-lg font-bold text-ink">{dict.waitlist.heading}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resourceWaitlist(lang).map((w) => (
            <WaitlistCard key={w.id} item={w} dict={dict} lang={lang} />
          ))}
        </div>
      </div>
    </>
  );
}
