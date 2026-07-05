import { SITE_URL } from "@/lib/site-defaults";
import type { SiteSettings } from "@/lib/cms";

export const site = {
  name: "Fufu Starter",
  contactName: "Project Team",
  email: "hello@example.com",
  hours: [],
  primaryActionLabel: "Start a project",
  primaryActionUrl: "/#message",
  url: SITE_URL,
  tagline: "A strict, minimal starter for quickly shaping new projects.",
  areaServed: [],
  sameAs: [],
} satisfies SiteSettings;
