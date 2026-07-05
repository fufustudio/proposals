import { proposals } from "@/content/proposals";

export type ProposalStatus = "draft" | "ready" | "accepted" | "archived";

export type Proposal = {
  slug: string;
  title: string;
  clientLabel: string;
  status: ProposalStatus;
  preparedAt: string;
  updatedAt?: string;
  summary: string;
  sections: readonly ProposalSection[];
};

export type ProposalSectionTone = "default" | "feature" | "contrast";
export type ProposalSectionFocusAlign = "start" | "center";

export type ProposalSection = {
  id: string;
  label: string;
  eyebrow?: string;
  heading: string;
  intro?: string;
  tone?: ProposalSectionTone;
  focusAlign?: ProposalSectionFocusAlign;
  blocks?: readonly ProposalBlock[];
  nextLabel?: string;
};

export type ProposalBlock =
  | {
      type: "text";
      body: readonly string[];
    }
  | {
      type: "cards";
      items: readonly {
        title: string;
        body?: string;
      }[];
    }
  | {
      type: "timeline";
      items: readonly {
        label: string;
        detail?: string;
      }[];
    }
  | {
      items: readonly {
        label: string;
        detail?: string;
      }[];
      type: "details";
    }
  | {
      type: "summary";
      items: readonly {
        label: string;
        value: string;
        detail?: string;
      }[];
    }
  | {
      type: "media";
      label: string;
      aspect?: "wide" | "square" | "portrait";
    };

export type ProposalSectionNavItem = Pick<
  ProposalSection,
  "focusAlign" | "id" | "label"
>;

export function getAllProposals() {
  return proposals;
}

export function getProposalBySlug(slug: string) {
  return proposals.find((proposal) => proposal.slug === slug) ?? null;
}

export function proposalPath(slug: string) {
  return `/proposals/${encodeURIComponent(slug)}`;
}

export function proposalAccessPath(slug: string) {
  return `${proposalPath(slug)}/access`;
}

export function slugFromProposalPath(pathname: string) {
  const match = pathname.match(/^\/proposals\/([^/]+)(?:\/.*)?$/);
  if (!match) return null;

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}
