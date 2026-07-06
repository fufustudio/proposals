import { ProposalDeck } from "@/components/proposals/proposal-deck";
import type { Proposal } from "@/features/proposals";
import styles from "./styles.module.css";

export function ProposalReader({ proposal }: { proposal: Proposal }) {
  return (
    <div className={styles.root}>
      <ProposalDeck proposal={proposal} />
    </div>
  );
}
