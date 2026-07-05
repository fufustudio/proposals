import Link, { type LinkProps } from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { PatternHref } from "@/components/types";
import { cn } from "@/lib/cn";
import styles from "./styles.module.css";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md";

const variants: Record<ButtonVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  outline: styles.outline,
  ghost: styles.ghost,
};

const sizes: Record<ButtonSize, string> = {
  sm: styles.sm,
  md: styles.md,
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  className = "",
  size: ButtonSize = "md",
) {
  return cn(styles.root, variants[variant], sizes[size], className);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
} & ComponentProps<"button">) {
  return (
    <button className={buttonClasses(variant, className, size)} {...props} />
  );
}

export function ButtonLink({
  href,
  external = false,
  variant = "primary",
  size = "md",
  className,
  children,
  ariaLabel,
}: {
  href: PatternHref;
  external?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const classes = buttonClasses(variant, className, size);

  if (external) {
    return (
      <a
        href={String(href)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href as LinkProps<string>["href"]}
      aria-label={ariaLabel}
      className={classes}
    >
      {children}
    </Link>
  );
}
