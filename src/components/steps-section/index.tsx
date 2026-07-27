import type { ReactNode } from "react";
import clsx from "clsx";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import {
  Section,
  type SectionSize,
  type SectionTone,
} from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
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
        <ol className={clsx(styles.list, layouts[layout])}>
          {items.map((item, index) => (
            <li className={styles.item} key={`${String(item.title)}-${index}`}>
              <span className={styles.number}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <Heading as="h3" size="item" className={styles.title}>
                {item.title}
              </Heading>
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
