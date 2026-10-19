import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/components/IssueCard";
import { PageHeader } from "@/components/PageHeader";
import { getCardnews } from "@/lib/cardnews";
import { getDictionary, getLocale } from "@/lib/i18n";
import { socials } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/cardnews">): Promise<Metadata> {
  const dict = await getDictionary(await getLocale(params));
  return { title: dict.cardnews.metaTitle, description: dict.cardnews.lede };
}

const instagram = socials.find((s) => s.id === "instagram")!.href;

export default async function CardnewsPage({ params }: PageProps<"/[lang]/cardnews">) {
  const lang = await getLocale(params);
  const dict = await getDictionary(lang);
  const t = dict.cardnews;
  const items = getCardnews();

  return (
    <>
      <PageHeader eyebrow="BIO:ON Card News" title={t.title} lede={t.lede} />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3 text-sm">
          {t.koOnly && <span className="text-muted">{t.koOnly}</span>}
          <a href={instagram} target="_blank" rel="noopener noreferrer" className="font-semibold text-teal hover:underline">
            {t.follow} @bio.on_insight<span aria-hidden> ↗</span>
          </a>
        </div>

        {items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">{t.empty}</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c) => (
              <li key={c.slug}>
                <Link href={`/${lang}/cardnews/${c.slug}`} className="group block overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-teal">
                  <div className="relative aspect-[4/5] bg-surface-2">
                    <Image
                      src={c.cards[0].src}
                      alt={c.cards[0].alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-muted">
                      <time dateTime={c.date}>{formatDate(c.date, lang)}</time> · {c.cards.length}
                      {lang === "ko" ? t.cards : ` ${t.cards}`}
                    </p>
                    <h2 className="mt-1 font-bold leading-snug text-ink group-hover:text-teal">{c.title}</h2>
                    {c.summary && <p className="mt-2 line-clamp-2 text-sm text-muted">{c.summary}</p>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
