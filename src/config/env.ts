export function optionalEnvValue(value: string | undefined) {
  return value?.trim() || undefined;
}

export function envBoolean(
  value: string | undefined,
  name: string,
  fallback: boolean,
) {
  const normalized = optionalEnvValue(value)?.toLowerCase();

  if (!normalized) return fallback;
  if (normalized === "true") return true;
  if (normalized === "false") return false;

  throw new Error(`${name} must be "true" or "false".`);
}

function envValue(name: string, fallback?: string) {
  return optionalEnvValue(process.env[name]) ?? fallback;
}

export const publicEnv = {
  vercelAnalyticsEnabled: envBoolean(
    process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED,
    "NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED",
    true,
  ),
  siteUrl: envValue("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000",
};
