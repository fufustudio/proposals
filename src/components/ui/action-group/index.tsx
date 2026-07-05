import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import type { PatternHref } from "@/components/types";
import {
  buttonClasses,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button";
import { TrackedLink } from "@/components/ui/tracked-link";
import { cn } from "@/lib/cn";
import styles from "./styles.module.css";

const alignments = {
  left: styles.left,
  center: styles.center,
} as const;

export function ActionGroup({
  actions,
  align = "left",
  size = "md",
  className,
}: {
  actions?: readonly ActionGroupAction[];
  align?: keyof typeof alignments;
  size?: ButtonSize;
  className?: string;
}) {
  if (!actions?.length) return null;

  return (
    <div className={cn(styles.root, alignments[align], className)}>
      {actions.map((action, index) => {
        const variant = action.variant ?? (index === 0 ? "primary" : "ghost");
        const classes = buttonClasses(variant, "", size);

        if (action.event) {
          return (
            <TrackedLink
              key={`${String(action.href)}-${index}`}
              href={action.href}
              event={action.event}
              external={action.external}
              ariaLabel={action.ariaLabel}
              className={classes}
            >
              {action.label}
            </TrackedLink>
          );
        }

        if (action.external) {
          return (
            <a
              key={`${String(action.href)}-${index}`}
              href={String(action.href)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={action.ariaLabel}
              className={classes}
            >
              {action.label}
            </a>
          );
        }

        return (
          <Link
            key={`${String(action.href)}-${index}`}
            href={action.href as LinkProps<string>["href"]}
            aria-label={action.ariaLabel}
            className={classes}
          >
            {action.label}
          </Link>
        );
      })}
    </div>
  );
}

export type ActionGroupAction = {
  label: ReactNode;
  href: PatternHref;
  variant?: ButtonVariant;
  event?: string;
  external?: boolean;
  ariaLabel?: string;
};
