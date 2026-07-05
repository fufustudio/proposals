import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProposalReader } from "@/components/proposals/proposal-reader";
import { getAllProposals, getProposalBySlug } from "@/features/proposals";
import { pageMetadata } from "@/lib/seo";

type ProposalPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProposals().map((proposal) => ({ slug: proposal.slug }));
}

export async function generateMetadata({
  params,
}: ProposalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const proposal = getProposalBySlug(slug);

  if (!proposal) {
    return pageMetadata({
      title: "Proposal Not Found",
      path: `/proposals/${slug}`,
    });
  }

  return {
    ...pageMetadata({
      title: proposal.title,
      description: proposal.summary,
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
