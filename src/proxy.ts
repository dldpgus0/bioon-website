import { NextResponse, type NextRequest } from "next/server";

const locales = ["ko", "en"];

// Picks ko/en from Accept-Language; anything that isn't English falls back to Korean.
function preferredLocale(request: NextRequest) {
  const header = request.headers.get("accept-language") ?? "";
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.slice(0, 2).toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  return ranked.find((r) => locales.includes(r.lang))?.lang ?? "ko";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return;

  request.nextUrl.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  // The bare domain serves the home page in place rather than redirecting, so search engine
  // ownership checks (which read the meta tags on "/") see them directly.
  if (pathname === "/") return NextResponse.rewrite(request.nextUrl);
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next internals, API routes, and any file with an extension (images, newsletter HTML).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
