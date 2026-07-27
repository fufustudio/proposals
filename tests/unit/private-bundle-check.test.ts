import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import {
  findPrivateBundleLeaks,
  privateContentMarkers,
} from "../../scripts/check-private-bundles.mjs";

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("private browser-bundle check", () => {
  const fixture = [
    {
      slug: "private-proposal",
      title: "Private Project Title",
      clientLabel: "Private Client",
      summary: "A confidential project summary.",
      slides: [{ heading: "A private slide heading." }],
    },
  ];

  it("selects stable proposal identity and copy markers", () => {
    expect(privateContentMarkers(fixture)).toEqual(
      expect.arrayContaining([
        {
          source: "proposals[0].clientLabel",
          value: "Private Client",
        },
        {
          source: "proposals[0].slides[0].heading",
          value: "A private slide heading.",
        },
      ]),
    );
  });

  it("reports private markers in browser chunks without printing their value", () => {
    const root = mkdtempSync(join(tmpdir(), "proposal-bundle-check-"));
    temporaryDirectories.push(root);
    const chunks = join(root, "chunks");
    mkdirSync(chunks);
    const proposalsFile = join(root, "proposals.json");
    writeFileSync(proposalsFile, JSON.stringify(fixture));
    writeFileSync(join(chunks, "app.js"), 'self.__payload="Private Client";');

    expect(
      findPrivateBundleLeaks({
        proposalsFile,
        staticChunksRoot: chunks,
      }),
    ).toEqual([
      {
        file: "app.js",
        source: "proposals[0].clientLabel",
      },
    ]);
  });
});
