"use client";

import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import { track } from "@vercel/analytics";
import type { PatternHref } from "@/components/types";
import styles from "./styles.module.css";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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
        className={classNames(styles.root, className)}
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
      className={classNames(styles.root, className)}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
