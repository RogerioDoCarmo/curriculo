import { MetadataRoute } from "next";

// Required for static export in Next.js 16
export const dynamic = "force-static";

/**
 * Generate robots.txt to allow all crawlers
 * Includes sitemap URL for search engines
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [],
    },
    sitemap: "https://rogeriodocarmo.com/sitemap.xml",
  };
}
