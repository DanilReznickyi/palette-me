// next.config.ts
const isProd = process.env.NODE_ENV === "production";

export default {
  output: "export",
  images: { unoptimized: true },
  basePath: isProd ? "/palette-me" : "",
  assetPrefix: isProd ? "/palette-me/" : "",
  trailingSlash: true,


  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
} as const;
