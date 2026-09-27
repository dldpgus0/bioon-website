"use client";

import { useRef, useState } from "react";

// Renders the original Stibee email HTML (same-origin) and grows the iframe to fit it,
// so the web version looks exactly like what subscribers received.
export function EmailFrame({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1200);

  function fit() {
    const doc = ref.current?.contentDocument;
    if (!doc) return;
    doc.documentElement.style.overflow = "hidden";
    const measure = () => setHeight(doc.documentElement.scrollHeight);
    measure();
    // Images and webfonts load after onLoad and change the height.
    new ResizeObserver(measure).observe(doc.body);
    doc.querySelectorAll("a").forEach((a) => a.setAttribute("target", "_blank"));
  }

  return (
    <iframe
      ref={ref}
      src={src}
      title={title}
      onLoad={fit}
      style={{ height }}
      className="w-full rounded-2xl border border-line bg-white"
    />
  );
}
