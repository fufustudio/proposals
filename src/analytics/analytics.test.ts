import { describe, expect, it, vi } from "vitest";

import type { AnalyticsDestination } from "@/analytics/destinations/types";
import { logDevelopmentEvent } from "@/analytics/destinations/development";
import { toVercelPayload } from "@/analytics/destinations/vercel";
import { createAnalyticsEvent } from "@/analytics/events";
import {
  configuredDestinations,
  dispatchAnalyticsEvent,
} from "@/analytics/track-event";

describe("typed analytics", () => {
  const event = createAnalyticsEvent("cta_clicked", {
    cta_id: "public_home",
    placement: "public",
  });

  it("creates and maps only the declared event properties", () => {
    expect(event).toEqual({
      name: "cta_clicked",
      properties: {
        cta_id: "public_home",
        placement: "public",
      },
    });
    expect(toVercelPayload(event)).toEqual(event);
  });

  it("enables the Vercel destination only when configured", () => {
    const destination: AnalyticsDestination = {
      id: "test",
      track: vi.fn(),
    };

    expect(
      configuredDestinations({ vercel: { enabled: true } }, destination),
    ).toEqual([destination]);
    expect(
      configuredDestinations({ vercel: { enabled: false } }, destination),
    ).toEqual([]);
  });

  it("isolates destination failures", () => {
    const success = vi.fn();
    const destinations: AnalyticsDestination[] = [
      {
        id: "failure",
        track() {
          throw new Error("destination failed");
        },
      },
      { id: "success", track: success },
    ];

    dispatchAnalyticsEvent(event, destinations);
    expect(success).toHaveBeenCalledWith(event);
  });

  it("logs the canonical event through the development destination", () => {
    const group = vi.spyOn(console, "groupCollapsed").mockImplementation(() => {
      // Test spy.
    });
    const log = vi.spyOn(console, "log").mockImplementation(() => {
      // Test spy.
    });
    const table = vi.spyOn(console, "table").mockImplementation(() => {
      // Test spy.
    });
    const end = vi.spyOn(console, "groupEnd").mockImplementation(() => {
      // Test spy.
    });

    logDevelopmentEvent(event);

    expect(group).toHaveBeenCalledWith(
      expect.stringContaining("ANALYTICS"),
      expect.any(String),
      expect.any(String),
      "cta_clicked",
      expect.any(String),
      "public",
    );
    expect(log).toHaveBeenCalledWith("Canonical event", event);
    expect(table).toHaveBeenCalledWith(event.properties);
    expect(end).toHaveBeenCalled();
  });
});
