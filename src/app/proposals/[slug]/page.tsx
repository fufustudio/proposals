import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProposalReader } from "@/components/proposals/proposal-reader";
import { proposalPath } from "@/features/proposals/paths";
import { getProposalBySlug } from "@/features/proposals/repository";
import { pageMetadata } from "@/config/seo";
import { requireProposalAccess } from "@/server/require-proposal-access";

type ProposalPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ProposalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const proposal = getProposalBySlug(slug);

  if (!proposal) {
    return {
      ...pageMetadata({
        title: "Private Proposal",
        description: "This private proposal is available by invitation only.",
        path: `/proposals/${slug}`,
      }),
      robots: { index: false, follow: false },
    };
  }

  return {
    ...pageMetadata({
      title: "Private Proposal",
      description: "This private proposal is available by invitation only.",
      path: `/proposals/${proposal.slug}`,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function ProposalPage({ params }: ProposalPageProps) {
  const { slug } = await params;
  const proposal = getProposalBySlug(slug);

  if (!proposal) notFound();
  await requireProposalAccess(slug, proposalPath(slug));

  return <ProposalReader proposal={proposal} />;
}
