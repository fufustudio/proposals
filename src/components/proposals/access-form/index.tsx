import { AccessCodeForm } from "@/components/access-code-form";

export function ProposalAccessForm({
  slug,
  error,
  nextPath,
}: {
  slug: string;
  error?: string;
  nextPath: string;
}) {
  return (
    <AccessCodeForm
      action="/api/proposal-access"
      inputId="proposal-access-code"
      inputLabel="Proposal password"
      submitLabel="View proposal"
      initialError={error}
      defaultError="That password did not unlock this proposal."
      errorPath={`/proposals/${encodeURIComponent(slug)}/access?error=invalid&next=${encodeURIComponent(nextPath)}`}
      hiddenFields={{ slug, next: nextPath }}
    />
  );
}
