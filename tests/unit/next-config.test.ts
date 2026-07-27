import { describe, expect, it } from "vitest";

import nextConfig from "../../next.config";

describe("Next.js security and runtime defaults", () => {
  it("uses typed routes and removes the framework header", () => {
    expect(nextConfig.typedRoutes).toBe(true);
    expect(nextConfig.poweredByHeader).toBe(false);
  });

  it("keeps private surfaces same-origin framed and tightly permissioned", async () => {
    expect(typeof nextConfig.headers).toBe("function");

    const rules = await nextConfig.headers!();
    const headers = rules.flatMap((rule) => rule.headers);
    const publicCsp = rules[0]?.headers.find(
      (header) => header.key === "Content-Security-Policy",
    )?.value;
    const privateRules = rules.filter((rule) =>
      ["/admin/:path*", "/proposals/:path*"].includes(rule.source),
    );

    expect(headers).toContainEqual({
      key: "X-Frame-Options",
      value: "SAMEORIGIN",
    });
    expect(headers).toContainEqual(
      expect.objectContaining({ key: "Permissions-Policy" }),
    );
    expect(publicCsp).toContain("frame-ancestors 'self'");
    expect(publicCsp).toContain("font-src 'self' data:");
    expect(publicCsp).not.toContain("fonts.gstatic.com");
    expect(privateRules).toHaveLength(2);

    for (const rule of privateRules) {
      const privateCsp = rule.headers.find(
        (header) => header.key === "Content-Security-Policy",
      )?.value;
      expect(privateCsp).not.toContain("vercel");
      expect(rule.headers).toContainEqual({
        key: "X-Robots-Tag",
        value: "noindex, nofollow, noarchive, nosnippet",
      });
      expect(rule.headers).toContainEqual(
        expect.objectContaining({
          key: "Cache-Control",
          value: expect.stringContaining("no-store"),
        }),
      );
    }
  });
});
