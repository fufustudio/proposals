import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProposalReader } from "@/components/proposals/proposal-reader";
import { getProposalBySlug } from "@/features/proposals";
import { pageMetadata } from "@/lib/seo";

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

  return <ProposalReader proposal={proposal} />;
}
