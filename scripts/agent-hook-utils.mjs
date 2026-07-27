import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";

const verificationExtensions = new Set([
  ".cjs",
  ".css",
  ".js",
  ".jsx",
  ".json",
  ".mjs",
  ".ts",
  ".tsx",
]);

export function readHookInput() {
  return new Promise((resolveInput) => {
    let input = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      input += chunk;
    });
    process.stdin.on("end", () => {
      try {
        resolveInput(JSON.parse(input || "{}"));
      } catch {
        resolveInput({});
      }
    });
  });
}

export function filesFromPatch(command) {
  const files = new Set();

  for (const line of command.split("\n")) {
    const fileMatch = line.match(/^\*\*\* (?:Add|Delete|Update) File: (.+)$/);
    const moveMatch = line.match(/^\*\*\* Move to: (.+)$/);
    const file = fileMatch?.[1] ?? moveMatch?.[1];

    if (file) files.add(file.trim());
  }

  return [...files];
}

export function filesFromHookInput(payload) {
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

export function projectPath(file, root = process.cwd()) {
  const path = isAbsolute(file) ? relative(root, file) : file;
  return path.split(sep).join("/").replace(/^\.\//, "");
}

export function extensionFor(file) {
  const lower = file.toLowerCase();
  if (lower.endsWith(".module.d.css.ts")) return ".ts";
  const index = lower.lastIndexOf(".");
  return index === -1 ? "" : lower.slice(index);
}

export function shouldRunQuickVerification(files) {
  return files.some((file) =>
    verificationExtensions.has(extensionFor(projectPath(file))),
  );
}

function stateFile(sessionId, stateDirectory) {
  const id = createHash("sha256").update(sessionId).digest("hex");
  return resolve(stateDirectory, `${id}.json`);
}

export function resolveAgentStateDirectory(root = process.cwd()) {
  const path = execFileSync(
    "git",
    ["rev-parse", "--git-path", "agent-hook-state"],
    {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    },
  ).trim();

  return isAbsolute(path) ? path : resolve(root, path);
}

export function recordAgentEdit(
  sessionId,
  files,
  stateDirectory = resolveAgentStateDirectory(),
) {
  if (typeof sessionId !== "string" || !sessionId || !files.length) return;

  mkdirSync(stateDirectory, { recursive: true });
  const file = stateFile(sessionId, stateDirectory);
  const previous = readAgentEditState(sessionId, stateDirectory);
  const changedFiles = new Set(previous?.files ?? []);

  for (const path of files) changedFiles.add(projectPath(path));

  writeFileSync(
    file,
    `${JSON.stringify({ files: [...changedFiles].sort() }, null, 2)}\n`,
  );
}

export function readAgentEditState(
  sessionId,
  stateDirectory = resolveAgentStateDirectory(),
) {
  if (typeof sessionId !== "string" || !sessionId) return null;

  const file = stateFile(sessionId, stateDirectory);
  if (!existsSync(file)) return null;

  try {
    const state = JSON.parse(readFileSync(file, "utf8"));
    return Array.isArray(state.files) ? state : null;
  } catch {
    return null;
  }
}

export function clearAgentEditState(
  sessionId,
  stateDirectory = resolveAgentStateDirectory(),
) {
  if (typeof sessionId !== "string" || !sessionId) return;
  rmSync(stateFile(sessionId, stateDirectory), { force: true });
}
