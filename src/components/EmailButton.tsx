"use client";

import { useState } from "react";

// A mailto link does nothing on computers without a mail app, so clicking also copies the
// address and says so. Devices with a mail app still open it.
export function EmailButton({ email, label, copiedLabel, className }: { email: string; label: string; copiedLabel: string; className: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <a
      href={`mailto:${email}`}
      className={className}
      onClick={() => {
        navigator.clipboard
          ?.writeText(email)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
          })
          .catch(() => {});
      }}
    >
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </a>
  );
}
