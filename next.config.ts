// next.config.ts
const isProd = process.env.NODE_ENV === "production";

// Если репозиторий будет называться `palette-me`,
// на GitHub Pages проект будет доступен по /palette-me
const repo = "palette-me";

export default {
  output: "export",               // важное — статический экспорт
  images: { unoptimized: true },  // потому что у нас нет Image-оптимизатора на GH Pages
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  trailingSlash: true,            // так проще на GH Pages
} as const;
