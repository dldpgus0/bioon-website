import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Pomodoro } from "@/components/Pomodoro";
import { getDictionary, getLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/tools/pomodoro">): Promise<Metadata> {
  const dict = await getDictionary(await getLocale(params));
  return { title: dict.pomodoro.title, description: dict.pomodoro.lede };
}

export default async function PomodoroPage({ params }: PageProps<"/[lang]/tools/pomodoro">) {
  const lang = await getLocale(params);
  const dict = await getDictionary(lang);

  return (
    <>
      <PageHeader eyebrow="Focus" title={dict.pomodoro.title} lede={dict.pomodoro.lede} />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Pomodoro dict={dict} />
        <Link href={`/${lang}/tools`} className="mt-10 inline-block text-sm font-semibold text-teal hover:underline">
          <span aria-hidden>← </span>
          {dict.tools.back}
        </Link>
      </div>
    </>
  );
}
