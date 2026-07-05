import type { NextRequest } from "next/server";
import { guardProposalAccessRequest } from "@/server/proposal-access-gate";

export function proxy(request: NextRequest) {
  return guardProposalAccessRequest(request);
}

export const config = {
  matcher: ["/proposals/:path*"],
};
