import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import type { ProposalSectionTone } from "@/features/proposals";
import styles from "./styles.module.css";

export function ProposalSection({
  id,
  eyebrow,
  heading,
  intro,
  tone = "default",
  nextLabel,
  nextId,
  headingLevel = "h2",
  children,
}: {
  id: string;
  eyebrow?: string;
  heading: string;
  intro?: string;
  tone?: ProposalSectionTone;
  nextLabel?: string;
  nextId?: string;
  headingLevel?: "h1" | "h2";
  children?: ReactNode;
}) {
  const Heading = headingLevel;

  return (
    <section
      id={id}
      data-proposal-section
      data-tone={tone}
      className={styles.section}
    >
      <Container size="xl" className={styles.grid}>
        <div className={styles.copy}>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <Heading>{heading}</Heading>
          {intro ? <p className={styles.intro}>{intro}</p> : null}
        </div>
        {children ? <div className={styles.blocks}>{children}</div> : null}
        {nextLabel && nextId ? (
          <a href={`#${nextId}`} className={styles.nextHint}>
            <span aria-hidden>↓</span>
            <span>{nextLabel}</span>
          </a>
        ) : null}
      </Container>
    </section>
  );
}
