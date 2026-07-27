import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const forbidden = [
  "Fufu Starter",
  "fufu-starter",
  "/api/contact",
  "ContactForm",
  "RESEND_",
  "next-sanity",
  "@sanity/",
  "@portabletext/",
  "sanity.config",
  "SANITY_PROJECT_ID",
  "SANITY_DATASET",
  "SANITY_API_",
  "Ruzicka",
  "ruzickapsychology",
  "Psychology",
  "psychology",
  "therapy",
  "Therapy",
  "Rochester",
  "vq39ihmt",
  "clientsecure",
  "SimplePractice",
  "8l26et78",
  "admin@fufu.studio",
];

const ignoredGlobs = [
  "package-lock.json",
  "scripts/check-proposals-clean.mjs",
  "docs/starter-sync.md",
  ".generated/**",
  "node_modules/**",
  ".next/**",
  "playwright-report/**",
  "test-results/**",
];

const args = [
  "-n",
  "--hidden",
  ...ignoredGlobs.flatMap((glob) => ["--glob", `!${glob}`]),
  forbidden.join("|"),
  ".",
];

const forbiddenPackagePrefixes = [
  "sanity",
  "next-sanity",
  "@sanity/",
  "@sanity-labs/",
  "@portabletext/",
];

export function findForbiddenPackageNames(packageNames) {
  return packageNames.filter((packageName) =>
    forbiddenPackagePrefixes.some(
      (prefix) => packageName === prefix || packageName.startsWith(prefix),
    ),
  );
}

export function packageNamesFromLock(lock) {
  return Object.keys(lock.packages ?? {})
    .filter((packagePath) => packagePath.includes("node_modules/"))
    .map((packagePath) =>
      packagePath.slice(packagePath.lastIndexOf("node_modules/") + 13),
    );
}

export function main(root = process.cwd()) {
  let failed = false;

  try {
    const output = execFileSync("rg", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });

    console.error("[proposal] Forbidden old scaffold content found:");
    console.error(output);
    failed = true;
  } catch (error) {
    if (error.status !== 1) throw error;
  }

  const lock = JSON.parse(
    readFileSync(join(root, "package-lock.json"), "utf8"),
  );
  const forbiddenPackages = findForbiddenPackageNames(
    packageNamesFromLock(lock),
  );

  if (forbiddenPackages.length) {
    console.error(
      "[proposal] Forbidden CMS packages found in package-lock.json:",
    );
    for (const packageName of forbiddenPackages) {
      console.error(`- ${packageName}`);
    }
    failed = true;
  }

  if (failed) process.exitCode = 1;
  else {
    console.log(
      "[proposal] No forbidden old scaffold strings or CMS packages found.",
    );
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) main();
