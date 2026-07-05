import { NextResponse } from "next/server";
import {
  createProposalAccessCookieValue,
  getProposalAccessConfig,
  proposalAccessCookieName,
  proposalAccessMaxAge,
  safeProposalNextPath,
  validateProposalAccessCode,
} from "@/server/proposal-access";
import {
  getProposalBySlug,
  proposalAccessPath,
  proposalPath,
} from "@/features/proposals";

export async function POST(request: Request) {
  const payload = await readPayload(request);
  const slug = payload.slug;
  const code = payload.code;
  const next = payload.next;
  const wantsJson = request.headers.get("accept")?.includes("application/json");

  if (!slug || !getProposalBySlug(slug)) {
    return accessResponse({
      requestUrl: request.url,
      wantsJson,
      redirectPath: "/",
      success: false,
      status: 404,
      message: "Proposal not found.",
    });
  }

  const config = getProposalAccessConfig();
  const accessPath = proposalAccessPath(slug);
  const nextPath = safeProposalNextPath(next, slug);

  if (
    !code ||
    !validateProposalAccessCode({
      slug,
      code,
      config,
    })
  ) {
    const errorUrl = new URL(accessPath, request.url);
    errorUrl.searchParams.set("error", "invalid");
    errorUrl.searchParams.set("next", nextPath);
    return accessResponse({
      requestUrl: request.url,
      wantsJson,
      redirectPath: `${errorUrl.pathname}${errorUrl.search}`,
      success: false,
      status: 401,
      message: "That password did not unlock this proposal.",
    });
  }

  const response = accessResponse({
    requestUrl: request.url,
    wantsJson,
    redirectPath: nextPath,
    success: true,
  });
  response.cookies.set({
    name: proposalAccessCookieName,
    value: createProposalAccessCookieValue({ slug, config }),
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureRequest(request),
    path: proposalPath(slug),
    maxAge: proposalAccessMaxAge,
  });

  return response;
}

function accessResponse({
  requestUrl,
  wantsJson,
  redirectPath,
  success,
  status = 200,
  message,
}: {
  requestUrl: string;
  wantsJson?: boolean;
  redirectPath: string;
  success: boolean;
  status?: number;
  message?: string;
}) {
  if (wantsJson) {
    return NextResponse.json(
      { success, redirectTo: redirectPath, ...(message ? { message } : {}) },
      { status },
    );
  }

  return redirectTo(redirectPath, requestUrl);
}

function redirectTo(path: string, requestUrl: string) {
  return NextResponse.redirect(new URL(path, requestUrl), 303);
}

async function readPayload(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const json = await request.json().catch(() => null);
    return {
      slug: fieldValue(json, "slug"),
      code: fieldValue(json, "code"),
      next: fieldValue(json, "next"),
    };
  }

  const params = new URLSearchParams(await request.text());
  return {
    slug: formValue(params.get("slug")),
    code: formValue(params.get("code")),
    next: formValue(params.get("next")),
  };
}

function fieldValue(value: unknown, key: string) {
  if (!value || typeof value !== "object") return "";
  return formValue((value as Record<string, unknown>)[key]);
}

function formValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isSecureRequest(request: Request) {
  return (
    new URL(request.url).protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https"
  );
}
