// next.config.ts
const isPages = process.env.NEXT_STATIC_EXPORT === "1";

export default {

  output: isPages ? "export" : undefined,

  images: { unoptimized: isPages },
  basePath: isPages ? "/palette-me" : "",
  assetPrefix: isPages ? "/palette-me/" : "",
  trailingSlash: isPages,


  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
} as const;
