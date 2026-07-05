import { NextResponse, type NextRequest } from "next/server";
import {
  getProposalBySlug,
  proposalAccessPath,
  slugFromProposalPath,
} from "@/features/proposals";
import {
  getProposalAccessConfig,
  proposalAccessCookieName,
  verifyProposalAccessCookieValue,
} from "@/server/proposal-access";

export function guardProposalAccessRequest(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const slug = slugFromProposalPath(pathname);

  if (!slug || pathname === proposalAccessPath(slug)) {
    return NextResponse.next();
  }

  const proposal = getProposalBySlug(slug);
  if (!proposal) return NextResponse.next();

  const hasAccess = verifyProposalAccessCookieValue({
    slug,
    value: request.cookies.get(proposalAccessCookieName)?.value,
    config: getProposalAccessConfig(),
  });

  if (hasAccess) return NextResponse.next();

  const accessUrl = new URL(proposalAccessPath(slug), request.url);
  accessUrl.searchParams.set("next", `${pathname}${search}`);

  return NextResponse.redirect(accessUrl);
}
