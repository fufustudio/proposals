import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import {
  Section,
  type SectionSize,
  type SectionTone,
} from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";
import styles from "./styles.module.css";

const layouts = {
  stack: styles.stack,
  grid: styles.gridLayout,
} as const;

export type StepItem = {
  title: ReactNode;
  body?: ReactNode;
};

export function StepsSection({
  eyebrow,
  heading,
  intro,
  items,
  layout = "grid",
  tone = "default",
  className,
  containerClassName,
  sectionSize = "default",
}: {
  eyebrow?: ReactNode;
  heading: ReactNode;
  intro?: ReactNode;
  items: readonly StepItem[];
  layout?: keyof typeof layouts;
  tone?: SectionTone;
  className?: string;
  containerClassName?: string;
  sectionSize?: SectionSize;
}) {
  return (
    <Section tone={tone} size={sectionSize} className={className}>
      <Container size="xl" className={containerClassName}>
        <SectionHeading eyebrow={eyebrow} heading={heading} intro={intro} />
        <ol className={cn(styles.list, layouts[layout])}>
          {items.map((item, index) => (
            <li className={styles.item} key={`${String(item.title)}-${index}`}>
              <span className={styles.number}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className={styles.title}>{item.title}</h3>
              {item.body ? (
                <div className={styles.body}>{item.body}</div>
              ) : null}
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
