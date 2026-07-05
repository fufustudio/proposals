import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import {
  Section,
  type SectionSize,
  type SectionTone,
} from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import styles from "./styles.module.css";

export type StatItem = {
  value: string;
  label: string;
  detail?: ReactNode;
};

export function StatsSection({
  eyebrow,
  heading,
  intro,
  items,
  tone = "muted",
  className,
  containerClassName,
  sectionSize = "compact",
}: {
  eyebrow?: ReactNode;
  heading?: ReactNode;
  intro?: ReactNode;
  items: readonly StatItem[];
  tone?: SectionTone;
  className?: string;
  containerClassName?: string;
  sectionSize?: SectionSize;
}) {
  return (
    <Section tone={tone} size={sectionSize} className={className}>
      <Container size="xl" className={containerClassName}>
        {heading ? (
          <SectionHeading
            eyebrow={eyebrow}
            heading={heading}
            intro={intro}
            gap="default"
          />
        ) : null}
        <dl className={styles.grid}>
          {items.map((item) => (
            <div className={styles.item} key={`${item.value}-${item.label}`}>
              <dt className={styles.label}>{item.label}</dt>
              <dd className={styles.value}>{item.value}</dd>
              {item.detail ? (
                <dd className={styles.detail}>{item.detail}</dd>
              ) : null}
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
