"use client";

import { useRef, useState, type FormEvent } from "react";
import { buttonClasses } from "@/components/button";
import { FormField } from "@/components/form-field";
import styles from "./styles.module.css";

export function AccessCodeForm({
  action,
  inputId,
  inputLabel,
  submitLabel,
  pendingLabel = "Checking...",
  initialError,
  defaultError,
  errorPath,
  hiddenFields,
}: {
  action: string;
  inputId: string;
  inputLabel: string;
  submitLabel: string;
  pendingLabel?: string;
  initialError?: string;
  defaultError: string;
  errorPath: string;
  hiddenFields: Readonly<Record<string, string>>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState(initialError);
  const [pending, setPending] = useState(false);

  function focusInput() {
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const body = new URLSearchParams();
    for (const [key, value] of new FormData(event.currentTarget)) {
      if (typeof value === "string") body.set(key, value);
    }

    setPending(true);
    setMessage(undefined);

    try {
      const response = await fetch(action, {
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
        window.history.replaceState(null, "", errorPath);
        setMessage(result?.message ?? defaultError);
        focusInput();
        return;
      }

      window.location.assign(result.redirectTo);
    } catch {
      setMessage("Access could not be checked. Please try again.");
      focusInput();
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      action={action}
      method="post"
      className={styles.form}
      aria-busy={pending}
      onSubmit={handleSubmit}
    >
      {Object.entries(hiddenFields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      <FormField
        ref={inputRef}
        id={inputId}
        name="code"
        type="password"
        label={inputLabel}
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
        {pending ? pendingLabel : submitLabel}
      </button>
    </form>
  );
}
