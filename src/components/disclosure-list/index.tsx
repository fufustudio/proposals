import type { ComponentProps, ReactNode } from "react";
import clsx from "clsx";
import {
  Heading,
  type HeadingElement,
  type HeadingSize,
} from "@/components/heading";
import styles from "./styles.module.css";

export function DisclosureList({ className, ...props }: ComponentProps<"div">) {
  return <div className={clsx(styles.list, className)} {...props} />;
}

export function DisclosureItem({
  title,
  children,
  className,
  summaryClassName,
  titleClassName,
  titleAs = "span",
  titleSize = "item",
  bodyClassName = styles.bodyText,
  bodySpacing = true,
  ...props
}: {
  title: ReactNode;
  children: ReactNode;
  summaryClassName?: string;
  titleClassName?: string;
  titleAs?: HeadingElement | "span";
  titleSize?: HeadingSize;
  bodyClassName?: string;
  bodySpacing?: boolean;
} & Omit<ComponentProps<"details">, "title">) {
  return (
    <details
      data-slot="disclosure-item"
      className={clsx(styles.item, className)}
      {...props}
    >
      <summary className={clsx(styles.summary, summaryClassName)}>
        {titleAs === "span" ? (
          <span className={clsx(styles.title, titleClassName)}>{title}</span>
        ) : (
          <Heading as={titleAs} size={titleSize} className={titleClassName}>
            {title}
          </Heading>
        )}
        <span className={styles.icon} aria-hidden>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </summary>
      <div
        className={clsx(
          styles.body,
          bodySpacing && styles.bodySpaced,
          bodyClassName,
        )}
      >
        {children}
      </div>
    </details>
  );
}
