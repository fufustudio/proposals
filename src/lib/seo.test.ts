import { describe, expect, it } from "vitest";
import { pageMetadata } from "./seo";

describe("pageMetadata", () => {
  it("includes default social images on every page", () => {
    const metadata = pageMetadata({
      title: "About",
      description: "About page",
      path: "/about",
    });

    expect(metadata.openGraph?.images).toEqual([
      { url: "/opengraph-image", width: 1200, height: 630 },
    ]);
    expect(metadata.twitter?.images).toEqual(["/opengraph-image"]);
  });
});
