import { redirect } from "next/navigation";

/**
 * Redirect /terms to /pt-BR/terms (default locale)
 */
export default function TermsRedirect() {
  redirect("/pt-BR/terms");
}
