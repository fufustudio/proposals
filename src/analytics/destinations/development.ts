import type { AnalyticsEvent } from "@/analytics/events";
import type { AnalyticsDestination } from "./types";

const badgeStyle = [
  "background:#6d28d9",
  "border-radius:3px",
  "color:#fff",
  "font-weight:600",
  "padding:2px 6px",
].join(";");
const eventStyle = "color:#0f766e;font-weight:600";
const contextStyle = "color:#64748b";

export function logDevelopmentEvent(event: AnalyticsEvent) {
  console.groupCollapsed(
    "%c ANALYTICS %c %s %c %s ",
    badgeStyle,
    eventStyle,
    event.name,
    contextStyle,
    event.properties.placement,
  );
  console.log("Canonical event", event);
  console.table(event.properties);
  console.groupEnd();
}

export const developmentDestination: AnalyticsDestination = {
  id: "development",
  track: logDevelopmentEvent,
};
