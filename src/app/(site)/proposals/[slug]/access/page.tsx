import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProposalAccessForm } from "@/components/proposals/access-form";
import { Container } from "@/components/ui/container";
import { PageShell } from "@/components/ui/page-shell";
import { Section } from "@/components/ui/section";
import {
  getProposalBySlug,
  proposalAccessPath,
  proposalPath,
} from "@/features/proposals";
import { pageMetadata } from "@/lib/seo";
import styles from "./styles.module.css";

type ProposalAccessPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    error?: string | string[];
    next?: string | string[];
  }>;
};

export async function generateMetadata({
  params,
}: ProposalAccessPageProps): Promise<Metadata> {
  const { slug } = await params;
  const proposal = getProposalBySlug(slug);

  return {
    ...pageMetadata({
      title: proposal ? `${proposal.title} Access` : "Proposal Access",
      path: proposalAccessPath(slug),
    }),
    robots: { index: false, follow: false },
  };
}

export default async function ProposalAccessPage({
  params,
  searchParams,
}: ProposalAccessPageProps) {
  const { slug } = await params;
  const proposal = getProposalBySlug(slug);
  const search = await searchParams;

  if (!proposal) notFound();

  const error =
    firstSearchValue(search.error) === "invalid"
      ? "That password did not unlock this proposal."
      : undefined;
  const nextPath = firstSearchValue(search.next) || proposalPath(proposal.slug);

  return (
    <PageShell fixedHeaderOffset>
      <Section size="page" className={styles.root}>
        <Container size="xl" className={styles.grid}>
          <div className={styles.copy}>
            <p className="eyebrow">{proposal.clientLabel}</p>
            <h1>{proposal.title}</h1>
            <p>
              Enter the proposal password to continue to this private draft.
            </p>
          </div>
          <div className={styles.formPanel}>
            <ProposalAccessForm
              slug={proposal.slug}
              error={error}
              nextPath={nextPath}
            />
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}

function firstSearchValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
