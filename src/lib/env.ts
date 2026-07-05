export function optionalEnvValue(value: string | undefined) {
  return value?.trim() || undefined;
}

function envValue(name: string, fallback?: string) {
  return optionalEnvValue(process.env[name]) ?? fallback;
}

export const publicEnv = {
  siteUrl: envValue("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000",
};
