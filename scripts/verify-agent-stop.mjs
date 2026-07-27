#!/usr/bin/env node

import { spawnSync } from "node:child_process";

import {
  clearAgentEditState,
  readAgentEditState,
  readHookInput,
  shouldRunQuickVerification,
} from "./agent-hook-utils.mjs";

const maximumFeedbackLength = 7_000;

function writeHookOutput(output = {}) {
  process.stdout.write(`${JSON.stringify(output)}\n`);
}

function runQuickVerification() {
  return spawnSync("npm", ["run", "verify:quick"], {
    encoding: "utf8",
    shell: false,
    timeout: 180_000,
  });
}

function failureOutput(result) {
  const output = [result.stdout, result.stderr, result.error?.message]
    .filter(Boolean)
    .join("\n")
    .trim();

  if (!output) return "The verification command failed without output.";
  return output.slice(-maximumFeedbackLength);
}

const payload = await readHookInput();
const sessionId = payload.session_id;
const state = readAgentEditState(sessionId);

if (!state?.files?.length) {
  writeHookOutput();
  process.exit(0);
}

if (!shouldRunQuickVerification(state.files)) {
  clearAgentEditState(sessionId);
  writeHookOutput();
  process.exit(0);
}

const result = runQuickVerification();
if (result.status === 0) {
  clearAgentEditState(sessionId);
  writeHookOutput();
  process.exit(0);
}

const message = [
  "Agent verification failed in npm run verify:quick.",
  "Fix the failure before finishing:",
  "",
  failureOutput(result),
].join("\n");

if (payload.stop_hook_active) {
  clearAgentEditState(sessionId);
  writeHookOutput({
    systemMessage:
      `${message}\n\nThe automatic retry has already been used. ` +
      "Stop retrying and report the remaining failure to the user.",
  });
  process.exit(0);
}

writeHookOutput({
  decision: "block",
  reason: message,
});
