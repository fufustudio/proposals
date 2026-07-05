#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";

const formatExtensions = new Set([
  ".cjs",
  ".css",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".mdx",
  ".mjs",
  ".ts",
  ".tsx",
  ".yaml",
  ".yml",
]);

const lintExtensions = new Set([".cjs", ".js", ".jsx", ".mjs", ".ts", ".tsx"]);

const ignoredFiles = new Set([
  "package-lock.json",
  "sanity.types.ts",
  "schema.json",
]);

function readStdin() {
  return new Promise((resolve) => {
    let input = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      input += chunk;
    });
    process.stdin.on("end", () => resolve(input));
  });
}

function filesFromPatch(command) {
  const files = new Set();

  for (const line of command.split("\n")) {
    const fileMatch = line.match(/^\*\*\* (?:Add|Update) File: (.+)$/);
    const moveMatch = line.match(/^\*\*\* Move to: (.+)$/);
    const file = fileMatch?.[1] ?? moveMatch?.[1];

    if (file) files.add(file.trim());
  }

  return [...files];
}

function filesFromPayload(payload) {
  const input = payload?.tool_input ?? {};
  const files = new Set();

  if (typeof input.command === "string") {
    for (const file of filesFromPatch(input.command)) files.add(file);
  }

  for (const key of ["file_path", "path"]) {
    if (typeof input[key] === "string") files.add(input[key]);
  }

  for (const key of ["files", "file_paths", "paths"]) {
    if (Array.isArray(input[key])) {
      for (const file of input[key]) {
        if (typeof file === "string") files.add(file);
      }
    }
  }

  return [...files];
}

function extensionFor(file) {
  const lower = file.toLowerCase();
  if (lower.endsWith(".module.d.css.ts")) return ".ts";
  const index = lower.lastIndexOf(".");
  return index === -1 ? "" : lower.slice(index);
}

function runnableFiles(files, extensions) {
  return files.filter((file) => {
    if (ignoredFiles.has(file)) return false;
    if (!extensions.has(extensionFor(file))) return false;
    if (!existsSync(file)) return false;
    return statSync(file).isFile();
  });
}

function run(command, args) {
  return spawnSync(command, args, {
    stdio: "inherit",
    shell: false,
  });
}

const rawInput = await readStdin();
let payload;

try {
  payload = JSON.parse(rawInput || "{}");
} catch {
  process.exit(0);
}

const files = filesFromPayload(payload);
const formatFiles = runnableFiles(files, formatExtensions);
if (!formatFiles.length) process.exit(0);

const prettier = run("npx", [
  "prettier",
  "--write",
  "--ignore-unknown",
  ...formatFiles,
]);
if (prettier.status) process.exit(prettier.status);

const lintFiles = runnableFiles(formatFiles, lintExtensions);
if (lintFiles.length) {
  const eslint = run("npx", ["eslint", "--fix", ...lintFiles]);
  if (eslint.status) process.exit(eslint.status);
}

if (formatFiles.some((file) => file.endsWith(".module.css"))) {
  const cssTypes = run("npm", ["run", "css-types"]);
  if (cssTypes.status) process.exit(cssTypes.status);
}
