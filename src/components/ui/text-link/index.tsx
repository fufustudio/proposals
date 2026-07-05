import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import type { PatternHref } from "@/components/types";
import { TrackedLink } from "@/components/ui/tracked-link";
import { cn } from "@/lib/cn";
import styles from "./styles.module.css";

type TextLinkProps = {
  href: PatternHref;
  children: ReactNode;
  className?: string;
  direction?: "forward" | "back" | "none";
  external?: boolean;
  event?: string;
  ariaLabel?: string;
};

export function TextLink({
  href,
  children,
  className = "",
  direction = "forward",
  external = false,
  event,
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
  const classes = cn(styles.root, className);

  if (event) {
    return (
      <TrackedLink
        href={href}
        event={event}
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
