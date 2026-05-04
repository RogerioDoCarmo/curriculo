import type { MetadataRoute } from "next";

// Required for static export in Next.js 16
export const dynamic = "force-static";

/**
 * Web App Manifest for PWA support
 *
 * This manifest controls how the app appears when installed on mobile devices:
 * - "name": Full name shown in app stores and install prompts
 * - "short_name": Short name shown on home screen (what you see under the icon)
 * - Open Graph/Twitter metadata (for sharing) uses the full title from layout.tsx
 *
 * Requirements: 10.1
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rogério do Carmo | Desenvolvedor React Native Mobile",
    short_name: "Rogério do Carmo",
    description:
      "Portifólio e currículo de Rogério do Carmo, especialista em desenvolvimento de aplicações mobile multiplataforma com React Native.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
    ],
  };
}
