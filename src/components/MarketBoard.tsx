"use client";

import market from "@/content/market.json";
import type { Dictionary } from "@/lib/i18n";
import { allowTradingView, TradingViewWidget, useTradingViewAllowed } from "./TradingViewWidget";

type Group = { id: string; ko: string; en: string; symbols: [string, string][] };

/** Market page body: a click-to-load gate, then the grouped quotes table and a heatmap. */
export function MarketBoard({ dict, lang }: { dict: Dictionary; lang: string }) {
  const t = dict.market;
  const allowed = useTradingViewAllowed();
  const groups = market.groups as Group[];

  if (!allowed) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 text-center">
        <p className="text-sm leading-relaxed text-muted">{t.consent}</p>
        <button
          type="button"
          onClick={allowTradingView}
          className="mt-5 rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-on-brand hover:opacity-90"
        >
          {t.load}
        </button>
      </div>
    );
  }

  const quotes = {
    width: "100%",
    height: "100%",
    showSymbolLogo: true,
    isTransparent: true,
    symbolsGroups: groups.map((g) => ({
      name: lang === "ko" ? g.ko : g.en,
      symbols: g.symbols.map(([name, displayName]) => ({ name, displayName })),
    })),
  };

  const heatmap = {
    exchanges: [],
    dataSource: "SPX500",
    grouping: "sector",
    blockSize: "market_cap_basic",
    blockColor: "change",
    hasTopBar: true,
    isDataSetEnabled: true,
    isZoomEnabled: true,
    hasSymbolTooltip: true,
    isMonoSize: false,
    isTransparent: true,
    width: "100%",
    height: "100%",
  };

  return (
    <div className="space-y-12">
      <section aria-labelledby="market-quotes">
        <h2 id="market-quotes" className="text-lg font-bold text-ink">
          {t.quotesTitle}
        </h2>
        <p className="mb-4 mt-1 text-sm text-muted">{t.quotesLede}</p>
        <div className="rounded-2xl border border-line bg-surface p-2">
          <TradingViewWidget script="embed-widget-market-quotes.js" config={quotes} height={620} lang={lang} />
        </div>
      </section>

      <section aria-labelledby="market-heatmap">
        <h2 id="market-heatmap" className="text-lg font-bold text-ink">
          {t.heatmapTitle}
        </h2>
        <p className="mb-4 mt-1 text-sm text-muted">{t.heatmapLede}</p>
        <div className="rounded-2xl border border-line bg-surface p-2">
          <TradingViewWidget script="embed-widget-stock-heatmap.js" config={heatmap} height={560} lang={lang} />
        </div>
      </section>
    </div>
  );
}
