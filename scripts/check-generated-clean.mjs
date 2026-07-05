import { execFileSync } from "node:child_process";

const GENERATED_PATTERNS = [
  "sanity.types.ts",
  "schema.json",
  ".generated/css-types/**/*.module.d.css.ts",
];

function git(args) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

const status = git(["status", "--porcelain=v1", "--", ...GENERATED_PATTERNS]);

if (status) {
  console.error(
    [
      "Generated files are out of date.",
      "",
      "Run `npm run css-types` and `npm run typegen`, then commit the generated output.",
      "",
      status,
    ].join("\n"),
  );
  process.exit(1);
}
