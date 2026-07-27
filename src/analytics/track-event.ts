import { analyticsConfig } from "@/analytics/config";
import { developmentDestination } from "@/analytics/destinations/development";
import type { AnalyticsDestination } from "@/analytics/destinations/types";
import { vercelDestination } from "@/analytics/destinations/vercel";
import {
  createAnalyticsEvent,
  type AnalyticsEvent,
  type AnalyticsEventName,
  type TrackEventArgs,
} from "@/analytics/events";

export function configuredDestinations(
  config: { vercel: { enabled: boolean } },
  destination: AnalyticsDestination = vercelDestination,
) {
  return config.vercel.enabled ? [destination] : [];
}

const enabledDestinations = [
  ...(process.env.NODE_ENV === "development" ? [developmentDestination] : []),
  ...configuredDestinations(analyticsConfig),
];

export function trackEvent<Name extends AnalyticsEventName>(
  name: Name,
  ...args: TrackEventArgs<Name>
) {
  trackAnalyticsEvent(createAnalyticsEvent(name, ...args) as AnalyticsEvent);
}

export function trackAnalyticsEvent(event: AnalyticsEvent) {
  dispatchAnalyticsEvent(event, enabledDestinations);
}

export function dispatchAnalyticsEvent(
  event: AnalyticsEvent,
  destinations: readonly AnalyticsDestination[],
) {
  for (const destination of destinations) {
    try {
      destination.track(event);
    } catch {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[analytics] ${destination.id} could not track "${event.name}".`,
        );
      }
    }
  }
}
