import { ButtonLink } from "@/components/button";
import { Container } from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";
import { Heading } from "@/components/heading";
import { Section } from "@/components/section";
import { Text } from "@/components/text";
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
          <Eyebrow>{eyebrow}</Eyebrow>
          <Heading as="h1" className={styles.heading}>
            {heading}
          </Heading>
          <Text className={styles.message}>{message}</Text>
          <ButtonLink href="/" className={styles.cta}>
            {ctaLabel}
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
