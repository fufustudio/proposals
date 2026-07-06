import {
  DisclosureItem,
  DisclosureList,
} from "@/components/ui/disclosure-list";
import { buttonClasses } from "@/components/ui/button";
import type { ProposalBlock } from "@/features/proposals";
import styles from "./styles.module.css";

export function ProposalSlideBlocks({
  blocks,
  headingId,
  onCoverAction,
}: {
  blocks: readonly ProposalBlock[];
  headingId?: string;
  onCoverAction?: () => void;
}) {
  return (
    <>
      {blocks.map((block, index) => (
        <ProposalSlideBlock
          key={`${block.type}-${index}`}
          block={block}
          headingId={headingId}
          onCoverAction={onCoverAction}
        />
      ))}
    </>
  );
}

function ProposalSlideBlock({
  block,
  headingId,
  onCoverAction,
}: {
  block: ProposalBlock;
  headingId?: string;
  onCoverAction?: () => void;
}) {
  switch (block.type) {
    case "cover":
      return (
        <div className={styles.cover}>
          <div className={styles.coverTopline}>
            <span>{block.eyebrow}</span>
            <span>{block.year}</span>
          </div>
          <div className={styles.coverTitle}>
            <span>{block.preparedFor}</span>
            <h1 id={headingId}>{block.title}</h1>
          </div>
          <div className={styles.coverBottom}>
            <p>{block.tagline}</p>
            <div className={styles.coverActions}>
              <div>
                {block.meta.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <button
                type="button"
                className={buttonClasses("outline", styles.coverButton, "sm")}
                onClick={onCoverAction}
              >
                {block.actionLabel}
                <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </div>
      );
    case "text":
      return (
        <div className={styles.textBlock}>
          {block.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      );
    case "numberedRows":
      return (
        <div className={styles.numberedRows}>
          {block.items.map((item, index) => (
            <article key={item.title} className={styles.numberedRow}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      );
    case "cards":
    case "pillars":
      return (
        <div className={styles.pillarGrid}>
          {block.items.map((item) => (
            <article key={item.title} className={styles.pillar}>
              {item.kicker ? <span>{item.kicker}</span> : null}
              <h3>{item.title}</h3>
              {item.body ? <p>{item.body}</p> : null}
            </article>
          ))}
        </div>
      );
    case "sitemap":
      return (
        <div className={styles.sitemap}>
          {block.columns.map((column) => (
            <article key={column.title}>
              <h3>{column.title}</h3>
              <ul>
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      );
    case "workstreams":
      return (
        <div className={styles.workstreams}>
          {block.items.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      );
    case "timeline":
      return (
        <div className={styles.timeline}>
          {block.items.map((item) => (
            <article
              key={item.label}
              data-active={item.active ? "true" : "false"}
            >
              <span className={styles.timelineDot} aria-hidden />
              {item.kicker ? (
                <span className={styles.kicker}>{item.kicker}</span>
              ) : null}
              <h3>{item.label}</h3>
              {item.detail ? <p>{item.detail}</p> : null}
              {item.milestone ? <strong>{item.milestone}</strong> : null}
            </article>
          ))}
        </div>
      );
    case "details":
      return (
        <DisclosureList className={styles.disclosures}>
          {block.items.map((item) => (
            <DisclosureItem key={item.label} title={item.label}>
              {item.detail ? <p>{item.detail}</p> : null}
            </DisclosureItem>
          ))}
        </DisclosureList>
      );
    case "summary":
      return (
        <dl className={styles.summary}>
          {block.items.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>
                <strong>{item.value}</strong>
                {item.detail ? <span>{item.detail}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      );
    case "pricing":
      return (
        <div className={styles.pricingWrap}>
          <div className={styles.pricingGrid}>
            {block.items.map((item) => (
              <article
                key={item.label}
                className={styles.pricingCard}
                data-recommended={item.recommended ? "true" : "false"}
              >
                {item.recommended ? (
                  <span className={styles.recommended}>Recommended</span>
                ) : null}
                <span className={styles.optionLabel}>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <strong>{item.price}</strong>
                {item.note ? <small>{item.note}</small> : null}
                <ul>
                  {item.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          {block.footer ? (
            <p className={styles.pricingFooter}>{block.footer}</p>
          ) : null}
        </div>
      );
    case "priceList":
      return (
        <div className={styles.priceList}>
          {block.items.map((item) => (
            <article key={item.title}>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
              <strong>{item.price}</strong>
            </article>
          ))}
        </div>
      );
    case "pricePanel":
      return (
        <aside className={styles.pricePanel}>
          {block.eyebrow ? <span>{block.eyebrow}</span> : null}
          <strong>
            {block.price}
            {block.suffix ? <small>{block.suffix}</small> : null}
          </strong>
          <ul>
            {block.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </aside>
      );
    case "steps":
      return (
        <div className={styles.steps}>
          {block.items.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      );
    case "cta":
      return (
        <div className={styles.ctaRow}>
          <a
            className={buttonClasses("primary", styles.ctaButton)}
            href={block.href}
          >
            {block.label}
            <span aria-hidden>→</span>
          </a>
          {block.support && block.supportHref && block.supportLabel ? (
            <p>
              {block.support}{" "}
              <a href={block.supportHref}>{block.supportLabel}</a>
            </p>
          ) : null}
        </div>
      );
    case "media":
      return (
        <div className={styles.media} data-aspect={block.aspect ?? "wide"}>
          <span>{block.label}</span>
        </div>
      );
  }

  return assertNever(block);
}

function assertNever(value: never): never {
  throw new Error(`Unsupported proposal block: ${JSON.stringify(value)}`);
}
