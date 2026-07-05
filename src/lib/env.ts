export function optionalEnvValue(value: string | undefined) {
  return value?.trim() || undefined;
}

function envValue(name: string, fallback?: string) {
  return optionalEnvValue(process.env[name]) ?? fallback;
}

export const publicEnv = {
  sanityProjectId: envValue("NEXT_PUBLIC_SANITY_PROJECT_ID"),
  sanityDataset: envValue("NEXT_PUBLIC_SANITY_DATASET") ?? "production",
  sanityApiVersion: envValue("NEXT_PUBLIC_SANITY_API_VERSION") ?? "2026-06-24",
  siteUrl: envValue("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000",
};
