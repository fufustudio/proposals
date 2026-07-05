import type { ComponentProps } from "react";
import styles from "./styles.module.css";

const widths = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
} as const;

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Container({
  size = "lg",
  className = "",
  ...props
}: { size?: keyof typeof widths } & ComponentProps<"div">) {
  return (
    <div
      className={classNames(styles.root, widths[size], className)}
      {...props}
    />
  );
}
