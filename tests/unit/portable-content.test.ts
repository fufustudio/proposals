import { describe, expect, it } from "vitest";

import {
  isExternalPortableTextHref,
  portableTextHref,
} from "@/components/ui/portable-content";

describe("portableTextHref", () => {
  it("allows expected public and relative link targets", () => {
    expect(portableTextHref("https://example.com")).toBe("https://example.com");
    expect(portableTextHref("mailto:hello@example.com")).toBe(
      "mailto:hello@example.com",
    );
    expect(portableTextHref("/sample")).toBe("/sample");
  });

  it("rejects scriptable or unsupported protocols", () => {
    expect(portableTextHref("javascript:alert(1)")).toBeNull();
    expect(
      portableTextHref("data:text/html,<script>alert(1)</script>"),
    ).toBeNull();
    expect(portableTextHref("ftp://example.com/file")).toBeNull();
  });

  it("identifies http links as external", () => {
    expect(isExternalPortableTextHref("https://example.com")).toBe(true);
    expect(isExternalPortableTextHref("/sample")).toBe(false);
    expect(isExternalPortableTextHref("mailto:hello@example.com")).toBe(false);
  });
});
