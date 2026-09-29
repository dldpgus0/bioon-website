import { socials, type SocialId } from "@/lib/site";

// Simple filled glyphs (24px grid, fill = currentColor).
const glyphs: Record<SocialId, React.ReactNode> = {
  linkedin: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3zM9.5 9.75h3.8v1.55h.05c.53-1 1.83-1.8 3.65-1.8 3.9 0 4.5 2.4 4.5 5.6v5.65h-4v-5c0-1.2 0-2.75-1.7-2.75s-1.95 1.3-1.95 2.65v5.1H9.5z" />
  ),
  instagram: (
    <path d="M12 3c2.45 0 2.75.01 3.72.05 2.5.12 3.67 1.3 3.78 3.78.05.97.05 1.27.05 3.72s0 2.75-.05 3.72c-.11 2.47-1.28 3.66-3.78 3.78-.97.04-1.27.05-3.72.05s-2.75-.01-3.72-.05c-2.5-.12-3.67-1.31-3.78-3.78C4.46 15.3 4.45 15 4.45 12.55s.01-2.75.05-3.72C4.61 6.35 5.78 5.17 8.28 5.05 9.25 5.01 9.55 5 12 5zm0-2c-2.5 0-2.8.01-3.8.06-3.36.15-5.23 2.02-5.38 5.38C2.76 7.44 2.75 7.75 2.75 12.25s.01 4.8.06 5.8c.15 3.36 2.02 5.23 5.38 5.38 1 .05 1.3.06 3.8.06s2.8-.01 3.8-.06c3.36-.15 5.23-2.02 5.38-5.38.05-1 .06-1.3.06-5.8s-.01-4.8-.06-5.8c-.15-3.36-2.02-5.23-5.38-5.38C14.8 1.01 14.5 1 12 1zm0 6.25a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm5.2-9.4a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3z" />
  ),
  email: (
    <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.2L4 7.4V17h16V7.4zm0-2.3L19.2 7H4.8z" />
  ),
};

export function SocialLinks({ className = "", size = "h-5 w-5" }: { className?: string; size?: string }) {
  return (
    <ul className={`flex items-center gap-4 ${className}`}>
      {socials.map((s) => (
        <li key={s.id}>
          <a
            href={s.href}
            aria-label={s.label}
            title={s.label}
            {...(s.id === "email" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            className="block text-muted transition-colors hover:text-teal"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className={size} aria-hidden>
              {glyphs[s.id]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
