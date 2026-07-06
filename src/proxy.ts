import type { NextRequest } from "next/server";
import { guardAdminAccessRequest } from "@/server/admin-access-gate";
import { guardProposalAccessRequest } from "@/server/proposal-access-gate";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return guardAdminAccessRequest(request);
  }

  return guardProposalAccessRequest(request);
}

export const config = {
  matcher: ["/admin/:path*", "/proposals/:path*"],
};
