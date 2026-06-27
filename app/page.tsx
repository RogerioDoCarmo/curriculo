"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_LOCALE } from "@/types/index";
// Load Tailwind on this standalone redirect page so utility classes apply
// (it renders its own <html>/<body> outside the locale layout).
import "./globals.css";

/**
 * Root page - redirects to default locale using client-side navigation
 * This avoids redirect loops with static export
 */
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${DEFAULT_LOCALE}`);
  }, [router]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="p-8 text-center">
          <p>Redirecting...</p>
        </div>
      </body>
    </html>
  );
}
