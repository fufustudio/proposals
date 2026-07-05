import { describe, expect, it } from "vitest";

import {
  createProposalAccessCookieValue,
  getProposalAccessConfig,
  parseProposalAccessCodes,
  validateProposalAccessCode,
  verifyProposalAccessCookieValue,
} from "@/server/proposal-access";
import { getAllProposals, getProposalBySlug } from "@/features/proposals";

describe("proposal content helpers", () => {
  it("finds the demo proposal by slug", () => {
    expect(getAllProposals()).toHaveLength(1);
    expect(getProposalBySlug("sample-proposal")?.title).toBe("Sample Proposal");
    expect(getProposalBySlug("missing")).toBeNull();
  });
});

describe("proposal access helpers", () => {
  it("parses access code JSON", () => {
    expect(parseProposalAccessCodes('{"sample-proposal":"demo"}')).toEqual({
      ok: true,
      codes: { "sample-proposal": "demo" },
    });

    expect(parseProposalAccessCodes("[]")).toEqual({
      ok: false,
      error: "PROPOSAL_ACCESS_CODES must be a JSON object.",
    });
    expect(parseProposalAccessCodes("{")).toEqual({
      ok: false,
      error: "PROPOSAL_ACCESS_CODES must be valid JSON.",
    });
  });

  it("allows the sample proposal code in non-production without env vars", () => {
    const config = getProposalAccessConfig({}, "development");

    expect(config.usingFallbackCodes).toBe(true);
    expect(config.usingFallbackSecret).toBe(true);
    expect(
      validateProposalAccessCode({
        slug: "sample-proposal",
        code: "demo",
        config,
      }),
    ).toBe(true);
  });

  it("requires configured access in production", () => {
    const missingConfig = getProposalAccessConfig({}, "production");

    expect(
      validateProposalAccessCode({
        slug: "sample-proposal",
        code: "demo",
        config: missingConfig,
      }),
    ).toBe(false);

    const configured = getProposalAccessConfig(
      {
        PROPOSAL_ACCESS_CODES: '{"sample-proposal":"real-code"}',
        PROPOSAL_SESSION_SECRET: "secret",
      },
      "production",
    );

    expect(
      validateProposalAccessCode({
        slug: "sample-proposal",
        code: "real-code",
        config: configured,
      }),
    ).toBe(true);
  });

  it("signs and verifies proposal access cookies", () => {
    const config = getProposalAccessConfig(
      {
        PROPOSAL_ACCESS_CODES: '{"sample-proposal":"demo"}',
        PROPOSAL_SESSION_SECRET: "secret",
      },
      "test",
    );
    const now = Date.UTC(2026, 6, 4);
    const value = createProposalAccessCookieValue({
      slug: "sample-proposal",
      config,
      now,
    });

    expect(
      verifyProposalAccessCookieValue({
        slug: "sample-proposal",
        value,
        config,
        now,
      }),
    ).toBe(true);
    expect(
      verifyProposalAccessCookieValue({
        slug: "other-proposal",
        value,
        config,
        now,
      }),
    ).toBe(false);
    expect(
      verifyProposalAccessCookieValue({
        slug: "sample-proposal",
        value: `${value}x`,
        config,
        now,
      }),
    ).toBe(false);
    expect(
      verifyProposalAccessCookieValue({
        slug: "sample-proposal",
        value,
        config,
        now: now + 60 * 60 * 24 * 15 * 1000,
      }),
    ).toBe(false);
  });
});
