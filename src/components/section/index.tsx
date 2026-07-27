import type { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

const tones = {
  default: styles.toneDefault,
  raised: styles.raised,
  muted: styles.muted,
  feature: styles.feature,
  contrast: styles.contrast,
} as const;

const sizes = {
  compact: styles.compact,
  default: styles.default,
  page: styles.page,
  spacious: styles.spacious,
} as const;

export type SectionTone = keyof typeof tones;
export type SectionSize = keyof typeof sizes;

export function Section({
  as: Component = "section",
  tone = "default",
  size = "default",
  className = "",
  ...props
}: {
  as?: "section" | "div";
  tone?: SectionTone;
  size?: SectionSize;
} & ComponentPropsWithoutRef<"section">) {
  return (
    <Component
      data-slot="section"
      data-size={size}
      data-tone={tone}
      className={clsx(styles.root, sizes[size], tones[tone], className)}
      {...props}
    />
  );
}
