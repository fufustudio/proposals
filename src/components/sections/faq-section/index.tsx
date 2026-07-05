import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import {
  DisclosureItem,
  DisclosureList,
} from "@/components/ui/disclosure-list";
import {
  Section,
  type SectionSize,
  type SectionTone,
} from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

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
    <Section tone={tone} size={sectionSize} className={className}>
      <Container size="lg" className={containerClassName}>
        <SectionHeading eyebrow={eyebrow} heading={heading} intro={intro} />
        <DisclosureList>
          {items.map((item, index) => (
            <DisclosureItem
              title={item.question}
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
