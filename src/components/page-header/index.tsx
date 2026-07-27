import type { ReactNode } from "react";
import clsx from "clsx";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import styles from "./styles.module.css";

type ContainerWidth = "sm" | "md" | "lg" | "xl";

const headingWidths = {
  sm: styles.widthSm,
  md: styles.widthMd,
  lg: styles.widthLg,
  xl: styles.widthXl,
} as const;

type PageHeaderProps = {
  eyebrow?: ReactNode;
  heading: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  width?: ContainerWidth;
  layout?: "stack" | "grid";
  headingWidth?: keyof typeof headingWidths;
  align?: "center" | "left";
  sectionSize?: "compact" | "default" | "page" | "spacious";
};

export function PageHeader({
  eyebrow,
  heading,
  intro,
  children,
  width,
  layout = "stack",
  headingWidth = "md",
  align = "center",
  sectionSize = "page",
}: PageHeaderProps) {
  const gridLayout = layout === "grid";
  const resolvedContainerSize = width ?? (gridLayout ? "xl" : "md");
  const headerGap = children ? styles.hasChildren : undefined;
  const headingClasses = clsx(
    gridLayout && styles.headingGrid,
    gridLayout && headingWidths[headingWidth],
    headerGap,
  );

  return (
    <Section size={sectionSize} data-slot="page-header">
      <Container
        size={resolvedContainerSize}
        className={clsx(styles.header, gridLayout ? styles.grid : styles.stack)}
      >
        <SectionHeading
          eyebrow={eyebrow}
          heading={heading}
          intro={intro}
          align={align}
          width={headingWidth === "xl" ? "lg" : headingWidth}
          gap="none"
          headingAs="h1"
          className={headingClasses}
        />
        {children && gridLayout ? (
          <div className={clsx(styles.childrenGrid, headingWidths.xl)}>
            {children}
          </div>
        ) : (
          children
        )}
      </Container>
    </Section>
  );
}
