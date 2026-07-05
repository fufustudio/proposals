import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import styles from "./styles.module.css";

export function NotFoundContent({
  eyebrow = "Not found",
  heading = "This page is not available.",
  message = "The page you requested does not exist, or its content is not available right now.",
  ctaLabel = "Return home",
}: {
  eyebrow?: string;
  heading?: string;
  message?: string;
  ctaLabel?: string;
}) {
  return (
    <Section size="page">
      <Container size="md">
        <div className={styles.content}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.heading}>{heading}</h1>
          <p className={styles.message}>{message}</p>
          <ButtonLink href="/" className={styles.cta}>
            {ctaLabel}
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
