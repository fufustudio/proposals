import type { ReactNode } from "react";
import type { PatternHref, PatternImage } from "@/components/sections/types";
import { Container } from "@/components/ui/container";
import { ImageFrame } from "@/components/ui/image-frame";
import {
  Section,
  type SectionSize,
  type SectionTone,
} from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/text-link";
import { cn } from "@/lib/cn";
import styles from "./styles.module.css";

const columnsMap = {
  2: styles.columns2,
  3: styles.columns3,
  4: styles.columns4,
} as const;

export type CardGridItem = {
  title: ReactNode;
  body?: ReactNode;
  href?: PatternHref;
  actionLabel?: ReactNode;
  external?: boolean;
  event?: string;
  ariaLabel?: string;
  icon?: ReactNode;
  image?: PatternImage;
};

export function CardGridSection({
  eyebrow,
  heading,
  intro,
  items,
  columns = 3,
  tone = "default",
  className,
  containerClassName,
  sectionSize = "default",
}: {
  eyebrow?: ReactNode;
  heading: ReactNode;
  intro?: ReactNode;
  items: readonly CardGridItem[];
  columns?: keyof typeof columnsMap;
  tone?: SectionTone;
  className?: string;
  containerClassName?: string;
  sectionSize?: SectionSize;
}) {
  return (
    <Section tone={tone} size={sectionSize} className={className}>
      <Container size="xl" className={containerClassName}>
        <SectionHeading eyebrow={eyebrow} heading={heading} intro={intro} />
        <div className={cn(styles.grid, columnsMap[columns])}>
          {items.map((item, index) => (
            <article
              className={styles.card}
              key={`${String(item.title)}-${index}`}
            >
              {item.image ? (
                <ImageFrame
                  image={item.image}
                  aspect="wide"
                  className={styles.image}
                />
              ) : null}
              {item.icon ? (
                <div className={styles.icon}>{item.icon}</div>
              ) : null}
              <h3 className={styles.title}>{item.title}</h3>
              {item.body ? (
                <div className={styles.body}>{item.body}</div>
              ) : null}
              {item.href ? (
                <TextLink
                  href={item.href}
                  external={item.external}
                  event={item.event}
                  ariaLabel={item.ariaLabel}
                  className={styles.link}
                >
                  {item.actionLabel ?? "Learn more"}
                </TextLink>
              ) : null}
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
