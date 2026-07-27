"use client";

import { useEffect } from "react";
import { ErrorContent } from "@/components/error-content";
import { fontClassName } from "@/components/fonts";
import "./globals.css";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[global] Unhandled application error", error);
  }, [error]);

  return (
    <html lang="en" className={fontClassName}>
      <body>
        <main>
          <ErrorContent retry={unstable_retry} />
        </main>
      </body>
    </html>
  );
}
