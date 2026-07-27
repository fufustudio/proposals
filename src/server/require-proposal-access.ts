import "server-only";

import type { Route } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { proposalAccessPath, proposalPath } from "@/features/proposals/paths";
import {
  getProposalAccessConfig,
  proposalAccessCookieName,
  safeProposalNextPath,
  verifyProposalAccessCookieValue,
} from "@/server/proposal-access";

export async function requireProposalAccess(
  slug: string,
  nextPath = proposalPath(slug),
) {
  const cookieStore = await cookies();
  const hasAccess = verifyProposalAccessCookieValue({
    slug,
    value: cookieStore.get(proposalAccessCookieName)?.value,
    config: getProposalAccessConfig(),
  });

  if (!hasAccess) {
    redirect(
      `${proposalAccessPath(slug)}?next=${encodeURIComponent(
        safeProposalNextPath(nextPath, slug),
      )}` as Route,
    );
  }
}
