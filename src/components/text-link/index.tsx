import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import clsx from "clsx";
import type { AnalyticsEvent } from "@/analytics/events";
import type { PatternHref } from "@/components/types";
import { TrackedLink } from "@/components/tracked-link";
import styles from "./styles.module.css";

type TextLinkProps = {
  href: PatternHref;
  children: ReactNode;
  className?: string;
  direction?: "forward" | "back" | "none";
  external?: boolean;
  analytics?: AnalyticsEvent;
  ariaLabel?: string;
};

export function TextLink({
  href,
  children,
  className = "",
  direction = "forward",
  external = false,
  analytics,
  ariaLabel,
}: TextLinkProps) {
  const childText = typeof children === "string" ? children.trim() : "";
  const childHasArrow = /[→›»]$/.test(childText);
  const prefix = direction === "back" ? "← " : "";
  const suffix = direction === "forward" && !childHasArrow ? " →" : "";

  const content = (
    <>
      {prefix}
      {children}
      {suffix}
    </>
  );
  const classes = clsx(styles.root, className);

  if (analytics) {
    return (
      <TrackedLink
        href={href}
        analytics={analytics}
        external={external}
        ariaLabel={ariaLabel}
        className={classes}
      >
        {content}
      </TrackedLink>
    );
  }

  if (external) {
    return (
      <a
        href={String(href)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href as LinkProps<string>["href"]}
      aria-label={ariaLabel}
      className={classes}
    >
      {content}
    </Link>
  );
}
