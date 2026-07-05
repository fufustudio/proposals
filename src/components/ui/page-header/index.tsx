import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import styles from "./styles.module.css";

type ContainerWidth = "sm" | "md" | "lg" | "xl";

const headingWidths = {
  sm: styles.widthSm,
  md: styles.widthMd,
  lg: styles.widthLg,
  xl: styles.widthXl,
} as const;

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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
  const headingClasses = classNames(
    gridLayout && styles.headingGrid,
    gridLayout && headingWidths[headingWidth],
    headerGap,
  );

  return (
    <Section size={sectionSize}>
      <Container
        size={resolvedContainerSize}
        className={classNames(
          styles.header,
          gridLayout ? styles.grid : styles.stack,
        )}
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
          <div className={classNames(styles.childrenGrid, headingWidths.xl)}>
            {children}
          </div>
        ) : (
          children
        )}
      </Container>
    </Section>
  );
}
