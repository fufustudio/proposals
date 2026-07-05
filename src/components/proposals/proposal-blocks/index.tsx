import {
  DisclosureItem,
  DisclosureList,
} from "@/components/ui/disclosure-list";
import type { ProposalBlock } from "@/features/proposals";
import { Reveal } from "@/components/proposals/reveal";
import styles from "./styles.module.css";

export function ProposalBlockRenderer({ block }: { block: ProposalBlock }) {
  switch (block.type) {
    case "text":
      return (
        <Reveal>
          <div className={styles.textBlock}>
            {block.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      );
    case "cards":
      return (
        <div className={styles.cardGrid}>
          {block.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 80}>
              <article className={styles.card}>
                <h3>{item.title}</h3>
                {item.body ? <p>{item.body}</p> : null}
              </article>
            </Reveal>
          ))}
        </div>
      );
    case "timeline":
      return (
        <Reveal>
          <ol className={styles.timeline}>
            {block.items.map((item) => (
              <li key={item.label}>
                <span className={styles.timelineMarker} aria-hidden />
                <div>
                  <h3>{item.label}</h3>
                  {item.detail ? <p>{item.detail}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      );
    case "details":
      return (
        <Reveal>
          <DisclosureList className={styles.details}>
            {block.items.map((item) => (
              <DisclosureItem key={item.label} title={item.label}>
                {item.detail ? <p>{item.detail}</p> : null}
              </DisclosureItem>
            ))}
          </DisclosureList>
        </Reveal>
      );
    case "summary":
      return (
        <Reveal>
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
        </Reveal>
      );
    case "media":
      return (
        <Reveal>
          <div className={styles.media} data-aspect={block.aspect ?? "wide"}>
            <span>{block.label}</span>
          </div>
        </Reveal>
      );
  }
}
