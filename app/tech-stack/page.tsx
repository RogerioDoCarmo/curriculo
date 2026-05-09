import { redirect } from "next/navigation";

/**
 * Redirect /tech-stack to /pt-BR/tech-stack (default locale)
 */
export default function TechStackRedirect() {
  redirect("/pt-BR/tech-stack");
}
