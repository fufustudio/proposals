"use client";

import Link, { type LinkProps } from "next/link";
import { buttonClasses } from "@/components/ui/button";
import type { Proposal } from "@/features/proposals";
import styles from "./styles.module.css";

export function ProposalJsonEditor({
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
          <p className="eyebrow">JSON viewer</p>
          <h1>{proposal.clientLabel}</h1>
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
        <div className={styles.editorPanel}>
          <div className={styles.editorHeader}>
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
            <h2>Metadata</h2>
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
              <h2>Slides</h2>
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
