"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_LOCALE } from "@/types/index";

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
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Redirecting...</p>
        </div>
      </body>
    </html>
  );
}
