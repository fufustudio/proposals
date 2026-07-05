import { render } from "@react-email/render";
import { Resend } from "resend";
import { optionalEnvValue } from "@/lib/env";

type InquiryPayload = {
  name?: unknown;
  email?: unknown;
  interest?: unknown;
  message?: unknown;
  company?: unknown;
  botcheck?: unknown;
};

type Inquiry = {
  name: string;
  email: string;
  interest: string;
  message: string;
};

const fieldLimits = {
  name: 120,
  email: 254,
  interest: 160,
  message: 3000,
};

const validationError = "Please share your name, email, and a short message.";
const emailError = "Please enter a valid email address.";
const lengthError = "Please shorten your message and try again.";
const providerError =
  "Something went wrong sending your message. Please try again after the provider is configured.";

export async function POST(request: Request) {
  let payload: InquiryPayload;

  try {
    payload = (await request.json()) as InquiryPayload;
  } catch {
    return contactResponse(false, validationError, 400);
  }

  if (isHoneypotSubmission(payload)) {
    return contactResponse(true);
  }

  const inquiry = normalizeInquiry(payload);
  const validation = validateInquiry(inquiry);

  if (validation) {
    return contactResponse(false, validation, 400);
  }

  const env = {
    RESEND_API_KEY: optionalEnvValue(process.env.RESEND_API_KEY),
    RESEND_FROM_EMAIL: optionalEnvValue(process.env.RESEND_FROM_EMAIL),
    RESEND_TO_EMAIL: optionalEnvValue(process.env.RESEND_TO_EMAIL),
  };
  const missingEnvVars = Object.entries(env)
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missingEnvVars.length > 0) {
    return contactResponse(false, configError(missingEnvVars), 500);
  }

  const apiKey = env.RESEND_API_KEY as string;
  const fromEmail = env.RESEND_FROM_EMAIL as string;
  const toEmail = env.RESEND_TO_EMAIL as string;
  const html = await renderContactEmail(inquiry);

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: "New website contact",
      replyTo: inquiry.email,
      text: inquiryText(inquiry),
      html,
    });

    if (error) {
      throw new Error(error.message);
    }

    return contactResponse(true);
  } catch (error) {
    console.error("[contact] Resend provider error:", error);
    return contactResponse(false, providerError, 502);
  }
}

function contactResponse(success: boolean, message?: string, status = 200) {
  return Response.json(
    { success, ...(message ? { message } : {}) },
    { status },
  );
}

function configError(missingEnvVars: string[]) {
  return `The form provider is not configured yet. Missing environment variables: ${missingEnvVars.join(
    ", ",
  )}.`;
}

function isHoneypotSubmission(payload: InquiryPayload) {
  return (
    normalizeField(payload.company).length > 0 ||
    payload.botcheck === true ||
    payload.botcheck === "on" ||
    payload.botcheck === "true"
  );
}

function normalizeInquiry(payload: InquiryPayload): Inquiry {
  return {
    name: normalizeField(payload.name),
    email: normalizeField(payload.email),
    interest: normalizeField(payload.interest),
    message: normalizeField(payload.message),
  };
}

function normalizeField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validateInquiry(inquiry: Inquiry) {
  if (
    inquiry.name.length > fieldLimits.name ||
    inquiry.email.length > fieldLimits.email ||
    inquiry.interest.length > fieldLimits.interest ||
    inquiry.message.length > fieldLimits.message
  ) {
    return lengthError;
  }

  if (!inquiry.name || !inquiry.email || !inquiry.message) {
    return validationError;
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inquiry.email)) {
    return emailError;
  }

  return null;
}

function inquiryText(inquiry: Inquiry) {
  return [
    "New website contact.",
    "",
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Interest: ${inquiry.interest || "-"}`,
    "",
    "Message:",
    inquiry.message,
  ].join("\n");
}

function renderContactEmail(inquiry: Inquiry) {
  return render(<ContactEmail inquiry={inquiry} />);
}

function ContactEmail({ inquiry }: { inquiry: Inquiry }) {
  return (
    <html lang="en">
      <head>
        <title>New website contact</title>
      </head>
      <body>
        <main>
          <h1>New website contact.</h1>
          <dl>
            <dt>Name</dt>
            <dd>{inquiry.name}</dd>
            <dt>Email</dt>
            <dd>{inquiry.email}</dd>
            <dt>Interest</dt>
            <dd>{inquiry.interest || "-"}</dd>
          </dl>
          <h2>Message</h2>
          {inquiry.message.split(/\n{2,}/).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </main>
      </body>
    </html>
  );
}
