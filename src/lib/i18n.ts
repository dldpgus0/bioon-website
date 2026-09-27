import "server-only";
import { notFound } from "next/navigation";

export const locales = ["ko", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ko";

const dictionaries = {
  ko: () => import("@/dictionaries/ko.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["ko"]>>;

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** Resolves the `[lang]` param, 404ing on unsupported locales. */
export async function getLocale(params: Promise<{ lang: string }>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return lang;
}

export const getDictionary = (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
