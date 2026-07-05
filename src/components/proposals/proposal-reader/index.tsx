import { ProposalBlockRenderer } from "@/components/proposals/proposal-blocks";
import { ProposalExperience } from "@/components/proposals/proposal-experience";
import { ProposalSection } from "@/components/proposals/proposal-section";
import type { Proposal } from "@/features/proposals";
import styles from "./styles.module.css";

export function ProposalReader({ proposal }: { proposal: Proposal }) {
  const navItems = proposal.sections.map(({ focusAlign, id, label }) => ({
    focusAlign,
    id,
    label,
  }));

  return (
    <div className={styles.root}>
      <ProposalExperience sections={navItems}>
        <article aria-label={proposal.title}>
          {proposal.sections.map((section, index) => {
            const nextSection = proposal.sections[index + 1];

            return (
              <ProposalSection
                key={section.id}
                id={section.id}
                eyebrow={section.eyebrow}
                heading={section.heading}
                intro={section.intro}
                tone={section.tone}
                nextLabel={section.nextLabel}
                nextId={nextSection?.id}
                headingLevel={index === 0 ? "h1" : "h2"}
              >
                {section.blocks?.map((block, blockIndex) => (
                  <ProposalBlockRenderer
                    key={`${section.id}-${block.type}-${blockIndex}`}
                    block={block}
                  />
                ))}
              </ProposalSection>
            );
          })}
        </article>
      </ProposalExperience>
    </div>
  );
}
