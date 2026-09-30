import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pages that moved into the tools hub keep working at their old addresses.
  async redirects() {
    return [
      { source: "/:lang(ko|en)/career/tools", destination: "/:lang/tools", permanent: true },
      { source: "/:lang(ko|en)/resources/flashcards", destination: "/:lang/tools/flashcards", permanent: true },
      // The market page was removed; send old links to the tools hub.
      { source: "/:lang(ko|en)/market", destination: "/:lang/tools", permanent: false },
    ];
  },
  // The resource route reads markdown and Office files from disk at request time.
  outputFileTracingIncludes: {
    "/api/resources/*": ["src/content/downloads/**/*"],
    // Insight pages read their web copy for the reference list; share images need the Korean font.
    "/*/insight/*": ["public/newsletters/**/*.html"],
    "/*/insight/*/opengraph-image": ["node_modules/pretendard/dist/public/static/Pretendard-{Bold,Regular}.otf"],
  },
};

export default nextConfig;
