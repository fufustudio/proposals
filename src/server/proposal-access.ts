import { createHmac, timingSafeEqual } from "node:crypto";
import { proposalAccessPath, proposalPath } from "@/features/proposals";

export type ProposalAccessConfig = {
  codes: Readonly<Record<string, string>>;
  sessionSecret?: string;
  isProduction: boolean;
  usingFallbackCodes: boolean;
  usingFallbackSecret: boolean;
  parseError?: string;
};

type EnvLike = {
  [key: string]: string | undefined;
  PROPOSAL_ACCESS_CODES?: string;
  PROPOSAL_SESSION_SECRET?: string;
};

const demoCodes = { "sample-proposal": "demo" } as const;
const demoSessionSecret = "development-only-fufu-proposals-session-secret";
const tokenVersion = "v1";

export const proposalAccessCookieName = "proposal_access";
export const proposalAccessMaxAge = 60 * 60 * 24 * 14;

export function getProposalAccessConfig(
  env: EnvLike = process.env,
  nodeEnv = process.env.NODE_ENV,
): ProposalAccessConfig {
  const isProduction = nodeEnv === "production";
  const parsed = parseProposalAccessCodes(env.PROPOSAL_ACCESS_CODES);
  const hasConfiguredCodes = parsed.ok && Object.keys(parsed.codes).length > 0;
  const canUseFallbackCodes = !isProduction && !env.PROPOSAL_ACCESS_CODES;
  const canUseFallbackSecret = !isProduction && !env.PROPOSAL_SESSION_SECRET;

  return {
    codes: hasConfiguredCodes
      ? parsed.codes
      : canUseFallbackCodes
        ? demoCodes
        : {},
    sessionSecret:
      env.PROPOSAL_SESSION_SECRET ||
      (canUseFallbackSecret ? demoSessionSecret : undefined),
    isProduction,
    usingFallbackCodes: !hasConfiguredCodes && canUseFallbackCodes,
    usingFallbackSecret: !env.PROPOSAL_SESSION_SECRET && canUseFallbackSecret,
    parseError: parsed.ok ? undefined : parsed.error,
  };
}

export function parseProposalAccessCodes(
  value: string | undefined,
): { ok: true; codes: Record<string, string> } | { ok: false; error: string } {
  if (!value?.trim()) return { ok: true, codes: {} };

  try {
    const parsed = JSON.parse(value) as unknown;

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {
        ok: false,
        error: "PROPOSAL_ACCESS_CODES must be a JSON object.",
      };
    }

    const codes: Record<string, string> = {};
    for (const [slug, code] of Object.entries(parsed)) {
      if (typeof code !== "string" || !code) {
        return {
          ok: false,
          error: "Each proposal access code must be a non-empty string.",
        };
      }

      codes[slug] = code;
    }

    return { ok: true, codes };
  } catch {
    return {
      ok: false,
      error: "PROPOSAL_ACCESS_CODES must be valid JSON.",
    };
  }
}

export function validateProposalAccessCode({
  slug,
  code,
  config = getProposalAccessConfig(),
}: {
  slug: string;
  code: string;
  config?: ProposalAccessConfig;
}) {
  if (!config.sessionSecret) return false;

  const expected = config.codes[slug];
  if (!expected) return false;

  return timingSafeStringEqual(code.trim(), expected);
}

export function createProposalAccessCookieValue({
  slug,
  config = getProposalAccessConfig(),
  now = Date.now(),
}: {
  slug: string;
  config?: ProposalAccessConfig;
  now?: number;
}) {
  if (!config.sessionSecret) {
    throw new Error("Proposal access is missing PROPOSAL_SESSION_SECRET.");
  }

  const expiresAt = now + proposalAccessMaxAge * 1000;
  const payload = Buffer.from(
    JSON.stringify({ slug, expiresAt }),
    "utf8",
  ).toString("base64url");
  const signature = signPayload(payload, config.sessionSecret);

  return `${tokenVersion}.${payload}.${signature}`;
}

export function verifyProposalAccessCookieValue({
  slug,
  value,
  config = getProposalAccessConfig(),
  now = Date.now(),
}: {
  slug: string;
  value: string | undefined;
  config?: ProposalAccessConfig;
  now?: number;
}) {
  if (!value || !config.sessionSecret) return false;

  const [version, payload, signature, ...rest] = value.split(".");
  if (version !== tokenVersion || !payload || !signature || rest.length > 0) {
    return false;
  }

  if (
    !timingSafeStringEqual(
      signature,
      signPayload(payload, config.sessionSecret),
    )
  ) {
    return false;
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { slug?: unknown; expiresAt?: unknown };

    return (
      decoded.slug === slug &&
      typeof decoded.expiresAt === "number" &&
      decoded.expiresAt > now
    );
  } catch {
    return false;
  }
}

export function safeProposalNextPath(next: string, slug: string) {
  const fallback = proposalPath(slug);
  if (!next || !next.startsWith("/") || next.startsWith("//")) return fallback;

  try {
    const parsed = new URL(next, "https://fufu.local");
    const proposalBase = proposalPath(slug);
    const accessPath = proposalAccessPath(slug);
    const isProposalPath =
      parsed.pathname === proposalBase ||
      parsed.pathname.startsWith(`${proposalBase}/`);

    if (!isProposalPath || parsed.pathname === accessPath) return fallback;

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

function signPayload(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function timingSafeStringEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) return false;

  return timingSafeEqual(leftBuffer, rightBuffer);
}
