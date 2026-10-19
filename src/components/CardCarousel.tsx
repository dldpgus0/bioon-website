"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Card } from "@/lib/cardnews";

// Swipeable 4:5 card viewer: native scroll-snap for touch, buttons and arrow keys for desktop.
export function CardCarousel({ cards, labels }: { cards: Card[]; labels: { prev: string; next: string; goTo: string } }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // Track which card is mostly in view, so swipes and button clicks both update the dots.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setIndex(Number((e.target as HTMLElement).dataset.i));
      },
      { root: el, threshold: 0.6 },
    );
    for (const slide of el.children) io.observe(slide);
    return () => io.disconnect();
  }, []);

  const go = (i: number) => {
    const slide = track.current?.children[Math.max(0, Math.min(cards.length - 1, i))] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  const arrow =
    "absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/45 px-3 py-2 text-lg text-white backdrop-blur transition-opacity hover:bg-black/60 disabled:opacity-0";

  return (
    <div
      className="relative"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      <div ref={track} className="flex snap-x snap-mandatory overflow-x-auto rounded-2xl border border-line [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {cards.map((card, i) => (
          <div key={card.src} data-i={i} className="relative aspect-[4/5] w-full shrink-0 snap-center bg-surface-2">
            <Image src={card.src} alt={card.alt} fill sizes="(min-width: 672px) 640px, 100vw" className="object-contain" priority={i === 0} />
          </div>
        ))}
      </div>
      <button type="button" aria-label={labels.prev} onClick={() => go(index - 1)} disabled={index === 0} className={`${arrow} left-3`}>
        ‹
      </button>
      <button type="button" aria-label={labels.next} onClick={() => go(index + 1)} disabled={index === cards.length - 1} className={`${arrow} right-3`}>
        ›
      </button>
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {cards.map((card, i) => (
          <button
            key={card.src}
            type="button"
            aria-label={labels.goTo.replace("{n}", String(i + 1))}
            aria-current={i === index}
            onClick={() => go(i)}
            className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-teal" : "w-2 bg-line"}`}
          />
        ))}
        <span className="ml-3 text-xs tabular-nums text-muted">
          {index + 1} / {cards.length}
        </span>
      </div>
    </div>
  );
}
