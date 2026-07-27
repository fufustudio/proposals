import type { ComponentProps } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

export function PageShell({
  fixedHeaderOffset = false,
  className,
  ...props
}: {
  fixedHeaderOffset?: boolean;
} & ComponentProps<"div">) {
  return (
    <div
      className={clsx(
        styles.root,
        fixedHeaderOffset && styles.fixedHeaderOffset,
        className,
      )}
      {...props}
    />
  );
}
