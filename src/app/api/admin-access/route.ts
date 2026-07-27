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
import {
  accessResponse,
  invalidAccessPayloadResponse,
  isSecureRequest,
  readAccessPayload,
} from "@/server/access-http";

export async function POST(request: Request) {
  const payload = await readAccessPayload(request, ["code", "next"]);
  if (!payload.ok) {
    return invalidAccessPayloadResponse(request, payload.reason);
  }

  const code = payload.fields.code;
  const nextPath = safeAdminNextPath(payload.fields.next);
  const config = getAdminAccessConfig();

  if (!code || !validateAdminAccessCode({ code, config })) {
    const errorUrl = new URL(adminAccessPath, request.url);
    errorUrl.searchParams.set("error", "invalid");
    errorUrl.searchParams.set("next", nextPath);

    return accessResponse({
      request,
      redirectPath: `${errorUrl.pathname}${errorUrl.search}`,
      success: false,
      status: 401,
      message: config.sessionSecret
        ? "That passcode did not unlock admin."
        : "Admin access is not configured.",
    });
  }

  const response = accessResponse({
    request,
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
