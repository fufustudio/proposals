#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";

import {
  extensionFor,
  filesFromHookInput,
  projectPath,
  readHookInput,
  recordAgentEdit,
} from "./agent-hook-utils.mjs";

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
const ignoredFiles = new Set(["package-lock.json"]);

function runnableFiles(files, extensions) {
  return files.filter((file) => {
    if (ignoredFiles.has(projectPath(file))) return false;
    if (!extensions.has(extensionFor(file))) return false;
    if (!existsSync(file)) return false;
    return statSync(file).isFile();
  });
}

function run(command, args) {
  return spawnSync(command, args, {
    encoding: "utf8",
    stdio: "inherit",
    shell: false,
  });
}

function failHook(message, result) {
  const detail = result?.error?.message;
  console.error(
    `Agent edit hook failed: ${message}${detail ? `: ${detail}` : ""}`,
  );
  process.exit(2);
}

const payload = await readHookInput();
const files = filesFromHookInput(payload);
recordAgentEdit(payload.session_id, files);

const formatFiles = runnableFiles(files, formatExtensions);
if (!formatFiles.length) process.exit(0);

const lintFiles = runnableFiles(formatFiles, lintExtensions);
if (lintFiles.length) {
  const eslint = run("npm", [
    "exec",
    "--offline",
    "--",
    "eslint",
    "--fix",
    ...lintFiles,
  ]);
  if (eslint.status !== 0) {
    failHook("ESLint could not fix the edited files", eslint);
  }
}

const prettier = run("npm", [
  "exec",
  "--offline",
  "--",
  "prettier",
  "--write",
  "--ignore-unknown",
  ...formatFiles,
]);
if (prettier.status !== 0) {
  failHook("Prettier could not format the edited files", prettier);
}

if (formatFiles.some((file) => file.endsWith(".module.css"))) {
  const cssTypes = run("npm", ["run", "css-types"]);
  if (cssTypes.status !== 0) {
    failHook("CSS Module types could not be generated", cssTypes);
  }
}
