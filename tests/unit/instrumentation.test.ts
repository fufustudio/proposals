import { describe, expect, it } from "vitest";
import { redactPrivatePath } from "@/instrumentation";

describe("privacy-aware request instrumentation", () => {
  it("redacts proposal identifiers from reader and admin paths", () => {
    expect(redactPrivatePath("/proposals/acme-redesign")).toBe(
      "/proposals/[private-proposal]",
    );
    expect(redactPrivatePath("/admin/proposals/acme-redesign?tab=json")).toBe(
      "/admin/proposals/[private-proposal]?tab=json",
    );
    expect(redactPrivatePath("/admin")).toBe("/admin");
  });
});
