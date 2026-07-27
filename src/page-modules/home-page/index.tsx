import { Container } from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";
import { Heading } from "@/components/heading";
import { PageShell } from "@/components/page-shell";
import { Section } from "@/components/section";
import { Text } from "@/components/text";
import styles from "./styles.module.css";

export function HomePage() {
  return (
    <PageShell>
      <Section size="page" className={styles.root}>
        <Container size="xl" className={styles.grid}>
          <section className={styles.message} aria-labelledby="home-heading">
            <Eyebrow>Private proposals</Eyebrow>
            <Heading as="h1" id="home-heading">
              Use your private project link.
            </Heading>
            <Text className={styles.intro}>
              Proposal details are available only from the specific access URL
              shared for your project.
            </Text>
          </section>
        </Container>
      </Section>
    </PageShell>
  );
}
