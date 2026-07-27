import "server-only";

import { proposals } from "@/content/proposals";

export function getAllProposals() {
  return proposals;
}

export function getProposalBySlug(slug: string) {
  return proposals.find((proposal) => proposal.slug === slug) ?? null;
}
