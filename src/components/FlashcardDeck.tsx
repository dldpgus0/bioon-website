"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fullscreenClasses, useFullscreen } from "@/hooks/useFullscreen";
import type { Dictionary } from "@/lib/i18n";

export type Flashcard = {
  id: string;
  term: string;
  definition: string;
  example: string;
  module: string;
  source: string;
  tags: string[];
};

const KEY = "bioon_flashcards_known";

function loadKnown(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}
function saveKnown(known: Set<string>) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...known]));
  } catch {}
}

function shuffled<T>(list: T[]) {
  const a = [...list];
  for (let j = a.length - 1; j > 0; j--) {
    const r = Math.floor(Math.random() * (j + 1));
    [a[j], a[r]] = [a[r], a[j]];
  }
  return a;
}

/**
 * Online flashcard practice: flip, filter by module/topic, shuffle, and mark cards as known.
 * Progress is a per-browser convenience kept in localStorage (the page works without it).
 */
export function FlashcardDeck({ cards, dict }: { cards: Flashcard[]; dict: Dictionary }) {
  const t = dict.flashcards;
  const [module, setModule] = useState("");
  const [tag, setTag] = useState("");
  const [order, setOrder] = useState<Flashcard[]>(cards);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());
  const root = useRef<HTMLDivElement>(null);
  const { full, toggle: toggleFull } = useFullscreen(root);

  // localStorage is only readable in the browser, so progress loads after mount.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- stored progress is browser-only
    setKnown(loadKnown());
  }, []);

  const modules = useMemo(() => [...new Set(cards.map((c) => c.module))].sort(), [cards]);
  const tags = useMemo(() => [...new Set(cards.flatMap((c) => c.tags))].sort(), [cards]);

  const rebuild = useCallback(
    (m: string, tg: string, shuffle: boolean) => {
      const list = cards.filter((c) => (!m || c.module === m) && (!tg || c.tags.includes(tg)));
      setOrder(shuffle ? shuffled(list) : list);
      setI(0);
      setFlipped(false);
    },
    [cards],
  );

  const n = order.length;
  const card = n ? order[Math.min(i, n - 1)] : null;
  const knownCount = order.filter((c) => known.has(c.id)).length;

  const move = useCallback(
    (d: number) => {
      if (!n) return;
      setI((x) => (x + d + n) % n);
      setFlipped(false);
    },
    [n],
  );
  const mark = useCallback(
    (isKnown: boolean) => {
      if (!card) return;
      setKnown((prev) => {
        const next = new Set(prev);
        if (isKnown) next.add(card.id);
        else next.delete(card.id);
        saveKnown(next);
        return next;
      });
      move(1);
    },
    [card, move],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tagName = (e.target as HTMLElement).tagName;
      if (tagName === "SELECT" || tagName === "INPUT") return;
      // Space on a focused button should press that button, not flip the card.
      if (tagName === "BUTTON" && e.key === " ") return;
      if (e.key === " ") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === "ArrowRight") move(1);
      else if (e.key === "ArrowLeft") move(-1);
      else if (e.key.toLowerCase() === "k") mark(true);
      else if (e.key.toLowerCase() === "a") mark(false);
      else if (e.key.toLowerCase() === "f") toggleFull();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move, mark, toggleFull]);

  const select =
    "rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none";
  const btn = "rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium text-ink hover:border-teal";
  const trap = card?.tags.includes("exam-trap");
  const chips = card && (
    <div className="flex flex-wrap gap-1.5 text-xs">
      <span className="rounded-full bg-brand-soft px-2 py-0.5 font-semibold text-brand">{card.module}</span>
      {trap && <span className="rounded-full bg-red-50 px-2 py-0.5 font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">{t.trap}</span>}
      {known.has(card.id) && <span className="rounded-full border border-line px-2 py-0.5 text-muted">{t.knownChip}</span>}
    </div>
  );

  return (
    <div ref={root} className={full ? fullscreenClasses : ""}>
      <div className={full ? "mx-auto w-full max-w-4xl" : ""}>
      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label={t.allModules}
          className={select}
          value={module}
          onChange={(e) => {
            setModule(e.target.value);
            rebuild(e.target.value, tag, false);
          }}
        >
          <option value="">{t.allModules}</option>
          {modules.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <select
          aria-label={t.allTopics}
          className={select}
          value={tag}
          onChange={(e) => {
            setTag(e.target.value);
            rebuild(module, e.target.value, false);
          }}
        >
          <option value="">{t.allTopics}</option>
          {tags.map((g) => (
            <option key={g} value={g}>
              {g.replace(/-/g, " ")}
            </option>
          ))}
        </select>
        <span className="flex-1" />
        <button type="button" className={btn} onClick={() => rebuild(module, tag, true)}>
          {t.shuffle}
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => {
            const empty = new Set<string>();
            saveKnown(empty);
            setKnown(empty);
            rebuild(module, tag, false);
          }}
        >
          {t.reset}
        </button>
        <button type="button" className={btn} onClick={toggleFull} aria-pressed={full}>
          {full ? t.exitFullscreen : t.fullscreen}
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3 text-sm text-muted" aria-live="polite">
        <span>{n ? `${Math.min(i, n - 1) + 1} / ${n}` : "0 / 0"}</span>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-line">
          <div className="h-full bg-teal transition-all" style={{ width: n ? `${(knownCount / n) * 100}%` : "0%" }} />
        </div>
        <span>
          {knownCount} {t.known}
        </span>
      </div>

      {!card ? (
        <p className="py-16 text-center text-muted">{t.empty}</p>
      ) : (
        <div className="mt-4 [perspective:1400px]">
          <div
            role="button"
            tabIndex={0}
            aria-label={t.flip}
            aria-pressed={flipped}
            onClick={() => setFlipped((f) => !f)}
            onKeyDown={(e) => e.key === "Enter" && setFlipped((f) => !f)}
            className={`relative ${full ? "min-h-[60vh]" : "min-h-[340px]"} cursor-pointer transition-transform duration-500 [transform-style:preserve-3d] ${
              flipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            {/* Front */}
            <div className="absolute inset-0 flex flex-col rounded-2xl border border-line bg-surface p-7 shadow-sm [backface-visibility:hidden]">
              {chips}
              <p className={`flex flex-1 items-center justify-center py-4 text-center font-bold tracking-tight text-ink ${full ? "text-3xl sm:text-5xl" : "text-2xl sm:text-3xl"}`}>
                {card.term}
              </p>
              <p className="text-center text-xs text-muted">{t.flipHint}</p>
            </div>
            {/* Back */}
            <div className="absolute inset-0 flex flex-col overflow-y-auto rounded-2xl border border-line bg-surface p-7 shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="flex flex-wrap items-center gap-1.5">
                {chips}
                <span className="rounded-full border border-line px-2 py-0.5 text-xs text-muted">{card.source}</span>
              </div>
              <h3 className="mt-4 text-sm font-semibold text-muted">{card.term}</h3>
              <p className={`mt-2 leading-relaxed text-ink ${full ? "text-xl sm:text-2xl" : "text-[17px]"}`}>{card.definition}</p>
              {card.example && (
                <div className="mt-4 rounded-lg border-l-4 border-teal bg-surface-2 px-4 py-3 text-sm text-text">
                  <p className="text-xs font-bold uppercase tracking-wider text-teal">{t.example}</p>
                  <p className="mt-1">{card.example}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button type="button" className={btn} onClick={() => move(-1)}>
          {t.prev}
        </button>
        <button type="button" className={btn} onClick={() => mark(false)}>
          {t.again}
        </button>
        <button type="button" onClick={() => mark(true)} className="rounded-lg bg-teal px-3 py-2 text-sm font-semibold text-on-brand hover:opacity-90">
          {t.gotIt}
        </button>
        <button type="button" className={btn} onClick={() => move(1)}>
          {t.next}
        </button>
      </div>
      <p className="mt-3 hidden text-center text-xs text-muted sm:block">{t.keys}</p>
      </div>
    </div>
  );
}
