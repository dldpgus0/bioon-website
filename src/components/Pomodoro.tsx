"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { FocusSound, type SoundId } from "@/lib/focusSound";
import type { Dictionary } from "@/lib/i18n";

type Phase = "focus" | "short" | "long";
type Settings = {
  focus: number;
  short: number;
  long: number;
  every: number;
  sound: SoundId;
  volume: number;
  breakSound: boolean;
  autoNext: boolean;
};

const DEFAULTS: Settings = { focus: 25, short: 5, long: 15, every: 4, sound: "brown", volume: 0.5, breakSound: false, autoNext: true };
const KEY = "bioon_pomodoro_settings";

const minutes = (s: Settings, p: Phase) => (p === "focus" ? s.focus : p === "short" ? s.short : s.long);
const fmt = (ms: number) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

/**
 * Pomodoro timer: focus / short break / long break (every Nth session), with generated focus
 * sounds while focusing, a chime between phases, and the countdown in the tab title.
 * Settings are a per-browser convenience in localStorage.
 */
export function Pomodoro({ dict }: { dict: Dictionary }) {
  const t = dict.pomodoro;
  const { track } = useAnalytics();
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [phase, setPhase] = useState<Phase>("focus");
  const [remaining, setRemaining] = useState(DEFAULTS.focus * 60_000);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(0);

  const sound = useRef<FocusSound | null>(null);
  const endAt = useRef(0);
  // Latest state for the interval callback (updated after each render, not during it).
  const state = useRef({ settings, phase, done, running });
  useEffect(() => {
    state.current = { settings, phase, done, running };
  });

  // Saved settings are browser-only.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "null");
      if (saved) {
        const s = { ...DEFAULTS, ...saved } as Settings;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- stored settings are browser-only
        setSettings(s);
        setRemaining(s.focus * 60_000);
      }
    } catch {}
    return () => sound.current?.close();
  }, []);

  const audio = () => (sound.current ??= new FocusSound());
  const soundFor = useCallback((s: Settings, p: Phase) => {
    const a = audio();
    a.setVolume(s.volume);
    if (s.sound !== "off" && (p === "focus" || s.breakSound)) a.play(s.sound);
    else a.stop();
  }, []);

  const startPhase = useCallback(
    (p: Phase, ms: number, s: Settings) => {
      endAt.current = Date.now() + ms;
      setRunning(true);
      soundFor(s, p);
    },
    [soundFor],
  );

  // Ends the current phase. A skipped focus session moves on to a break but isn't counted.
  const finish = useCallback((skipped = false) => {
    const { settings: s, phase: p, done: d } = state.current;
    audio().chime();
    let next: Phase = "focus";
    let nextDone = d;
    if (p === "focus") {
      next = "short";
      if (!skipped) {
        nextDone = d + 1;
        if (nextDone % s.every === 0) next = "long";
        track("pomodoro_complete", { minutes: s.focus });
      }
    }
    setDone(nextDone);
    setPhase(next);
    const ms = minutes(s, next) * 60_000;
    setRemaining(ms);
    if (s.autoNext) startPhase(next, ms, s);
    else {
      setRunning(false);
      audio().stop();
    }
  }, [startPhase, track]);

  // Tick from a fixed end time so the countdown doesn't drift in background tabs.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const left = endAt.current - Date.now();
      if (left <= 0) finish();
      else setRemaining(left);
    }, 250);
    return () => clearInterval(id);
  }, [running, finish]);

  // Countdown in the tab title while running.
  useEffect(() => {
    const original = document.title;
    if (running) document.title = `${fmt(remaining)} · ${t.phases[phase]}`;
    return () => {
      document.title = original;
    };
  }, [running, remaining, phase, t.phases]);

  const toggle = useCallback(() => {
    if (running) {
      setRemaining(Math.max(0, endAt.current - Date.now()));
      setRunning(false);
      audio().stop();
    } else {
      startPhase(phase, remaining, settings);
      track("pomodoro_start", { phase, sound: settings.sound });
    }
  }, [running, phase, remaining, settings, startPhase, track]);

  const switchTo = (p: Phase) => {
    setRunning(false);
    audio().stop();
    setPhase(p);
    setRemaining(minutes(settings, p) * 60_000);
  };

  const update = (patch: Partial<Settings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    if (!running && ("focus" in patch || "short" in patch || "long" in patch)) {
      setRemaining(minutes(next, phase) * 60_000);
    }
    if ("volume" in patch) audio().setVolume(next.volume);
    if (running && ("sound" in patch || "breakSound" in patch)) soundFor(next, phase);
  };

  // Space starts or pauses (except while typing in a field or pressing a focused button).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (e.key !== " " || tag === "INPUT" || tag === "SELECT" || tag === "BUTTON") return;
      e.preventDefault();
      toggle();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  const total = minutes(settings, phase) * 60_000;
  const progress = total ? 1 - remaining / total : 0;
  const btn = "rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink hover:border-teal";
  const field = "w-20 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none";

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-line bg-surface p-6 text-center sm:p-10">
        <div role="tablist" aria-label={t.phaseLabel} className="inline-flex rounded-full border border-line p-1">
          {(["focus", "short", "long"] as Phase[]).map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={phase === p}
              onClick={() => switchTo(p)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                phase === p ? "bg-brand text-on-brand" : "text-muted hover:text-ink"
              }`}
            >
              {t.phases[p]}
            </button>
          ))}
        </div>

        <p className="mt-8 font-mono text-7xl font-bold tabular-nums tracking-tight text-ink sm:text-8xl" aria-live="off">
          {fmt(remaining)}
        </p>
        <div className="mx-auto mt-6 h-1.5 max-w-md overflow-hidden rounded-full bg-line" aria-hidden>
          <div className={`h-full transition-all ${phase === "focus" ? "bg-brand" : "bg-teal"}`} style={{ width: `${progress * 100}%` }} />
        </div>
        <p className="mt-3 text-sm text-muted">
          {t.sessions}: {done} · {t.longEvery.replace("{n}", String(settings.every))}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="min-w-32 rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-on-brand hover:opacity-90"
          >
            {running ? t.pause : t.start}
          </button>
          <button type="button" className={btn} onClick={() => switchTo(phase)}>
            {t.reset}
          </button>
          <button type="button" className={btn} onClick={() => finish(true)}>
            {t.skip}
          </button>
        </div>
        <p className="mt-4 hidden text-xs text-muted sm:block">{t.keys}</p>
      </section>

      <section aria-labelledby="pomodoro-settings" className="rounded-2xl border border-line bg-surface p-6">
        <h2 id="pomodoro-settings" className="font-bold text-ink">
          {t.settings}
        </h2>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            [25, 5, 15],
            [50, 10, 20],
          ].map(([f, s, l]) => (
            <button key={f} type="button" className={btn} onClick={() => update({ focus: f, short: s, long: l })}>
              {f} / {s} / {l}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-text">
          {(["focus", "short", "long"] as const).map((k) => (
            <label key={k} className="flex items-center gap-2">
              {t.phases[k]}
              <input
                type="number"
                min={1}
                max={120}
                value={settings[k]}
                onChange={(e) => update({ [k]: Math.min(120, Math.max(1, Number(e.target.value) || 1)) })}
                className={field}
              />
              {t.min}
            </label>
          ))}
        </div>

        <h3 className="mt-6 text-sm font-semibold text-ink">{t.soundTitle}</h3>
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label={t.soundTitle}>
          {(["off", "brown", "rain", "ambient"] as SoundId[]).map((id) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={settings.sound === id}
              onClick={() => update({ sound: id })}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                settings.sound === id ? "border-teal bg-teal text-on-brand" : "border-line bg-surface text-muted hover:border-teal hover:text-teal"
              }`}
            >
              {t.sounds[id]}
            </button>
          ))}
        </div>
        <label className="mt-4 flex items-center gap-3 text-sm text-text">
          {t.volume}
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.volume}
            onChange={(e) => update({ volume: Number(e.target.value) })}
            className="w-48 accent-teal"
          />
        </label>

        <div className="mt-4 space-y-2 text-sm text-text">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={settings.breakSound} onChange={(e) => update({ breakSound: e.target.checked })} className="accent-teal" />
            {t.breakSound}
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={settings.autoNext} onChange={(e) => update({ autoNext: e.target.checked })} className="accent-teal" />
            {t.autoNext}
          </label>
        </div>
        <p className="mt-4 text-xs text-muted">{t.soundNote}</p>
      </section>
    </div>
  );
}
