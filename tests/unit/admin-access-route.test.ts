import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST as POSTAccess } from "@/app/api/admin-access/route";
import { POST as POSTLogout } from "@/app/api/admin-logout/route";
import { adminAccessCookieName } from "@/server/admin-access";

describe("POST /api/admin-access", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    delete process.env.ADMIN_ACCESS_CODE;
    delete process.env.ADMIN_SESSION_SECRET;
  });

  it("sets an admin access cookie and redirects for a valid code", async () => {
    process.env.ADMIN_ACCESS_CODE = "admin-demo";
    process.env.ADMIN_SESSION_SECRET = "test-secret";

    const res = await POSTAccess(
      formRequest("https://example.com/api/admin-access", {
        code: "admin-demo",
        next: "/admin/proposals/sample-proposal",
      }),
    );

    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe(
      "https://example.com/admin/proposals/sample-proposal",
    );
    expect(res.headers.get("set-cookie")).toContain(
      `${adminAccessCookieName}=`,
    );
    expect(res.headers.get("set-cookie")).toContain("Path=/admin");
    expect(res.headers.get("set-cookie")).toContain("HttpOnly");
  });

  it("returns to the access page for invalid codes", async () => {
    process.env.ADMIN_ACCESS_CODE = "admin-demo";
    process.env.ADMIN_SESSION_SECRET = "test-secret";

    const res = await POSTAccess(
      formRequest("https://example.com/api/admin-access", {
        code: "wrong",
        next: "/admin",
      }),
    );

    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe(
      "https://example.com/admin/access?error=invalid&next=%2Fadmin",
    );
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("returns JSON safely when production admin access is unconfigured", async () => {
    vi.stubEnv("NODE_ENV", "production");

    const res = await POSTAccess(
      jsonRequest("https://example.com/api/admin-access", {
        code: "admin-demo",
        next: "/admin",
      }),
    );
    const body = (await res.json()) as { success?: boolean; message?: string };

    expect(res.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.message).toBe("Admin access is not configured.");
    expect(res.headers.get("set-cookie")).toBeNull();
  });
});

describe("POST /api/admin-logout", () => {
  it("clears the admin cookie", async () => {
    const res = await POSTLogout(
      formRequest("https://example.com/api/admin-logout", {}),
    );

    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe(
      "https://example.com/admin/access",
    );
    expect(res.headers.get("set-cookie")).toContain(
      `${adminAccessCookieName}=`,
    );
    expect(res.headers.get("set-cookie")).toContain("Max-Age=0");
    expect(res.headers.get("set-cookie")).toContain("Path=/admin");
  });
});

function formRequest(url: string, payload: Record<string, string>) {
  return new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(payload),
  });
}

function jsonRequest(url: string, payload: Record<string, string>) {
  return new Request(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
