import { publicEnv } from "@/lib/env";
import type { NavItem } from "@/components/types";

export const SITE_URL = publicEnv.siteUrl;

export const SITE_NAME = "Fufu Proposals";

export const SITE_DEFAULT_DESCRIPTION =
  "A private proposal workspace for Fufu project scopes, timelines, and next steps.";

export type SiteSettings = {
  name: string;
  tagline?: string;
  url: string;
  email?: string;
  sameAs?: readonly string[];
};

export const SITE_SETTINGS = {
  name: SITE_NAME,
  tagline: "Private project proposals prepared by Fufu.",
  url: SITE_URL,
  sameAs: [],
} as const satisfies SiteSettings;

export const MAIN_NAV = [] as const satisfies readonly NavItem[];

export const FOOTER_NAV = [] as const satisfies readonly NavItem[];
