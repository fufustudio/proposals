import { describe, expect, it } from "vitest";

import {
  createAdminAccessCookieValue,
  getAdminAccessConfig,
} from "@/server/admin-access";
import {
  createProposalAccessCookieValue,
  getProposalAccessConfig,
  parseProposalAccessCodes,
  validateProposalAccessCode,
  verifyProposalAccessCookieValue,
} from "@/server/proposal-access";
import proposalsJson from "@/content/proposals.json";
import {
  getAllProposals,
  getProposalBySlug,
} from "@/page-modules/proposals/repository";
import { validateProposals } from "@/page-modules/proposals/validation";

describe("proposal content helpers", () => {
  it("finds the demo proposal by slug", () => {
    expect(getAllProposals()).toHaveLength(1);
    const proposal = getProposalBySlug("sample-proposal");

    expect(proposal?.status).toBe("draft");
    expect(proposal?.slides).toHaveLength(13);
    expect(proposal?.slides[0]?.id).toBe("cover");
    expect(proposal?.slides[0]?.layout).toBe("cover");
    expect(proposal?.slides.at(-1)?.id).toBe("appendix");
    expect(proposal?.slides.every((slide) => slide.blocks.length > 0)).toBe(
      true,
    );
    expect(getProposalBySlug("missing")).toBeNull();
  });

  it("validates the canonical proposal JSON fixture", () => {
    const result = validateProposals(proposalsJson);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value[0]?.slug).toBe("sample-proposal");
    }
  });

  it("rejects invalid identity, dates, structure, and links", () => {
    const invalid = structuredClone(proposalsJson) as unknown as {
      slug: string;
      preparedAt: string;
      slides: {
        id: string;
        blocks: Record<string, unknown>[];
      }[];
    }[];
    const proposal = invalid[0];

    if (!proposal) throw new Error("Expected the sample proposal fixture.");

    proposal.slug = "Invalid Slug";
    proposal.preparedAt = "2026-02-30";
    proposal.slides[1]!.id = proposal.slides[0]!.id;
    proposal.slides[2]!.blocks = [];
    proposal.slides[11]!.blocks[1]!.href = "javascript:alert(1)";
    invalid.push(structuredClone(proposal));

    const result = validateProposals(invalid);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          expect.stringContaining("slug must use lowercase"),
          expect.stringContaining("preparedAt must be a valid YYYY-MM-DD date"),
          expect.stringContaining('id duplicates "cover"'),
          expect.stringContaining("blocks must contain at least one block"),
          expect.stringContaining("href must be an https, mailto, tel"),
          expect.stringContaining('slug duplicates "Invalid Slug"'),
        ]),
      );
    }
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

  it("does not accept an admin session as a proposal session", () => {
    const secret = "shared-secret-for-audience-test";
    const adminValue = createAdminAccessCookieValue({
      config: getAdminAccessConfig(
        {
          ADMIN_ACCESS_CODE: "admin-code",
          ADMIN_SESSION_SECRET: secret,
        },
        "test",
      ),
    });
    const proposalConfig = getProposalAccessConfig(
      {
        PROPOSAL_ACCESS_CODES: '{"sample-proposal":"demo"}',
        PROPOSAL_SESSION_SECRET: secret,
      },
      "test",
    );

    expect(
      verifyProposalAccessCookieValue({
        slug: "sample-proposal",
        value: adminValue,
        config: proposalConfig,
      }),
    ).toBe(false);
  });
});
