import { proposals } from "@/content/proposals";

export {
  proposalStatusValues,
  validateProposal,
  validateProposals,
} from "@/features/proposals/validation";
export type { ProposalValidationResult } from "@/features/proposals/validation";

export type ProposalStatus = "draft" | "ready" | "accepted" | "archived";

export type Proposal = {
  slug: string;
  title: string;
  clientLabel: string;
  status: ProposalStatus;
  preparedAt: string;
  updatedAt?: string;
  summary: string;
  slides: readonly ProposalSlide[];
};

export type ProposalSlideLayout =
  | "appendix"
  | "cover"
  | "grid"
  | "list"
  | "pricing"
  | "split"
  | "statement"
  | "timeline";

export type ProposalSlide = {
  id: string;
  label: string;
  eyebrow?: string;
  heading: string;
  intro?: string;
  note?: string;
  layout: ProposalSlideLayout;
  blocks: readonly ProposalBlock[];
};

export type ProposalBlock =
  | {
      type: "cover";
      eyebrow: string;
      year: string;
      preparedFor: string;
      title: string;
      tagline: string;
      meta: readonly string[];
      actionLabel: string;
    }
  | {
      type: "text";
      body: readonly string[];
    }
  | {
      type: "numberedRows";
      items: readonly {
        title: string;
        body: string;
      }[];
    }
  | {
      type: "cards" | "pillars";
      items: readonly {
        kicker?: string;
        title: string;
        body?: string;
      }[];
    }
  | {
      type: "sitemap";
      columns: readonly {
        title: string;
        items: readonly string[];
      }[];
    }
  | {
      type: "workstreams";
      items: readonly {
        title: string;
        body: string;
      }[];
    }
  | {
      type: "timeline";
      items: readonly {
        kicker?: string;
        label: string;
        detail?: string;
        milestone?: string;
        active?: boolean;
      }[];
      meta?: string;
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
      type: "pricing";
      footer?: string;
      items: readonly {
        label: string;
        title: string;
        body: string;
        price: string;
        note?: string;
        features: readonly string[];
        recommended?: boolean;
      }[];
    }
  | {
      type: "priceList";
      items: readonly {
        title: string;
        body: string;
        price: string;
      }[];
    }
  | {
      type: "pricePanel";
      eyebrow?: string;
      price: string;
      suffix?: string;
      features: readonly string[];
    }
  | {
      type: "steps";
      items: readonly {
        title: string;
        body: string;
      }[];
    }
  | {
      type: "cta";
      label: string;
      href: string;
      support?: string;
      supportHref?: string;
      supportLabel?: string;
    }
  | {
      type: "media";
      label: string;
      aspect?: "wide" | "square" | "portrait";
    };

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
