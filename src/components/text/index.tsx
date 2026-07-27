import type { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

const variants = {
  body: styles.body,
  lead: styles.lead,
  compact: styles.compact,
  small: styles.small,
  prose: styles.prose,
} as const;

const tones = {
  default: styles.toneDefault,
  strong: styles.toneStrong,
  inherit: styles.toneInherit,
  light: styles.toneLight,
} as const;

export type TextElement = "p" | "span" | "div";
export type TextVariant = keyof typeof variants;
export type TextTone = keyof typeof tones;

export type TextProps = ComponentPropsWithoutRef<"p"> & {
  as?: TextElement;
  variant?: TextVariant;
  tone?: TextTone;
};

export function Text({
  as: Component = "p",
  variant = "body",
  tone = "default",
  className,
  ...props
}: TextProps) {
  return (
    <Component
      data-slot="text"
      data-variant={variant}
      data-tone={tone}
      className={clsx(styles.root, variants[variant], tones[tone], className)}
      {...props}
    />
  );
}
