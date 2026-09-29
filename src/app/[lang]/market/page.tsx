import type { Metadata } from "next";
import { MarketBoard } from "@/components/MarketBoard";
import { PageHeader } from "@/components/PageHeader";
import { getDictionary, getLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/market">): Promise<Metadata> {
  const dict = await getDictionary(await getLocale(params));
  return { title: dict.market.title, description: dict.market.lede };
}

// Global pharma and biotech prices via free TradingView widgets; the company list is
// src/content/market.json.
export default async function MarketPage({ params }: PageProps<"/[lang]/market">) {
  const lang = await getLocale(params);
  const dict = await getDictionary(lang);
  const t = dict.market;

  return (
    <>
      <PageHeader eyebrow="Market" title={t.title} lede={t.lede} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <p className="mb-8 rounded-xl border border-line bg-surface-2 px-4 py-3 text-xs leading-relaxed text-muted">{t.disclaimer}</p>
        <MarketBoard dict={dict} lang={lang} />
        <div className="mt-10 text-sm text-muted">
          <p className="font-semibold text-ink">{t.moreTitle}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <a href="https://www.tradingview.com/heatmap/stock/" target="_blank" rel="noopener noreferrer" className="underline hover:text-teal">
                {t.moreHeatmap}
              </a>
            </li>
            <li>
              <a href="https://www.tradingview.com/screener/" target="_blank" rel="noopener noreferrer" className="underline hover:text-teal">
                {t.moreScreener}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
