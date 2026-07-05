"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { track } from "@vercel/analytics";
import { buttonClasses } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import styles from "./styles.module.css";

type InquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const noteId = "contact-form-note";
const fieldLimits = {
  name: 120,
  email: 254,
  interest: 160,
  message: 3000,
};

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ContactForm({ note }: { note?: string }) {
  const [state, setState] = useState<InquiryState>({ status: "idle" });
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (state.status === "success") track("inquiry_submitted");
  }, [state.status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (
      String(formData.get("company") ?? "").trim() ||
      formData.get("botcheck")
    ) {
      return;
    }

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const interest = String(formData.get("interest") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (
      name.length > fieldLimits.name ||
      email.length > fieldLimits.email ||
      interest.length > fieldLimits.interest ||
      message.length > fieldLimits.message
    ) {
      setState({
        status: "error",
        message: "Please shorten your message and try again.",
      });
      return;
    }

    if (!name || !email || !message) {
      setState({
        status: "error",
        message: "Please share your name, email, and a short message.",
      });
      return;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setState({
        status: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    setPending(true);

    try {
      const payload = {
        name,
        email,
        interest,
        message,
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json().catch(() => null);

      if (!res.ok || !result?.success) {
        throw new Error(result?.message ?? "Contact submission failed");
      }

      setState({ status: "success" });
      form.reset();
    } catch (error) {
      console.error("[contact] Form provider error:", error);
      setState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong sending your message. Please try again after the provider is configured.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div aria-hidden className={styles.honeypot}>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
        <label htmlFor="botcheck">Do not check this box</label>
        <input
          id="botcheck"
          type="checkbox"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className={classNames(styles.fields, pending && styles.pending)}>
        <FormField
          id="contact-name"
          name="name"
          required
          label="Name"
          placeholder="Name*"
          maxLength={fieldLimits.name}
          className={styles.field}
        />
        <FormField
          id="contact-email"
          type="email"
          name="email"
          required
          label="Email address"
          placeholder="Email address*"
          maxLength={fieldLimits.email}
          className={styles.field}
        />
        <FormField
          id="contact-interest"
          name="interest"
          label="Interest"
          placeholder="What are you interested in?"
          maxLength={fieldLimits.interest}
          className={styles.field}
        />
        <FormField
          id="contact-message"
          name="message"
          rows={6}
          required
          label="Message"
          aria-describedby={note ? noteId : undefined}
          placeholder="Short message*"
          maxLength={fieldLimits.message}
          className={classNames(styles.field, styles.textarea)}
          multiline
        />
      </div>

      {note ? (
        <p id={noteId} className={styles.note}>
          {note}
        </p>
      ) : null}

      {state.status === "success" ? (
        <p className={styles.success} role="status">
          Message sent.
        </p>
      ) : null}

      {state.status === "error" ? (
        <p className={styles.error}>{state.message}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={buttonClasses("primary", styles.submit)}
      >
        {pending ? "Sending..." : "Submit"}
      </button>
    </form>
  );
}
