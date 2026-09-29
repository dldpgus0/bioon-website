import market from "@/content/market.json";

// Korean share prices from the Financial Services Commission's free stock price API on the
// public data portal (data.go.kr, "금융위원회_주식시세정보"). TradingView's free widgets don't carry
// KRX prices. The API publishes each trading day's close on the next business day, so the
// table shows the latest close it has. Set DATA_GO_KR_KEY to the portal's "Decoding" key.

const ENDPOINT = "https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo";

export type KrxQuote = {
  code: string;
  nameKo: string;
  nameEn: string;
  date: string; // YYYYMMDD
  close: number;
  change: number;
  changePct: number;
  marketCap: number; // KRW
  history: number[]; // recent closes, oldest first, for the sparkline
};

type Item = { basDt: string; srtnCd: string; clpr: string; vs: string; fltRt: string; mrktTotAmt: string };

function ymd(d: Date) {
  return d.toISOString().slice(0, 10).replaceAll("-", "");
}

/** About the last six weeks of daily rows for one company, newest first. */
async function recent(key: string, code: string): Promise<Item[]> {
  const since = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    serviceKey: key,
    resultType: "json",
    numOfRows: "40",
    pageNo: "1",
    likeSrtnCd: code,
    beginBasDt: ymd(since),
  });
  const res = await fetch(`${ENDPOINT}?${params}`, { next: { revalidate: 21600 } });
  if (!res.ok) return [];
  const data = await res.json().catch(() => null);
  const raw = data?.response?.body?.items?.item;
  const items: Item[] = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return items.filter((i) => i.srtnCd === code).sort((a, b) => b.basDt.localeCompare(a.basDt));
}

/** Latest close for each Korean company in market.json, or null when the API is unavailable. */
export async function getKrxQuotes(): Promise<KrxQuote[] | null> {
  const key = process.env.DATA_GO_KR_KEY;
  if (!key) return null;
  try {
    const rows = await Promise.all(
      (market.korea as [string, string, string][]).map(async ([code, nameKo, nameEn]) => {
        const days = await recent(key, code);
        const i = days[0];
        if (!i) return null;
        return {
          code,
          nameKo,
          nameEn,
          date: i.basDt,
          close: Number(i.clpr),
          change: Number(i.vs),
          changePct: Number(i.fltRt),
          marketCap: Number(i.mrktTotAmt),
          history: days.map((d) => Number(d.clpr)).reverse(),
        };
      }),
    );
    const ok = rows.filter((r): r is KrxQuote => r !== null);
    return ok.length ? ok : null;
  } catch {
    return null;
  }
}
