import type { AnalyticsEvent } from "@/analytics/events";

export type AnalyticsDestination = {
  id: string;
  track(event: AnalyticsEvent): void;
};
