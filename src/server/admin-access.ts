import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSignedSession,
  timingSafeStringEqual,
  verifySignedSession,
} from "@/server/signed-session";

export type AdminAccessConfig = {
  code?: string;
  sessionSecret?: string;
  isProduction: boolean;
  usingFallbackCode: boolean;
  usingFallbackSecret: boolean;
};

type EnvLike = {
  [key: string]: string | undefined;
  ADMIN_ACCESS_CODE?: string;
  ADMIN_SESSION_SECRET?: string;
};

const demoAdminCode = "admin-demo";
const demoAdminSessionSecret = "development-only-fufu-admin-session-secret";
const sessionPurpose = "proposal-admin";

export const adminPath = "/admin";
export const adminAccessPath = "/admin/access";
export const adminAccessCookieName = "proposal_admin_access";
export const adminAccessMaxAge = 60 * 60 * 8;

export function adminProposalEditorPath(slug: string) {
  return `${adminPath}/proposals/${encodeURIComponent(slug)}`;
}

export function getAdminAccessConfig(
  env: EnvLike = process.env,
  nodeEnv = process.env.NODE_ENV,
): AdminAccessConfig {
  const isProduction = nodeEnv === "production";
  const configuredCode = env.ADMIN_ACCESS_CODE?.trim();
  const configuredSecret = env.ADMIN_SESSION_SECRET?.trim();
  const canUseFallbackCode = !isProduction && !configuredCode;
  const canUseFallbackSecret = !isProduction && !configuredSecret;

  return {
    code: configuredCode || (canUseFallbackCode ? demoAdminCode : undefined),
    sessionSecret:
      configuredSecret ||
      (canUseFallbackSecret ? demoAdminSessionSecret : undefined),
    isProduction,
    usingFallbackCode: canUseFallbackCode,
    usingFallbackSecret: canUseFallbackSecret,
  };
}

export function validateAdminAccessCode({
  code,
  config = getAdminAccessConfig(),
}: {
  code: string;
  config?: AdminAccessConfig;
}) {
  if (!config.code || !config.sessionSecret) return false;

  return timingSafeStringEqual(code.trim(), config.code);
}

export function createAdminAccessCookieValue({
  config = getAdminAccessConfig(),
  now = Date.now(),
}: {
  config?: AdminAccessConfig;
  now?: number;
} = {}) {
  if (!config.sessionSecret) {
    throw new Error("Admin access is missing ADMIN_SESSION_SECRET.");
  }

  return createSignedSession({
    purpose: sessionPurpose,
    data: { role: "admin" },
    secret: config.sessionSecret,
    maxAge: adminAccessMaxAge,
    now,
  });
}

export function verifyAdminAccessCookieValue({
  value,
  config = getAdminAccessConfig(),
  now = Date.now(),
}: {
  value: string | undefined;
  config?: AdminAccessConfig;
  now?: number;
}) {
  return Boolean(
    verifySignedSession({
      value,
      purpose: sessionPurpose,
      secret: config.sessionSecret,
      now,
      validateData: (data): data is { role: "admin" } =>
        Boolean(
          data &&
          typeof data === "object" &&
          (data as { role?: unknown }).role === "admin",
        ),
    }),
  );
}

export function safeAdminNextPath(next: string) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return adminPath;
  }

  try {
    const parsed = new URL(next, "https://fufu.local");
    const isAdminPath =
      parsed.pathname === adminPath ||
      parsed.pathname.startsWith(`${adminPath}/`);

    if (!isAdminPath || parsed.pathname === adminAccessPath) {
      return adminPath;
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return adminPath;
  }
}

export async function requireAdminAccess(nextPath = adminPath) {
  const cookieStore = await cookies();
  const hasAccess = verifyAdminAccessCookieValue({
    value: cookieStore.get(adminAccessCookieName)?.value,
    config: getAdminAccessConfig(),
  });

  if (!hasAccess) {
    redirect(
      `${adminAccessPath}?next=${encodeURIComponent(
        safeAdminNextPath(nextPath),
      )}`,
    );
  }
}
