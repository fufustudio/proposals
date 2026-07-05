import type { ReactNode } from "react";
import styles from "./styles.module.css";

const alignments = {
  center: styles.center,
  left: styles.left,
} as const;

const widths = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
} as const;

const gaps = {
  none: "",
  default: styles.gapDefault,
  spacious: styles.gapSpacious,
} as const;

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function SectionHeading({
  eyebrow,
  heading,
  intro,
  align = "center",
  width = "md",
  gap = "default",
  headingAs: Heading = "h2",
  headingClassName,
  introClassName,
  className,
}: {
  eyebrow?: ReactNode;
  heading: ReactNode;
  intro?: ReactNode;
  align?: keyof typeof alignments;
  width?: keyof typeof widths;
  gap?: keyof typeof gaps;
  headingAs?: "h1" | "h2" | "h3";
  headingClassName?: string;
  introClassName?: string;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        styles.root,
        alignments[align],
        widths[width],
        gaps[gap],
        className,
      )}
    >
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <Heading
        className={classNames(
          eyebrow ? styles.headingAfterEyebrow : undefined,
          headingClassName,
        )}
      >
        {heading}
      </Heading>
      {intro ? (
        <p className={classNames(styles.intro, introClassName)}>{intro}</p>
      ) : null}
    </div>
  );
}
