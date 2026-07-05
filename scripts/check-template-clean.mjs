import { execFileSync } from "node:child_process";

const forbidden = [
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
  "fufu.studio",
  "admin@fufu.studio",
  "hello@fufu.studio",
  "Fufu <hello@fufu.studio>",
];

const ignoredGlobs = [
  "package-lock.json",
  "sanity.types.ts",
  "schema.json",
  "scripts/check-template-clean.mjs",
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

try {
  const output = execFileSync("rg", args, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  console.error("[template] Forbidden starter content found:");
  console.error(output);
  process.exit(1);
} catch (error) {
  if (error.status === 1) {
    console.log("[template] No forbidden client-specific strings found.");
    process.exit(0);
  }

  throw error;
}
