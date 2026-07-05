"use client";

import { useState, type FormEvent } from "react";
import { buttonClasses } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import styles from "./styles.module.css";

export function ProposalAccessForm({
  slug,
  error,
  nextPath,
}: {
  slug: string;
  error?: string;
  nextPath: string;
}) {
  const [message, setMessage] = useState(error);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const body = new URLSearchParams();

    for (const [key, value] of new FormData(form)) {
      if (typeof value === "string") body.set(key, value);
    }

    setPending(true);
    setMessage(undefined);

    try {
      const response = await fetch("/api/proposal-access", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });
      const result = (await response.json().catch(() => null)) as {
        success?: boolean;
        redirectTo?: string;
        message?: string;
      } | null;

      if (!response.ok || !result?.success || !result.redirectTo) {
        const next = encodeURIComponent(nextPath);
        window.history.replaceState(
          null,
          "",
          `/proposals/${encodeURIComponent(slug)}/access?error=invalid&next=${next}`,
        );
        setMessage(
          result?.message ?? "That password did not unlock this proposal.",
        );
        return;
      }

      window.location.assign(result.redirectTo);
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      action="/api/proposal-access"
      method="post"
      className={styles.form}
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="next" value={nextPath} />

      <div className={styles.fieldGroup}>
        <FormField
          id="proposal-access-code"
          name="code"
          type="password"
          label="Proposal password"
          labelVisibility="visible"
          autoComplete="current-password"
          required
          disabled={pending}
          className={styles.field}
          error={message}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className={buttonClasses("primary", styles.button)}
      >
        {pending ? "Checking..." : "View proposal"}
      </button>
    </form>
  );
}
