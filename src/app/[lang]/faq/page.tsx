import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { getDictionary, getLocale } from "@/lib/i18n";
import { socials } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/faq">): Promise<Metadata> {
  const dict = await getDictionary(await getLocale(params));
  return { title: dict.faq.title, description: dict.faq.lede };
}

export default async function FaqPage({ params }: PageProps<"/[lang]/faq">) {
  const lang = await getLocale(params);
  const { faq } = await getDictionary(lang);
  const email = socials.find((s) => s.id === "email")!;

  // FAQPage structured data so search engines can show the answers directly.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.sections.flatMap((s) =>
      s.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader eyebrow="FAQ" title={faq.title} lede={faq.lede} />
      <div className="mx-auto max-w-3xl space-y-10 px-4 py-10 sm:px-6">
        {faq.sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-teal">{section.title}</h2>
            <div className="mt-3 divide-y divide-line rounded-2xl border border-line bg-surface">
              {section.items.map((item) => (
                <details key={item.q} className="group px-6 py-4">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-ink">
                    {item.q}
                    <span aria-hidden className="mt-0.5 shrink-0 text-teal transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-muted">{item.a}</p>
                  {"link" in item && item.link && (
                    <Link href={`/${lang}${item.link.href}`} className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">
                      {item.link.label}<span aria-hidden> →</span>
                    </Link>
                  )}
                </details>
              ))}
            </div>
          </section>
        ))}
        <p className="text-center text-muted">
          {faq.more}{" "}
          <a href={email.href} className="font-semibold text-brand hover:underline">
            {email.href.replace("mailto:", "")}
          </a>
        </p>
      </div>
    </>
  );
}
