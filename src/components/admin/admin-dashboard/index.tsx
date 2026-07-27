import Link, { type LinkProps } from "next/link";
import { buttonClasses } from "@/components/button";
import { Eyebrow } from "@/components/eyebrow";
import { Heading } from "@/components/heading";
import { proposalPath } from "@/page-modules/proposals/paths";
import type { Proposal } from "@/page-modules/proposals/types";
import { adminProposalEditorPath } from "@/server/admin-access";
import styles from "./styles.module.css";

export function AdminDashboard({
  proposals,
}: {
  proposals: readonly Proposal[];
}) {
  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <div>
          <Eyebrow>Fufu Admin</Eyebrow>
          <Heading as="h1">Proposal projects</Heading>
        </div>
        <form action="/api/admin-logout" method="post">
          <button
            type="submit"
            className={buttonClasses("ghost", styles.logout, "sm")}
          >
            Log out
          </button>
        </form>
      </header>

      <section className={styles.panel} aria-labelledby="proposal-list-title">
        <div className={styles.panelHeader}>
          <Heading as="h2" size="module" id="proposal-list-title">
            Projects
          </Heading>
          <span>{proposals.length}</span>
        </div>

        <div className={styles.list}>
          {proposals.map((proposal) => (
            <article key={proposal.slug} className={styles.row}>
              <div className={styles.summary}>
                <span className={styles.client}>{proposal.clientLabel}</span>
                <Heading as="h3">{proposal.title}</Heading>
                <dl className={styles.meta}>
                  <div>
                    <dt>Updated</dt>
                    <dd>{proposal.updatedAt ?? proposal.preparedAt}</dd>
                  </div>
                  <div>
                    <dt>Slides</dt>
                    <dd>{proposal.slides.length}</dd>
                  </div>
                </dl>
              </div>

              <div className={styles.actions}>
                <Link
                  className={buttonClasses("secondary", "", "sm")}
                  href={
                    proposalPath(proposal.slug) as LinkProps<string>["href"]
                  }
                >
                  Open proposal
                </Link>
                <Link
                  className={buttonClasses("primary", "", "sm")}
                  href={
                    adminProposalEditorPath(
                      proposal.slug,
                    ) as LinkProps<string>["href"]
                  }
                >
                  View JSON
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
