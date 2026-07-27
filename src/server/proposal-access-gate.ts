import { NextResponse, type NextRequest } from "next/server";
import {
  proposalAccessPath,
  slugFromProposalPath,
} from "@/features/proposals/paths";
import { getProposalBySlug } from "@/features/proposals/repository";
import {
  getProposalAccessConfig,
  proposalAccessCookieName,
  verifyProposalAccessCookieValue,
} from "@/server/proposal-access";
import { applyPrivateResponseHeaders } from "@/server/access-http";

export function guardProposalAccessRequest(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const slug = slugFromProposalPath(pathname);

  if (!slug || pathname === proposalAccessPath(slug)) {
    return applyPrivateResponseHeaders(NextResponse.next());
  }

  const proposal = getProposalBySlug(slug);
  if (!proposal) return applyPrivateResponseHeaders(NextResponse.next());

  const hasAccess = verifyProposalAccessCookieValue({
    slug,
    value: request.cookies.get(proposalAccessCookieName)?.value,
    config: getProposalAccessConfig(),
  });

  if (hasAccess) return applyPrivateResponseHeaders(NextResponse.next());

  const accessUrl = new URL(proposalAccessPath(slug), request.url);
  accessUrl.searchParams.set("next", `${pathname}${search}`);

  return applyPrivateResponseHeaders(NextResponse.redirect(accessUrl));
}
