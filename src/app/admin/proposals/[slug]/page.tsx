import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProposalJsonViewer } from "@/components/admin/proposal-json-viewer";
import { proposalPath } from "@/page-modules/proposals/paths";
import { getProposalBySlug } from "@/page-modules/proposals/repository";
import { pageMetadata } from "@/config/seo";
import {
  adminProposalEditorPath,
  requireAdminAccess,
} from "@/server/admin-access";

type AdminProposalPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: AdminProposalPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    ...pageMetadata({
      title: "Proposal JSON",
      path: adminProposalEditorPath(slug),
    }),
    robots: { index: false, follow: false },
  };
}

export default async function AdminProposalPage({
  params,
}: AdminProposalPageProps) {
  const { slug } = await params;

  await requireAdminAccess(adminProposalEditorPath(slug));

  const proposal = getProposalBySlug(slug);

  if (!proposal) notFound();

  return (
    <ProposalJsonViewer
      proposal={proposal}
      canonicalJson={`${JSON.stringify(proposal, null, 2)}\n`}
      proposalUrl={proposalPath(proposal.slug)}
    />
  );
}
