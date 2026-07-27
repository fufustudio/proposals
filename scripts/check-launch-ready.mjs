#!/usr/bin/env node

import nextEnv from "@next/env";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const { loadEnvConfig, resetEnv, updateInitialEnv } = nextEnv;

export function loadEnvironment(root, processEnvironment = process.env) {
  const originalNodeEnv = process.env.NODE_ENV;
  const logger = { info() {}, error: console.error };
  process.env.NODE_ENV = "production";
  updateInitialEnv({ NODE_ENV: "production" });

  try {
    return {
      ...loadEnvConfig(root, false, logger, true).combinedEnv,
      ...processEnvironment,
    };
  } finally {
    resetEnv();
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
    updateInitialEnv({ NODE_ENV: originalNodeEnv });
  }
}

function trimmed(env, name) {
  return env[name]?.trim() ?? "";
}

export function validateProductionOrigin(value, name = "NEXT_PUBLIC_SITE_URL") {
  if (!value) return [`${name} is required for launch.`];

  try {
    const url = new URL(value);
    const failures = [];

    if (url.protocol !== "https:") {
      failures.push(`${name} must use https for launch.`);
    }
    if (url.pathname !== "/" || url.search || url.hash) {
      failures.push(
        `${name} must be an origin without a path, query, or hash.`,
      );
    }
    if (
      ["localhost", "127.0.0.1", "::1"].includes(url.hostname) ||
      url.hostname === "0.0.0.0" ||
      url.hostname.endsWith(".local")
    ) {
      failures.push(`${name} must not point at a local host for launch.`);
    }
    if (
      url.hostname === "example.com" ||
      url.hostname.endsWith(".example") ||
      url.hostname.endsWith(".example.com")
    ) {
      failures.push(`${name} must not use an example domain for launch.`);
    }

    return failures;
  } catch {
    return [`${name} must be an absolute URL origin.`];
  }
}

export function validateProposalCodes(value, expectedSlugs = []) {
  if (!value) return ["PROPOSAL_ACCESS_CODES is required for launch."];

  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return ["PROPOSAL_ACCESS_CODES must be a JSON object."];
    }

    const entries = Object.entries(parsed);
    if (!entries.length) {
      return ["PROPOSAL_ACCESS_CODES must contain at least one proposal."];
    }

    const failures = [];
    for (const [slug, code] of entries) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        failures.push(
          `PROPOSAL_ACCESS_CODES contains invalid slug "${slug || "(empty)"}".`,
        );
      }
      if (typeof code !== "string" || code.trim().length < 8) {
        failures.push(
          `The access code for ${slug || "an unnamed proposal"} must contain at least 8 characters.`,
        );
      } else if (
        /demo|password|change.?me|replace|example|fake|test/i.test(code.trim())
      ) {
        failures.push(
          `The access code for ${slug} still contains a placeholder value.`,
        );
      }
    }

    const configuredSlugs = new Set(entries.map(([slug]) => slug));
    for (const slug of expectedSlugs) {
      if (!configuredSlugs.has(slug)) {
        failures.push(
          `PROPOSAL_ACCESS_CODES is missing the "${slug}" proposal.`,
        );
      }
    }
    for (const slug of configuredSlugs) {
      if (expectedSlugs.length && !expectedSlugs.includes(slug)) {
        failures.push(
          `PROPOSAL_ACCESS_CODES contains unknown proposal "${slug}".`,
        );
      }
    }

    return failures;
  } catch {
    return ["PROPOSAL_ACCESS_CODES must be valid JSON."];
  }
}

function validateSecret(env, name) {
  const value = trimmed(env, name);
  if (!value) return [`${name} is required for launch.`];
  if (value.length < 32)
    return [`${name} must contain at least 32 characters.`];
  if (/replace|development-only|change.?me|example|fake|test/i.test(value)) {
    return [`${name} still contains a placeholder value.`];
  }
  return [];
}

export function validateAnalyticsConfiguration(env) {
  const value = trimmed(env, "NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED");
  if (!value || value === "true" || value === "false") return [];
  return ['NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED must be "true" or "false".'];
}

export function validateLaunch({ root, processEnvironment = process.env }) {
  const env = loadEnvironment(root, processEnvironment);
  const proposalSlugs = readLaunchProposalSlugs(root);
  const failures = [
    ...validateProductionOrigin(trimmed(env, "NEXT_PUBLIC_SITE_URL")),
    ...proposalSlugs.failures,
    ...validateProposalCodes(
      trimmed(env, "PROPOSAL_ACCESS_CODES"),
      proposalSlugs.slugs,
    ),
    ...validateSecret(env, "PROPOSAL_SESSION_SECRET"),
    ...validateSecret(env, "ADMIN_SESSION_SECRET"),
    ...validateAnalyticsConfiguration(env),
  ];

  const adminCode = trimmed(env, "ADMIN_ACCESS_CODE");
  if (!adminCode) {
    failures.push("ADMIN_ACCESS_CODE is required for launch.");
  } else if (adminCode.length < 12) {
    failures.push("ADMIN_ACCESS_CODE must contain at least 12 characters.");
  } else if (
    /admin-demo|password|change.?me|replace|example|fake|test/i.test(adminCode)
  ) {
    failures.push("ADMIN_ACCESS_CODE still contains a placeholder value.");
  }

  return failures;
}

export function readLaunchProposalSlugs(root) {
  try {
    const proposals = JSON.parse(
      readFileSync(join(root, "src/content/proposals.json"), "utf8"),
    );
    if (!Array.isArray(proposals)) {
      return {
        slugs: [],
        failures: ["src/content/proposals.json must contain an array."],
      };
    }

    const slugs = proposals
      .map((proposal) =>
        proposal && typeof proposal === "object" ? proposal.slug : undefined,
      )
      .filter((slug) => typeof slug === "string");

    return { slugs, failures: [] };
  } catch {
    return {
      slugs: [],
      failures: ["src/content/proposals.json could not be read for launch."],
    };
  }
}

function main() {
  const failures = validateLaunch({ root: process.cwd() });

  if (failures.length) {
    console.error("Proposal launch check failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log("Proposal launch configuration check passed.");
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) main();
