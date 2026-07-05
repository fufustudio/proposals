import type { ComponentProps } from "react";
import styles from "./styles.module.css";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function PageShell({
  fixedHeaderOffset = false,
  className,
  ...props
}: {
  fixedHeaderOffset?: boolean;
} & ComponentProps<"div">) {
  return (
    <div
      className={classNames(
        styles.root,
        fixedHeaderOffset && styles.fixedHeaderOffset,
        className,
      )}
      {...props}
    />
  );
}
