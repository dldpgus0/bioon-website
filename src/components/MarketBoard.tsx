"use client";

import { useRef, type ReactNode } from "react";
import market from "@/content/market.json";
import { fullscreenClasses, useFullscreen } from "@/hooks/useFullscreen";
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
    <div className="space-y-14">
      <WidgetPanel id="market-quotes" title={t.quotesTitle} lede={t.quotesLede} t={t}>
        {(full) => (
          <TradingViewWidget
            script="embed-widget-market-quotes.js"
            config={quotes}
            className={full ? "h-full min-h-[70vh]" : "h-[75vh] min-h-[560px] max-h-[900px]"}
            lang={lang}
          />
        )}
      </WidgetPanel>

      <WidgetPanel id="market-heatmap" title={t.heatmapTitle} lede={t.heatmapLede} t={t}>
        {(full) => (
          <TradingViewWidget
            script="embed-widget-stock-heatmap.js"
            config={heatmap}
            className={full ? "h-full min-h-[70vh]" : "h-[80vh] min-h-[600px] max-h-[1000px]"}
            lang={lang}
          />
        )}
      </WidgetPanel>
    </div>
  );
}

/** A titled widget box with a full-screen button; the widget grows to fill the screen. */
function WidgetPanel({
  id,
  title,
  lede,
  t,
  children,
}: {
  id: string;
  title: string;
  lede: string;
  t: Dictionary["market"];
  children: (full: boolean) => ReactNode;
}) {
  const box = useRef<HTMLElement>(null);
  const { full, toggle } = useFullscreen(box);

  return (
    <section ref={box} aria-labelledby={id} className={full ? fullscreenClasses.replace("justify-center", "justify-start") : ""}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id={id} className="text-lg font-bold text-ink sm:text-xl">
            {title}
          </h2>
          {!full && <p className="mt-1 text-sm text-muted">{lede}</p>}
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-pressed={full}
          className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-medium text-ink hover:border-teal hover:text-teal"
        >
          {full ? t.exitFullscreen : t.fullscreen}
        </button>
      </div>
      <div className={`flex flex-col rounded-2xl border border-line bg-surface p-2 ${full ? "min-h-0 flex-1" : ""}`}>{children(full)}</div>
    </section>
  );
}
