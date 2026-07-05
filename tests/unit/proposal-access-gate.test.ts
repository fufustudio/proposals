import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it } from "vitest";
import { guardProposalAccessRequest } from "@/server/proposal-access-gate";
import {
  createProposalAccessCookieValue,
  getProposalAccessConfig,
  proposalAccessCookieName,
  proposalAccessMaxAge,
} from "@/server/proposal-access";

describe("proposal access proxy gate", () => {
  beforeEach(() => {
    process.env.PROPOSAL_ACCESS_CODES = '{"sample-proposal":"demo"}';
    process.env.PROPOSAL_SESSION_SECRET = "test-secret";
  });

  it("redirects locked proposal requests to the access page with next", () => {
    const response = guardProposalAccessRequest(
      request("https://example.com/proposals/sample-proposal?section=scope"),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://example.com/proposals/sample-proposal/access?next=%2Fproposals%2Fsample-proposal%3Fsection%3Dscope",
    );
  });

  it("allows proposal access pages through", () => {
    const response = guardProposalAccessRequest(
      request("https://example.com/proposals/sample-proposal/access"),
    );

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("allows unknown proposal slugs through safely", () => {
    const response = guardProposalAccessRequest(
      request("https://example.com/proposals/unknown"),
    );

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("allows proposal requests with a valid signed access cookie", () => {
    const config = getProposalAccessConfig();
    const cookieValue = createProposalAccessCookieValue({
      slug: "sample-proposal",
      config,
    });
    const response = guardProposalAccessRequest(
      request("https://example.com/proposals/sample-proposal", cookieValue),
    );

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("redirects proposal requests with an expired access cookie", () => {
    const config = getProposalAccessConfig();
    const cookieValue = createProposalAccessCookieValue({
      slug: "sample-proposal",
      config,
      now: Date.now() - proposalAccessMaxAge * 1000 - 1000,
    });
    const response = guardProposalAccessRequest(
      request("https://example.com/proposals/sample-proposal", cookieValue),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://example.com/proposals/sample-proposal/access?next=%2Fproposals%2Fsample-proposal",
    );
  });
});

function request(url: string, proposalAccessCookie?: string) {
  return new NextRequest(url, {
    headers: proposalAccessCookie
      ? {
          cookie: `${proposalAccessCookieName}=${proposalAccessCookie}`,
        }
      : undefined,
  });
}
