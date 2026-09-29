"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// not-found pages get no params, so the language comes from the address.
const text = {
  ko: {
    title: "페이지를 찾을 수 없어요",
    body: "주소가 바뀌었거나 삭제된 페이지예요. 아래에서 원하는 곳으로 이동해 보세요.",
    links: [
      ["", "홈으로"],
      ["/insight", "뉴스레터 보기"],
      ["/wiki", "위키"],
      ["/career", "커리어"],
    ],
  },
  en: {
    title: "Page not found",
    body: "This page has moved or no longer exists. Try one of these instead.",
    links: [
      ["", "Home"],
      ["/insight", "Read the newsletter"],
      ["/wiki", "Wiki"],
      ["/career", "Career"],
    ],
  },
} as const;

export default function NotFound() {
  const lang = usePathname()?.startsWith("/en") ? "en" : "ko";
  const t = text[lang];

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 sm:py-32">
      <p className="text-sm font-semibold tracking-[0.25em] text-teal">404</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{t.title}</h1>
      <p className="mt-4 leading-relaxed text-muted">{t.body}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {t.links.map(([href, label], i) => (
          <Link
            key={href}
            href={`/${lang}${href}`}
            className={
              i === 0
                ? "rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-on-brand hover:opacity-90"
                : "rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink hover:border-teal hover:text-teal"
            }
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
