import { notFound } from "next/navigation";

// Any address under /ko or /en that no other route matches shows the site's 404 page
// (src/app/[lang]/not-found.tsx) inside the normal header and footer.
export default function CatchAll() {
  notFound();
}
