import { describe, expect, it } from "vitest";

import {
  adminAccessMaxAge,
  createAdminAccessCookieValue,
  getAdminAccessConfig,
  safeAdminNextPath,
  validateAdminAccessCode,
  verifyAdminAccessCookieValue,
} from "@/server/admin-access";

describe("admin access helpers", () => {
  it("allows the demo admin code in non-production without env vars", () => {
    const config = getAdminAccessConfig({}, "development");

    expect(config.usingFallbackCode).toBe(true);
    expect(config.usingFallbackSecret).toBe(true);
    expect(validateAdminAccessCode({ code: "admin-demo", config })).toBe(true);
  });

  it("requires configured admin access in production", () => {
    const missingConfig = getAdminAccessConfig({}, "production");

    expect(
      validateAdminAccessCode({ code: "admin-demo", config: missingConfig }),
    ).toBe(false);

    const configured = getAdminAccessConfig(
      {
        ADMIN_ACCESS_CODE: "real-admin-code",
        ADMIN_SESSION_SECRET: "secret",
      },
      "production",
    );

    expect(
      validateAdminAccessCode({
        code: "real-admin-code",
        config: configured,
      }),
    ).toBe(true);
  });

  it("signs and verifies admin access cookies", () => {
    const config = getAdminAccessConfig(
      {
        ADMIN_ACCESS_CODE: "admin-demo",
        ADMIN_SESSION_SECRET: "secret",
      },
      "test",
    );
    const now = Date.UTC(2026, 6, 4);
    const value = createAdminAccessCookieValue({ config, now });

    expect(
      verifyAdminAccessCookieValue({
        value,
        config,
        now,
      }),
    ).toBe(true);
    expect(
      verifyAdminAccessCookieValue({
        value: `${value}x`,
        config,
        now,
      }),
    ).toBe(false);
    expect(
      verifyAdminAccessCookieValue({
        value,
        config,
        now: now + adminAccessMaxAge * 1000 + 1000,
      }),
    ).toBe(false);
  });

  it("sanitizes admin next paths", () => {
    expect(safeAdminNextPath("/admin/proposals/sample-proposal")).toBe(
      "/admin/proposals/sample-proposal",
    );
    expect(safeAdminNextPath("/admin/proposals/sample-proposal?tab=json")).toBe(
      "/admin/proposals/sample-proposal?tab=json",
    );
    expect(safeAdminNextPath("/admin/access")).toBe("/admin");
    expect(safeAdminNextPath("/proposals/sample-proposal")).toBe("/admin");
    expect(safeAdminNextPath("https://example.com/admin")).toBe("/admin");
    expect(safeAdminNextPath("//example.com/admin")).toBe("/admin");
  });
});
