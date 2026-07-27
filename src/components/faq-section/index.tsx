import type { ReactNode } from "react";
import { Container } from "@/components/container";
import { DisclosureItem, DisclosureList } from "@/components/disclosure-list";
import {
  Section,
  type SectionSize,
  type SectionTone,
} from "@/components/section";
import { SectionHeading } from "@/components/section-heading";
import styles from "./styles.module.css";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type FaqItem = {
  question: ReactNode;
  answer: ReactNode;
};

export function FaqSection({
  eyebrow,
  heading,
  intro,
  items,
  tone = "default",
  className,
  containerClassName,
  sectionSize = "default",
}: {
  eyebrow?: ReactNode;
  heading: ReactNode;
  intro?: ReactNode;
  items: readonly FaqItem[];
  tone?: SectionTone;
  className?: string;
  containerClassName?: string;
  sectionSize?: SectionSize;
}) {
  return (
    <Section
      tone={tone}
      size={sectionSize}
      className={classNames(styles.root, className)}
    >
      <Container size="lg" className={containerClassName}>
        <SectionHeading eyebrow={eyebrow} heading={heading} intro={intro} />
        <DisclosureList>
          {items.map((item, index) => (
            <DisclosureItem
              title={item.question}
              titleAs="h3"
              titleSize="item"
              key={`${String(item.question)}-${index}`}
            >
              {item.answer}
            </DisclosureItem>
          ))}
        </DisclosureList>
      </Container>
    </Section>
  );
}
