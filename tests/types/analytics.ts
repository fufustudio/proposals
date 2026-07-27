import { trackEvent } from "@/analytics/track-event";

trackEvent("cta_clicked", {
  cta_id: "public_home",
  placement: "public",
});

// @ts-expect-error event names are restricted to the canonical tracking plan
trackEvent("proposal_opened", {
  cta_id: "public_home",
  placement: "public",
});

trackEvent("cta_clicked", {
  cta_id: "public_home",
  // @ts-expect-error private placements are not permitted
  placement: "proposal",
});

trackEvent("cta_clicked", {
  // @ts-expect-error CTA identifiers use the public allowlist
  cta_id: "client-specific-cta",
  placement: "public",
});
