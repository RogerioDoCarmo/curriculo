import { MetadataRoute } from "next";

/**
 * Generate sitemap for all pages and locales
 * Includes alternate language links for each page
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://rogeriodocarmo.com";
  const locales = ["pt-BR", "en", "es"];
  const pages = ["", "/projects", "/experience", "/skills", "/contact"];

  const sitemap: MetadataRoute.Sitemap = [];

  // Generate entries for each page in each locale
  pages.forEach((page) => {
    locales.forEach((locale) => {
      const url = `${baseUrl}/${locale}${page}`;

      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : 0.8,
        alternates: {
          languages: {
            "pt-BR": `${baseUrl}/pt-BR${page}`,
            en: `${baseUrl}/en${page}`,
            es: `${baseUrl}/es${page}`,
          },
        },
      });
    });
  });

  return sitemap;
}
