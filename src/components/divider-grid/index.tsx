import type { ReactNode } from "react";
import { Children, isValidElement } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type DividerGridProps = {
  children: ReactNode;
  columns?: 2 | 4;
  twoColumnBreakpoint?: "sm" | "md";
  className?: string;
  itemClassName?: string;
};

export function DividerGrid({
  children,
  columns = 2,
  twoColumnBreakpoint = "sm",
  className = "",
  itemClassName = "",
}: DividerGridProps) {
  const items = Children.toArray(children);

  return (
    <div
      className={clsx(
        columns === 4 ? styles.columns4 : styles.columns2,
        className,
      )}
      data-divider-grid={columns}
    >
      {items.map((child, index) => (
        <div
          key={isValidElement(child) && child.key ? child.key : index}
          className={clsx(
            dividerClasses(index, items.length, columns, twoColumnBreakpoint),
            itemClassName,
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

function dividerClasses(
  index: number,
  count: number,
  columns: 2 | 4,
  breakpoint: "sm" | "md",
) {
  if (columns === 4) {
    return clsx(
      styles.item,
      index < count - 1 && styles.borderBottom,
      index >= count - 2 && styles.borderBottomOffSm,
      index < count - 2 && styles.borderBottomOffLg,
      index % 2 === 0 && styles.borderRightSm,
      index < count - 1 && styles.borderRightLg,
    );
  }

  const borderRight =
    breakpoint === "md" ? styles.borderRightMd : styles.borderRightSm;
  const borderBottomOff =
    breakpoint === "md" ? styles.borderBottomOffMd : styles.borderBottomOffSm;

  return clsx(
    styles.item,
    index < count - 1 && styles.borderBottom,
    index % 2 === 0 && borderRight,
    index === count - 2 && borderBottomOff,
  );
}
