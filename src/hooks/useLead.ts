"use client";

import { useEffect, useState } from "react";

// Whether this browser has unlocked the gated resources and tools. The unlock cookie is
// HttpOnly, so the state is read from /api/lead on mount and flipped locally after a
// successful sign-up (the subscribe API sets the cookie in the same response).
export function useLead() {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/lead")
      .then((r) => r.json())
      .then((d) => active && setUnlocked(Boolean(d.unlocked)))
      .catch(() => {})
      .finally(() => active && setChecked(true));
    return () => {
      active = false;
    };
  }, []);

  return { unlocked, checked, unlock: () => setUnlocked(true) };
}
