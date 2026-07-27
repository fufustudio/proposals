import { NextResponse, type NextRequest } from "next/server";
import {
  adminAccessCookieName,
  adminAccessPath,
  adminPath,
  getAdminAccessConfig,
  safeAdminNextPath,
  verifyAdminAccessCookieValue,
} from "@/server/admin-access";
import { applyPrivateResponseHeaders } from "@/server/access-http";

export function guardAdminAccessRequest(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!isAdminPath(pathname) || pathname === adminAccessPath) {
    return applyPrivateResponseHeaders(NextResponse.next());
  }

  const hasAccess = verifyAdminAccessCookieValue({
    value: request.cookies.get(adminAccessCookieName)?.value,
    config: getAdminAccessConfig(),
  });

  if (hasAccess) return applyPrivateResponseHeaders(NextResponse.next());

  const accessUrl = new URL(adminAccessPath, request.url);
  accessUrl.searchParams.set("next", safeAdminNextPath(`${pathname}${search}`));

  return applyPrivateResponseHeaders(NextResponse.redirect(accessUrl));
}

function isAdminPath(pathname: string) {
  return pathname === adminPath || pathname.startsWith(`${adminPath}/`);
}
