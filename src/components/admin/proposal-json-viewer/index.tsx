"use client";

import Link, { type LinkProps } from "next/link";
import { buttonClasses } from "@/components/button";
import { Eyebrow } from "@/components/eyebrow";
import { Heading } from "@/components/heading";
import type { Proposal } from "@/page-modules/proposals/types";
import styles from "./styles.module.css";

export function ProposalJsonViewer({
  proposal,
  canonicalJson,
  proposalUrl,
}: {
  proposal: Proposal;
  canonicalJson: string;
  proposalUrl: string;
}) {
  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <div>
          <Eyebrow>JSON viewer</Eyebrow>
          <Heading as="h1">{proposal.clientLabel}</Heading>
        </div>
        <div className={styles.headerActions}>
          <Link className={buttonClasses("secondary", "", "sm")} href="/admin">
            Projects
          </Link>
          <Link
            className={buttonClasses("outline", "", "sm")}
            href={proposalUrl as LinkProps<string>["href"]}
          >
            Open proposal
          </Link>
          <form action="/api/admin-logout" method="post">
            <button type="submit" className={buttonClasses("ghost", "", "sm")}>
              Log out
            </button>
          </form>
        </div>
      </header>

      <section className={styles.workspace} aria-label="Proposal JSON viewer">
        <div className={styles.viewerPanel}>
          <div className={styles.viewerHeader}>
            <label htmlFor="proposal-json">Proposal JSON</label>
          </div>
          <textarea
            id="proposal-json"
            data-testid="proposal-json-textarea"
            value={canonicalJson}
            readOnly
            spellCheck={false}
            className={styles.textarea}
          />
        </div>

        <aside className={styles.preview} aria-label="Proposal outline preview">
          <section className={styles.previewSection}>
            <Heading as="h2" size="module">
              Metadata
            </Heading>
            <dl className={styles.meta}>
              <div>
                <dt>Title</dt>
                <dd>{proposal.title}</dd>
              </div>
              <div>
                <dt>Slug</dt>
                <dd>{proposal.slug}</dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>{proposal.updatedAt ?? proposal.preparedAt}</dd>
              </div>
            </dl>
          </section>

          <section className={styles.previewSection}>
            <div className={styles.outlineHeader}>
              <Heading as="h2" size="module">
                Slides
              </Heading>
              <span>{proposal.slides.length}</span>
            </div>
            <ol className={styles.outline}>
              {proposal.slides.map((slide, index) => (
                <li key={slide.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{slide.label}</strong>
                    <p>{slide.heading}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </section>
    </main>
  );
}
