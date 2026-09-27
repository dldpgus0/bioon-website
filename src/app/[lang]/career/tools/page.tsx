import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SubscribeForm } from "@/components/SubscribeForm";
import { getDictionary, getLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/career/tools">): Promise<Metadata> {
  const dict = await getDictionary(await getLocale(params));
  return { title: dict.career.toolsTitle };
}

export default async function ToolsPage({ params }: PageProps<"/[lang]/career/tools">) {
  const lang = await getLocale(params);
  const dict = await getDictionary(lang);

  return (
    <>
      <PageHeader eyebrow="AI TOOLS" title={dict.career.toolsTitle} lede={dict.career.toolsLede} />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          {dict.career.tools.map((tool, i) => (
            <div key={tool.title} className="relative overflow-hidden rounded-2xl border border-line bg-surface p-8">
              <span className="absolute right-5 top-5 rounded-full bg-teal-soft px-3 py-1 text-xs font-bold text-teal">
                {dict.career.comingSoon}
              </span>
              <span className="text-3xl">{i === 0 ? "📝" : "🎙️"}</span>
              <h2 className="mt-4 text-xl font-bold text-ink">{tool.title}</h2>
              <p className="mt-3 leading-relaxed text-muted">{tool.body}</p>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-12 max-w-md text-center">
          <p className="font-medium text-ink">{dict.career.toolsNotify}</p>
          <div className="mt-4">
            <SubscribeForm labels={dict.subscribe} lang={lang} compact />
          </div>
        </div>
      </div>
    </>
  );
}
