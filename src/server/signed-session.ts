import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

const tokenVersion = "v1";

type SignedSessionEnvelope = {
  purpose: string;
  expiresAt: number;
  data: unknown;
};

export function createSignedSession({
  purpose,
  data,
  secret,
  maxAge,
  now = Date.now(),
}: {
  purpose: string;
  data: unknown;
  secret: string;
  maxAge: number;
  now?: number;
}) {
  const payload = Buffer.from(
    JSON.stringify({
      purpose,
      expiresAt: now + maxAge * 1000,
      data,
    } satisfies SignedSessionEnvelope),
    "utf8",
  ).toString("base64url");

  return `${tokenVersion}.${payload}.${signPayload(payload, secret)}`;
}

export function verifySignedSession<T>({
  value,
  purpose,
  secret,
  validateData,
  now = Date.now(),
}: {
  value: string | undefined;
  purpose: string;
  secret: string | undefined;
  validateData: (value: unknown) => value is T;
  now?: number;
}): T | null {
  if (!value || !secret) return null;

  const [version, payload, signature, ...rest] = value.split(".");
  if (version !== tokenVersion || !payload || !signature || rest.length) {
    return null;
  }

  if (!timingSafeStringEqual(signature, signPayload(payload, secret))) {
    return null;
  }

  try {
    const envelope = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as SignedSessionEnvelope;

    if (
      envelope.purpose !== purpose ||
      typeof envelope.expiresAt !== "number" ||
      envelope.expiresAt <= now ||
      !validateData(envelope.data)
    ) {
      return null;
    }

    return envelope.data;
  } catch {
    return null;
  }
}

export function timingSafeStringEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) return false;

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function signPayload(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}
