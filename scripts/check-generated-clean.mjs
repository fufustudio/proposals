import { execFileSync } from "node:child_process";

const GENERATED_PATTERNS = [".generated/css-types/**/*.module.d.css.ts"];

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
      "Generated output differs from the committed files.",
      "",
      "Review the generated changes, then commit them when they are expected.",
      "",
      status,
    ].join("\n"),
  );
  process.exit(1);
}
