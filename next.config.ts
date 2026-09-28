import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The resource route reads markdown and Office files from disk at request time.
  outputFileTracingIncludes: {
    "/api/resources/*": ["src/content/downloads/**/*"],
  },
};

export default nextConfig;
