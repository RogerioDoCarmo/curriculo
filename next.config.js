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
};

module.exports = nextConfig;
