import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed pages (tools hub, market) send old links to the home page.
  async redirects() {
    return [
      { source: "/:lang(ko|en)/tools", destination: "/:lang", permanent: false },
      { source: "/:lang(ko|en)/tools/:path*", destination: "/:lang", permanent: false },
      { source: "/:lang(ko|en)/career/tools", destination: "/:lang", permanent: false },
      { source: "/:lang(ko|en)/resources/flashcards", destination: "/:lang", permanent: false },
      { source: "/:lang(ko|en)/market", destination: "/:lang", permanent: false },
      // The wiki was replaced by the card news archive.
      { source: "/:lang(ko|en)/wiki", destination: "/:lang/cardnews", permanent: false },
      { source: "/:lang(ko|en)/wiki/:path*", destination: "/:lang/cardnews", permanent: false },
    ];
  },
  // The resource route reads markdown and Office files from disk at request time.
  outputFileTracingIncludes: {
    "/api/resources/*": ["src/content/downloads/**/*"],
    // Insight pages read their web copy for the reference list; share images need the Korean font.
    "/*/insight/*": ["public/newsletters/**/*.html"],
    "/*/insight/*/opengraph-image": ["src/fonts/Pretendard-{Bold,Regular}.otf"],
  },
  // Keep server functions small (Vercel counts their size against the Hobby storage limit):
  // Vercel optimises images itself, so the sharp binaries aren't needed in the bundles.
  outputFileTracingExcludes: {
    "*": ["node_modules/@img/**", "node_modules/sharp/**"],
  },
};

export default nextConfig;
