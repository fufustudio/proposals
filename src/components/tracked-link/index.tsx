"use client";

import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import clsx from "clsx";
import { trackAnalyticsEvent } from "@/analytics/track-event";
import type { AnalyticsEvent } from "@/analytics/events";
import type { PatternHref } from "@/components/types";
import styles from "./styles.module.css";

export function TrackedLink({
  href,
  analytics,
  external = false,
  className,
  ariaLabel,
  children,
}: {
  href: PatternHref;
  analytics: AnalyticsEvent;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  const handleClick = () => trackAnalyticsEvent(analytics);

  if (external) {
    return (
      <a
        href={String(href)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={clsx(styles.root, className)}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href as LinkProps<string>["href"]}
      aria-label={ariaLabel}
      className={clsx(styles.root, className)}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
