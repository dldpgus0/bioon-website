"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useSyncExternalStore } from "react";

// Embeds a free TradingView widget (https://www.tradingview.com/widget/). TradingView supplies
// and refreshes the market data, which lets the site show global prices without a data licence;
// its attribution link must stay. The widget runs in a TradingView iframe that may set its own
// cookies, so it only loads after the visitor clicks "Load" once (remembered in localStorage).

const KEY = "bioon_tradingview_ok";
const EVENT = "bioon-tradingview";

function read() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}
function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
export function allowTradingView() {
  try {
    localStorage.setItem(KEY, "1");
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}
/** Whether the visitor has chosen to load TradingView widgets ("pending" during SSR/hydration). */
export function useTradingViewAllowed() {
  return useSyncExternalStore(subscribe, read, () => false);
}

export function TradingViewWidget({
  script,
  config,
  height,
  lang,
}: {
  script: string;
  config: Record<string, unknown>;
  height: number;
  lang: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";
  const json = JSON.stringify({ ...config, colorTheme: theme, locale: lang === "ko" ? "kr" : "en" });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = '<div class="tradingview-widget-container__widget" style="height:100%;width:100%"></div>';
    const s = document.createElement("script");
    s.src = `https://s3.tradingview.com/external-embedding/${script}`;
    s.async = true;
    s.type = "text/javascript";
    s.innerHTML = json;
    el.appendChild(s);
    return () => {
      el.innerHTML = "";
    };
  }, [script, json]);

  return (
    <div>
      <div ref={ref} className="tradingview-widget-container" style={{ height }} />
      <p className="mt-1 text-right text-xs text-muted">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank" className="hover:text-teal">
          Market data by TradingView
        </a>
      </p>
    </div>
  );
}
