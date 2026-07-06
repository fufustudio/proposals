import { execFileSync } from "node:child_process";

const forbidden = [
  "Fufu Starter",
  "fufu-starter",
  "/api/contact",
  "ContactForm",
  "RESEND_",
  "next-sanity",
  "sanity.config",
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

  console.error("[proposal] Forbidden old scaffold content found:");
  console.error(output);
  process.exit(1);
} catch (error) {
  if (error.status === 1) {
    console.log("[proposal] No forbidden old scaffold strings found.");
    process.exit(0);
  }

  throw error;
}
