import { beforeEach, describe, expect, it } from "vitest";

import { POST } from "@/app/api/proposal-access/route";
import {
  proposalAccessCookieName,
  safeProposalNextPath,
} from "@/server/proposal-access";

describe("POST /api/proposal-access", () => {
  beforeEach(() => {
    delete process.env.PROPOSAL_ACCESS_CODES;
    delete process.env.PROPOSAL_SESSION_SECRET;
  });

  it("sets a proposal access cookie and redirects for a valid code", async () => {
    process.env.PROPOSAL_ACCESS_CODES = '{"sample-proposal":"demo"}';
    process.env.PROPOSAL_SESSION_SECRET = "test-secret";

    const res = await POST(
      formRequest({
        slug: "sample-proposal",
        code: "demo",
        next: "/proposals/sample-proposal",
      }),
    );

    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe(
      "https://example.com/proposals/sample-proposal",
    );
    expect(res.headers.get("set-cookie")).toContain(
      `${proposalAccessCookieName}=`,
    );
    expect(res.headers.get("set-cookie")).toContain(
      "Path=/proposals/sample-proposal",
    );
    expect(res.headers.get("set-cookie")).toContain("HttpOnly");
    expect(res.headers.get("set-cookie")).toContain("SameSite=lax");
    expect(res.headers.get("set-cookie")).toContain("Secure");
    expect(res.headers.get("cache-control")).toContain("no-store");
    expect(res.headers.get("x-robots-tag")).toContain("noindex");
  });

  it("returns to the access page for invalid codes", async () => {
    process.env.PROPOSAL_ACCESS_CODES = '{"sample-proposal":"demo"}';
    process.env.PROPOSAL_SESSION_SECRET = "test-secret";

    const res = await POST(
      formRequest({
        slug: "sample-proposal",
        code: "wrong",
        next: "/proposals/sample-proposal",
      }),
    );

    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe(
      "https://example.com/proposals/sample-proposal/access?error=invalid&next=%2Fproposals%2Fsample-proposal",
    );
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("fails safely for unknown proposal slugs", async () => {
    const res = await POST(
      formRequest({
        slug: "unknown",
        code: "demo",
        next: "/proposals/unknown",
      }),
    );

    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("https://example.com/");
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("does not redirect successful access back to the password page", async () => {
    process.env.PROPOSAL_ACCESS_CODES = '{"sample-proposal":"demo"}';
    process.env.PROPOSAL_SESSION_SECRET = "test-secret";

    const res = await POST(
      formRequest({
        slug: "sample-proposal",
        code: "demo",
        next: "/proposals/sample-proposal/access?error=invalid",
      }),
    );

    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe(
      "https://example.com/proposals/sample-proposal",
    );
  });

  it("rejects unsupported and oversized request bodies", async () => {
    const unsupported = await POST(
      new Request("https://example.com/api/proposal-access", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: "code=demo",
      }),
    );
    const oversized = await POST(
      new Request("https://example.com/api/proposal-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": "9000",
        },
        body: "code=demo",
      }),
    );

    expect(unsupported.status).toBe(303);
    expect(unsupported.headers.get("location")).toBe("https://example.com/");
    expect(oversized.status).toBe(303);
    expect(oversized.headers.get("location")).toBe("https://example.com/");
  });
});

describe("safeProposalNextPath", () => {
  it("accepts only same-proposal detail paths and hashes", () => {
    expect(
      safeProposalNextPath(
        "/proposals/sample-proposal#investment",
        "sample-proposal",
      ),
    ).toBe("/proposals/sample-proposal#investment");
    expect(
      safeProposalNextPath(
        "/proposals/sample-proposal/access?error=invalid",
        "sample-proposal",
      ),
    ).toBe("/proposals/sample-proposal");
    expect(safeProposalNextPath("/proposals/other", "sample-proposal")).toBe(
      "/proposals/sample-proposal",
    );
  });
});

function formRequest(payload: Record<string, string>) {
  return new Request("https://example.com/api/proposal-access", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(payload),
  });
}
