import type { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

const sizes = {
  display: styles.display,
  section: styles.section,
  module: styles.module,
  item: styles.item,
} as const;

const tones = {
  default: styles.toneDefault,
  inherit: styles.toneInherit,
  light: styles.toneLight,
} as const;

export type HeadingElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type HeadingSize = keyof typeof sizes;
export type HeadingTone = keyof typeof tones;

const defaultSizes: Record<HeadingElement, HeadingSize> = {
  h1: "display",
  h2: "section",
  h3: "item",
  h4: "item",
  h5: "item",
  h6: "item",
};

export type HeadingProps = Omit<ComponentPropsWithoutRef<"h2">, "color"> & {
  as?: HeadingElement;
  size?: HeadingSize;
  tone?: HeadingTone;
};

export function Heading({
  as: Component = "h2",
  size,
  tone = "default",
  className,
  ...props
}: HeadingProps) {
  const resolvedSize = size ?? defaultSizes[Component];

  return (
    <Component
      data-slot="heading"
      data-size={resolvedSize}
      data-tone={tone}
      className={clsx(styles.root, sizes[resolvedSize], tones[tone], className)}
      {...props}
    />
  );
}
