// Absolute base for canonical, og:* and sitemap URLs. Vercel provides the production domain at
// build time; NEXT_PUBLIC_SITE_URL overrides it (e.g. a custom domain).
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

// Public profile links shown in the hero, footer and About page.
export const socials = [
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/lyh359/" },
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/bio.on_insight/" },
  { id: "email", label: "Email", href: "mailto:yaehyun.lee59@gmail.com" },
] as const;

export type SocialId = (typeof socials)[number]["id"];
