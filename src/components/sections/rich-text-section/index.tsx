import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import {
  PortableContent,
  type PortableTextValue,
} from "@/components/ui/portable-content";
import {
  Section,
  type SectionSize,
  type SectionTone,
} from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import styles from "./styles.module.css";

export function RichTextSection({
  eyebrow,
  heading,
  content,
  width = "md",
  tone = "default",
  className,
  containerClassName,
  sectionSize = "default",
}: {
  eyebrow?: ReactNode;
  heading?: ReactNode;
  content?: PortableTextValue | null;
  width?: "sm" | "md" | "lg";
  tone?: SectionTone;
  className?: string;
  containerClassName?: string;
  sectionSize?: SectionSize;
}) {
  return (
    <Section tone={tone} size={sectionSize} className={className}>
      <Container size={width} className={containerClassName}>
        {heading ? (
          <SectionHeading
            eyebrow={eyebrow}
            heading={heading}
            align="left"
            width="lg"
          />
        ) : null}
        <PortableContent value={content} className={styles.content} />
      </Container>
    </Section>
  );
}
