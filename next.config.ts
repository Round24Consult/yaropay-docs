import type { NextConfig } from "next"

/**
 * yaropay.com/docs, rendered at build time from the Markdown in docs/. Exported as static files (out/)
 * and served by Caddy under /docs. The rest of yaropay.com is a separate site.
 */
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/docs",
  trailingSlash: false,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
}

export default nextConfig
