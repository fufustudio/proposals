import { AccessCodeForm } from "@/components/access-code-form";

export function AdminAccessForm({
  error,
  nextPath,
}: {
  error?: string;
  nextPath: string;
}) {
  return (
    <AccessCodeForm
      action="/api/admin-access"
      inputId="admin-access-code"
      inputLabel="Admin passcode"
      submitLabel="Enter admin"
      initialError={error}
      defaultError="That passcode did not unlock admin."
      errorPath={`/admin/access?error=invalid&next=${encodeURIComponent(nextPath)}`}
      hiddenFields={{ next: nextPath }}
    />
  );
}
