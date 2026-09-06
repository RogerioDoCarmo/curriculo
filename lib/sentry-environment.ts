export type SentryEnvironment = "production" | "preview" | "local";

/**
 * Distinguishes a real Vercel deployment from a local machine build.
 * NODE_ENV can't do this — a local `next build && next start` also sets
 * NODE_ENV=production. VERCEL_ENV is only set by Vercel's build infra.
 */
export function getSentryEnvironment(): SentryEnvironment {
  const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;
  if (vercelEnv === "production" || vercelEnv === "preview") {
    return vercelEnv;
  }
  return "local";
}

export function isSentryEnabled(environment: SentryEnvironment): boolean {
  return environment === "production" || environment === "preview";
}
