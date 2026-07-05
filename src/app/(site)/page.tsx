import { Container } from "@/components/ui/container";
import { HeaderSentinel } from "@/components/site/header-sentinel";
import { PageShell } from "@/components/ui/page-shell";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { getAllProposals, proposalPath } from "@/features/proposals";
import styles from "./styles.module.css";

export default function Home() {
  const proposals = getAllProposals();

  return (
    <PageShell>
      <Section size="page" className={styles.hero}>
        <Container size="xl" className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <p className="eyebrow">Fufu Proposals</p>
            <h1 className={styles.heroHeading}>
              A private proposal workspace.
            </h1>
            <p className={styles.heroBody}>
              This scaffold is ready for proposal routes, protected access, and
              future Figma-driven content without publishing a finished proposal
              yet.
            </p>
          </div>
        </Container>
      </Section>
      <HeaderSentinel />

      <Section id="proposals" size="default">
        <Container size="xl" className={styles.sectionGrid}>
          <SectionHeading
            eyebrow="Available proposals"
            heading="Demo proposal access is wired."
            intro="The only proposal here is a fake fixture for testing the private route and access flow."
            className={styles.sectionIntro}
          />
          <div className={styles.proposalGrid}>
            {proposals.map((proposal) => (
              <article key={proposal.slug} className={styles.proposalCard}>
                <p className="eyebrow">{proposal.clientLabel}</p>
                <h2>{proposal.title}</h2>
                <p>{proposal.summary}</p>
                <ButtonLink href={proposalPath(proposal.slug)} size="sm">
                  Open proposal
                </ButtonLink>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
