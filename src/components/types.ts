import type { LinkProps } from "next/link";
import type { ImageProps } from "next/image";
import type { ReactNode } from "react";
import type { AnalyticsEvent } from "@/analytics/events";

export type PatternHref = LinkProps<string>["href"] | string;

export type PatternAction = {
  label: ReactNode;
  href: PatternHref;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  analytics?: AnalyticsEvent;
  external?: boolean;
  ariaLabel?: string;
};

export type PatternImage = {
  src: ImageProps["src"];
  alt: string;
  sizes?: string;
  preload?: boolean;
  quality?: number;
  placeholder?: ImageProps["placeholder"];
  blurDataURL?: string;
  objectPosition?: string;
};

export type NavItem = {
  label: string;
  href: PatternHref;
};
