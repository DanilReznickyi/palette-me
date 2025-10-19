// next.config.ts
const isProd = process.env.NODE_ENV === "production";

const repo = "palette-me";

export default {
  output: "export",
  images: { unoptimized: true },
  basePath: process.env.NODE_ENV === "production" ? "/palette-me" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/palette-me/" : "",
  trailingSlash: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
} as const;

