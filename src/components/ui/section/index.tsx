import type { ComponentProps } from "react";
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

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Section({
  tone = "default",
  size = "default",
  className = "",
  ...props
}: {
  tone?: SectionTone;
  size?: SectionSize;
} & ComponentProps<"section">) {
  return (
    <section
      className={classNames(styles.root, sizes[size], tones[tone], className)}
      {...props}
    />
  );
}
