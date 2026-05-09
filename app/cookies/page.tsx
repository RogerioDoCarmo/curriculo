import { redirect } from "next/navigation";

/**
 * Redirect /cookies to /pt-BR/cookies (default locale)
 */
export default function CookiesRedirect() {
  redirect("/pt-BR/cookies");
}
