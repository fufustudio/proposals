import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it } from "vitest";
import { guardAdminAccessRequest } from "@/server/admin-access-gate";
import {
  adminAccessCookieName,
  adminAccessMaxAge,
  createAdminAccessCookieValue,
  getAdminAccessConfig,
} from "@/server/admin-access";

describe("admin access proxy gate", () => {
  beforeEach(() => {
    process.env.ADMIN_ACCESS_CODE = "admin-demo";
    process.env.ADMIN_SESSION_SECRET = "test-secret";
  });

  it("redirects locked admin requests to the access page with next", () => {
    const response = guardAdminAccessRequest(
      request("https://example.com/admin/proposals/sample-proposal"),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://example.com/admin/access?next=%2Fadmin%2Fproposals%2Fsample-proposal",
    );
  });

  it("allows the admin access page through", () => {
    const response = guardAdminAccessRequest(
      request("https://example.com/admin/access"),
    );

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("allows admin requests with a valid signed access cookie", () => {
    const config = getAdminAccessConfig();
    const cookieValue = createAdminAccessCookieValue({ config });
    const response = guardAdminAccessRequest(
      request("https://example.com/admin", cookieValue),
    );

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("redirects admin requests with an expired access cookie", () => {
    const config = getAdminAccessConfig();
    const cookieValue = createAdminAccessCookieValue({
      config,
      now: Date.now() - adminAccessMaxAge * 1000 - 1000,
    });
    const response = guardAdminAccessRequest(
      request("https://example.com/admin", cookieValue),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://example.com/admin/access?next=%2Fadmin",
    );
  });
});

function request(url: string, adminAccessCookie?: string) {
  return new NextRequest(url, {
    headers: adminAccessCookie
      ? {
          cookie: `${adminAccessCookieName}=${adminAccessCookie}`,
        }
      : undefined,
  });
}
