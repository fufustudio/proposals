import { NextResponse } from "next/server";
import {
  adminAccessCookieName,
  adminAccessMaxAge,
  adminAccessPath,
  adminPath,
  createAdminAccessCookieValue,
  getAdminAccessConfig,
  safeAdminNextPath,
  validateAdminAccessCode,
} from "@/server/admin-access";

export async function POST(request: Request) {
  const payload = await readPayload(request);
  const code = payload.code;
  const nextPath = safeAdminNextPath(payload.next);
  const wantsJson = request.headers.get("accept")?.includes("application/json");
  const config = getAdminAccessConfig();

  if (!code || !validateAdminAccessCode({ code, config })) {
    const errorUrl = new URL(adminAccessPath, request.url);
    errorUrl.searchParams.set("error", "invalid");
    errorUrl.searchParams.set("next", nextPath);

    return adminAccessResponse({
      requestUrl: request.url,
      wantsJson,
      redirectPath: `${errorUrl.pathname}${errorUrl.search}`,
      success: false,
      status: 401,
      message: config.sessionSecret
        ? "That passcode did not unlock admin."
        : "Admin access is not configured.",
    });
  }

  const response = adminAccessResponse({
    requestUrl: request.url,
    wantsJson,
    redirectPath: nextPath,
    success: true,
  });
  response.cookies.set({
    name: adminAccessCookieName,
    value: createAdminAccessCookieValue({ config }),
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureRequest(request),
    path: adminPath,
    maxAge: adminAccessMaxAge,
  });

  return response;
}

function adminAccessResponse({
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

  return NextResponse.redirect(new URL(redirectPath, requestUrl), 303);
}

async function readPayload(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const json = await request.json().catch(() => null);
    return {
      code: fieldValue(json, "code"),
      next: fieldValue(json, "next"),
    };
  }

  const params = new URLSearchParams(await request.text());
  return {
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
