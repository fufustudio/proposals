"use client";

import { useEffect } from "react";
import { ErrorContent } from "@/components/error-content";

export default function AppError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[app] Unhandled route error", error);
  }, [error]);

  return (
    <main>
      <ErrorContent retry={unstable_retry} />
    </main>
  );
}
