"use client";

import { useState, type FormEvent } from "react";
import { buttonClasses } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import styles from "./styles.module.css";

export function AdminAccessForm({
  error,
  nextPath,
}: {
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
      const response = await fetch("/api/admin-access", {
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
        window.history.replaceState(
          null,
          "",
          `/admin/access?error=invalid&next=${encodeURIComponent(nextPath)}`,
        );
        setMessage(result?.message ?? "That passcode did not unlock admin.");
        return;
      }

      window.location.assign(result.redirectTo);
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      action="/api/admin-access"
      method="post"
      className={styles.form}
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="next" value={nextPath} />

      <FormField
        id="admin-access-code"
        name="code"
        type="password"
        label="Admin passcode"
        labelVisibility="visible"
        autoComplete="current-password"
        required
        disabled={pending}
        className={styles.field}
        error={message}
      />

      <button
        type="submit"
        disabled={pending}
        className={buttonClasses("primary", styles.button)}
      >
        {pending ? "Checking..." : "Enter admin"}
      </button>
    </form>
  );
}
