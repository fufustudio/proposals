import Link, { type LinkProps } from "next/link";
import clsx from "clsx";
import type { PatternAction } from "@/components/types";
import { buttonClasses, type ButtonSize } from "@/components/button";
import { TrackedLink } from "@/components/tracked-link";
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
  actions?: readonly PatternAction[];
  align?: keyof typeof alignments;
  size?: ButtonSize;
  className?: string;
}) {
  if (!actions?.length) return null;

  return (
    <div className={clsx(styles.root, alignments[align], className)}>
      {actions.map((action, index) => {
        const variant = action.variant ?? (index === 0 ? "primary" : "ghost");
        const classes = buttonClasses(variant, "", size);

        if (action.analytics) {
          return (
            <TrackedLink
              key={`${String(action.href)}-${index}`}
              href={action.href}
              analytics={action.analytics}
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

export type ActionGroupAction = PatternAction;
