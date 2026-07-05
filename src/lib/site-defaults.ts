import { publicEnv } from "@/lib/env";
import type { NavItem } from "@/components/types";

export const SITE_URL = publicEnv.siteUrl;

export const SITE_NAME = "Fufu Starter";

export const SITE_DEFAULT_DESCRIPTION =
  "A lightweight Next.js starter for consistent Fufu project delivery.";

export const MAIN_NAV = [] as const satisfies readonly NavItem[];

export const FOOTER_NAV = [] as const satisfies readonly NavItem[];
