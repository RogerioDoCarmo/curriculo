const createNextIntlPlugin = require("next-intl/plugin");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = createNextIntlPlugin("./i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Static export for Vercel
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Better compatibility
  eslint: {
    ignoreDuringBuilds: true, // We'll run ESLint separately in CI
  },
  typescript: {
    ignoreBuildErrors: true, // We'll run TypeScript checks separately in CI
  },
  // For static export with i18n, we need to disable locale detection
  // Users will navigate to /en, /es, or /pt-BR directly
};

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
