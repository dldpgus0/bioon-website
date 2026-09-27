import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { getDictionary, getLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/resources">): Promise<Metadata> {
  const dict = await getDictionary(await getLocale(params));
  return { title: dict.resources.title };
}

export default async function ResourcesPage({ params }: PageProps<"/[lang]/resources">) {
  const lang = await getLocale(params);
  const dict = await getDictionary(lang);
  const t = dict.resources;

  return (
    <>
      <PageHeader eyebrow="Resources" title={t.title} lede={t.lede} />
      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {t.items.map((item) => {
          const free = item.type === "free";
          return (
            <div key={item.title} className="flex flex-col rounded-2xl border border-line bg-surface p-6">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${free ? "bg-teal-soft text-teal" : "bg-brand-soft text-brand"}`}
                >
                  {free ? t.free : t.paid}
                </span>
                <span className="text-xs font-medium text-muted">{t.comingSoon}</span>
              </div>
              <h2 className="mt-4 text-lg font-bold text-ink">{item.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{item.body}</p>
              {/* Phase 2: email-gated delivery via Stibee */}
              <Link
                href={`/${lang}/subscribe`}
                className="mt-5 rounded-xl border border-line py-2.5 text-center text-sm font-semibold text-muted"
                aria-disabled
              >
                {free ? t.getFree : t.comingSoon}
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
