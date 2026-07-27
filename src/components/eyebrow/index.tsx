import type { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

const families = {
  mono: styles.mono,
  sans: styles.sans,
} as const;

const tones = {
  accent: styles.toneAccent,
  inherit: styles.toneInherit,
  light: styles.toneLight,
} as const;

export type EyebrowProps = ComponentPropsWithoutRef<"p"> & {
  as?: "p" | "span";
  family?: keyof typeof families;
  tone?: keyof typeof tones;
};

export function Eyebrow({
  as: Component = "p",
  family = "sans",
  tone = "accent",
  className,
  ...props
}: EyebrowProps) {
  return (
    <Component
      data-slot="eyebrow"
      data-family={family}
      data-tone={tone}
      className={clsx(styles.root, families[family], tones[tone], className)}
      {...props}
    />
  );
}
