import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CookieSettingsButton } from "@/components/CookieConsent";
import { getDictionary, getLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/cookies">): Promise<Metadata> {
  const dict = await getDictionary(await getLocale(params));
  return { title: dict.cookies.title, description: dict.cookies.lede };
}

// Keep in sync with what the site actually stores: src/lib/lead.ts (bioon_lead),
// CookieConsent.tsx (consent key), ThemeProvider (next-themes "theme" key), GA4 and the
// market page's TradingView widgets (TradingViewWidget.tsx).
const necessary = [
  { name: "bioon_lead", key: "lead" },
  { name: "bioon_analytics_consent", key: "consent" },
  { name: "theme", key: "theme" },
  { name: "bioon_tradingview_ok", key: "tvconsent" },
] as const;
const analytics = [
  { name: "_ga", key: "ga" },
  { name: "_ga_<ID>", key: "gaid" },
] as const;
const thirdParty = [{ name: "TradingView", key: "tradingview" }] as const;

export default async function CookiesPage({ params }: PageProps<"/[lang]/cookies">) {
  const lang = await getLocale(params);
  const dict = await getDictionary(lang);
  const t = dict.cookies;

  const table = (rows: readonly { name: string; key: keyof typeof t.items }[]) => (
    <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-surface">
      {rows.map((r) => {
        const it = t.items[r.key];
        return (
          <li key={r.name} className="p-5 text-sm">
            <p className="font-mono font-semibold text-ink">{r.name}</p>
            <p className="mt-1 text-text">{it.purpose}</p>
            <p className="mt-2 text-xs text-muted">
              {t.cols.type}: {it.type} · {t.cols.duration}: {it.duration}
            </p>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <PageHeader eyebrow="Cookies" title={t.title} lede={t.lede} />
      <div className="mx-auto max-w-3xl space-y-10 px-4 py-10 sm:px-6">
        <section>
          <h2 className="text-lg font-bold text-ink">{t.necessaryTitle}</h2>
          <p className="mt-1 text-sm text-muted">{t.necessaryNote}</p>
          {table(necessary)}
        </section>
        <section>
          <h2 className="text-lg font-bold text-ink">{t.analyticsTitle}</h2>
          <p className="mt-1 text-sm text-muted">{t.analyticsNote}</p>
          {table(analytics)}
        </section>
        <section>
          <h2 className="text-lg font-bold text-ink">{t.thirdPartyTitle}</h2>
          <p className="mt-1 text-sm text-muted">{t.thirdPartyNote}</p>
          {table(thirdParty)}
        </section>
        <section>
          <h2 className="text-lg font-bold text-ink">{t.changeTitle}</h2>
          <p className="mt-1 text-sm text-text">{t.changeBody}</p>
          <div className="mt-3 inline-block rounded-xl border border-brand px-4 py-2 text-sm font-semibold text-brand">
            <CookieSettingsButton label={dict.consent.settings} />
          </div>
        </section>
        <section className="text-sm">
          <h2 className="font-bold text-ink">{t.sourcesTitle}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
            <li>
              <a href="https://support.google.com/analytics/answer/11397207" target="_blank" rel="noopener noreferrer" className="underline hover:text-teal">
                Google Analytics Help — [GA4] Cookie usage on websites
              </a>
            </li>
            <li>
              <a href="https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/" target="_blank" rel="noopener noreferrer" className="underline hover:text-teal">
                ICO — Guidance on the use of storage and access technologies
              </a>
            </li>
          </ul>
          <p className="mt-4 text-xs text-muted">{t.updated}</p>
        </section>
      </div>
    </>
  );
}
