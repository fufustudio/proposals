import { publicEnv } from "@/config/env";

export const analyticsConfig = {
  vercel: {
    enabled: publicEnv.vercelAnalyticsEnabled,
  },
} as const;
