import type { Reference } from "@/lib/content";

/** Source list for the bottom of an article: title, publisher and an external link to the original. */
export function References({ items, title, newTab }: { items: Reference[]; title: string; newTab: string }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="references" className="rounded-2xl border border-line bg-surface-2 p-6">
      <h2 id="references" className="text-sm font-bold uppercase tracking-wider text-muted">
        {title}
      </h2>
      <ol className="mt-4 space-y-3">
        {items.map((r, i) => (
          <li key={r.url + i} className="flex gap-3 text-sm">
            <span className="w-5 shrink-0 text-right font-semibold text-muted">{i + 1}.</span>
            <div className="min-w-0">
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline font-medium text-ink underline decoration-line underline-offset-4 hover:text-teal hover:decoration-teal"
              >
                {r.title}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1 inline h-3.5 w-3.5 align-[-2px]" aria-hidden>
                  <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="sr-only"> ({newTab})</span>
              </a>
              <p className="mt-0.5 text-xs text-muted">{r.source}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
