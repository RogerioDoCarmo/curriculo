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
    // Define device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Define image sizes for different layouts
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Supported formats
    formats: ["image/webp"],
  },
  trailingSlash: true, // Better compatibility with static hosting
  typescript: {
    ignoreBuildErrors: true, // We'll run TypeScript checks separately in CI
  },
  // Compress output
  compress: true,
  // Generate ETags for better caching
  generateEtags: true,
  // Power by header
  poweredByHeader: false, // Remove X-Powered-By header for security
  // React strict mode for better development experience
  reactStrictMode: true,
};

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
