import { Container } from "@/components/ui/container";
import { DividerGrid } from "@/components/ui/divider-grid";
import { HeaderSentinel } from "@/components/site/header-sentinel";
import { PageShell } from "@/components/ui/page-shell";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ActionGroup } from "@/components/ui/action-group";
import { ContactForm } from "@/components/site/contact-form";
import { PortableContent } from "@/components/ui/portable-content";
import { home } from "@/content/home";
import { getHomePageContent } from "@/lib/cms";
import styles from "./styles.module.css";

export default async function Home() {
  const homePage = await getHomePageContent();

  return (
    <PageShell>
      <Section size="page" className={styles.hero}>
        <Container size="xl" className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <p className="eyebrow">{home.eyebrow}</p>
            <h1 className={styles.heroHeading}>{homePage.title}</h1>
            {homePage.intro ? (
              <p className={styles.heroBody}>{homePage.intro}</p>
            ) : null}
            <ActionGroup
              actions={[
                {
                  label: home.primaryCta,
                  href: "#starter-shape",
                  event: "primary_cta_click",
                },
                {
                  label: home.secondaryCta,
                  href: "#message",
                  variant: "ghost",
                },
              ]}
              className={styles.actions}
            />
          </div>
        </Container>
      </Section>
      <HeaderSentinel />

      <Section id="starter-shape" size="default">
        <Container size="xl" className={styles.sectionGrid}>
          <SectionHeading
            eyebrow="Project Defaults"
            heading="Keep the reusable conventions. Delete the rest."
            intro="The starter is intentionally sparse so a new repo begins with structure instead of cleanup."
            className={styles.sectionIntro}
          />
          {homePage.body?.length ? (
            <PortableContent
              value={homePage.body}
              className={styles.homeBody}
            />
          ) : (
            <DividerGrid itemClassName={styles.principleItem}>
              {home.principles.map((item) => (
                <div key={item.title}>
                  <h2 className={styles.principleTitle}>{item.title}</h2>
                  <p className={styles.principleBody}>{item.body}</p>
                </div>
              ))}
            </DividerGrid>
          )}
        </Container>
      </Section>

      <Section
        id="message"
        tone="contrast"
        size="default"
        className={styles.contact}
      >
        <Container size="xl" className={styles.contactGrid}>
          <div className={styles.contactCopy}>
            <p className="eyebrow">{home.contactEyebrow}</p>
            <h2 className={styles.contactHeading}>{home.contactHeading}</h2>
            <p className={styles.contactIntro}>{home.contactIntro}</p>
          </div>
          <div className={styles.formColumn}>
            <ContactForm note={home.contactFormNote} />
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
