import { redirect } from "next/navigation";

/**
 * Redirect /privacy to /pt-BR/privacy (default locale)
 */
export default function PrivacyRedirect() {
  redirect("/pt-BR/privacy");
}
