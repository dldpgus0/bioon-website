// Public profile links shown in the hero, footer and About page.
export const socials = [
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/lyh359/" },
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/bio.on_insight/" },
  { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@bioon.insight" },
  { id: "email", label: "Email", href: "mailto:yaehyun.lee59@gmail.com" },
] as const;

export type SocialId = (typeof socials)[number]["id"];
