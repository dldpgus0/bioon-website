"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

/**
 * Full-screen mode for one element. Uses the browser Fullscreen API where available; where it
 * isn't (e.g. iPhone Safari) the caller's CSS "full" state still fills the viewport, and Esc exits.
 */
export function useFullscreen(ref: RefObject<HTMLElement | null>) {
  const [full, setFull] = useState(false);
  const native = useRef(false);

  const exit = useCallback(() => {
    if (native.current && document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    native.current = false;
    setFull(false);
  }, []);

  const enter = useCallback(() => {
    setFull(true);
    const el = ref.current;
    if (el?.requestFullscreen) {
      el.requestFullscreen()
        .then(() => {
          native.current = true;
        })
        .catch(() => {});
    }
  }, [ref]);

  const toggle = useCallback(() => (full ? exit() : enter()), [full, enter, exit]);

  useEffect(() => {
    // Leaving native full screen (Esc, browser UI) also leaves our CSS state.
    const onChange = () => {
      if (!document.fullscreenElement && native.current) {
        native.current = false;
        setFull(false);
      }
    };
    // In the CSS-only fallback, Esc exits.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && full && !native.current) setFull(false);
    };
    document.addEventListener("fullscreenchange", onChange);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      window.removeEventListener("keydown", onKey);
    };
  }, [full]);

  return { full, toggle };
}

/** Classes that make an element fill the screen (used for both native and fallback modes). */
export const fullscreenClasses = "fixed inset-0 z-[60] flex flex-col justify-center overflow-y-auto bg-bg p-4 sm:p-10";
