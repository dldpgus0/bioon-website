import type { Metadata } from "next";
import Link from "next/link";
import { CareerList } from "@/components/CareerList";
import { PageHeader } from "@/components/PageHeader";
import { getPosts } from "@/lib/content";
import { getDictionary, getLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/career">): Promise<Metadata> {
  const dict = await getDictionary(await getLocale(params));
  return { title: dict.career.title };
}

export default async function CareerPage({ params }: PageProps<"/[lang]/career">) {
  const lang = await getLocale(params);
  const dict = await getDictionary(lang);

  return (
    <>
      <PageHeader eyebrow="BIO:ON Career" title={dict.career.title} lede={dict.career.lede} />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_320px]">
        <div>
          <CareerList posts={getPosts(lang)} dict={dict} lang={lang} />
        </div>
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <Link
            href={`/${lang}/career/interview`}
            className="block rounded-2xl border border-brand bg-brand p-6 text-white transition-opacity hover:opacity-95"
          >
            <p className="text-xs font-bold tracking-wide text-white/70">NEW · 🎙️</p>
            <h2 className="mt-2 text-lg font-bold">{dict.career.interview.cardTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/80">{dict.career.interview.cardBody}</p>
            <span className="mt-4 inline-block text-sm font-semibold">{dict.career.interview.cta}<span aria-hidden> →</span></span>
          </Link>
          <div className="rounded-2xl border border-teal/40 bg-teal-soft p-6">
            <p className="text-xs font-bold tracking-wide text-teal">AI TOOLS · {dict.career.comingSoon}</p>
            <h2 className="mt-2 text-lg font-bold text-ink">{dict.career.toolsTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{dict.career.toolsLede}</p>
            <ul className="mt-4 space-y-2 text-sm font-medium text-ink">
              {dict.career.tools.map((t) => (
                <li key={t.title}>✦ {t.title}</li>
              ))}
            </ul>
            <Link href={`/${lang}/tools`} className="mt-5 inline-block text-sm font-semibold text-teal hover:underline">
              {dict.career.toolsCta}<span aria-hidden> →</span>
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
