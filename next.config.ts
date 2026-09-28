import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The resource route reads markdown and Office files from disk at request time.
  outputFileTracingIncludes: {
    "/api/resources/*": ["src/content/downloads/**/*"],
    // Insight pages read their web copy for the reference list; share images need the Korean font.
    "/*/insight/*": ["public/newsletters/**/*.html"],
    "/*/insight/*/opengraph-image": ["node_modules/pretendard/dist/public/static/Pretendard-{Bold,Regular}.otf"],
  },
};

export default nextConfig;
