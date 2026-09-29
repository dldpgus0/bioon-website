import type { Metadata } from "next";
import Link from "next/link";
import { FlashcardDeck, type Flashcard } from "@/components/FlashcardDeck";
import { PageHeader } from "@/components/PageHeader";
import deck from "@/content/flashcards.json";
import { getDictionary, getLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/resources/flashcards">): Promise<Metadata> {
  const dict = await getDictionary(await getLocale(params));
  return { title: dict.flashcards.title, description: dict.flashcards.lede };
}

// Cards come from src/content/flashcards.json (npm run flashcards -- <deck.json> to update).
export default async function FlashcardsPage({ params }: PageProps<"/[lang]/resources/flashcards">) {
  const lang = await getLocale(params);
  const dict = await getDictionary(lang);
  const t = dict.flashcards;
  const cards = deck.cards as Flashcard[];

  return (
    <>
      <PageHeader eyebrow="Flashcards" title={t.title} lede={t.lede} />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="mb-6 rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm text-muted">
          {t.note} · {cards.length} {t.cards} · {t.updated} {deck.updated}
        </p>
        <FlashcardDeck cards={cards} dict={dict} />
        <Link href={`/${lang}/resources`} className="mt-10 inline-block text-sm font-semibold text-teal hover:underline">
          <span aria-hidden>← </span>
          {t.back}
        </Link>
      </div>
    </>
  );
}
