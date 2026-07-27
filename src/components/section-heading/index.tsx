import type { ReactNode } from "react";
import clsx from "clsx";
import { Eyebrow } from "@/components/eyebrow";
import {
  Heading,
  type HeadingElement,
  type HeadingSize,
} from "@/components/heading";
import { Text } from "@/components/text";
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

export function SectionHeading({
  eyebrow,
  heading,
  intro,
  align = "center",
  width = "md",
  gap = "default",
  headingAs = "h2",
  headingSize,
  tone = "default",
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
  headingAs?: HeadingElement;
  headingSize?: HeadingSize;
  tone?: "default" | "inherit" | "light";
  headingClassName?: string;
  introClassName?: string;
  className?: string;
}) {
  return (
    <div
      data-slot="section-heading"
      className={clsx(
        styles.root,
        alignments[align],
        widths[width],
        gaps[gap],
        className,
      )}
    >
      {eyebrow ? (
        <Eyebrow tone={tone === "default" ? "accent" : tone}>{eyebrow}</Eyebrow>
      ) : null}
      <Heading
        as={headingAs}
        size={headingSize ?? (headingAs === "h1" ? "display" : "section")}
        tone={tone}
        className={clsx(
          eyebrow ? styles.headingAfterEyebrow : undefined,
          headingClassName,
        )}
      >
        {heading}
      </Heading>
      {intro ? (
        <Text tone={tone} className={clsx(styles.intro, introClassName)}>
          {intro}
        </Text>
      ) : null}
    </div>
  );
}
