import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProposalAccessForm } from "@/components/proposals/access-form";
import { Container } from "@/components/ui/container";
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

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ProposalAccessPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    ...pageMetadata({
      title: "Private Proposal Access",
      description: "Enter the proposal password to continue.",
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
    <main className={styles.root}>
      <Container size="xl" className={styles.grid}>
        <div className={styles.copy}>
          <p className="eyebrow">Private proposal</p>
          <h1>Enter the project password.</h1>
          <p>
            Proposal details are hidden until access is confirmed for this
            specific project URL.
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
    </main>
  );
}

function firstSearchValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
