import { Container } from "@/components/ui/container";
import { PageShell } from "@/components/ui/page-shell";
import { Section } from "@/components/ui/section";
import styles from "./styles.module.css";

export default function Home() {
  return (
    <PageShell>
      <Section size="page" className={styles.root}>
        <Container size="xl" className={styles.grid}>
          <section className={styles.message} aria-labelledby="home-heading">
            <p className="eyebrow">Private proposals</p>
            <h1 id="home-heading">Use your private project link.</h1>
            <p>
              Proposal details are available only from the specific access URL
              shared for your project.
            </p>
          </section>
        </Container>
      </Section>
    </PageShell>
  );
}
