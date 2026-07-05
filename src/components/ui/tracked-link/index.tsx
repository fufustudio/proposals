"use client";

import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import { track } from "@vercel/analytics";
import type { PatternHref } from "@/components/types";

export function TrackedLink({
  href,
  event,
  external = false,
  className,
  ariaLabel,
  children,
}: {
  href: PatternHref;
  event: string;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  const handleClick = () => track(event);

  if (external) {
    return (
      <a
        href={String(href)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={className}
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
      className={className}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
