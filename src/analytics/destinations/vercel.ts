import { track } from "@vercel/analytics";
import type { AnalyticsEvent } from "@/analytics/events";
import type { AnalyticsDestination } from "./types";

export function toVercelPayload(event: AnalyticsEvent) {
  switch (event.name) {
    case "cta_clicked":
      return {
        name: event.name,
        properties: {
          cta_id: event.properties.cta_id,
          placement: event.properties.placement,
        },
      };
  }
}

export const vercelDestination: AnalyticsDestination = {
  id: "vercel",
  track(event) {
    const payload = toVercelPayload(event);
    track(payload.name, payload.properties);
  },
};
