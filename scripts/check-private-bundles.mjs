#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";

export function privateContentMarkers(proposals) {
  const markers = [];

  for (const [proposalIndex, proposal] of proposals.entries()) {
    for (const key of ["slug", "title", "clientLabel", "summary"]) {
      addMarker(markers, `proposals[${proposalIndex}].${key}`, proposal[key]);
    }

    for (const [slideIndex, slide] of (proposal.slides ?? []).entries()) {
      for (const key of ["heading", "intro", "note"]) {
        addMarker(
          markers,
          `proposals[${proposalIndex}].slides[${slideIndex}].${key}`,
          slide[key],
        );
      }
    }
  }

  return markers;
}

export function findPrivateBundleLeaks({ proposalsFile, staticChunksRoot }) {
  if (!existsSync(staticChunksRoot)) {
    throw new Error(
      `Static build output was not found at ${staticChunksRoot}. Run the production build first.`,
    );
  }

  const proposals = JSON.parse(readFileSync(proposalsFile, "utf8"));
  const markers = privateContentMarkers(proposals);
  const failures = [];

  for (const file of walk(staticChunksRoot).filter((path) =>
    /\.(?:js|json)$/.test(path),
  )) {
    const source = readFileSync(file, "utf8");
    for (const marker of markers) {
      if (source.includes(marker.value)) {
        failures.push({
          file: relative(staticChunksRoot, file),
          source: marker.source,
        });
      }
    }
  }

  return failures;
}

function addMarker(markers, source, value) {
  if (typeof value !== "string" || value.length < 8) return;
  markers.push({ source, value });
}

function walk(root) {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function main() {
  const root = process.cwd();
  const failures = findPrivateBundleLeaks({
    proposalsFile: join(root, "src/content/proposals.json"),
    staticChunksRoot: join(root, ".next/static/chunks"),
  });

  if (failures.length) {
    console.error("Private proposal content leaked into browser bundles:");
    for (const failure of failures) {
      console.error(`- ${failure.file} contains ${failure.source}`);
    }
    process.exit(1);
  }

  console.log("Browser bundles contain no private proposal fixture markers.");
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) main();
