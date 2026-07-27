import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { afterEach, describe, expect, it } from "vitest";

import {
  validateAnalyticsConfiguration,
  validateLaunch,
  validateProductionOrigin,
  validateProposalCodes,
} from "../../scripts/check-launch-ready.mjs";
import {
  findForbiddenPackageNames,
  packageNamesFromLock,
} from "../../scripts/check-proposals-clean.mjs";

describe("proposal launch verification", () => {
  const temporaryDirectories: string[] = [];

  afterEach(() => {
    for (const directory of temporaryDirectories.splice(0)) {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("accepts a complete non-placeholder production configuration", () => {
    const failures = validateLaunch({
      root: process.cwd(),
      processEnvironment: {
        NODE_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "https://proposals.fufu.studio",
        PROPOSAL_ACCESS_CODES: '{"sample-proposal":"Sunset!River-2048"}',
        PROPOSAL_SESSION_SECRET: "p".repeat(32),
        ADMIN_ACCESS_CODE: "Copper!Harbor-4821",
        ADMIN_SESSION_SECRET: "a".repeat(32),
        NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED: "false",
      },
    });

    expect(failures).toEqual([]);
  });

  it("rejects local, path-based, and insecure launch URLs", () => {
    expect(validateProductionOrigin("http://localhost:3000/proposals")).toEqual(
      [
        "NEXT_PUBLIC_SITE_URL must use https for launch.",
        "NEXT_PUBLIC_SITE_URL must be an origin without a path, query, or hash.",
        "NEXT_PUBLIC_SITE_URL must not point at a local host for launch.",
      ],
    );
    expect(validateProductionOrigin("https://0.0.0.0")).toEqual([
      "NEXT_PUBLIC_SITE_URL must not point at a local host for launch.",
    ]);
  });

  it("validates proposal code JSON without exposing access codes", () => {
    expect(validateProposalCodes('{"sample-proposal":"demo"}')).toEqual([
      "The access code for sample-proposal must contain at least 8 characters.",
    ]);
    expect(validateProposalCodes("{")).toEqual([
      "PROPOSAL_ACCESS_CODES must be valid JSON.",
    ]);
    expect(
      validateProposalCodes(
        '{"sample-proposal":"Sunset!River-2048","old-proposal":"Archive!Stone-6813"}',
        ["sample-proposal", "new-proposal"],
      ),
    ).toEqual([
      'PROPOSAL_ACCESS_CODES is missing the "new-proposal" proposal.',
      'PROPOSAL_ACCESS_CODES contains unknown proposal "old-proposal".',
    ]);
    expect(
      validateProposalCodes('{"Invalid Slug":"long-example-code"}'),
    ).toEqual([
      'PROPOSAL_ACCESS_CODES contains invalid slug "Invalid Slug".',
      "The access code for Invalid Slug still contains a placeholder value.",
    ]);
  });

  it("accepts supported analytics switches and rejects invalid values", () => {
    expect(
      validateAnalyticsConfiguration({
        NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED: "false",
      }),
    ).toEqual([]);
    expect(
      validateAnalyticsConfiguration({
        NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED: "sometimes",
      }),
    ).toEqual([
      'NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED must be "true" or "false".',
    ]);
  });

  it("uses production-local precedence and expands environment references", () => {
    const root = mkdtempSync(join(tmpdir(), "proposal-launch-env-"));
    temporaryDirectories.push(root);
    writeFileSync(
      join(root, ".env.production"),
      [
        "NEXT_PUBLIC_SITE_URL=https://lower.example.org",
        "BASE_SECRET=expanded-secret-value",
        "PROPOSAL_SESSION_SECRET=$BASE_SECRET-suffix",
      ].join("\n"),
    );
    writeFileSync(
      join(root, ".env.production.local"),
      "NEXT_PUBLIC_SITE_URL=https://proposals.fufu.studio\n",
    );

    const launchCheckUrl = pathToFileURL(
      join(process.cwd(), "scripts/check-launch-ready.mjs"),
    ).href;
    const output = execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "--eval",
        `import { loadEnvironment } from ${JSON.stringify(launchCheckUrl)};
process.stdout.write(JSON.stringify(loadEnvironment(${JSON.stringify(root)})));`,
      ],
      {
        encoding: "utf8",
        env: { NODE_ENV: "production" },
      },
    );
    const env = JSON.parse(output) as NodeJS.ProcessEnv;

    expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://proposals.fufu.studio");
    expect(env.PROPOSAL_SESSION_SECRET).toBe("expanded-secret-value-suffix");
  });
});

describe("verification command hierarchy", () => {
  const packageJson = JSON.parse(
    readFileSync(join(process.cwd(), "package.json"), "utf8"),
  ) as { scripts: Record<string, string> };

  it("keeps proposal, launch, browser, and release gates distinct", () => {
    expect(packageJson.scripts.verify).toContain("format:check");
    expect(packageJson.scripts.verify).toContain("privacy:check-build");
    expect(packageJson.scripts["verify:proposal"]).toContain(
      "check:generated-clean",
    );
    expect(packageJson.scripts["verify:handoff"]).toContain("launch:check");
    expect(packageJson.scripts["verify:handoff"]).toContain("test:e2e");
    expect(packageJson.scripts["verify:release"]).toContain("verify:handoff");
  });

  it("does not expose redundant working or CI aliases", () => {
    expect(packageJson.scripts["verify:working"]).toBeUndefined();
    expect(packageJson.scripts["verify:ci"]).toBeUndefined();
  });
});

describe("CMS dependency boundary", () => {
  it("rejects Sanity and Portable Text packages from a lockfile inventory", () => {
    const sanityClient = ["@", "sanity/client"].join("");
    const portableTextReact = ["@", "portabletext/react"].join("");
    const nextSanity = ["next", "sanity"].join("-");
    const packageNames = packageNamesFromLock({
      packages: {
        "": {},
        "node_modules/next": {},
        [`node_modules/${nextSanity}`]: {},
        [`node_modules/${sanityClient}`]: {},
        [`node_modules/${portableTextReact}`]: {},
      },
    });

    expect(findForbiddenPackageNames(packageNames)).toEqual([
      nextSanity,
      sanityClient,
      portableTextReact,
    ]);
  });
});

describe("private-route telemetry boundary", () => {
  function sourceFiles(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return sourceFiles(path);
      return /\.(?:ts|tsx)$/.test(entry.name) ? [path] : [];
    });
  }

  it("mounts telemetry only from the public site layout", () => {
    const rootLayout = readFileSync(
      join(process.cwd(), "src/app/layout.tsx"),
      "utf8",
    );
    const siteLayout = readFileSync(
      join(process.cwd(), "src/app/(home)/layout.tsx"),
      "utf8",
    );

    expect(rootLayout).not.toContain("@vercel/analytics");
    expect(rootLayout).not.toContain("@vercel/speed-insights");
    expect(rootLayout).not.toContain("SiteScripts");
    expect(siteLayout).toContain("SiteScripts");
  });

  it("keeps private route and component trees free of analytics calls", () => {
    const privateRoots = [
      "src/app/admin",
      "src/app/proposals",
      "src/components/admin",
      "src/components/proposals",
    ].map((path) => join(process.cwd(), path));

    for (const file of privateRoots.flatMap(sourceFiles)) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toContain("@/analytics");
      expect(source, file).not.toMatch(/\banalytics\s*=/);
    }
  });
});
