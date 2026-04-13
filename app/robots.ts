import { MetadataRoute } from "next";

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
