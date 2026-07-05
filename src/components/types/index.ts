import type { LinkProps } from "next/link";

export type PatternHref = LinkProps<string>["href"] | string;

export type NavItem = {
  label: string;
  href: PatternHref;
};
