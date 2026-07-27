"use client";

import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";
import { Heading } from "@/components/heading";
import { Section } from "@/components/section";
import { Text } from "@/components/text";
import styles from "./styles.module.css";

export function ErrorContent({ retry }: { retry: () => void }) {
  return (
    <Section size="page">
      <Container size="md">
        <div className={styles.content}>
          <Eyebrow family="mono">Something went wrong</Eyebrow>
          <Heading as="h1" className={styles.heading}>
            This page could not be loaded.
          </Heading>
          <Text className={styles.message}>
            The problem may be temporary. Try loading the page again.
          </Text>
          <Button type="button" onClick={retry} className={styles.action}>
            Try again
          </Button>
        </div>
      </Container>
    </Section>
  );
}
