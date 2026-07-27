"use client";

import { useEffect } from "react";
import { ErrorContent } from "@/components/error-content";

export default function SiteError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[site] Unhandled route error", error);
  }, [error]);

  return <ErrorContent retry={unstable_retry} />;
}
