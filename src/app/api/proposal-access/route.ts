import {
  createProposalAccessCookieValue,
  getProposalAccessConfig,
  proposalAccessCookieName,
  proposalAccessMaxAge,
  safeProposalNextPath,
  validateProposalAccessCode,
} from "@/server/proposal-access";
import {
  proposalAccessPath,
  proposalPath,
} from "@/page-modules/proposals/paths";
import { getProposalBySlug } from "@/page-modules/proposals/repository";
import {
  accessResponse,
  invalidAccessPayloadResponse,
  isSecureRequest,
  readAccessPayload,
} from "@/server/access-http";

export async function POST(request: Request) {
  const payload = await readAccessPayload(request, ["slug", "code", "next"]);
  if (!payload.ok) {
    return invalidAccessPayloadResponse(request, payload.reason);
  }

  const slug = payload.fields.slug;
  const code = payload.fields.code;
  const next = payload.fields.next;

  if (!slug || !getProposalBySlug(slug)) {
    return accessResponse({
      request,
      redirectPath: "/",
      success: false,
      status: 401,
      message: "That password did not unlock this proposal.",
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
      request,
      redirectPath: `${errorUrl.pathname}${errorUrl.search}`,
      success: false,
      status: 401,
      message: "That password did not unlock this proposal.",
    });
  }

  const response = accessResponse({
    request,
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
