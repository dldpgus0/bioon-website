import type { Metadata } from "next";
import { VerticalLogo } from "@/components/Logo";
import { SubscribeForm } from "@/components/SubscribeForm";
import { getDictionary, getLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/subscribe">): Promise<Metadata> {
  const dict = await getDictionary(await getLocale(params));
  return { title: dict.subscribe.title };
}

export default async function SubscribePage({ params }: PageProps<"/[lang]/subscribe">) {
  const lang = await getLocale(params);
  const dict = await getDictionary(lang);
  const t = dict.subscribe;

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-2 md:items-center">
      <div>
        <VerticalLogo className="mb-6 h-32 w-auto" />
        <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">{t.title}</h1>
        <p className="mt-4 leading-relaxed text-muted">{t.lede}</p>
        <ul className="mt-6 space-y-3">
          {t.points.map((p) => (
            <li key={p} className="flex items-center gap-3 text-ink">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-soft text-xs font-bold text-teal">✓</span>
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-3xl border border-line bg-surface p-6 shadow-sm sm:p-8">
        <SubscribeForm labels={t} lang={lang} />
        <p className="mt-4 text-xs leading-relaxed text-muted">{t.privacy}</p>
      </div>
    </div>
  );
}
